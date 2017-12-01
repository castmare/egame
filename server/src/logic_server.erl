-module(logic_server).
-author(lifan).

-export([init/0, loop/1, process/2, proc_cmd/3]).
-compile(export_all).
-define(TEST, true).

-include("record.hrl").
-include("settings.hrl").
-include("msg/up_pb.hrl").
-include("msg/down_pb.hrl").

-define(REPEAT_DATA_ETS, repeat_data_ets).
% 这里用于缓存客户端数据包重发
init() ->
  ets:new(?REPEAT_DATA_ETS, [set, named_table, public, compressed]),
  ok.

%%%===================================================================
%%% 主逻辑框架
%%%===================================================================
%% use protobuf to transfer binary data between C/S.
loop(Socket) ->
  log4erl:info("logic_server:loop ~w ~n", [Socket]),
  receive
    {tcp, Socket, Data} ->
      log4erl:info("logic_server:loop receive ~w data ~w ~n", [Socket, Data]),
      try process(Socket, Data) of
        fail -> pass;
        ReplyData -> gen_tcp:send(Socket, ReplyData)
      catch
        Error:Reason -> 
          %%alarm:notify(decode_msg_head),
          log4erl:error("logic_server:decode_head ip ~p catch ~p:~p~n", [get(ip), Error, Reason])
      after
        log4erl:info("logic_server:loop tcp ~w closed by server", [Socket]),
        gen_tcp:close(Socket)
      end;
    {tcp_closed, Socket} ->
      log4erl:info("logic_server:loop tcp ~w closed by peer", [Socket]),
      gen_tcp:close(Socket);
    _Other ->
      log4erl:info("logic_server:loop tcp ~w closed by server, case of ~w", [Socket, _Other]),
      gen_tcp:close(Socket)
  after 10000 ->
    log4erl:info("logic_server:loop tcp ~w closed by server, recieve timeout", [Socket]),
    gen_tcp:close(Socket)
  end.

process(Socket, Data) ->
  IPStr = get_socket_ip(Socket),
  put(ip, IPStr),
  put(timenow, tools:timenow()),
  {DeviceID, IsLogin, Body, SvrID} = decode_head(Data),
  case application:get_env(debug) of
    {ok, false} ->
      log4erl:info("logic_server:loop receive client msg success \
        sokect ~w deviceid ~p islogin ~w svrid ~w body ~w ~n", 
          [Socket, DeviceID, IsLogin, SvrID, Body]),
        process_msg(DeviceID, SvrID, IsLogin, Body);
    {ok, true} ->
      log4erl:info("logic_server:loop debug logic_server receive client msg success \
        sokect ~w deviceid ~p islogin ~w svrid ~w body ~w ~n", 
          [Socket, DeviceID, IsLogin, SvrID, Body]),
      process_msg_debug(DeviceID, SvrID, IsLogin, Body)
  end.   

%% 处理消息
process_msg(DeviceID, SvrID, IsLogin, Body) ->
  try 
    {ok, UpMsgData} = decrypt_msg(Body),
    case process_msg2(DeviceID, SvrID, IsLogin, UpMsgData) of
      {fail, _} -> fail;
      {ok, DownMsgData} ->
        {ok, ReplyData} = encrypt_msg(DownMsgData),
        log4erl:info("logic_server:process_msg encrypt_msg ReplyData ~w", [ReplyData]),
        ReplyData
    end
  catch
    E:R->
      log4erl:error("logic_server:process_msg failed ~w ~p ~p ~nn", [E, R, ?STACK]),
      fail
  end.
    
%% 处理消息(Debug模式)
process_msg_debug(DeviceID, SvrID, IsLogin, Body) ->
  process_msg(DeviceID, SvrID, IsLogin, Body).
 
