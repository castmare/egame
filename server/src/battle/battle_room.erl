%%%
%%% battle room
%%%
-module(battle_room).
-author(lifan).

-behaviour(gen_statem).

%% API 
-export([init/0, start_link/1, start_battle/1, client_sync/3]).

%% gen_statem callbacks
-export([init/1, terminate/3, code_change/4, callback_mode/0]).
-export([prepare/3, load/3, battle/3, ends/3]).

-include("record.hrl").
-include("settings.hrl").
-include("battle_def.hrl").
-include("msg/up_pb.hrl").
-include("msg/down_pb.hrl").
-include("msg/battle_pb.hrl").

-define(SERVER, ?MODULE).
-define(SYNC_LOAD_INTERVAL, 1000).
-define(SYNC_FRAME_INTERVAL, 100).
-define(BATTLE_END_WAIT, 1000).
-define(BATTLE_DESCTROY_WAIT, 1000).

-define(BATTLE_USER_ETS, battle_user_ets). 

-record(battle_user, {
  user_id, 
  role_id, 
  is_confirmed,
  load,
  is_end
}).

-record(user_index, {user_id, room_pid, socket}).
-record(data, {
  battle_id,
  battle_seed,
  teams,
  users,
  frames,
  frame_id,
  start_time,
  end_time,
  result,
  stat
}).

%% state prepare, load, battle, ends, cancel, destroy
% ===================================================================
%% API functions
%% ====================================== =============================
init() ->
  ets:new(?BATTLE_USER_ETS, [ordered_set, named_table, public]),
  ok.

start_battle(Battle) ->
  start_link(Battle).

start_link(Battle) ->
  {ok, _PID} = gen_statem:start(?SERVER, ?MODULE, [Battle], []),
  ok.

client_sync(Socket, UserID, Msg) ->
  try
    ets:update_element(?BATTLE_USER_ETS, UserID, 
      {#user_index.socket, Socket}),
    Room = get_battle_room(UserID),
    case Room of
      ?UNDEF -> throw("room not found");
      _ -> ok
    end,
    sync(Room, UserID, Msg)
  catch
    E:R ->
      log4erl:error("~p client_sync failed ~p ~p ~p", [?MODULE, E, R, ?STACK])
  end.

sync(Room, UserID, {battle_start, _, Confirm}) ->
  gen_statem:cast(Room, {start_sync, UserID, Confirm});

sync(Room, UserID, {battle_load, _, Finish, Process}) ->
  NewProcess = case Finish of
    true -> finish;
    false -> Process
  end,
  gen_statem:cast(Room, {load_sync, UserID, NewProcess});

sync(Room, UserID, {battle_frame_group, _, Frames}) ->
  gen_statem:cast(Room, {frame_sync, UserID, Frames});

sync(Room, UserID, {battle_end, _, Result, Stat}) ->
  gen_statem:cast(Room, {end_sync, UserID, Result, Stat});

sync(_Room, _UserID, _) ->
  unsupported.

%% ===================================================================
%% gen_statem callback functions
%% ===================================================================

init([Battle]) ->
  #{
    battle_id := BatleID,  
    battle_seed := BatteSeed,
    teams := Teams
  } = Battle,
  Users = create_battle_users(Teams),
  Data = #data{
    battle_id = BatleID,
    battle_seed = BatteSeed,
    teams = Teams,
    users = Users,
    frames = [],
    frame_id = 0,
    start_time = tools:timenow()
  },
  build_user_index(Users),
  {ok, prepare, Data}.
callback_mode() -> state_functions.

terminate(_Reason, _State, _Data) ->
  void.
code_change(_Vsn, State, Data, _Extra) ->
  {ok, State, Data}.
%%% state callback(s)

prepare({cast, _From}, {start_sync, _UserID, false}, Data) ->
  {next_state, cancel, Data};
