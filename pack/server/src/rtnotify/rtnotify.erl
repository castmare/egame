%%实时信息推送服务器

-module(rtnotify).
-author('zhangrenai').

-behaviour(gen_server).

%% APIs

-export([init_ets/0, start_link/0]).
-export([is_rtnotify_register/1, 
  notify_msg/2,
  is_online/1,
  is_online2u/1,
  ionline/1,
  get_uid/1]).

-export([rtnotify_register/3, rtnotify_unregister/2, notify_send/2]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2,
   terminate/2, code_change/3]).



-compile(export_all).
-record(state, {}).

-define(RTNOTIFY_SOCKET2UID_ETS, rtnotify_socket2uid_ets).
-define(RTNOTIFY_UID2SOCKET_ETS, rtnotify_uid2socket_ets).
-define(RTNOTIFY_UID_TC_ETS,  rtnotify_uid_tc_ets).

-include("../settings.hrl").

init_ets() ->
  ets:new(?RTNOTIFY_SOCKET2UID_ETS, [set, named_table, public]),
  ets:new(?RTNOTIFY_UID2SOCKET_ETS, [set, named_table, public]),
  ets:new(?RTNOTIFY_UID_TC_ETS, [set, named_table, public]),
  ok.

start_link() ->
  gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

notify_msg(UserIDList, Msg) when is_list(UserIDList) ->
  gen_server:cast(?MODULE, {groupcast, UserIDList, Msg});

notify_msg(UserID, Msg) ->
  gen_server:cast(?MODULE, {notify, UserID, Msg}).

rtnotify_register(Socket, UID, Pid) ->
  gen_server:cast(?MODULE, {register_socket, UID, Socket, Pid}).

rtnotify_unregister(Socket, Reason) ->
  gen_server:cast(?MODULE, {unregister_socket, Socket, Reason}).

is_rtnotify_register(Socket) ->
  get_uid(Socket) =/= undefined.

