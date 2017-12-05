
-module(memcache).
-author('Ollir Zhang<ollir.h@gmail.com>').
-behaviour(gen_server).

-include("record.hrl").
-include("settings.hrl").
-include_lib("stdlib/include/ms_transform.hrl").

-compile(export_all).

%% API 
-export([start_link/0]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2,
         handle_info/2, terminate/2, code_change/3]).

-record(state, {idmax, max_reg = 1000000}).
-define(DEVICEID_ETS, deviceid_ets).

%% ===================================================================
%% API functions
%% ===================================================================

start_link() ->
  State = #state{idmax = 0},
  gen_server:start_link({local, ?MODULE}, ?MODULE, State, []).

% 获取userid
get_userid(DeviceID, SvrID) ->
  case ets:lookup(?DEVICEID_ETS, {DeviceID, SvrID}) of
    [] -> ?UNDEF;
    [{_, UserId, _}] -> UserId
  end.

get_user_from_deviceid(DeviceID, SvrID) -> 
  case get_userid(DeviceID, SvrID) of
    ?UNDEF -> ?UNDEF;
    UserID -> get_user(UserID, DeviceID)
  end.

get_user(UserID, DeviceID) ->
  User = get_user(UserID),
  DeviceID = User#user.device_id,
  User.
  
get_user(UserID) ->
  user_db:get_user(UserID).
  
get_role(RoleID, UserID) ->
  Role = get_role(RoleID),
  UserID = Role#role.uid,
  Role.
  
get_role(RoleID) ->
  role_db:get_role(RoleID).
 
write_user(User) ->
  user_db:update_user(User).
  
write_role(Role) ->
  role_db:update_role(Role).

write_db(#user{} = User) -> write_user(User);
write_db(#role{} = Role) -> write_role(Role).

write_db(User, Role) ->
  ok = role_db:update_role(Role),
  ok = user_db:update_user(User).
  
get_reg_count() -> ets:info(?DEVICEID_ETS, size).

register_deviceid(DeviceID, SvrID) ->
  gen_server:call(?MODULE, {register_deviceid, DeviceID, SvrID}).

query_max_uid() ->
  gen_server:call(?MODULE, {query_max_uid}).

inc_reg_max(Count) ->
  gen_server:call(?MODULE, {inc_reg_max, Count}).

modify_reg_max(Max) ->
  gen_server:call(?MODULE, {modify_reg_max, Max}).


%% ===================================================================
%% gen_server callback functions
%% ===================================================================
init(State) ->
  log4erl:info("~p initializing ~n", [?MODULE]),
  process_flag(trap_exit, true),
  TableID = ets:new(?DEVICEID_ETS, [set, named_table, public]),
  Max = init_deviceid_ets(TableID),    % 初始化deviceid表
  true = erlang:is_integer(Max),
  {ok, State#state{idmax = Max}}.


% 申请新的UserID
handle_call({register_deviceid, DeviceID, SvrID}, _From,
            State = #state{idmax = X, max_reg = MR}) ->
  case X > MR of
    true -> {reply, full, State};   % 注册人数超过上限
    false ->                              % 还有注册名额
      ets:insert(?DEVICEID_ETS, {{DeviceID, SvrID}, X + 1, 0}),
      {reply, X + 1, State#state{idmax = X + 1}}
  end;

% 查询最大用户ID
handle_call({query_max_uid}, _From, State = #state{idmax = X}) ->
  {reply, X, State};

% 修改最大注册人数
handle_call({inc_reg_max, Count}, _From, State) ->
  OldMax = State#state.max_reg,
  IDMax = State#state.idmax,
  Max = case IDMax+Count>OldMax of
    true -> IDMax + Count;
    false -> OldMax
  end,
  {reply, OldMax, State#state{max_reg = Max}};
  
handle_call({modify_reg_max, Max}, _From, State) ->
  OldMax = State#state.max_reg,
  {reply, OldMax, State#state{max_reg = Max}}.

handle_cast(_, State) -> {noreply, State}.

terminate(_Reason, _State) -> log4erl:info("~p stopping ~n", [?MODULE]), ok.

handle_info(_Info, State) -> {noreply, State}.
code_change(_OldVsn, State, _Extra) -> {ok, State}.

%% ===================================================================
%% gen_server support functions
%% ===================================================================

% 初始化设备id的索引表
init_deviceid_ets(TableID) ->
  Dict = persistence:get_device_id_dict(),
  dict:fold(
    fun(DeviceID, {UserID, SvrID}, MaxUserID) -> 
      ets:insert(TableID, {{DeviceID, SvrID}, UserID, 0}), 
      max(MaxUserID, UserID)
    end, 0, Dict).