prepare({cast, _From}, {start_sync, UserID, true}, Data) ->
  NewData = start_confirm(Data, UserID),
  case is_all_confirmed(NewData) of
    false -> {keep_state, NewData};
    true -> 
      notify_battle_start(NewData),
      {next_state, load, NewData, [{state_timeout, ?SYNC_LOAD_INTERVAL, notify_load}]}
  end;
prepare(EventType, EventContent, Data) ->
    handle_event(EventType, EventContent, Data).

load({cast, _From}, {load_sync, UserID, Process}, Data) ->
  NewData = load_process(Data, UserID, Process),
  {keep_state, NewData};
load(state_timeout, notify_load, Data) ->
  notify_load_process(Data),
  case is_all_loaded(Data) of
    false ->
      {keep_state_and_data, [{state_timeout, ?SYNC_LOAD_INTERVAL, notify_load}]};
    true -> 
      {next_state, battle, Data, [{state_timeout, ?SYNC_FRAME_INTERVAL, notify_frame}]}
  end;
  
load(EventType, EventContent, Data) ->
  handle_event(EventType, EventContent, Data).

battle(state_timeout, notify_frame, Data) ->
  NewData = sync_frames(Data),
  {keep_state, NewData, [{state_timeout, ?SYNC_FRAME_INTERVAL, notify_frame}]};

battle({cast, _From}, {frame_sync, UserID, Frames}, Data) ->
  NewData = add_frames(Data, UserID, Frames),
  {keep_state, NewData};

battle({cast, _From}, {end_sync, UserID, Result, Stat}, Data) ->
  NewData = battle_end(Data, UserID, Result, Stat),
  case is_battle_end(NewData) of
    false ->
      {keep_state, NewData, {timeout, ?BATTLE_END_WAIT, battle_end}};
    true ->
      notify_battle_end(NewData),
      {next_state, ends, NewData, [{state_timeout, ?BATTLE_END_WAIT, battle_end}]}
  end;

battle(timeout, battle_end, Data) ->
  {keep_state, Data, {state_timeout, ?BATTLE_END_WAIT, battle_end}};

battle(EventType, EventContent, Data) ->
  handle_event(EventType, EventContent, Data).

ends(state_timeout, battle_end, Data) ->
  notify_battle_end(Data),
  {keep_state_and_data, {state_timeout, ?BATTLE_DESCTROY_WAIT, battle_destroy}};

ends(state_timeout, battle_destroy, Data) ->
  {stop, {shutdown, {battle_destory, Data}}, battle_destroy, Data};

ends(EventType, EventContent, Data) ->
    handle_event(EventType, EventContent, Data).

%% Handle events common to all states
% handle_event({call,From}, get_count, Data) ->
%     %% Reply with the current count
%     {keep_state, Data, [{reply,From,Data}]};
handle_event(_, _, Data) ->
    %% Ignore all other events
    {keep_state, Data}.
  
%% ===================================================================
%% internal functions
%% ===================================================================
get_battle_room(UserID) ->
  case ets:lookup(?BATTLE_USER_ETS, UserID) of
    [] -> ?UNDEF;
    [#user_index{room_pid = PID}] -> PID
  end.

create_battle_users({TeamA, TeamB}) ->
  UserIDList = TeamA#matched_team.members ++ TeamB#matched_team.members,
  [create_battle_user(UserID) || UserID <- UserIDList].

create_battle_user(UserID) ->
  #battle_user{
    user_id = UserID,
    is_confirmed = false,
    is_end = false,
    load = 0
  }.

