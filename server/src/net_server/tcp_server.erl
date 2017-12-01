-module(tcp_server).
-author('Ollir Zhang<ollir.h@gmail.com>').
-behavior(gen_server).

-include("../settings.hrl").

-define(TCP_DEFAULT_OPTIONS, [
    binary,           % 传输的是二进制
    {packet, 2},      % 包头有2个byte用于传输包大小
    {active, once},   % 半阻塞
    {reuseaddr, true}, % ...
    {backlog, 2048}
    ]).

-record(server_state, {
    ip = any,       % ip
    port,           % listen port
    listen,         % listen socket
    conn = 0,       % current connection
    maxconn,        % max connection
    loop_func,      % 主循环体，进行服务的函数
    reg_func,       % 注册函数，在gen_server启动的时候执行，{Module, Func}
    close_func      % 退出函数，连接断开时执行的回调
    }).

-export([
    init/1,
    code_change/3,
    handle_call/3,
    handle_cast/2,
    handle_info/2,
    terminate/2
    ]).

-export([start_link/4, start_link/5]).

-export([accepter/2]).

%% 启动socket服务器，注册服务
start_link(Name, Port, Max, [LoopFunc]) ->
  start_link(Name, Port, Max, [LoopFunc, undefined, undefined]);
start_link(Name, Port, Max, [LoopFunc, CloseFunc]) ->
  start_link(Name, Port, Max, [LoopFunc, CloseFunc, undefined]);
start_link(Name, Port, Max, [LoopFunc, CloseFunc, RegFunc]) ->
  start_link(Name, Port, Max, [LoopFunc, CloseFunc, RegFunc], ?TCP_DEFAULT_OPTIONS).

start_link(Name, Port, Max, [LoopFunc], TcpOptions) ->
  start_link(Name, Port, Max, [LoopFunc, undefined, undefined], TcpOptions);
start_link(Name, Port, Max, [LoopFunc, CloseFunc], TcpOptions) ->
  start_link(Name, Port, Max, [LoopFunc, CloseFunc, undefined], TcpOptions);
start_link(Name, Port, Max, [LoopFunc, CloseFunc, RegFunc], TcpOptions) ->
  State = #server_state{port = Port,
                        maxconn = Max,
                        loop_func = LoopFunc,
                        reg_func = RegFunc,
                        close_func = CloseFunc},
  gen_server:start_link({local, Name}, ?MODULE, {State, TcpOptions}, []).

init({State = #server_state{port=Port, reg_func = RegFunc}, TcpOptions}) ->
  log4erl:info("~p initializing port ~p ~n", [?MODULE, Port]),
  process_flag(trap_exit, true),
  reg_func(RegFunc), % 执行注册函数
  case gen_tcp:listen(Port, TcpOptions) of
    {ok, ListenSock} ->
      NewState = State#server_state{listen = ListenSock},
      start_accepters(?ACCEPT_NUM, NewState),
      %{ok, Port} = inet:port(ListenSock),
      {ok, NewState};
    {error, Why} ->
      log4erl:error("Error: socket_listen_error[~p]~n", [Why]),
      {stop, Why}
  end.

handle_cast(accept_new, State) ->
  proc_lib:spawn(?MODULE, accepter, [self(), State]),
  {noreply, State}.

terminate(_Reason, _Library) ->
  log4erl:error("~p stopping ~n", [?MODULE]),
  ok.

% These are just here to suppress warnings.
handle_call(_Msg, _Caller, State) -> {noreply, State}.
handle_info(_Msg, Library) -> {noreply, Library}.
code_change(_OldVersion, Library, _Extra) -> {ok, Library}.

% 注册函数执行
reg_func(undefined) -> ok;
reg_func({M, F}) -> M:F().

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
start_accepters(0, _) ->
  io:format("accpeters start ok~n");
start_accepters(Num, NewState) ->
  proc_lib:spawn(?MODULE, accepter, [self(), NewState]),
  start_accepters(Num-1, NewState).

accepter(GenServer, #server_state{listen=ListenSock, loop_func = {M, F}, close_func = CF}) ->
  log4erl:info("~p start accept ~p~n", [{M, F}, self()]),
  case gen_tcp:accept(ListenSock) of
    {ok, Socket} ->
      io:format("accept succ ~p~n", [Socket]),
      gen_server:cast(GenServer, accept_new),
      case CF of
        undefined -> M:F(Socket);
        _ -> M:F(Socket, CF)
      end;
    _Other ->
      gen_server:cast(GenServer, accept_new),
      io:format("accept returned ~w - goodbye!~n",[_Other])
  end.

