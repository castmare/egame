-module(net_test).
-author('ltb').

-compile([export_all]).

-define(IP, "192.168.191.128").
-define(PORT, 13000).

-define(DEVICE_ID, "1#12-12452234").

-include("msg/up_pb.hrl").
-include("msg/down_pb.hrl").
-include("settings.hrl").


rpc_call(UpMsg) ->
  case gen_tcp:connect(?IP, ?PORT, [binary, {packet, 4}, {active, true}]) of
    {ok, Socket} ->
      send_up_msg(Socket, UpMsg),
      receive_msg(Socket);
    {error, Reason} ->
      tools:format("tcp connect error ~p~n", [Reason])
  end.

receive_msg(Socket) ->
  receive
    {tcp, Socket, Data} ->
      %%Plain = mycrypto:decrypt(?CRYPT_KEY, Data),
      Down = down_pb:decode_msg(Data, down_msg),   
			tools:format("receive_msg down ~w~n", [Down]);
    {tcp_error, Socket, Reason} ->
      tools:format("tcp_error ~p~n", [Reason])
  end.

send_up_msg(Socket, #up_msg{login = Login} = Up) ->
  UpMsg = up_pb:encode_msg(Up),
  UpBin = iolist_to_binary(UpMsg),
  IsLogin = case Login =/= undefined of true -> 1; false -> 0 end,
  DeviceIdBinary = list_to_binary(?DEVICE_ID),
  Len = size(DeviceIdBinary),
  Body = UpBin,
  Left = <<DeviceIdBinary/binary, Body/binary>>,
  Data = <<IsLogin:8, Len:16/little, Left/binary>>,
  io:format("send_up_msg ~w~n", [Data]),
  gen_tcp:send(Socket, Data).


login() ->
  UpMsg = #up_msg{
    sequence = tools:timenow(),
    repeat = false,
    user_id = 0,
    role_id = 0,
    login = #login_req{
      device_id = ?DEVICE_ID,
      version = "1.0.0"
    }
  },
  rpc_call(UpMsg).
  