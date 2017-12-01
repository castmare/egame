%%% WebSocket Server
-module(ws_server).
-author(lifan).
-include("settings.hrl").
-export([loop/1, loop_req/1]).
-compile(export_all).

%%%===================================================================
%%% 主逻辑框架
%%%===================================================================
%% use protobuf to transfer binary data between C/S.
loop(Socket) ->
  log4erl:info("ws_server:loop ~w ~n", [Socket]),
  receive
    {tcp, Socket, Data} ->
      log4erl:info("ws_server:loop receive ~w data ~p ~n", [Socket, Data]),
      try
        Resp = handshake_web_socket(Socket, Data),
        PID = proc_lib:spawn(?MODULE, loop_req, [Socket]),
        gen_tcp:controlling_process(Socket, PID),
        inet:setopts(Socket, [{active, once}]),
        gen_tcp:send(Socket, Resp)
      catch
        Error:Reason -> 
          log4erl:error("ws_server:loop failed ~p:~p, ~p~n", [Error, Reason, ?STACK]),
          gen_tcp:close(Socket)
      end;
    {tcp_closed, Socket} ->
      log4erl:info("ws_server:loop tcp ~w closed by peer", [Socket]),
      gen_tcp:close(Socket);
    _Other ->
      log4erl:info("ws_server:loop tcp ~w closed by server, case of ~w", [Socket, _Other]),
      gen_tcp:close(Socket)
  after 10000 ->
    log4erl:info("ws_server:loop tcp ~w closed by server, recieve timeout", [Socket]),
    gen_tcp:close(Socket)
  end.

loop_req(Socket) ->
  log4erl:info("ws_server:loop_req ~w ~n", [Socket]),
  receive
    {tcp, Socket, Data} ->
      log4erl:info("ws_server:loop_req receive ~w data ~p ~n", [Socket, Data]),
      try
        WSData = websocket_data(Data),
        log4erl:info("ws_server:loop_req ~w websocket_data ~p ~n", [Socket, WSData]),
        LogicResp = logic_server:process(Socket, WSData),
        log4erl:info("ws_server:loop_req ~w logic resp ~p ~n", [Socket, LogicResp]),
        Resp = build_client_data(LogicResp),
        log4erl:info("ws_server:loop_req ~w resp_data ~p ~n", [Socket, Resp]),
        gen_tcp:send(Socket, Resp)
      catch
        Error:Reason -> 
          log4erl:error("ws_server:loop_req failed ~p:~p, ~p~n", [Error, Reason, ?STACK])
      after
        gen_tcp:close(Socket)
      end;
    {tcp_closed, Socket} ->
      log4erl:info("ws_server:loop_req tcp ~w closed by peer", [Socket]),
      gen_tcp:close(Socket);
    _Other ->
      log4erl:info("ws_server:loop_req tcp ~w closed by server, case of ~w", [Socket, _Other]),
      gen_tcp:close(Socket)
  after 10000 ->
    log4erl:info("ws_server:loop_req tcp ~w closed by server, recieve timeout", [Socket]),
    gen_tcp:close(Socket)
  end.
%%%===================================================================
%%% 支持函数
%%%===================================================================
handshake_web_socket(Socket, Data) ->
  log4erl:info("handshake_web_socket Data ~w ~p", [Socket, Data]),
  Key = list_to_binary(
    lists:last(
      string:tokens(
        hd(
          lists:filter(
            fun(S) -> lists:prefix("Sec-WebSocket-Key:", S) end, 
            string:tokens(binary_to_list(Data), "\r\n")
          )
        ), 
        ": "
      )
    )
  ),
  log4erl:info("handshake_web_socket Key ~p", [Key]),
  Challenge = base64:encode(crypto:hash(sha, << Key/binary, "258EAFA5-E914-47DA-95CA-C5AB0DC85B11" >>)),
  log4erl:info("handshake_web_socket Challenge ~p", [Challenge]),
  Handshake = ["HTTP/1.1 101 Switching Protocols\r\n",
                "connection: Upgrade\r\n",
                "upgrade: websocket\r\n",
                "sec-websocket-accept: ", 
                Challenge, "\r\n", "\r\n", <<>>],
  log4erl:info("handshake_web_socket Handshake ~p", [Handshake]),          
  list_to_binary(Handshake).


%% 仅处理长度为125以内的文本消息
websocket_data(Data) when is_list(Data) ->
    websocket_data(list_to_binary(Data));

websocket_data(<< 1:1, 0:3, _DataType:4, 1:1, Len:7, MaskKey:32, Rest/bits>>) when Len < 126 ->
    log4erl:info("websocket_data data type ~w len ~w mask key ~w rest ~w", 
      [_DataType, Len, MaskKey, Rest]),
    <<End:Len/binary, _/bits>> = Rest,
    log4erl:info("websocket_data data end ~w ", [End]),
    Text = websocket_unmask(End, MaskKey, <<>>),
    log4erl:info("websocket_data data text ~w ", [Text]),
    Text;


websocket_data(_) ->
    <<>>. 

%% 由于Browser发过来的数据都是mask的,所以需要unmask
websocket_unmask(<<>>, _, Unmasked) ->
    Unmasked;

websocket_unmask(<< O:32, Rest/bits >>, MaskKey, Acc) ->
    T = O bxor MaskKey,
    websocket_unmask(Rest, MaskKey, << Acc/binary, T:32 >>);

websocket_unmask(<< O:24 >>, MaskKey, Acc) ->
    << MaskKey2:24, _:8 >> = << MaskKey:32 >>,
    T = O bxor MaskKey2,
    << Acc/binary, T:24 >>;

websocket_unmask(<< O:16 >>, MaskKey, Acc) ->
    << MaskKey2:16, _:16 >> = << MaskKey:32 >>,
    T = O bxor MaskKey2,
    << Acc/binary, T:16 >>;

websocket_unmask(<< O:8 >>, MaskKey, Acc) ->
    << MaskKey2:8, _:24 >> = << MaskKey:32 >>,
    T = O bxor MaskKey2,
    << Acc/binary, T:8 >>.

%% 发送文本给Client
build_client_data(Data) ->
    Len = iolist_size(Data),
    BinLen = payload_length_to_binary(Len),
    [<< 1:1, 0:3, 2:4, 0:1, BinLen/bits >>, Data].

payload_length_to_binary(N) ->
    case N of
        N when N =< 125 -> << N:7 >>;
        N when N =< 16#ffff -> << 126:7, N:16 >>;
        N when N =< 16#7fffffffffffffff -> << 127:7, N:64 >>
    end.


  

