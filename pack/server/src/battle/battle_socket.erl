-module(battle_socket).
-author(lifan).

-export([loop/1, ws_entry/1]).
-compile(export_all).

-include("../record.hrl").
-include("../settings.hrl").
-include("msg/battle_pb.hrl").
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
        log4erl:info("battle_socket receive ~p ~p ~p~n", [Socket, size(Data), Data]),
        PlainData = ws_server:websocket_data(Data),
        log4erl:info("battle_socket receive plain ~p ~p ~p~n", [Socket, size(PlainData), PlainData]),
        case PlainData of
          <<3,233>> -> throw(ws_closed);
          _ -> ok
        end,
        UpMsg = decode_battle_up_msg(PlainData),
        log4erl:info("battle_socket upmsg ~p ~p ~n", [Socket, UpMsg]),
        proc_msg(UpMsg, Socket)
      of
        ok -> loop(Socket);
        _  -> check_socket(Socket)
      catch 
        throw:ws_closed ->
          log4erl:info("ws socket ~p closed", [Socket]),
          close_conn(Socket);
        Err:Reason ->
          log4erl:error("battle_socket proc msg fail: ~p:~p ~p~n", [Err, Reason, erlang:get_stacktrace()]),
          close_conn(Socket)
      end;

    {tcp_closed, Socket} ->
      log4erl:info("Socket ~p closed from client normal~n", [Socket]),
      close_conn(Socket);

    {tcp_error, Socket, Reason} ->
      log4erl:error("battle_socket Socket ~p error: ~p ~n", [Socket, Reason]),
      close_conn(Socket);

    {battle_notify, Socket, NotifyMsg} ->
      try
        log4erl:info("battle_send s pid ~p  socket ~p notify ~p~n", [self(), Socket, NotifyMsg]),
        Msg = encode_battle_notify_msg(NotifyMsg),
        log4erl:info("battle_send s pid ~p  socket ~p encode ~p~n", [self(), Socket, Msg]),
        CipherData = ws_server:build_client_data(Msg),
        log4erl:info("battle_send s pid ~p  socket ~p cipherdata ~p~n", [self(), Socket, CipherData]),
        log4erl:info("UDP msg size is ~p ~n", [byte_size(CipherData)]),
        gen_tcp:send(Socket, CipherData)
      of
        _SendStatus -> ok %log4erl:info("battle_send s pid ~p  socket ~p send ~p~n", [self(), Socket, SendOK])
      catch Err:Reason ->
        log4erl:error("battle_send pid ~p  socket ~p error ~p:~p~n", [self(), Socket, Err, Reason])
      end,
      loop(Socket);
    Other ->
      log4erl:error("battle_socket Socket ~p Got unexpect Msg ~p~n", [Socket, Other]),
      loop(Socket)
  after 10000 -> %10秒
    check_socket(Socket)
  end.

check_socket(Socket) ->
  case battle_socket:is_battle_register(Socket) of
    true ->
      loop(Socket);
    false ->
      %log4erl:info("battle_socket Socket[~p] close by no register.~n", [Socket]),
      close_conn(Socket)
  end.

close_conn(Socket) ->
  log4erl:info("battle_socket Socket[~p] active close", [Socket]),
  gen_tcp:close(Socket).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
proc_msg(UpMsg, Socket) ->
  {UserID, CMDS} = filter_cmd(UpMsg),
  proc_cmds(Socket, UserID, CMDS).

proc_cmds(_Socket, _UserID, []) ->
  finish;

proc_cmds(Socket, UserID, [CMD|CS]) ->
  battle_room:client_sync(Socket, UserID, CMD),
  proc_cmds(Socket, UserID, CS).

decode_battle_up_msg(UpMsgData) ->
  battle_pb:decode_msg(UpMsgData, battle_up_msg).
  
encode_battle_notify_msg(Msg) ->
  battle_pb:encode_msg(Msg).

filter_cmd(#battle_up_msg{} = UpMsg) ->
  [battle_up_msg, UserID | CMDList] = tuple_to_list(UpMsg),
  CMDS = lists:filter(fun(X) -> X =/= ?UNDEF end, CMDList),
  {UserID, CMDS}.
  