-module(egame_sup).
-author(lifan).

-behaviour(supervisor).

%% API
-export([start_link/0]).

%% Supervisor callbacks
-export([init/1]).

%% Helper macro for declaring children of supervisor
-define(CHILD(I, Type), {I, {I, start_link, []}, permanent, 5000, Type, [I]}).

-include("settings.hrl").
-include("services.hrl").
%% ===================================================================
%% API functions
%% ===================================================================

start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []).


%% ===================================================================
%% Supervisor callbacks
%% ===================================================================

init([]) ->
  % 读配置参数
  log4erl:conf(?LOG4ERL_CONF),  % 加载log4erl的配置文件

  % 启动timer服务
  timer:start(),

  % 初始化监控树
  Children = ?CONST_SERICES_CHILDREN_SPEC_LIST,

  %RestartStrategy = {one_for_one, 0, 1},  % 不会重启，这样便于暴露错误
  RestartStrategy = {one_for_one, 30, 10}, % 10s内重启子进程30次
  {ok, {RestartStrategy, Children}}.