%% 日志记录data的长度
-define(DATA_FOR_LOG_SIZE, 1024).
process_msg2(DeviceID, SvrID, IsLogin, UpMsgData) ->
  try 
    UpMsg = decode_up_msg(UpMsgData),
    put(up_msg, UpMsg),
    case proc_up_msg(DeviceID, SvrID, IsLogin, UpMsg) of
      noreply -> {fail, noreply};
      Ret when is_binary(Ret) -> {ok, Ret};
      #down_msg{} = Ret ->
        Down = encode_down_msg(Ret),
        log4erl:info("logic_server:process_msg2 proc_up_msg down_msg ~p encoded ~w", [Ret, Down]),
        {ok, Down};
      Ret ->
        ErrorInfo = pack_error_info(Ret, DeviceID, SvrID),
        Down = encode_down_msg(#down_msg{error = ErrorInfo}),
        {ok, Down}
     end
  catch
    _:{badmatch, {decode_fail, Reason}} ->
      DataSize = erlang:size(UpMsgData),
      DataForLog = case DataSize > 1024 of
        true -> binary:part(0, 1024);
        false -> UpMsgData
      end,
        log4erl:error("logic_server:process_msg2 decode up msg failed, deviceid ~w ip ~p reason ~p data ~w~n", 
          [DeviceID, get(ip), Reason, DataForLog, DataSize]),
      {fail, decode_error};
    E:R ->
      log4erl:error("logic_server:process_msg2 failed, unknown error ~w ~w ~p ~n", [E, R, ?STACK]),
      {fail, unknown_error}
  end.
      

proc_up_msg(DeviceID, SvrID, IsLogin, UpMsg) ->
  ?LOG("up msg is ~p~n", [UpMsg]),
  case UpMsg of
    #up_msg{repeat = false} ->
      proc_up_msg2(DeviceID, SvrID, IsLogin, UpMsg);
    #up_msg{repeat = true} ->
      case get_repeat_cache(DeviceID, SvrID) of
        ?UNDEF -> 
          %% 没有找到缓存，再跑一次
          proc_up_msg2(DeviceID, SvrID, IsLogin, UpMsg);
        {UpMsgOld, DownMsg} when DownMsg =/= ?UNDEF ->
          %% 上次的请求已经处理完毕
          case UpMsg#up_msg{repeat = false} =:= UpMsgOld of
            true -> DownMsg;
            false -> proc_up_msg2(DeviceID, SvrID, IsLogin, UpMsg)
          end;
        _ ->
            %% 上次处理还没结束，等待客户端重试
          log4erl:info("logic_server:proc_up_msg recv illegal repeat msg from deviceid ~p", [DeviceID]),
          #down_msg{}
      end;
    Error ->
      log4erl:error("logic_server:proc_up_msg deviceid ~p bad up msg ~w~n", [DeviceID, Error]),
      data_format_error
  end.
  
proc_up_msg2(DeviceID, SvrID, IsLogin, #up_msg{user_id = UserID, role_id = RoleID} = UpMsg) ->
  put_repeat_up(DeviceID, SvrID, UpMsg),
  put(userid, UserID),
  put(svrid, SvrID),
  put(deviceid, DeviceID),
  put(roleid, RoleID),
  CMDList = filter_cmd(UpMsg),
  UserInfo = {DeviceID, SvrID, UserID, RoleID},
  log4erl:info("logic_server:proc_up_msg2 UserInfo ~p IsLogin ~w CMDList ~p", [UserInfo, IsLogin, CMDList]),
  LastOpTime = update_user_op_time(DeviceID, SvrID, get(timenow)),
  put(last_op_time, LastOpTime),
  proc_cmd_list(CMDList, UserInfo, IsLogin, #down_msg{}).
          
proc_cmd_list([], {DeviceID, SvrID, _UserID, _RoleID}, _IsLogin, DownMsg) ->
  DownMsgFinal = DownMsg,
  put_repeat_down(DeviceID, SvrID, DownMsgFinal),
  ?LOG("down msg is ~p~n", [DownMsgFinal]),
  DownMsgFinal;

%% 处理命令列表
proc_cmd_list([CMD | Rest], UserInfo, IsLogin, DownMsg) ->
  put(client_cmd, CMD),
  case stat_profile:stat(logic_server, proc_cmd, [CMD, IsLogin, UserInfo], fun get_stat_key/3) of
    #down_msg{} = Ret -> 
      L1 = tuple_to_list(DownMsg),
      L2 = tuple_to_list(Ret),
      L3 = lists:zipwith(
        fun(X,Y) -> 
          case X =:= ?UNDEF of 
            true -> Y; 
            false -> X 
          end 
        end, L1, L2),
      proc_cmd_list(Rest, UserInfo, IsLogin, list_to_tuple(L3));
    Ret -> Ret
  end.
    
%%%===================================================================
%%% 逻辑处理
%%%===================================================================

%% 主要逻辑处理单条命令
%% 如果已有命令，但是DeviceID和UserID都未定义，请求错误
proc_cmd(_CMD, _IsLogin, {[], _, _, _}) ->
  log4erl:error("logic_server:proc_cmd cmd with out deviceid & userid, ~w~n", [_CMD]),
  empty_deviceid;
%% 如果已有命令，但是DeviceID和UserID都未定义，请求错误
proc_cmd(_CMD, _IsLogin, {?UNDEF, _, _, _}) ->
  log4erl:error("logic_server:proc_cmd cmd with ?UNDEF deviceid & userid, ~w~n", [_CMD]),
  no_deviceid;

%% sdk登入
proc_cmd(#sdk_login_req{} = CMD, IsLogin, _) when IsLogin =:= 1 ->
  proc_sdk_login(CMD);

%% 登录
proc_cmd(#login_req{} = CMD, _IsLogin, UserInfo) ->
  proc_login(CMD, UserInfo);
 
%% 除了登录之外的其他请求,没有提供UserID的命令，一律错误
proc_cmd(_CMD, _IsLogin, {_, _, ?UNDEF, _}) ->
  log4erl:error("logic_server:proc_cmd cmd without userid, ~w~n", [_CMD]),
  no_userid;

%% 角色处理
proc_cmd(#role_req{} = RoleReq, _, {DeviceID, SvrID, UserID, _RoleID}) ->
  UserID = memcache:get_userid(DeviceID, SvrID),
  User = memcache:get_user({UserID, DeviceID}),
  role_cli:client_request(User, RoleReq);

%% 除了角色处理之外的其他请求,没有提供RoleID的命令，一律错误
proc_cmd(_CMD, _IsLogin, {_, _, _, ?UNDEF}) ->
  log4erl:error("logic_server:proc_cmd cmd without roleid, ~w~n", [_CMD]),
  no_roleid;
 
%% 其他请求
proc_cmd(CMD, IsLogin, {DeviceID, SvrID, UserID, RoleID}) when IsLogin =:= 0 ->
  UserID = memcache:get_userid(DeviceID, SvrID),
  Role = memcache:get_role({RoleID, UserID}),
  proc_cmd(Role, CMD).

proc_cmd(_, _CMD) ->
  log4erl:error("logic_server:proc_cmd cmd not found, ~w~n", [_CMD]),
  cmd_notfound.
  
%%%===================================================================
%%% 支持函数
%%%===================================================================

get_socket_ip(Socket) ->
  case tools:socket_ip_str(Socket) of
    ?UNDEF -> 
      log4erl:info("logic_server:loop get client ip error~n", []),
      throw(no_ip);
    IPStr -> IPStr
   end.

get_svrid_and_deviceid(DeviceIDBinary) ->
  DeviceIDStr = binary_to_list(DeviceIDBinary),
  [DeviceIDHead|Rest] = string:tokens(DeviceIDStr, "-"),
  case DeviceIDHead =/= DeviceIDStr of
    true ->
      {_DeviceIDHeadNew, [$- | RestNew]} = lists:splitwith(fun(A) -> A =/= $- end, DeviceIDStr),
      put(org_sdk_device_id, RestNew);
    false -> pass
  end,
  case string:tokens(DeviceIDHead, "#") of
    [StrIdStr, PlatId] ->
      {list_to_integer(StrIdStr), PlatId ++ "-" ++ lists:concat(Rest)};
    [_PlatId] ->
      {tools:getsvrid(), DeviceIDStr}
  end.

%% 解码包头
%% islogin:1|deviceid_len:2|deviceid|msg_body
decode_head(Data) ->
  <<IsLogin:8, Len:16/little, Left/binary>> = Data,
  <<DeviceIDBinary:Len/binary, Body/binary>> = Left,
  {SvrID, DeviceID} = get_svrid_and_deviceid(DeviceIDBinary),
  {DeviceID, IsLogin, Body, SvrID}.

get_stat_key(_M, _F, [Msg, _, _]) ->
  case tuple_to_list(Msg) of
    [MsgType] -> {clireq, MsgType};
    [MsgType | CMDList] -> 
      case lists:filter(fun(X) -> X =/= ?UNDEF end, CMDList) of
        [MsgData] when is_tuple(MsgData) -> {clireq, MsgType, element(1, MsgData)};
        _ -> {clireq, MsgType}
      end
  end.


decrypt_msg(Msg) -> {ok, Msg}.
encrypt_msg(Msg) -> {ok, Msg}.

decode_up_msg(UpMsgData) ->
  up_pb:decode_msg(UpMsgData, up_msg).
  
encode_down_msg(DownMsg) ->
  down_pb:encode_msg(DownMsg).

pack_error_info(Error, DeviceID, SvrID) when is_atom(Error) ->
  pack_error_info(atom_to_list(Error), DeviceID, SvrID);
pack_error_info(Str, _DeviceID, _SvrID) when is_list(Str) ->
  #error_info{msg = Str};
pack_error_info(_Unknown, _DeviceID, _SvrID) ->
  #error_info{msg = "unknown error"}.

get_repeat_cache(DeviceID, SvrID) -> 
  case ets:lookup(?REPEAT_DATA_ETS, {DeviceID, SvrID}) of
    [] -> ?UNDEF;
    [{_, UpMsgOld, DownMsg}] -> {UpMsgOld, DownMsg};
    [Ret] -> Ret
  end.
  
put_repeat_up(DeviceID, SvrID, UpMsg) ->
  ets:insert(?REPEAT_DATA_ETS, {{DeviceID, SvrID}, UpMsg, ?UNDEF}).
  
put_repeat_down(DeviceID, SvrID, DownMsg) ->
  ets:update_element(?REPEAT_DATA_ETS, {DeviceID, SvrID}, {3, DownMsg}).
  
filter_cmd(#up_msg{} = UpMsg) ->
  [up_msg, _S, _R, _UID, _RID | CMDList] = tuple_to_list(UpMsg),
  lists:filter(fun(X) -> X =/= ?UNDEF end, CMDList).
  
update_user_op_time(_DeviceID, _SvrID, Timenow) ->
  Timenow.
  
proc_sdk_login(_) ->
  #down_msg{}.
  
proc_login(#login_req{}, {DeviceID, SvrID, _UserID, _RoleID}) ->
  LoginParam = #login_param {
    device_id = DeviceID,
    svr_id = SvrID
  },
  users:login(LoginParam).
  
 
  
  

