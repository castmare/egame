%%% 业务逻辑模块监控者
-module(init_sup).
-author(lifan).

-behaviour(supervisor).

%% API
-export([start_link/0]).

%% Supervisor callbacks
-export([init/1]).


-include("settings.hrl").
%% ===================================================================
%% API functions
%% ===================================================================

start_link() ->
  supervisor:start_link({local, ?MODULE}, ?MODULE, []).

%% ===================================================================
%% Supervisor callbacks
%% ===================================================================
init([]) ->
  log4erl:info("start init_sup supervisor~n"),
  user_db:init(),
  role_db:init(),
  rtnotify:init_ets(),
  stat_profile:init(),
  logic_server:init(),
  Children = [],
  RestartStrategy = {one_for_one, 3, 10},
  {ok, {RestartStrategy, Children}}.
