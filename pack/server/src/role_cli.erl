%%%-------------------------------------------------------------------
%%% @doc 角色请求处理
%%%-------------------------------------------------------------------
-module(role_cli).
-author(lifan).

%%% API
-export([client_request/2]).

-compile(export_all).

-include("record.hrl").
-include("settings.hrl").
-include("msg/up_pb.hrl").
-include("msg/down_pb.hrl").

-define(DOWN(Type, Data), 
  #down_msg{role = setelement(#role_reply.Type, #role_reply{}, Data)}
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

cli(User, {create_role, RoleCID}) ->
  {Result, Role} = users:create_new_role(User, RoleCID),
  Reply = #create_role_reply{result = Result, role = Role},
  ?DOWN(create, Reply);

cli(User, {select_role, RoleID}) ->
   Role = users:select_role(User, RoleID),
   Reply = #select_role_reply{role = Role},
   ?DOWN(select, Reply);

cli(User, {lookup_role}) ->
   Roles = users:pack_role_summarys(User),
   Reply = #lookup_role_reply{roles = Roles},
   ?DOWN(lookup, Reply);

cli(_User, _) ->
  unsupport_request.
  
