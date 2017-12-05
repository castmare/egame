%%实时信息推送长连接网络服务器

-module(rtnotify_socket).
-author('zhangrenai').

-export([loop/1, ws_entry/1]).
-compile(export_all).

-include("../record.hrl").
-include("../settings.hrl").
-include("msg/up_pb.hrl").
-include("msg/down_pb.hrl").
%%%===================================================================
%%% 主逻辑框架
%%%===================================================================
ws_entry(Socket) ->
  log4erl:info("ws_entry:loop ~w ~n", [Socket]),
  receive
    {tcp, Socket, Data} ->
      log4erl:info("ws_entry:loop receive ~w data ~p ~n", [Socket, Data]),
      try
        Resp = ws_server:handshake_web_socket(Socket, Data),
        PID = proc_lib:spawn(?MODULE, loop, [Socket]),
        gen_tcp:controlling_process(Socket, PID),
        gen_tcp:send(Socket, Resp)
      catch
        Error:Reason -> 
          log4erl:error("ws_server:loop failed ~p:~p, ~p~n", [Error, Reason, ?STACK]),
          gen_tcp:close(Socket)
      end;
    {tcp_closed, Socket} ->
      log4erl:info("ws_entry:loop tcp ~w closed by peer", [Socket]),
      gen_tcp:close(Socket);
    _Other ->
      log4erl:info("ws_entry:loop tcp ~w closed by server, case of ~w", [Socket, _Other]),
      gen_tcp:close(Socket)
  after 10000 ->
    log4erl:info("ws_entry:loop tcp ~w closed by server, recieve timeout", [Socket]),
    gen_tcp:close(Socket)
  end.


%% use protobuf to transfer binary data between C/S.
loop(Socket) ->
  inet:setopts(Socket, [{active, once}]),
  log4erl:info("loop pid ~p socket ~p ~n", [self(), Socket]),
  receive
    {tcp, Socket, Data} ->
      try
        log4erl:info("rtnotify receive ~p ~p ~p~n", [Socket, size(Data), Data]),
        PlainData = ws_server:websocket_data(Data),
        log4erl:info("rtnotify receive plain ~p ~p ~p~n", [Socket, size(PlainData), PlainData]),
        case PlainData of
          <<3,233>> -> throw(ws_closed);
          _ -> ok
        end,
        {_DeviceID, _IsLogin, Body, _SvrID} = logic_server:decode_head(PlainData),
        UpMsg = logic_server:decode_up_msg(Body),
        log4erl:info("rtnotify upmsg ~p ~p ~n", [Socket, UpMsg]),
        proc_msg(UpMsg, Socket)
      of
        ok -> loop(Socket);
        _  -> check_socket(Socket)
      catch 
        throw:ws_closed ->
          log4erl:info("ws socket ~p closed", [Socket]),
          close_conn(Socket);
        Err:Reason ->
          log4erl:error("rtnotify_socket proc msg fail: ~p:~p ~p~n", [Err, Reason, erlang:get_stacktrace()]),
          close_conn(Socket)
      end;

    {tcp_closed, Socket} ->
      log4erl:info("Socket ~p closed from client normal~n", [Socket]),
      close_conn(Socket);

    {tcp_error, Socket, Reason} ->
      log4erl:error("rtnotify_socket Socket ~p error: ~p ~n", [Socket, Reason]),
      close_conn(Socket);

    {rtnotify_send, Socket, DownMsg} ->
      try
        log4erl:info("rtnotify_send s pid ~p  socket ~p dm ~p~n", [self(), Socket, DownMsg]),
        Msg = logic_server:encode_down_msg(DownMsg),
        log4erl:info("rtnotify_send s pid ~p  socket ~p encode ~p~n", [self(), Socket, Msg]),
        CipherData = ws_server:build_client_data(Msg),
        log4erl:info("rtnotify_send s pid ~p  socket ~p cipherdata ~p~n", [self(), Socket, CipherData]),
        log4erl:info("UDP msg size is ~p ~n", [byte_size(CipherData)]),
        gen_tcp:send(Socket, CipherData)
      of
        _SendStatus -> ok %log4erl:info("rtnotify_send s pid ~p  socket ~p send ~p~n", [self(), Socket, SendOK])
      catch Err:Reason ->
        log4erl:error("rtnotify_send pid ~p  socket ~p error ~p:~p~n", [self(), Socket, Err, Reason])
      end,
      loop(Socket);

    {rtnotify_kick, Socket, _Reason} ->
      %log4erl:info("rtnotify_socket Socket ~p kick: ~p~n", [Socket, Reason]),
      gen_tcp:close(Socket);

    Other ->
      log4erl:error("rtnotify_socket Socket ~p Got unexpect Msg ~p~n", [Socket, Other]),
      loop(Socket)
  after 10000 -> %10秒
    check_socket(Socket)
  end.

