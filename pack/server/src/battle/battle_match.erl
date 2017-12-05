-module(battle_match).
-author(lifan).

-behaviour(gen_server).

%% API 
-export([start_link/0]).
-export([start_match/1, cancel_match/1]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2,
         handle_info/2, terminate/2, code_change/3]).

-include("record.hrl").
-include("settings.hrl").
-include("battle_def.hrl").
-include("msg/down_pb.hrl").

-define(SERVER, ?MODULE).
-define(TEAM_MEMBERS, 2).
-define(MATCH_INTERVAL, 1000).
-define(LEVEL_FIT, 1).

-define(MATCH_ETS, match_ets).
-define(MATCH_INDEX_ETS, match_index_ets).
-define(MATCHED_TEAM_ETS, matched_team_ets).

-record(state, {matched_team_id, avg_level, match_time}).

-record(match_unit, {user_id, role_id, state, level, team_id, start_time, matched_team}).
-record(match_index_key, {start_time, user_id}).
-record(match_index, {key, level}).
-record(matched_team_key, {start_time, id}).
% ===================================================================
%% API functions
%% ===================================================================

start_link() ->
  gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

start_match(Role) ->
  gen_server:call(?SERVER, {start_match, Role}).

cancel_match(Role) ->
  gen_server:call(?SERVER, {cancel_match, Role}).


