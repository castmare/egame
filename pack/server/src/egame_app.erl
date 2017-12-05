-module(egame_app).
-author(lifan).
-behaviour(application).

%% API
-export([start/0, stop/0]).

%% Application callbacks
-export([start/2, stop/1]).

-define(APP_NAME, egame).

%% ===================================================================
%% API
%% ===================================================================
% 用于Makefile启动进程
start() ->
  start_lager(),
  application:start(log4erl),
  log4erl:info("egame_app start."),
  start_mnesia_db(),
  case application:start(?APP_NAME) of
    ok ->
      log4erl:info("application ~w start ok ~n", [?APP_NAME]),
      [erlang:garbage_collect(X) || X <- erlang:processes()],
      start_monitor(),
      log4erl:info("server system start succ ~n");
    {error, Reason} -> 
      log4erl:info("server system start fail, reason ~p~n", [Reason])
  end.


stop() ->
  application:stop(?APP_NAME),
  stop_mnesia_db(),
  log4erl:info("server system stopped ~n"),
  application:stop(log4erl),
  application:stop(lager),
  stop_monitor(),
  erlang:halt().


%% ===================================================================
%% Application callbacks
%% ===================================================================
start(_StartType, _StartArgs) ->
  egame_sup:start_link().

stop(_State) ->
  ok.


%% ===================================================================
%% Support functions
%% ===================================================================
start_lager() ->
  Dir = "logs",
  LogRotateDate = "",
  LogRotateCount = 10,
  LogRotateSize = 10240000,
  LogMaxCountPerSec = 100,
  application:load(lager),
  InfoLog = filename:join([Dir, "info.log"]),
  ErrorLog = filename:join([Dir, "error.log"]),
  CrashLog = filename:join([Dir, "crash.log"]),
  application:set_env(lager, log_root, Dir),
  application:set_env(lager, handlers, [
    {lager_console_backend, [{level, info}]},
    {lager_file_backend, [{file, ErrorLog}, {level, error}, {date, LogRotateDate},
                          {count, LogRotateCount}, {size, LogRotateSize}]},
    {lager_file_backend, [{file, InfoLog}, {level, info}, {date, LogRotateDate},
                          {count, LogRotateCount}, {size, LogRotateSize}]}
  ]),
  application:set_env(lager, crash_log, CrashLog),
  application:set_env(lager, crash_log_date, LogRotateDate),
  application:set_env(lager, crash_log_size, LogRotateSize),
  application:set_env(lager, crash_log_count, LogRotateCount),
  application:set_env(lager, error_logger_hwm, LogMaxCountPerSec),
  lager:start().

start_mnesia_db() ->
  mnesia:create_schema([node()]),
  mnesia:start().

stop_mnesia_db() ->
  mnesia:stop().

start_monitor() ->
  os:cmd("cd monitor; ./stop_svrmon.sh; ./start_svrmon.sh").

stop_monitor() ->
  os:cmd("cd monitor; ./stop_svrmon.sh").
