%% mysql的缓写机制
-module(slow_db).
-author('Ollir Zhang<ollir.h@gmail.com>').
-behavior(gen_server).

-include("../record.hrl").
-include("../settings.hrl").

-export([start_link/5,
         insert/2,
         update/2,
         flush_once/2]).

-export([init/1,
         handle_call/3,
         handle_cast/2,
         handle_info/2,
         terminate/2,
         code_change/3]).

-record(slow_record, {name,           % ETS表名字
                      queue,          % 待写队列
                      back_end_procs, % 后台写入进程列表
                      prepare_func,   % MySQL prepare
                      insert_func,    % 写数据
                      update_func}).  % 更新数据


%% 启动缓写
start_link(Props, Name, PrepareFunc, InsertFunc, UpdateFunc) ->
  State = #slow_record{name = Name,
                       queue = queue:new(),
                       back_end_procs = [],
                       prepare_func = PrepareFunc,
                       insert_func = InsertFunc,
                       update_func = UpdateFunc},
  gen_server:start_link({local, Name}, ?MODULE, [State, Props], []).


init([State = #slow_record{name = Name, prepare_func = {M, F}}, Props]) ->
  log4erl:info("~p initializing ~n", [Name]),
  process_flag(trap_exit, true),
  M:F(),                                      % 执行准备函数
  erlang:garbage_collect(self()),             % 来次GC
  ets:new(Name, [set, named_table, public]),
  Write_interval = proplists:get_value(write_interval, Props),
  Write_per_time = proplists:get_value(write_per_time, Props),
  erlang:send_after(Write_interval, self(), {loop_interval_flushdb, Write_interval, Write_per_time}), % 写DB心跳
  {ok, State}.

handle_call({insert, Content}, _From, State = #slow_record{queue = Queue}) ->
  ets:insert(State#slow_record.name, {Content}),
  NewQueue = queue:in({Content, new}, Queue),
  {reply, ok, State#slow_record{queue = NewQueue}};
handle_call({update, Content}, _From, State = #slow_record{name = Name, queue = Queue}) ->
  NewQueue = case ets:lookup(Name, Content) of
    [] ->                                     
      ets:insert(Name, {Content}),
      queue:in(Content, Queue);
    [_] -> Queue      % 已在写队列中
  end,
  {reply, ok, State#slow_record{queue = NewQueue}}.

handle_cast(_Msg, State = #slow_record{name = Name}) ->
  log4erl:info("~p unknow handle_cast ~p~n", [Name, _Msg]),
  {noreply, State}.

% 存DB操作，由心跳触发
handle_info(Msg = {loop_interval_flushdb, Write_interval, Write_per_time}, State = #slow_record{queue = Queue, back_end_procs = BEPS}) ->
  erlang:send_after(Write_interval, self(), Msg), % 写DB心跳
  BEPS2 = filter_dead_procs(BEPS),
  case length(BEPS2) >= ?SLOW_DB_PROC_MAX of
    true -> {noreply, State#slow_record{back_end_procs = BEPS2}};
    false ->
      {Content, NewQueue} = tools:get_n(Queue, Write_per_time, []),
      ets_delete(State#slow_record.name, Content),
      Pid = proc_lib:spawn(?MODULE, flush_once, [Content, State]),
      {noreply, State#slow_record{queue = NewQueue, back_end_procs = [Pid|BEPS2]}}
  end;
handle_info(_Info, State = #slow_record{name = Name}) -> 
  log4erl:info("~p unknow handle_info ~p~n", [Name, _Info]),
  {noreply, State}.

terminate(_Reason, State = #slow_record{name = Name, queue = Queue}) ->
  log4erl:info("~p stopping ~n", [Name]),
  Qlen = queue:len(Queue),
  log4erl:info("~p flush ~p ~n", [Name, Qlen]),
  {Content, _NewQueue} = tools:get_n(Queue, Qlen, []),
  ets_delete(State#slow_record.name, Content),
  flush_once(Content, State),
  ok.

code_change(_OldVsn, State, _Extra) -> {ok, State}.

% -----------------------------------------------------------------------


insert(Name, Content) ->
  gen_server:call(Name, {insert, Content}).

update(Name, Content) ->
  gen_server:call(Name, {update, Content}).

% -----------------------------------------------------------------------

% 顺序执行DB操作
flush_once([], _) -> ok;
flush_once([{C, new} | Rest], State = #slow_record{name = Name, insert_func = {M, F}}) ->
  case M:F(C) of
    error -> insert(Name, C);  % 如果写DB出错了，继续进slow_db的写队列
    _ -> ok
  end,
  flush_once(Rest, State);
flush_once([C | Rest], State = #slow_record{name = Name, update_func = {M, F}}) ->
  case M:F(C) of
    error -> update(Name, C);         % 如果写DB出错了，继续进slow_db的写队列
    _ -> ok
  end,
  flush_once(Rest, State).

  
% 删除脏写数据的ETS表
ets_delete(_Table, []) -> ok;
ets_delete(Table, [{C, new} | Rest]) -> ets_delete(Table, [C|Rest]);
ets_delete(Table, [C | Rest]) ->
  ets:delete(Table, C),
  ets_delete(Table, Rest).

% 删除已经结束的进程
filter_dead_procs(Procs) ->
  lists:filter(fun(X) -> erlang:process_info(X, status) =/= undefined end, Procs).