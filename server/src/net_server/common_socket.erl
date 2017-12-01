%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%% 多人对战长连接网络服务器
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

-module(common_socket).
-author('ltb').

-export([init_ets/0, loop/2, udp_loop/4]).
-export([add_new_conn/2, send_pb_msg/2, send_udp_msg/2, send_udp_msg/3, add_udp_addr/2, close_device_socket/1, close_conn_cb/1, 
  get_tcp_addr/0, get_udp_addr/0]).

-include("../record.hrl").
-include("../settings.hrl").
-include("msg/up_pb.hrl").

-define(MULTIPLAYER_SOCKET_DEVICE_ETS, common_socket_device_ets).
-define(MULTIPLAYER_USER_SOCKET_ETS, common_user_socket_ets).

init_ets() ->
  ets:new(?MULTIPLAYER_SOCKET_DEVICE_ETS, [set, named_table,  public]),
  ets:new(?MULTIPLAYER_USER_SOCKET_ETS, [set, named_table, public]),
  ok.


%% use protobuf to transfer binary data between C/S.
loop(Socket, CloseFunc) ->
  receive
    {tcp, Socket, Data} ->
      try
        UpMsg = up_pb:decode_up_msg(Data),
        proc_msg(UpMsg, Socket)
      of
        _ ->
          inet:setopts(Socket, [{active, once}]),
          loop(Socket, CloseFunc)
      catch Err:Reason ->
        log4erl:error("Common Socket: proc msg fail: ~p:~p ~p ~n", [Err, Reason, erlang:get_stacktrace()]),
        disconnect_cb(Socket, CloseFunc),
        close_conn(Socket)
      end;

    {tcp_closed, Socket} ->
      disconnect_cb(Socket, CloseFunc),
      close_conn(Socket);

    {tcp_error, Socket, Reason} ->
      log4erl:error("Common Socket: Socket ~p error: ~p ~n", [Socket, Reason]),
      disconnect_cb(Socket, CloseFunc),
      close_conn(Socket);

    {_From, close_conn} ->
      log4erl:info("Common Socket: room mgr close Socket ~p~n", [Socket]),
      close_conn(Socket);

    Other ->
      log4erl:error("Common Socket: Socket ~p Got unexpect Msg ~p~n", [Socket, Other]),
      loop(Socket, CloseFunc)

  after 60000 ->
    disconnect_cb(Socket, CloseFunc),
    close_conn(Socket)
  end.

new_conn(Socket, DeviceID, UdpInfo) ->
  add_device_id(Socket, DeviceID),
  add_socket(DeviceID, Socket, UdpInfo).

new_conn(Socket, DeviceID) ->
  new_conn(Socket, DeviceID, undefined).

close_conn(undefined) -> ok;
close_conn(Socket) ->
  case get_device_id(Socket) of
    undefined -> ok;
    DeviceID ->
      ets:delete(?MULTIPLAYER_USER_SOCKET_ETS, DeviceID)
  end,
  ets:delete(?MULTIPLAYER_SOCKET_DEVICE_ETS, Socket),
  gen_tcp:close(Socket).


close_device_socket(DeviceID) ->
  case get_socket(DeviceID) of
    undefined -> ok;
    Socket -> ets:delete(?MULTIPLAYER_SOCKET_DEVICE_ETS, Socket),
      gen_tcp:close(Socket)
  end,
  ets:delete(?MULTIPLAYER_USER_SOCKET_ETS, DeviceID).

disconnect_cb(Socket, {M, F}) ->
  case get_device_id(Socket) of
    undefined -> ok;
    DeviceID -> M:F(DeviceID)
  end.

% 发送tcp消息
send_pb_msg(DeviceID, PbMsg) when is_tuple(DeviceID) ->
  case get_socket(DeviceID) of
    undefined -> ok; 
    Socket -> send_pb_msg(Socket, PbMsg)
  end;
send_pb_msg(Socket, PbMsg) ->
  Bin = pbed:encode_down_msg(PbMsg),
  gen_tcp:send(Socket, Bin).

% 发送udp消息
send_udp_msg(DeviceID, PbMsg) when is_tuple(DeviceID) ->
  case get_udp_addr(DeviceID) of
    undefined -> ok;
    {Socket, UdpAddr} -> send_udp_msg(Socket, UdpAddr, PbMsg)
  end.

send_udp_msg(Socket, {Host, Port}, PbMsg) ->
  Bin = pbed:encode_down_msg(PbMsg),
  gen_udp:send(Socket, Host, Port, Bin).

add_device_id(Socket, DeviceID) ->
  ets:insert(?MULTIPLAYER_SOCKET_DEVICE_ETS, {Socket, DeviceID}).