%%%%%%%%%%%%%%%%%%%%%%%
init([]) ->
  process_flag(trap_exit, true),
  log4erl:info("~p starting ~n", [?MODULE]),
  {ok, #state{}}.

handle_cast({register_socket, UID, Socket, Pid}, State) ->
  data_register(UID, Socket, Pid),
  {noreply, State};
handle_cast({unregister_socket, Socket, Reason}, State) ->
  data_unregister(Socket, Reason),
  {noreply, State};
handle_cast({notify, TargetUId, Msg}, State) ->
  notify_send(TargetUId, Msg),
  {noreply, State};
handle_cast({groupcast, TargetUIdList, Msg}, State) ->
  notify_list_send(TargetUIdList, Msg),
  {noreply, State};  
handle_cast(_Msg, State) -> {noreply, State}.
handle_call(_Request, _From, State) -> {reply, ok, State}.
terminate(_Reason, _State) -> 
  log4erl:info("~p stopping ~n", [?MODULE]), 
  ok.
handle_info(_Info, State) -> {noreply, State}.
code_change(_OldVsn, State, _Extra) -> {ok, State}.

data_register(UID, Socket, Pid) ->
  OldSocket = get_socket(UID),
  case OldSocket =/= undefined andalso OldSocket =/= Socket of
    true -> data_unregister(OldSocket, conflict);
    false -> ok
  end,
  %io:format("rtnotify_register register uid ~p pid ~p socket ~p~n", [UID, Pid, Socket]),
  ets:insert(?RTNOTIFY_SOCKET2UID_ETS, {Socket, UID, Pid}),
  ets:insert(?RTNOTIFY_UID2SOCKET_ETS, {UID, Socket, Pid}),
  %log4erl:info("rtnotify Socket[~p] Pid[~p] register UID[~p] ok", [Socket, Pid, UID]),
  ok.

data_unregister(Socket, Reason) ->
  case get_uidpid(Socket) of 
    undefined -> ok;
    {UID, Pid} -> 
      ets:delete(?RTNOTIFY_SOCKET2UID_ETS, Socket),
      ets:delete(?RTNOTIFY_UID2SOCKET_ETS, UID),
      case Reason of
        activeclose -> ok;
        _ ->
          Pid!{rtnotify_kick, Socket, Reason}
      end,
      set_unregister_ts(UID),
      %log4erl:info("rtnotify Socket[~p] Pid[~p] unregister UID[~p] Reason ~p", [Socket, Pid, UID, Reason])
      ok
  end.

notify_all_send(Msg) ->
  ets:safe_fixtable(?RTNOTIFY_UID2SOCKET_ETS, true),
  First = ets:first(?RTNOTIFY_UID2SOCKET_ETS),
  notify_all_send_1(First, Msg),  
  ets:safe_fixtable(?RTNOTIFY_UID2SOCKET_ETS, false).

notify_all_send_1('$end_of_table',_Msg) ->
  ok;
notify_all_send_1(Key,Msg) ->
  case get_socketpid(Key) of 
    undefined -> false; 
    {Socket, Pid} -> 
      % io:format("notify_send find uid ~p Msg ~p~n", [UID, Msg]),
      Pid!{rtnotify_send, Socket, Msg},
      true
  end,
  Next = ets:next(?RTNOTIFY_UID2SOCKET_ETS,Key),
  notify_all_send_1(Next, Msg).

notify_list_send(UIDList, Msg) ->
  [notify_send(UID, Msg)||UID<-UIDList],
  ok.
notify_send(UID, Msg) ->
  case get_socketpid(UID) of 
    undefined -> false; 
    {Socket, Pid} -> 
      % io:format("notify_send find uid ~p Msg ~p~n", [UID, Msg]),
      Pid!{rtnotify_send, Socket, Msg},
      true
  end.

get_uid(Socket) ->
  case ets:info(?RTNOTIFY_SOCKET2UID_ETS) =:= undefined of
    true -> undefined;
    false ->
      case ets:lookup(?RTNOTIFY_SOCKET2UID_ETS, Socket) of
        [] ->
          %io:format("Socket ~p device can't found.~n", [Socket]), 
          undefined;
        [{_, UID, _}] -> UID
      end
  end.

get_uidpid(Socket) ->
  case ets:info(?RTNOTIFY_SOCKET2UID_ETS) =:= undefined of
    true -> undefined;
    false -> 
      case ets:lookup(?RTNOTIFY_SOCKET2UID_ETS, Socket) of
        [] ->
          %io:format("Socket ~p device can't found.~n", [Socket]), 
          undefined;
        [{_, UID, Pid}] -> {UID, Pid}
      end
  end.

get_socket(UID) ->
  case ets:lookup(?RTNOTIFY_UID2SOCKET_ETS, UID) of
    [] -> undefined;
    [{_, Socket, _}] -> Socket
  end.

get_socketpid(UID) ->
  case ets:lookup(?RTNOTIFY_UID2SOCKET_ETS, UID) of
    [] -> undefined;
    [{_, Socket, Pid}] -> {Socket, Pid}
  end.
  
is_online(UID) ->
  ets:member(?RTNOTIFY_UID2SOCKET_ETS, UID).

% 因为客户端无法告知压后台，所以用15分种来设置一个玩家的在线缓冲时间
is_online2u(UID) ->
  is_online(UID) orelse is_just_leave(UID, ?NOW).

is_just_leave(UID, Now) ->
  case ets:lookup(?RTNOTIFY_UID_TC_ETS, UID) of
    [{_, TS}] when Now =< TS + ?MINUTE(15) -> true;
    _ -> false
  end. 

set_unregister_ts(UID) ->
  ets:insert(?RTNOTIFY_UID_TC_ETS, {UID, ?NOW}).

ionline(UID) ->
  IsOnline = is_online2u(UID),
  tools:bool2int(IsOnline).
  