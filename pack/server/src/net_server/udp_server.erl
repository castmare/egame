-module(udp_server).
-behaviour(gen_server).

-export([start_link/3, start_link/4]).

-export([init/1
      , handle_call/3
      , handle_cast/2
      , handle_info/2
      , terminate/2
      , code_change/3]).

-record(state, {port, cb, worker}).

-define(DEF_BUFFER_LEN, 1024000).       % 默认缓冲区长度

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

start_link(Name, Port, CB) ->
  start_link(Name, Port, CB, ?DEF_BUFFER_LEN).
start_link(Name, Port, CB, BufLen) ->
  gen_server:start_link({local, Name}, ?MODULE, [Port, CB, BufLen], []).

init([Port, CB, BufLen]) ->
  log4erl:info("~p initializing port ~p ~n", [?MODULE, Port]),
  process_flag(trap_exit, true),
  Pid = proc_lib:spawn_link(fun() -> init_one(Port, CB, BufLen) end),
  {ok, #state{port = Port, cb = CB, worker = Pid}}.

handle_cast(_Msg, State) -> {noreply, State}.
handle_call(_Request, _From, State) -> {reply, ok, State}.
terminate(_Reason, _State) -> log4erl:info("~p stopping ~n", [?MODULE]), ok.
handle_info(_Info, State) -> {noreply, State}.
code_change(_OldVsn, State, _Extra) -> {ok, State}.

init_one(Port, CB, BufLen) ->
  {ok, Socket} = gen_udp:open(Port, [binary
      , {recbuf, BufLen}, {sndbuf, BufLen}, {buffer, BufLen}]),
  io:format("start udp server port ~p~n", [Port]),
  loop(Socket, CB).

loop(Socket, {M,F}) ->
  receive
    {udp, Socket, Host, Port, Bin} ->
      proc_lib:spawn(M, F, [Socket, Host, Port, Bin]),
      loop(Socket, {M,F})
  end.
