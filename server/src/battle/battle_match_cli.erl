%%%-------------------------------------------------------------------
%%% @doc battle_match client request dsad
%%%-------------------------------------------------------------------
-module(battle_match_cli).
-author(lifan).

%%% API
-export([client_request/2]).

-compile(export_all).

-include("record.hrl").
-include("settings.hrl").
-include("msg/up_pb.hrl").
-include("msg/down_pb.hrl").

-define(DOWN(Type, Data), 
  #down_msg{match = setelement(#match_reply.Type, #match_reply{}, Data)}
).
-define(RETURN(Error), throw({return, Error})).
-define(RETURN_IF(IsTrue, Error), IsTrue andalso throw({return, Error})).
-define(OK_IF(IsTrue, Error), case IsTrue of true -> ok; _ -> Error end).
-define(OK_IF_NOT(IsTrue, Error), case IsTrue of false -> ok; _ -> Error end).

%%%===================================================================
%%% API
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc 处理客户端请求
%% @spec client_request(User, Msg) -> Resp
%%  when User = user(), Msg = term()
%%--------------------------------------------------------------------
client_request(#user{} = User, #role_req{} = Msg) ->
  try
    cli(User, tools:filter_msg(Msg))
  catch
    throw:{return, Err} when is_list(Err); is_atom(Err) -> {tip, Err};
    error:{badmatch, Err} when is_list(Err); is_atom(Err) -> {tip, Err};
    E:R -> 
      Stack = erlang:get_stacktrace(),
      log4erl:error("~p client_request failed ~p ~p ~p", [?MODULE, E, R, Stack]),
      erlang:raise(E, R, Stack)
  end.


%%%===================================================================
%%% 客户端协议
%%%===================================================================

cli(Role, {start_match}) ->
  Reply = battle_match:start_match(Role),
  ?DOWN(start, Reply);

cli(Role, {cancel_match}) ->
  Reply = battle_cancel:start_match(Role),
  ?DOWN(cancel, Reply);

cli(_Role, _) ->
  unsupport_request.
  