build_user_index(Users) ->
  PID = self(),
  lists:foreach(
    fun(#battle_user{user_id = UserID}) ->
      Index = #user_index{user_id = UserID, room_pid = PID},
      ets:insert(?BATTLE_USER_ETS, Index)
    end, Users),
  ok.

start_confirm(Data, UserID) ->
  BattleUser = get_battle_user(Data, UserID),
  set_battle_user(Data, BattleUser#battle_user{is_confirmed = true}).

is_all_confirmed(#data{users = UserList}) ->
  lists:all(fun(#battle_user{is_confirmed = C}) -> C end, UserList).

is_all_loaded(#data{users = UserList}) ->
  lists:all(fun(#battle_user{load = Load}) -> Load =:= finish end, UserList).

get_battle_user(#data{users = UserList}, UserID) ->
  lists:keyfind(UserID, #battle_user.user_id, UserList).

set_battle_user(#data{users = UserList} = Data, 
    #battle_user{user_id = UserID} = User) ->
  NewList = lists:keystore(UserID, #battle_user.user_id, UserList, User),
  Data#data{users = NewList}.

get_user_id_list(#data{users = UserList}) ->
  [UserID || #battle_user{user_id = UserID} <- UserList].

notify_battle_start(#data{battle_id = ID, battle_seed = Seed, teams = Teams} = Data) ->
  Notify = #battle_notify_msg{
    sob = #battle_start_notify{
      battle_id   = ID,
      battle_seed = Seed,
      teams       = Teams
    }
  },
  UserIDList = get_user_id_list(Data),
  battle_notify(UserIDList, Notify).

load_process(Data, UserID, Process) ->
  BattleUser = get_battle_user(Data, UserID),
  set_battle_user(Data, BattleUser#battle_user{load = Process}).

notify_load_process(#data{users = UserList} = Data) ->
  Loads = [build_battle_load(User) || User <- UserList],
  Notify = #battle_notify_msg {
    load = #battle_load_notify{
      loads = Loads
    }
  },
  UserIDList = get_user_id_list(Data),
  battle_notify(UserIDList, Notify).

build_battle_load(#battle_user{user_id = UserID, load = Load}) ->
  #battle_load{
    user_id = UserID,
    is_finished = Load =:= finish,
    process = case Load of finish -> ?UNDEF; _ -> Load end
  }.

add_frames(#data{frames = OldFrames} = Data, _UserID, Frames) ->
  NewFrames = [Frames | OldFrames],
  Data#data{frames = NewFrames}.

sync_frames(#data{frames = Frames} = Data) ->
  CurFrameID = Data#data.frame_id + 1,
  BattleFrames = build_battle_frames(Frames, []),
  Notify = #battle_notify_msg{
    frame = #battle_frame_notify{
      sync_frame  = CurFrameID,
      frames = BattleFrames
    }
  },
  UserIDList = get_user_id_list(Data),
  battle_notify(UserIDList, Notify),
  Data#data{frames = [], frame_id = CurFrameID}.

build_battle_frames([], Rslt) -> Rslt;
build_battle_frames([Frames|Rest], Rslt) when is_list(Frames) ->
  NewRslt = [build_battle_frame(Frame) || Frame <- Frames] ++ Rslt,
  build_battle_frames(Rest, NewRslt);

build_battle_frames([Frame|Rest], Rslt) when is_tuple(Frame) ->
  build_battle_frames(Rest, [build_battle_frame(Frame)|Rslt]).

build_battle_frame(Frame) when is_tuple(Frame) -> Frame.


battle_end(Data, UserID, Result, Stat) ->
  BattleUser = get_battle_user(Data, UserID),
  Data2 = set_battle_user(Data, BattleUser#battle_user{is_end = true}),
  Data2#data{result = Result, stat = Stat}.

is_battle_end(#data{users = UserList}) ->
  lists:all(fun(#battle_user{is_end = E}) -> E end, UserList).

notify_battle_end(#data{result = Result, stat = Stat} = Data) ->
  Notify = #battle_notify_msg{
    eob = #battle_end_notify{
      result  = Result,
      stat    = Stat
    }
  },
  UserIDList = get_user_id_list(Data),
  battle_notify(UserIDList, Notify).

battle_notify([], _Notify) -> finish;
battle_notify([UID|Rest], Notify) ->
  Socket = ets:lookup_element(?BATTLE_USER_ETS, UID, #user_index.socket),
  Socket ! {battle_notify, Socket, Notify},
  battle_notify(Rest, Notify).
  