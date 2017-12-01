%%% 最先初始化的模块
-module(init_base).
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
  log4erl:info("start init_base supervisor~n"),
  persistence:init(?DETS_PATH),
  Children = [],
  RestartStrategy = {one_for_one,3,10},
  {ok, {RestartStrategy, Children}}.