get_device_id(Socket) ->
  case ets:lookup(?MULTIPLAYER_SOCKET_DEVICE_ETS, Socket) of
    [] ->
      undefined;
    [{_, DeviceID}] -> DeviceID
  end.

add_socket(DeviceID, Socket, UdpInfo) ->
  ets:insert(?MULTIPLAYER_USER_SOCKET_ETS, {DeviceID, Socket, UdpInfo}).

add_udp_addr(DeviceID, SocketInfo) ->
  case ets:lookup(?MULTIPLAYER_USER_SOCKET_ETS, DeviceID) of
    [] -> 
      ets:insert(?MULTIPLAYER_USER_SOCKET_ETS, {DeviceID, undefined, SocketInfo});
    [{DeviceID, _, SocketInfo}] -> ok;
    [{DeviceID, _, _}] ->
      ets:update_element(?MULTIPLAYER_USER_SOCKET_ETS, DeviceID, {3, SocketInfo})
  end.

get_socket(DeviceID) ->
  case ets:lookup(?MULTIPLAYER_USER_SOCKET_ETS, DeviceID) of
    [] -> undefined;
    [{_, Socket, _}] -> Socket
  end.

get_udp_addr(DeviceID) ->
  case ets:lookup(?MULTIPLAYER_USER_SOCKET_ETS, DeviceID) of
    [] -> undefined;
    [{_, _, SocketInfo}] -> SocketInfo
  end.

%% udp 回调接口
udp_loop(Socket, Host, Port, Data) ->
  try up_pb:decode_up_msg(Data) of
    UpMsg ->
      proc_msg(UpMsg, {Socket, {Host, Port}})
  catch 
    Error : Reason -> 
      log_decode_error(udp, Error, Reason, Data)
  end.

log_decode_error(Type, Error, Reason, Data) ->
  DataSize = erlang:size(Data),
  DataForLog = case DataSize > 1024 of
    true -> binary:part(Data, 0, 1024);
    false -> Data
  end,
  log4erl:error("common_socket decode ~w msg catch ~w:~w data ~w size ~w~n", 
    [Type, Error, Reason, DataForLog, DataSize]).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
proc_msg(UpMsg, Socket) ->
  CMDS = filter_cmd(UpMsg),
  decode_msg(CMDS, Socket).

decode_msg([], _Socket) ->
  ok;
decode_msg([CMD|CS], Socket) ->
  FilterMsg = tools:filter_msg2(CMD),
  case exec_cmd(Socket, FilterMsg) of
    close_conn -> close_conn;
    _ -> decode_msg(CS, Socket)
  end.

%%%%%%%%%%%%%% 连接进入大厅
exec_cmd(Socket, {Type, Msg}) when Type =:= multiplayer_battle ->
  multiplayer_cli:req(Socket, Msg);

exec_cmd(Socket, {Type, Msg}) when Type =:= multi_stage ->
  multi_stage_cli:req(Socket, Msg);

exec_cmd(_Socket, Etc) ->
  log4erl:error("common_socket receive unknow type msg:~p~n", [Etc]),
  close_conn.

% 找出有效命令
filter_cmd(UpMsg) when is_record(UpMsg, up_msg) ->
  [up_msg, _R, _U | CMDS] = tuple_to_list(UpMsg),
  lists:filter(fun(X) -> X =/= undefined end, CMDS).


add_new_conn(DeviceID, Socket) ->
  case ets:lookup(?MULTIPLAYER_USER_SOCKET_ETS, DeviceID) of
    [] -> new_conn(Socket, DeviceID);
    [{DeviceID, Socket, _}] -> ok;
    [{DeviceID, OldSocket, UdpInfo}] -> 
      close_conn(OldSocket),
      new_conn(Socket, DeviceID, UdpInfo)
  end.

close_conn_cb(Deviceid) ->
  multiplayer_manager:close_conn(Deviceid),
  multi_stage_tiny_room:close_conn(Deviceid),
  multi_stage_battle_room:close_conn(Deviceid).

get_tcp_addr() ->
  get_addr(multiplayer_port).

get_udp_addr() ->
  get_addr(multiplayer_battle_port).

get_addr(PortName) ->
  SvrID = tools:getsvrid(),
  {ok, RTRoomPort} = application:get_env(dgame, PortName),
  case server_config:get_outip(SvrID) of
    undefined -> 
      %%内网debug模式下，减少人工配置
      case application:get_env(dgame, debug) of
        {ok, true} -> 
          lists:concat([tools:getsvrip(), ":", RTRoomPort]);
        _ -> undefined
      end;
    OuterIP -> 
      lists:concat([OuterIP, ":", RTRoomPort])
  end.