check_socket(Socket) ->
  case rtnotify:is_rtnotify_register(Socket) of
    true ->
      loop(Socket);
    false ->
      %log4erl:info("rtnotify_socket Socket[~p] close by no register.~n", [Socket]),
      close_conn(Socket)
  end.

close_conn(Socket) ->
  log4erl:info("rtnotify Socket[~p] active close", [Socket]),
  %UID = rtnotify:get_uid(Socket),
  rtnotify:rtnotify_unregister(Socket, activeclose),
  gen_tcp:close(Socket).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
proc_msg(UpMsg, Socket) ->
  CMDS = logic_server:filter_cmd(UpMsg),
  case decode_msg(CMDS, Socket, #down_msg{}) of
    Ret when is_record(Ret, down_msg) ->
      Bin = logic_server:encode_down_msg(Ret),
      log4erl:info("rtnotify send ~p ~p ~p~n", [Socket, size(Bin), Bin]),
      CipherData = ws_server:build_client_data(Bin),
      log4erl:info("rtnotify send CipherData ~p ~p~n", [Socket, CipherData]),
      gen_tcp:send(Socket, CipherData),
      ok;
    Ret -> Ret
  end.

decode_msg([], _Socket, DownMsg) ->
  DownMsg;

decode_msg([CMD|CS], Socket, DownMsg) ->
  FilterMsg = tools:filter_msg2(CMD),
  %log4erl:info("exec_cmd [~p]~n", [FilterMsg]),
  case exec_cmd(FilterMsg, Socket) of
    Ret when is_record(Ret, down_msg) ->
      %send_client_msg(Socket, Ret),
      L1 = tuple_to_list(DownMsg),
      L2 = tuple_to_list(Ret),
      L3 = lists:zipwith(fun(X, Y) -> case X == undefined of true -> Y; false -> X end end, L1, L2),
      decode_msg(CS, Socket, list_to_tuple(L3));
    close_conn -> close_conn;
    _ -> decode_msg(CS, Socket, DownMsg)
  end.

exec_cmd({rtnotify_req, #rtnotify_register{user_id = UID}}, Socket) ->
  Pid = self(),
  %log4erl:info("rtnotify Socket[~p] Pid[~p] start register DeviceID[~p] UID[~p]", [Socket, Pid, DeviceID, UID]),
  rtnotify:rtnotify_register(Socket, UID, Pid),
  rtnotify_msg:build_rtnotify_register_reply(success);

exec_cmd({rtnotify_req, {rtnotify_keepalive, ClientTime}}, _Socket) ->
  rtnotify_msg:build_rtnotify_keepalive_reply(ClientTime);

exec_cmd({rtnotify_req, {rtnotify_callback, Data}}, _Socket) ->
  rtnotify_msg:build_rtnotify_callback_reply(Data);


exec_cmd(Etc, _Socket) ->
  log4erl:error("rtnotify receive unknow type msg:~p~n", [Etc]),
  close_conn.

