%%% 网络服务监控者
-module(net_server_sup).
-author('ltb').

-behaviour(supervisor).

%% API
-export([start_link/0]).

%% Supervisor callbacks
-export([init/1]).

-define(DEFAULLT_MAX_CON, 50000).
-define(TCP_COMMON_OPT, [binary, {active, once}, {reuseaddr, true}, {backlog, 2048}]).
-define(WEB_SOCKET_OPT, [{packet, 0} | ?TCP_COMMON_OPT]).
-define(DEFAULT_TCP_OPT, [{packet, 2} | ?TCP_COMMON_OPT]).
-define(COMMON_OPTION1, [{packet, 4} | ?TCP_COMMON_OPT]).
-define(COMMON_OPTION2, [{packet, 0}, {nodelay, true} | ?TCP_COMMON_OPT]).
-define(DEFAULT_UDP_BUF, 1024000).

-define(SETTING_LIST, [
  %% 第一个参数为类型
  %% tcp ModuleName 最大连接数(可省略，默认为50000) 传入的函数([]时为ModuleName:loop)|list tcp参数 
  %% udp ModuleName 传入函数([]时为ModuleName:loop)|tuple udp_buffer_len
  %% 进程名字为ModuleName_socket
  %% 端口环境变量为ModuleName_port
  {tcp, main, [{logic_server, loop}], ?TCP_COMMON_OPT},
  {tcp, ws_main, [{ws_server, ws_entry}], ?WEB_SOCKET_OPT},
  {tcp, rtnotify, [{rtnotify_socket, ws_entry}], ?COMMON_OPTION2}
]).

%% ===================================================================
%% API
%% ===================================================================
start_link() ->
  supervisor:start_link({local, ?MODULE}, ?MODULE, []).

%% ===================================================================
%% Supervisor callbacks
%% ===================================================================
init(_) ->
  Children = [map_fun(X) || X <- ?SETTING_LIST],
  {ok, {{one_for_one, 30, 10}, Children}}.

%% ===================================================================
%% Support functions
%% ===================================================================
map_fun({Type, ModuleName, MF, Option}) ->
  map_fun({Type, ModuleName, ?DEFAULLT_MAX_CON, MF, Option});
map_fun({Type, ModuleName, MaxCon, MF, Option}) ->
  {Name, Port, NewMF} = get_base_params(ModuleName, Type, MF),
  {ServerName, NewOption} = 
    case Type of
      tcp ->
        {tcp_server, [Name, Port, MaxCon, NewMF, Option]};
      udp ->
        {udp_server, [Name, Port, NewMF, Option]}
    end,
  {Name,
    {ServerName, start_link, NewOption},
    permanent, 2000, worker, [ServerName]
  }.

get_base_params(ModuleName, Type, MF) ->
  Name = list_to_atom(lists:concat([ModuleName, "_socket"])),
  PortName = list_to_atom(lists:concat([ModuleName, "_port"])),
  {PortName, {ok, Port}} = {PortName, application:get_env(PortName)},
  NewMF = get_exe_function(ModuleName, Type, MF),
  {Name, Port, NewMF}.

get_exe_function(ModuleName, tcp, []) -> [{ModuleName, loop}];
get_exe_function(ModuleName, udp, []) -> {ModuleName, loop};
get_exe_function(_ModuleName, _Type, MF) -> MF.