%% ===================================================================
%% gen_server callback functions
%% ===================================================================
init([]) ->
  log4erl:info("~p initializing ~n", [?SERVER]),
  process_flag(trap_exit, true),
  ets:new(?MATCH_ETS, [set, named_table, public, {keypos, #match_unit.user_id}]),
  ets:new(?MATCH_INDEX_ETS, [ordered_set, named_table, public, {keypos, #match_index.key}]),
  ets:new(?MATCHED_TEAM_ETS, [ordered_set, named_table, public, {keypos, #matched_team.key}]),
  erlang:send_after(?MATCH_INTERVAL, self(), match),
  State = #state{
    matched_team_id = 0,
    avg_level = 0
  },
  {ok, State}.

handle_call({start_match, Role}, _From, State) ->
  {Reply, NewState} = start_match_i(Role, State),
  {reply, Reply, NewState};

handle_call({cancel_match, Role}, _From, State) ->
  {Reply, NewState} = cancel_match_i(Role, State),
  {reply, Reply, NewState}.

handle_cast(match, State) -> 
  NewState = match_i(State),
  erlang:send_after(?MATCH_INTERVAL, self(), match),
  {noreply, NewState};

handle_cast(_, State) -> {noreply, State}.

terminate(_Reason, _State) -> 
  log4erl:info("~p stopping ~n", [?SERVER]), ok.

handle_info(_Info, State) -> {noreply, State}.
code_change(_OldVsn, State, _Extra) -> {ok, State}.

%% ===================================================================
%% gen_server support functions
%% ===================================================================
start_match_i(#role{uid = UserID, rid = RoleID, level = Level}, State) ->
  {Reply, NewState} = case ets:lookup(?MATCH_ETS, UserID) of
    [#match_unit{state = _State}] -> 
      {matching, State};
    [] ->
      Unit = #match_unit{
        user_id = UserID,
        role_id = RoleID,
        state = matching,
        level = Level,
        start_time = tools:timenow()
      },
      NewState0 = calc_avg(State, Level),
      add_match_unit(Unit),
      {success, NewState0}
  end,
  {Reply, NewState}.

cancel_match_i(#role{uid = UserID}, State) ->
  {Reply, NewState} = case ets:lookup(?MATCH_ETS, UserID) of
    [] -> {success, State};
    [#match_unit{state = matched_battle}] ->
      {matched, State};
    [#match_unit{state = State, level = Level}] ->
      NewState0 = calc_avg(State, -Level),
      delete_match_unit(UserID),
      {success, NewState0}
  end,
  {Reply, NewState}.


get_match_index_key(#match_unit{user_id = UserID, start_time = ST}) ->
  #match_index_key{start_time = ST, user_id = UserID}.

get_match_index(#match_unit{level = Level} = Role) ->
  #match_index{
    key = get_match_index_key(Role),
    level = Level
  }.

add_match_unit(Unit) ->
  ets:insert(?MATCH_INDEX_ETS, get_match_index(Unit)),
  ets:insert(?MATCH_ETS, Unit).

delete_match_unit(UserID) ->
  case ets:lookup(?MATCH_ETS, UserID) of
    [] -> pass;
    [#match_unit{state = State} = Unit] ->
      case State of
        matched_team ->
          disband_matched_team(Unit#match_unit.matched_team);
        _ -> pass
      end,
      ets:delete(?MATCH_INDEX_ETS, get_match_index_key(Unit)),
      ets:delete(?MATCH_ETS, UserID)
  end.
  
calc_avg(#state{avg_level = Avg} = State, ModLevel) ->
  UnitNum = get_unit_count(),
  NewNum = case ModLevel > 0 of
    true -> UnitNum + 1;
    false -> UnitNum - 1
  end,
  NewAvg = case NewNum > 0 of
    false -> 0;
    true -> (UnitNum * Avg + ModLevel) / NewNum
  end,
  State#state{avg_level = NewAvg}.

get_unit_count() ->
  ets:info(?MATCH_ETS, size).

match_i(State) ->
  State2 = State#state{match_time = tools:timenow()},
  State3 = match_to_team(State2),
  {State4, Matched} = match_to_battle(State3),
  notify_matched(Matched),
  {ok, State4}.

match_to_team(State) ->
  IndexEts = ?MATCH_INDEX_ETS,
  ets:safe_fixtable(IndexEts, true),
  tools:ets_foldl(fun match_to_team/3, State, IndexEts),
  ets:safe_fixtable(IndexEts, false).

%% match single unit to a team
match_to_team(Tab, Key, State) ->
  [MatchUnit] = ets:lookup(?MATCH_ETS, Key#match_index_key.user_id),
  case try_match_team(MatchUnit, ets:next(Tab, Key), Tab, State) of
    ?NOTFOUND -> State;
    {MatchedKey, MatchedUnit} ->
      ets:delete(Tab, MatchedKey),
      ets:delete(Tab, Key),
      add_matched_team(MatchUnit, MatchedUnit, State)
  end.

try_match_team(_, ?EOT, _, _) -> ?NOTFOUND;
try_match_team(#match_unit{user_id = UserID} = Unit, 
  #match_index_key{user_id = UserID} = Key, Tab, Acc) ->
  try_match_team(Unit, ets:next(Tab, Key), Tab, Acc);
try_match_team(Unit, #match_index_key{user_id = UserID} = Key, Tab, Acc) ->
  [MatchedUnit] = ets:lookup(Tab, UserID),
  case is_fit_to_team(Unit, MatchedUnit, Acc) of
    false ->
      try_match_team(Unit, ets:next(Tab, Key), Tab, Acc);
    true ->
      {Key, MatchedUnit}
  end.

is_fit_to_team(
    #match_unit{level = LevelA, start_time = TimeA},
    #match_unit{level = LevelB, start_time = TimeB},
    #state{avg_level = LevelAvg, match_time = Timenow}
    ) ->
  Adjust = time_adjust(TimeA, Timenow) + time_adjust(TimeB, Timenow),
  abs(((LevelA + LevelB) / 2) - LevelAvg) < ?LEVEL_FIT + Adjust.

time_adjust(StartTime, Timenow) -> (Timenow - StartTime) / 2.

add_matched_team(MatchUnit, MatchedUnit, State) ->
  UserIDA = MatchUnit#match_unit.user_id,
  UserIDB = MatchedUnit#match_unit.user_id,
  TeamID = State#state.matched_team_id,
  Timenow = State#state.match_time,
  Key = #matched_team_key{
    start_time = Timenow,
    id = TeamID
  },
  MatchedTeam = #matched_team{
    key = Key,
    members = [UserIDA, UserIDB]
  },
  Matched = [{#match_unit.state, matched_team}, {#match_unit.matched_team, Key}],
  ets:update_element(?MATCH_ETS, UserIDA, Matched),
  ets:update_element(?MATCH_ETS, UserIDB, Matched),
  ets:insert(?MATCHED_TEAM_ETS, MatchedTeam),
  State#state{matched_team_id = TeamID + 1}.

disband_matched_team(TeamKey) ->
  [MatchedTeam] = ets:lookup(?MATCHED_TEAM_ETS, TeamKey),
  ets:foreach(
    fun(UID) ->
      [Unit] = ets:lookup(?MATCH_ETS, UID),
      ets:update_element(?MATCH_ETS, UID, {#match_unit.state, matching}),
      ets:insert(?MATCH_INDEX_ETS, get_match_index(Unit))
    end, MatchedTeam#matched_team.members),
  ets:delete(?MATCHED_TEAM_ETS, TeamKey).

match_to_battle(State) -> 
  TeamEts = ?MATCHED_TEAM_ETS,
  ets:safe_fixtable(TeamEts, true),
  Matched = tools:ets_foldl(fun match_to_battle/3, [], TeamEts),
  ets:safe_fixtable(TeamEts, false),
  {State, Matched}.

%% match teams unit to a battle
match_to_battle(Tab, Key, Matched) ->
  [MatchTeam] = ets:lookup(Tab, Key),
  case try_match_battle(MatchTeam, ets:next(Tab, Key), Tab) of
    ?NOTFOUND -> Matched;
    {MatchedKey, MatchedTeam} ->
      ets:delete(Tab, MatchedKey),
      ets:delete(Tab, Key),
      add_battle_team(MatchTeam, MatchedTeam),
      [{MatchTeam, MatchedTeam} | Matched]
  end.

try_match_battle(_, ?EOT, _) -> ?NOTFOUND;
try_match_battle(
    #matched_team{key = #matched_team_key{id = TeamID}} = Team, 
    #matched_team_key{id = TeamID} = Key, Tab) ->
  try_match_battle(Team, ets:next(Tab, Key), Tab);
try_match_battle(Team, Key, Tab) ->
  [MatchedTeam] = ets:lookup(Tab, Key),
  case is_fit_to_battle(Team, MatchedTeam) of
    false ->
      try_match_battle(Team, ets:next(Tab, Key), Tab);
    true ->
      {Key, MatchedTeam}
  end.

is_fit_to_battle(_, _) -> true.

add_battle_team(#matched_team{members = MembersA}, 
    #matched_team{members = MembersB}) ->
  lists:foreach(
    fun(UID) ->
      ets:update_element(?MATCH_ETS, UID, {#match_unit.state, matched_battle})
    end, MembersA ++ MembersB
  ),
  ok.
  
notify_matched([]) -> finish;
notify_matched([Teams|Rest]) ->
  notify_matched_teams(Teams),
  notify_matched(Rest).

notify_matched_teams({TeamA, TeamB} = Teams) ->
  Msg = create_notify_msg(Teams),
  Targets = TeamA#matched_team.members ++ TeamB#matched_team.members,
  rtnotify:notify_msg(Targets, Msg),
  ok.

create_notify_msg({TeamA, TeamB}) ->
  #battle_match_notify {
    team_a = pack_team(TeamA),
    team_b = pack_team(TeamB),
    battle_ip = get_battle_ip(),
    battle_port = get_battle_port()
  }.

pack_team(#matched_team{members = Members}) ->
  TeamMembers = [pack_team_member(UserID) || UserID <- Members],
  #battle_team{members = TeamMembers}.

pack_team_member(UserID) ->
  [Unit] = ets:lookup(?MATCH_ETS, UserID),
  #match_unit{
    user_id = UserID,
    role_id = RoleID,
    team_id = TeamID
  } = Unit,
  Role = memcache:get_role(RoleID, UserID),
  #battle_team_member{
    role_id = Role#role.rid,
    elf_id = Role#role.eid,
    name = roles:get_name(Role),
    level = Role#role.level,
    team_id = TeamID
  }.

get_battle_ip() ->
  {ok, IP} = application:get_env(battle_ip),
  IP.

get_battle_port() ->
  {ok, Port} = application:get_env(battle_port),
  Port.

