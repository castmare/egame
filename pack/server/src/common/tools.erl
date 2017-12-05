-module(tools).
-author('Ollir Zhang<ollir.h@gmail.com>').
%% basic
-export([
  ceiling/1,
  floor/1,
  unique_id/0,
  positive/1,
  reset_error_handler/0,
  filter_msg/1,
  filter_msg2/1,
  get_stacktrace/0,
  pred_judge/2,
  make_pair/2,
  convert_area/1,
  between/3,
  trans2local_record/2
]).

%% file
-export([
  dump_data/1,
  load_data/0,
  dump_data_to/2,
  load_data_from/1,
  file_traversal/3,
  mysql_log/4,
  dump_process_infos/0,
  dump_data_list/1,
  dump_data_ets/1,
  dump_data_ets_to/2,
  dump_one_ets_data/2
]).

% time
-export([
  timenow/0,
  time/0,
  timenow_millisec/0,
  timestamp_to_datetime/1,
  timestamp_to_string/1,
  string_to_datetime/1,
  string_to_seconds/1,
  the_same_day/1,
  the_same_day/2,
  the_same_day_zero/1,
  the_same_month/1,
  get_diff_days/2,
  get_diff_days_real/2,
  the_same_week/2,
  is_less/2,
  today/0,
  today/1,
  calc_datetime/1,
  local_time2seconds/1,
  local_today_seconds/0,
  yesterday_week_day/1,
  my_week_day/0,
  week_day/0,
  nth_days_after/1,
  nth_days_after/2,
  nth_days_before/1,
  nth_days_before/2,
  get_time_string/1,
  span_point/2,
  is_point/1,
  in_period/2,
  make_today_timestamp/4
]).

% cfg
-export([
  getsvrname/0,
  getsvrip/0,
  getsvrid/0]).

%% container
-export([
  shuffle/1,
  shuffle_with_seed/2,
  get_n/3,
  random_divide_num/2,
  random_with_weight/1,
  check_list_intersect/2,
  get_n_random/2,
  foreach_ets/3,
  binsearch/3,
  binsearch/5,
  lists_check_duplicate/1,
  lists_merge/1,
  insert_unique/2,
  split_list/3,
  join/2,
  get_n_from_list/2,
  record_name/1,
  index_of/2,
  ets_foldl/3,
  dets_foldl/3
]).

% string
-export([
  md5str/1,
  trim/1,
  eval/1,
  name_to_dbstr/1,
  dbstr_to_name/1,
  get_utf8/1,
  get_unicode/1,
  bin_to_hexstr/1,
  hexstr_to_bin/1,
  string_to_term/1,
  term_to_string/1,
  check_mobile_number/1,
  term2binary/3,
  term2binary_compress/3,
  term2binary_compress_mb/3,
  format/2
]).

%% net
-export([
  socket_ip_str/1,
  socket_self_ip_str/1,
  ip_in_range/2,
  get_ipv4_int/1
]).

%% http
-export([
  getJSON/1,
  decode_json/1,
  getArgs/2,
  requestPOST/2,
  term_to_url_data/1,
  get_url/2,
  post_url/2,
  make_sign/2
]).

%% router，合服后路由信息发生变化
-export([
  get_real_svrid/1,
  get_real_guild_svrid/2,
  get_real_userid_svrid/2,
  get_merged_svr_list/0,
  get_merged_svr_list/1
]).

-export([
  rpc_call/4,
  rpc_call/5,
  rpc_cast/4
]).

%% other
-export([injection/5, update_protobuff/1, safe_apply/3]).

%% debug
-export([print_stacktrace/0]).

-export([bool2int/1]).
%% global key

-export([uid2key/1]).

%% ets
-export([new_ets/1, new_ets/2]).

-export([do_multi_task/2, do_multi_task/3, do_multi_task_proc/1]).

-define(MAX_BIN_LEN, 65535).
-define(MAX_MEDIUM_BIN_LEN, (16 * 1024 * 1024) - 1).
%% ------------------------------------------------------------------
%% Basic Function Exports
%% ------------------------------------------------------------------
ceiling(X) when X < 0 -> trunc(X);
ceiling(X) ->
  T = trunc(X),
  case X - T == 0 of
    true -> T;
    false -> T + 1
  end.

%%  取整 小于X的最大整数
floor(X) ->
  T = trunc(X),
  if
    X - T == 0 -> T;
    true ->
      if
        X > 0 -> T;
        true -> T - 1
      end
  end.

%% 非负数
positive(Value) ->
  erlang:max(Value, 0).

% 生成一个64位的唯一ID
unique_id() ->
  {A, B, C} = erlang:timestamp(),
  A * 1000000 * 1000000 + B * 1000000 + C.

reset_error_handler() ->
  L = gen_event:which_handlers(error_logger),
  Handler = case lists:member(rb_log_mf_h, L) of
    true -> rb_log_mf_h;
    false -> log_mf_h
  end,
  gen_event:delete_handler(error_logger, Handler, []),
  H = Handler:init("logs", 1073741824, 10, fun sasl:pred/1),
  error_logger:add_report_handler(Handler,H).

filter_msg(Msg) ->
  [_MsgType | CMDS] = tuple_to_list(Msg),
  [MsgData] = lists:filter(fun(X) -> X =/= undefined end, CMDS),
  MsgData.

filter_msg2(Msg) ->
  [MsgType | CMDS] = tuple_to_list(Msg),
  [MsgData] = lists:filter(fun(X) -> X =/= undefined end, CMDS),
  {MsgType, MsgData}.

get_stacktrace() ->
  try must_be_undefined:call() of
    _ -> ok
  catch _:_ -> erlang:get_stacktrace()
  end.

% 执行判断函数
pred_judge(Res, []) ->
    Res;
pred_judge({true, SomeThing}, [F | Last]) ->
   Res = F(SomeThing),
   pred_judge(Res, Last);
pred_judge({false, SomeThing}, _) ->
   {false, SomeThing};
pred_judge(SomeThing, Ops) ->
   pred_judge({true, SomeThing}, Ops).

%% 构造{key, value}
make_pair([], Res) -> Res;
make_pair([K, V | L], Res) ->
  make_pair(L, [{K, V}, Res]).

%% ------------------------------------------------------------------
%% File Function Exports
%% ------------------------------------------------------------------
dump_data(Term) ->
  S = term_to_string(Term),
  file:write_file(dump_data, S).

dump_data_list(List) ->
  dump_data_list_to(List, dump_data).

dump_data_ets(Ets) ->
  dump_data_ets_to(Ets, dump_data).

dump_data_list_to(List, FileName) ->
  case file:open(FileName, [write]) of
    {ok, File} ->
      if
        is_list(List) ->
          Size = length(List),
          file:write(File, "["),
          lists:foldl(fun(D, {Idx, DumpData}) ->
            DumpData1 = case Idx == 1 of
              true -> tools:term_to_string(D);
              false -> DumpData ++ io_lib:format(",\n", []) ++ tools:term_to_string(D)
            end,
            case length(DumpData1) > 1024 of
              true ->
                file:write(File, DumpData1),
                {Idx+1, ""};
              false ->
                case Idx == Size of
                  true -> file:write(File, DumpData1);
                  false -> ok
                end,
                {Idx+1, DumpData1}
            end
          end, {1, ""}, List),
          file:write(File, "]");
        true -> file:write(File, tools:term_to_string(List))
      end,
      file:close(File);
    _ -> log4erl:error("dump data failed.")
  end.

dump_data_ets_to(Ets, FileName) ->
  case ets:info(Ets) of
    undefined -> ets_not_exist;
    _ ->
      case file:open(FileName, [write]) of
        {ok, File} ->
          file:write(File, "["),
          foreach_ets(Ets, {?MODULE, dump_one_ets_data},[Ets, File]),
          file:write(File, "]"),
          file:close(File);
        _ -> log4erl:error("dump data failed.")
      end
  end.

dump_one_ets_data(Id, [Ets, File]) ->
  case ets:lookup(Ets, Id) of
    [] -> ok;
    [Data] ->
      case ets:first(Ets) == Id of
        true -> file:write(File, tools:term_to_string(Data));
        false -> file:write(File, io_lib:format(",\n", []) ++ tools:term_to_string(Data))
      end
  end.

dump_data_to(Term, FileName) ->
  S = term_to_string(Term),
  file:write_file(FileName, S).

load_data() ->
  {ok, S} = file:read_file(dump_data),
  string_to_term(binary_to_list(S)).

load_data_from(FileName) ->
  {ok, S} = file:read_file(FileName),
  string_to_term(binary_to_list(S)).
file_traversal(FileName, Spliter, Fun) ->
  case file:open(FileName, [read]) of
    {ok, FD} ->
      file_traversal2(FD, FileName, Spliter, Fun),
      file:close(FD);
    {error, Err} ->
      log4erl:error("open file ~p fail, err: ~p~n", [FileName, Err])
  end.

file_traversal2(FD, FileName, Spliter, Fun) ->
  case file:read_line(FD) of
    eof -> ok;
    {error, Reason} ->
      log4erl:error("traversal ~p fail, err ~p~n", [FileName, Reason]),
      fail;
    {ok, Line} ->
      case string:tokens(Line, Spliter) of
        [] -> ok;
        Params -> Fun(Params)
      end,
      file_traversal2(FD, FileName, Spliter, Fun)
  end.

%% mysql 的log函数
mysql_log(Module, Line, error, FormatFun) ->
  {Format, Arguments} = FormatFun(),
  log4erl:error("~w:~b: "++ Format ++ "~n", [Module, Line] ++ Arguments);
mysql_log(_Module, _Line, _, _FormatFun) -> ok.    % 忽略其他level的mysql日志

dump_process_infos() ->
  filelib:ensure_dir("./logs/"),
  File = "./logs/processes_infos.log",
  {ok, Fd} = file:open(File, [write, raw, binary, append]),
  Fun = fun(Pi) ->
    Info = io_lib:format("=>~p \n\n",[Pi]),
    case filelib:is_file(File) of
      true -> file:write(Fd, Info);
      false ->
        file:close(Fd),
        {ok, NewFd} = file:open(File, [write, raw, binary, append]),
        file:write(NewFd, Info)
    end
    %timer:sleep(20)
  end,
  [Fun({P, erlang:process_info(P)}) || P <- erlang:processes()],
  file:close(Fd).

%% ------------------------------------------------------------------
%% Time Function Exports
%% ------------------------------------------------------------------
% 时间戳
-ifdef(TEST).
timenow() ->
  {A, B, _} = os:timestamp(),
  A * 1000 * 1000 + B + toolkit:get_time_compensation().
-else.
timenow() ->
  {A, B, _} = os:timestamp(),
  A * 1000 * 1000 + B.
-endif.

% 当前时间{h,min,s}
-ifdef(TEST).
time() ->
  {_ , Time} = timestamp_to_datetime(tools:timenow()),
  Time.
-else.
time() ->
  erlang:time().
-endif.

timenow_millisec() ->
  {MegaSecs, Secs, MicroSecs} = os:timestamp(),
  1000000000 * MegaSecs + Secs * 1000 + MicroSecs div 1000.

% 时间戳转本地时间
timestamp_to_datetime(TimeStamp) ->
  MegaS = TimeStamp div (1000*1000),
  S = TimeStamp rem (1000*1000),
  calendar:now_to_local_time({MegaS, S, 0}).

timestamp_to_string(TimeStamp) ->
  {{Y, M, D}, {H, MM, S}} = timestamp_to_datetime(TimeStamp),
  lists:concat([Y, '-', M, '-', D, ' ', H, ':', MM, ':', S]).

string_to_datetime([]) -> 0;
string_to_datetime(DateTimeStr) ->
  [Y, M, D, H, Min, S] = string:tokens(DateTimeStr, ": /-"),
  F = fun list_to_integer/1,
  local_time2seconds({{F(Y), F(M), F(D)}, {F(H), F(Min), F(S)}}).

string_to_seconds([]) ->0;
string_to_seconds(TimeStr) ->
[H, M, S] = string:tokens(TimeStr, ": /"),
F = fun list_to_integer/1,
F(H)*3600 + F(M)*60 + F(S).

% 检查日期是否是同一个月
the_same_month(0) -> false;
the_same_month(TimeStamp) ->
  TimeStamp_Offset = TimeStamp - 3600 * 5,
  Timenow_Offset = timenow() - 3600 * 5,
  {{Y1, M1, _}, _} = timestamp_to_datetime(TimeStamp_Offset),
  {{Y2, M2, _}, _} = timestamp_to_datetime(Timenow_Offset),
  {Y1, M1} == {Y2, M2}.

% 检查日期是否是同一天
the_same_day_zero(0) -> false;
the_same_day_zero(TimeStamp) ->
  TimeZone = single_cfg:get_time_zone(),
  Period1 = (TimeStamp + TimeZone*3600) div 86400,
  Period2 = (timenow() + TimeZone*3600) div 86400,
  Period1 == Period2.

% 检查日期是否是同一天
the_same_day(TimeStamp) ->
  the_same_day(TimeStamp, tools:timenow()).
the_same_day(T1, T2) when (T1 =:= 0) or (T2 =:= 0) -> false;
the_same_day(T1, T2) ->
  TimeZone = single_cfg:get_time_zone(),
  Period1 = (T1 - 5*3600 + TimeZone*3600) div 86400,
  Period2 = (T2 - 5*3600 + TimeZone*3600) div 86400,
  Period1 == Period2.

%% 从检查日期是否同一周
%% 注意!!! 每个新周从周日凌晨5点开始;
the_same_week(0, _Type) -> false; % 目前支持Type类型 sunday; monday
the_same_week(TimeStamp, Type) ->
  TimeStampOffset = get_offset(TimeStamp, Type),
  TimenowOffset   = get_offset(tools:timenow(), Type),
  {{Y1, M1, D1}, _} = timestamp_to_datetime(TimeStampOffset),
  {{Y2, M2, D2}, _} = timestamp_to_datetime(TimenowOffset),
  Week1 = calendar:iso_week_number({Y1, M1, D1}),
  Week2 = calendar:iso_week_number({Y2, M2, D2}),
  Week1 == Week2.  

get_offset(TimeStamp, sunday) ->
  TimeStamp - 3600 * 5 + 3600 * 24;
get_offset(TimeStamp, monday) ->
  TimeStamp - 3600 * 5.  

calc_datetime(Time) ->
  calendar:now_to_local_time({Time div (1000*1000), Time rem (1000*1000), 0}).

%% 今天已经过去的秒数
local_today_seconds() ->
  {_, {H, M, S}} = calendar:local_time(),
  H * 60 * 60 + M * 60 + S.

% {Year, Month, Day}
yesterday_week_day({Y, M, D}) ->
  Week = calendar:day_of_the_week({Y, M, D}),
  yesterday_week_day(Week);
yesterday_week_day(7) -> 6;
yesterday_week_day(6) -> 5;
yesterday_week_day(5) -> 4;
yesterday_week_day(4) -> 3;
yesterday_week_day(3) -> 2;
yesterday_week_day(2) -> 1;
yesterday_week_day(1) -> 7.

% 获得weekday，每天从5点开始
-ifdef(TEST).
my_week_day() ->
  case tools:timestamp_to_datetime(timenow()) of
    {LocalTime, {H, _, _}} when H < 5 ->     % 当天5点前，按照昨天计算
      tools:yesterday_week_day(LocalTime);
    {LocalTime, _} ->
      calendar:day_of_the_week(LocalTime)
  end.
-else.
my_week_day() ->
  case calendar:local_time() of
    {LocalTime, {H, _, _}} when H < 5 ->     % 当天5点前，按照昨天计算
      tools:yesterday_week_day(LocalTime);
    {LocalTime, _} ->
      calendar:day_of_the_week(LocalTime)
  end.
-endif.

% 获得weekday，每天从0点开始
-ifdef(TEST).
week_day() ->
  {LocalTime, _} = tools:timestamp_to_datetime(timenow()),
  calendar:day_of_the_week(LocalTime).
-else.
week_day() ->
  {LocalTime, _} = calendar:local_time(),
  calendar:day_of_the_week(LocalTime).
-endif.

%% 获取n天前的时间戳
nth_days_before(Days) when Days > 0 ->
  nth_days_before(tools:timenow(), Days).

nth_days_before(Seconds, Days) when Days > 0 ->
  Seconds - Days * 24 * 60 * 60.

nth_days_after(Days) when Days > 0 ->
  nth_days_after(tools:timenow(), Days).

% 检查时间跨度是否超过第二天5点，如果超过，按照第二天五点算
nth_days_after(Seconds, Days) when Days > 0 ->
  {_, {H, M, S}} = calc_datetime(Seconds),
  T1 = if
    (H * 3600 + M * 60 + S) < (5 * 3600 - 1) ->
      Seconds + (Days - 1) * 24 * 60 * 60;
    true -> Seconds + Days * 24 * 60 * 60
  end,
  {DayTime, _} = calc_datetime(T1),
  local_time2seconds({DayTime, {4, 59, 59}}).

%% 将本地时间转为时间戳
local_time2seconds(DayTime) ->
  [Time] = calendar:local_time_to_universal_time_dst(DayTime),
  calendar:datetime_to_gregorian_seconds(Time) - 62167219200.

% 获取今天的年月日，5点为界
today() ->
  {Today, _} = timestamp_to_datetime(timenow() - 3600 * 5),
  Today.

% 获取n天之后(Days<0就是之前)的年月日，5点为界
today(Days) ->
  {Today, _} = timestamp_to_datetime(timenow() + Days*24*60*60 - 3600 * 5),
  Today.

% 判断两个时间的大小
is_less({H1,M1,S1}, {H2,M2,S2}) ->
  T1 = H1*3600 + M1*60 + S1,
  T2 = H2*3600 + M2*60 + S2,
  T1 < T2.

%% 判断时间是否为整点
is_point(Timestamp) ->
  case Timestamp rem 3600 of
    0 -> true;
    _ -> false
  end.
%% 判断时间段是否跨越整点
span_point(Start, End) when is_integer(Start), is_integer(End) ->
  StartClock = trunc(Start / 3600),
  EndClock   = trunc(End / 3600),
  StartClock =/= EndClock.

get_diff_days(Seconds1, Seconds2) ->
  get_diff_days_real(Seconds1 - 3600 * 5, Seconds2 - 3600 * 5).

get_diff_days_real(Seconds1, Seconds2) ->
  {{Year1, Month1, Day1}, _} = timestamp_to_datetime(Seconds1),
  {{Year2, Month2, Day2}, _} = timestamp_to_datetime(Seconds2),
  Days1 = calendar:date_to_gregorian_days(Year1, Month1, Day1),
  Days2 = calendar:date_to_gregorian_days(Year2, Month2, Day2),
  abs(Days2-Days1).

% 判断时间点是否在时间范围内
% 1. 先格式化时间戳
% 2. 做时间比较
in_period([{A,B}|Rest], Timestamp) when not is_integer(A) ->
  A1 = local_time2seconds(A),
  B1 = local_time2seconds(B),
  in_period([{A1,B1}|Rest], Timestamp);
in_period([], _Timestamp) -> false;
in_period([{A,B}|Rest], Timestamp) ->
  case A =< Timestamp andalso B >= Timestamp of
    true -> true;
    false -> in_period(Rest, Timestamp)
  end.

make_today_timestamp(TN, Hour, Minute, Second) ->
  {{Year, Month, Day}, _} = timestamp_to_datetime(TN),
  local_time2seconds({{Year, Month, Day}, {Hour, Minute, Second}}).

% returns date/time string
get_time_string(Datetime) ->
  {datetime, {{Y, M, D}, {H, Mi, S}}} = Datetime,
  L = lists:map(fun(X) ->
            X2=integer_to_list(X),
          return_2columns(X2) end,
        [Y, M, D, H, Mi, S]),
  [Y2, M2, D2, H2, Mi2, S2] = L,
  Y2 ++ "/" ++ M2 ++ "/" ++ D2 ++ " " ++ H2 ++ ":" ++ Mi2 ++ ":" ++ S2.

% a function to format date/time properly (e.g. 09 instead of 9)
return_2columns(X) ->
  case length(X) of
    1 ->
      "0" ++ X;
    _ ->
      X
  end.

%% ------------------------------------------------------------------
%% env variables
%% ------------------------------------------------------------------

getsvrid() ->
  case application:get_env(dgame, svr_id) of
    {ok, SvrID} -> SvrID;
    undefined -> 0
  end.

getsvrip() ->
  case application:get_env(dgame, svr_ip) of
    {ok, SvrIP} -> SvrIP;
    undefined -> "127.0.0.1"
  end.

getsvrname() ->
  case application:get_env(dgame, svr_name) of
    {ok, SvrName} -> get_unicode(SvrName);
    undefined -> "火星"
  end.


%% ------------------------------------------------------------------
%% Container&alg Function Exports
%% ------------------------------------------------------------------
% 列表乱序
shuffle(List) -> shuffle(List, []).
shuffle([], Acc) -> Acc;
shuffle(List, Acc) ->
  {Leading, [H | T]} = lists:split(random_num_factory:next(length(List)) - 1, List),
  shuffle(Leading ++ T, [H | Acc]).

shuffle_with_seed(List, Seed) -> shuffle_with_seed(List, [], Seed).
shuffle_with_seed([], Acc, _Seed) -> Acc;
shuffle_with_seed(List, Acc, Seed) ->
  {R, S} = rand:uniform_s(length(List), Seed),
  {Leading, [H | T]} = lists:split( R- 1, List),
  shuffle_with_seed(Leading ++ T, [H | Acc], S).

%% 检查两个集合是否有交集
check_list_intersect([], _ListB) -> false;
check_list_intersect([A | ALeft], ListB) ->
  case lists:member(A, ListB) of
    true -> true;
    false -> check_list_intersect(ALeft, ListB)
  end.

% 获取队首N个元素
get_n(Queue, 0, Done) ->  {lists:reverse(Done), Queue};
get_n(Queue, N, Done) ->
  case queue:out(Queue) of
    {{value, X}, NewQueue} -> get_n(NewQueue, N - 1, [X | Done]);
    {empty, NewQueue} -> {lists:reverse(Done), NewQueue}
  end.

random_divide_num(Amount, N) ->
  SeedTable = [random_num_factory:next()|| _X <- lists:seq(1, N)],
  Sum = lists:sum(SeedTable),
  [Amount * Seed / Sum || Seed <- SeedTable].

% [ {Weihgt, Data} ]
random_with_weight(List) ->
  WeihgtList = [Weihgt || {Weihgt, _} <- List],
  Sum = lists:sum(WeihgtList),
  Rand = random_num_factory:next() * Sum,
  random_with_weight(List, Rand).
random_with_weight([{Weihgt, Data} | List], Rand) ->
  case Rand =< Weihgt of
    true -> Data;
    false -> random_with_weight(List, Rand - Weihgt)
  end.

%  从1到N中随机获取M个不重复的数
get_n_random(N, M) when N =:= M ->
  lists:seq(1, N);
get_n_random(N, M) ->
  X = N - M + 1,
  L = get_n_random2(X, M, []),
  lists:sort(L).

get_n_random2(_X, 0, List) ->
  List;
get_n_random2(X, M, List) ->
  R = random_num_factory:next(X),
  NewList = case lists:member(R, List) of
    true -> [X|List];
    false -> [R|List]
  end,
  get_n_random2(X + 1, M - 1, NewList).

get_n_from_list(List, N) ->
  Len   = erlang:length(List),
  N2    = erlang:min(N, Len),
  IList = get_n_random(Len, N2),
  [lists:nth(I, List) || I <- IList].

% ets表遍历
foreach_ets(ETS, Func, Params) ->
  case ets:first(ETS) of
    '$end_of_table' -> 0;
    Key ->
      ets:safe_fixtable(ETS, true),
      case Func of
        {M, F} -> M:F(Key, Params);
        Fun -> Fun(Key, Params)
      end,
      Num = foreach_ets(ETS, Func, Params, Key, 1),
      ets:safe_fixtable(ETS, false),
      Num
  end.

foreach_ets(ETS, Func, Params, Key, Num) ->
  case ets:next(ETS, Key) of
    '$end_of_table' -> Num;
    NewKey ->
      case Func of
        {M, F} -> M:F(NewKey, Params);
        Fun -> Fun(NewKey, Params)
      end,
      foreach_ets(ETS, Func, Params, NewKey, Num + 1)
  end.

binsearch(Arr, Key, GetKeyFunc) ->
  binsearch(Arr, Key, 0, array:size(Arr), GetKeyFunc).

binsearch(Arr, Key, LowerBound, UpperBound, GetKeyFunc) ->
  Mid = (LowerBound + UpperBound) div 2,
  Item = array:get(Mid, Arr),
  ComKey = case GetKeyFunc of
    {M, F} -> M:F(Item);
    Fun -> Fun(Item)
  end,
  if
    UpperBound < LowerBound -> {-1, UpperBound};
    Key < ComKey ->
      binsearch(Arr, Key, LowerBound, Mid-1, GetKeyFunc);
    Key > ComKey ->
      binsearch(Arr, Key, Mid+1, UpperBound, GetKeyFunc);
    true ->
      Mid
  end.

%检查列表中的元素是否有重复
lists_check_duplicate(L) -> lists_check_duplicate2(L,  sets:new()).

lists_check_duplicate2([], _S) -> false;
lists_check_duplicate2([H|T], S) ->
  case sets:is_element(H,S) of
    true -> true;
    false -> lists_check_duplicate2(T, sets:add_element(H,S))
  end.

% 统计list中同一元素出现的次数，输入可以是单个数字或atom的集合，也可以而是{ID,Amount}的格式
% 举例: lists_merge([1,3,1,2,4]) -> [{1,2},{3,1},{2,1},{4,1}]
lists_merge(L) -> lists_merge2([], L).

lists_merge2(Rslt, []) -> Rslt; % 保持原来的顺序
lists_merge2(Rslt, [ID | Left]) when is_integer(ID) orelse is_atom(ID) ->
  lists_merge2(Rslt, [{ID, 1} | Left]);
lists_merge2(Rslt, [{ID, Amount} | Left]) ->
  case lists:keyfind(ID, 1, Rslt) of
    false -> lists_merge2([{ID, Amount} | Rslt], Left);
    {ID, N} -> lists_merge2(lists:keyreplace(ID, 1, Rslt, {ID, Amount + N}), Left)
  end.

insert_unique(T, List) ->
  case lists:member(T, List) of
    true ->
      List;
    false ->
      [T|List]
  end.

index_of(Item, List) -> index_of(Item, List, 1).

index_of(_, [], _) -> undefined;
index_of(Item, [Item|_], Index) -> Index;
index_of(Item, [_|TL], Index) -> index_of(Item, TL, Index + 1).
%% ------------------------------------------------------------------
%% String Function Exports
%% ------------------------------------------------------------------
%% md5 string
md5str(S) ->
  Md5_bin = erlang:md5(S),
  Md5_list = binary_to_list(Md5_bin),
  lists:flatten(list_to_hex(Md5_list)).

%% 去除字串两边的空格
trim(Str) ->
  Res1 = trim_ahead_blank(Str),
  Res2 = trim_ahead_blank(lists:reverse(Res1)),
  lists:reverse(Res2).

eval(S) ->
  {ok,Scanned,_} = erl_scan:string(S),
  {ok,Parsed} = erl_parse:parse_exprs(Scanned),
  {value, Value,_} = erl_eval:exprs(Parsed,[]),
  Value.

trim_ahead_blank([32 | Left]) ->  %% trim whitespace
  trim_ahead_blank(Left);
trim_ahead_blank([9  | Left]) -> %% trim tab
  trim_ahead_blank(Left);
trim_ahead_blank([13 | Left]) -> %% trim line
  trim_ahead_blank(Left);
trim_ahead_blank([10 | Left]) -> %% trim line
  trim_ahead_blank(Left);
trim_ahead_blank(Str) ->
  Str.

term_to_string(Term) ->
  R= io_lib:format("~p",[Term]),
  lists:flatten(R).

list_to_hex(L) ->
  lists:map(fun(X) -> int_to_hex(X) end, L).

int_to_hex(N) when N < 256 ->
  [hex(N div 16), hex(N rem 16)].

hex(N) when N < 10 -> $0 + N;
hex(N) when N >= 10, N < 16 -> $a + (N-10).

name_to_dbstr(Name) ->
  BinName = unicode:characters_to_binary(Name),
  binary_to_list(BinName).

dbstr_to_name(DBStr) ->
  %BinName = list_to_binary(DBStr),
  unicode:characters_to_list(DBStr).

get_utf8(Str) ->
  Bin = unicode:characters_to_binary(Str),
  binary_to_list(Bin).

get_unicode(Str) ->
  Bin = iolist_to_binary(Str),
  unicode:characters_to_list(Bin).

%% term反序列化，string转换为term，e.g., "[{a},1]"  => [{a},1]
string_to_term(String) ->
    case erl_scan:string(String++".") of
        {ok, Tokens, _} ->
            case erl_parse:parse_term(Tokens) of
                {ok, Term} -> Term;
                _Err -> undefined
            end;
        _Error ->
            undefined
    end.

%% change binary into hex.
bin_to_hexstr(Bin) ->
  lists:flatten([io_lib:format("~2.16.0b", [X]) ||
    X <- binary_to_list(Bin)]).

hexstr_to_bin(S) ->
  hexstr_to_bin(S, []).
hexstr_to_bin([], Acc) ->
  list_to_binary(lists:reverse(Acc));
hexstr_to_bin([X,Y|T], Acc) ->
  {ok, [V], []} = io_lib:fread("~16u", [X,Y]),
  hexstr_to_bin(T, [V | Acc]).

check_mobile_number(NumberList) ->
  (erlang:length(NumberList)=:=11) andalso ((catch re:run(NumberList, "^1[3|4|5|7|8][0-9]{9}$")) =:= {match,[{0,11}]}).

term2binary(Action, Id, Data) ->
  Bin = term_to_binary(Data),
  binary_len_check(Action, Id, Bin, ?MAX_BIN_LEN),
  Bin.

term2binary_compress(Action, Id, Data) ->
  Bin = term2binary_compress(Data),
  binary_len_check(Action, Id, Bin, ?MAX_BIN_LEN),
  Bin.

term2binary_compress_mb(Action, Id, Data) ->
  Bin = term2binary_compress(Data),
  binary_len_check(Action, Id, Bin, ?MAX_MEDIUM_BIN_LEN),
  Bin.

term2binary_compress(Data) ->
  BinOrg = term_to_binary(Data),
  zlib:compress(BinOrg).

binary_len_check(Action, Id, Bin, MAX_LEN) ->
  case erlang:size(Bin) of
    Len when Len >= MAX_LEN ->
      Msg = io_lib:format("~w key ~w data length greater than ~w", [Action, Id, MAX_LEN]),
      log4erl:info(Msg),
      proc_lib:spawn(alarm_sender, send_msg, [Msg]);
    _ -> ok
  end.

format(Fmt, Params) ->
  io:format(Fmt, Params),
  log4erl:info(Fmt, Params).
%% ------------------------------------------------------------------
%% Net Function Exports
%% ------------------------------------------------------------------
socket_ip_str(Socket) ->
  case inet:peername(Socket) of
    {ok, {IP, _Port}} ->
      case inet:ntoa(IP) of
        {error, einval} -> undefined;
        Addr -> Addr
      end;
    {error, _} -> undefined
  end.

socket_self_ip_str(Socket) ->
  case inet:sockname(Socket) of
    {ok, {IP, _Port}} ->
      case inet:ntoa(IP) of
        {error, einval} -> undefined;
        Addr -> Addr
      end;
    {error, _} -> undefined
  end.

%% 检查输入IP 是否在一个子网Range里，Range可以是一个简单IP
%% 子网的描述形如 "192.168.1.0/25" "110.75.128.0/19"
ip_in_range(IP, SubnetIP) when IP =:= SubnetIP -> 0;
ip_in_range(IP, SubnetIP) ->
  case string:tokens(SubnetIP, "/ ") of
    [IPBase, Range] ->
      IRange = list_to_integer(Range),
      case IRange < 32 of
        false -> 2;     % 不考虑256个IP以上的子网
        true ->
          case inet:parse_strict_address(IP) of
            {error, _} -> 3;
            {ok, IPT} ->
              case inet:parse_strict_address(IPBase) of
                {error, _} -> 4;
                {ok, IPRT} ->
                  IPI = get_ipv4_int(IPT),
                  IPRI = get_ipv4_int(IPRT),
                  Mask = (1 bsl (32 - IRange)) - 1,
                  case (IPRI band Mask) =/= 0 of    % 检查子网输入合法性
                    true -> 5;
                    false ->
                      case (IPI band (IPRI + Mask)) =:= IPI
                        andalso (IPI band IPRI) =:= IPRI of     % 检查IP是否在子网内
                        false -> 6;
                        true -> 0
                      end
                  end
              end
          end
      end;
    _ -> 1
  end.

get_ipv4_int({A,B,C,D}) -> A*256*256*256+B*256*256+C*256+D.
%% ------------------------------------------------------------------
%% Http Function Exports
%% ------------------------------------------------------------------
make_sign(Data ,Key) ->
  Data2 = lists:keydelete("sign", 1, Data),
  Data3 = lists:sort(fun({A,_}, {B,_}) -> A < B end, Data2),
  Data4 = term_to_url_data(Data3),
  Data5 = lists:concat([Data4, Key]),
  md5str(Data5).

getArgs(NameList, QS) ->
  lists:foldr(fun(X, Y) -> [proplists:get_value(X, QS) | Y] end, [], NameList).

requestPOST(Url, Data) ->
   case httpc:request(post, {Url, [], "application/x-www-form-urlencoded", Data}, [{timeout, 6000}], []) of
       {fail, Reason} ->
            log4erl:error("http request ~p error cause ~p~n", [Url, Reason]),
            {fail, http_request_fail};
       {ok, {_, _, Body}} ->
            {success, Body}
   end.

term_to_url_data(L) -> makeUrlData(L, 1).
makeUrlData([], _) -> "";
makeUrlData([{Name, Val}|T] ,First) ->
  case First == 1 of
    true -> lists:concat([Name, "=", Val, makeUrlData(T, 0)]);
    false -> lists:concat(["&", Name,"=", Val, makeUrlData(T, 0)])
  end.

get_url(Url, Data) ->
    Url2= lists:concat([Url, "?", Data]),
    {ok, {_, _, Body}} =  httpc:request(get, {Url2, []}, [{timeout, 6000}], []),
    Body.
post_url(Url, Data) ->
    {ok, {_, _, Body}} = httpc:request(post, {Url, [], "application/x-www-form-urlencoded",Data}, [{timeout, 6000}], []),
    Body.
decode_json(Data) ->
   {ok, {obj, Value}, _} = rfc4627:decode(Data),
   Value.
getJSON(Data) ->
       Decode = rfc4627:decode(Data),
       case Decode of
         {error, Reason} ->
           {fail, Reason};
         {ok, {obj, Value}, _} ->
           {ok, Value}
       end.
%% ------------------------------------------------------------------
%% router Function Exports
%% ------------------------------------------------------------------

%% 这些转换函数都考虑了多次合服的问题，所以需要循环查找合服链
get_real_svrid(SvrId) ->
  case ets:lookup(merge_server_ets, SvrId) of
    [] -> SvrId;
    [{_, NewSvrId, _, _}] ->
      get_real_svrid(NewSvrId)
  end.

get_real_guild_svrid(GuildId, SvrId) ->
  case ets:lookup(merge_server_ets, SvrId) of
    [] -> {GuildId, SvrId};
    [{_, NewSvrId, _, GuildBaseId}] -> get_real_guild_svrid(GuildBaseId + GuildId, NewSvrId)
  end.

get_real_userid_svrid(UID, SvrId) ->
  case ets:lookup(merge_server_ets, SvrId) of
    [] -> {UID, SvrId};
    [{_, NewSvrId, UserBaseId, _}] -> get_real_userid_svrid(UserBaseId + UID, NewSvrId)
  end.

%获得当前服务器里面被合入的svrid
get_merged_svr_list() ->
  GameSvrID = tools:getsvrid(),
  get_merged_svr_list(GameSvrID).
  
get_merged_svr_list(GameSvrID) ->
  L = [SvrID || {SvrID, _, _, _} <- ets:tab2list(merge_server_ets)],
  L2 = lists:filter(fun(SvrID)-> tools:get_real_svrid(SvrID)=:=GameSvrID end, L),
  L2.

%% ------------------------------------------------------------------
%% Other Function Exports
%% ------------------------------------------------------------------

%% 远程执行代码
injection(Node, FileName, Module, Function, Args) ->
  case rpc:call(Node, code, is_loaded, [Module]) of
    false ->
      {ok, B} = file:read_file(FileName),
      S = binary_to_list(B),
      case rpc:call(Node, dynamic_compile, load_from_string, [S]) of
        {module, Module} ->
          Rslt = rpc:call(Node, Module, Function, Args),
          rpc:call(Node, code, purge, [Module]),
          rpc:cast(Node, code, delete, [Module]),   % 清理失败了不要紧，下次检查出错再处理
          Rslt;
        O ->
          io:format("O is ~p~n", [O]),
          rpc_error
      end;
    {file, _} -> err_module_loaded;
    _ -> rpc_error
  end.

%% 热更protobuf文件
update_protobuff(_Name) -> ok.
  % ProtoFile = ?PB_PATH(Name),
  % case lists:member(Name, ?ALL_PB_FILE) of
  %   true ->
  %     ok = protobuffs_compile:scan_file(ProtoFile, ?PB_COMPILE_OP),
  %     ModName = list_to_atom(filename:basename(ProtoFile, ".proto")++"_pb"),
  %     SoftPurgeRet = code:soft_purge(ModName),
  %     io:format("code:soft_purge ~p --> ~p~n", [ModName, SoftPurgeRet]),
  %     code:load_file(ModName);
  %   false ->
  %     {not_found_file, ProtoFile}
  % end.

%% ------------------------------------------------------------------
%% Logic Function Exports
%% ------------------------------------------------------------------

%% 分割list
split_list([], _Size, R) -> R;
split_list(L, Size, R) ->
  {H, T} = case length(L) > Size of
    true -> lists:split(Size, L);
    false -> {L, []}
  end,
  split_list(T, Size, [H] ++ R).

join(_Sep, []) -> [];
join(Sep, [H|T]) -> [H|join_prepend(Sep, T)].

join_prepend(_Sep, []) -> [];
join_prepend(Sep, [H|T]) -> [Sep, H|join_prepend(Sep, T)].


bool2int(true) ->
  1;
bool2int(false) ->
  0.

print_stacktrace() ->
  try 
    throw(print_stacktrace)
  catch _:_ ->
    log4erl:info("stacktrack:~n~p",[erlang:get_stacktrace()])
  end.

uid2key(UID) ->
  {getsvrid(), UID}.

convert_area("Mainland") -> cn;
convert_area("Korea") -> kr;
convert_area("Japan") -> jp;
convert_area("SouthEastAsia") -> sea;
convert_area("Taiwan") -> tw;
convert_area("Vietnam") -> vn.

between(Value, Min, Max) ->
  Value1 = erlang:max(Value, Min),
  Value2 = erlang:min(Value1, Max),
  Value2.

record_name(Record) ->
  erlang:element(1, Record).

safe_apply(Mod, Fun, Params) ->
  try
    erlang:apply(Mod, Fun, Params)
  catch
    error:{badmatch, Err} when is_atom(Err)-> Err;
    error:{badmatch, {tip, Err}} when is_atom(Err)-> {tip, Err};
    error:{badmatch, {quit, Err}} when is_atom(Err)-> {quit, Err}  
  end.

%% 不同版本record兼容,调用示例 
%% trans2local_record({user_summary, 1, "hah", 3}, #user_summary{}).
trans2local_record(Record, LocalRecord) ->
  Type = element(1, LocalRecord),
  Size = size(LocalRecord),
  case Record of
    Record when is_tuple(Record), size(Record) =:= Size, element(1, Record) =:= Type -> 
      Record;
    Record when is_tuple(Record), element(1, Record) =:= Type ->
      record_trans(Record, LocalRecord);
    Other ->
      Other
  end.

record_trans(RemoteRecord, LocalRecord) ->
  LocalList = tuple_to_list(LocalRecord),
  RemoteList = tuple_to_list(RemoteRecord),
  record_trans(LocalList, RemoteList, []).

record_trans([], _Remote, Done) ->
  list_to_tuple(lists:reverse(Done));
record_trans([Local| RestLocal], [], Done) ->
  record_trans(RestLocal, [], [Local| Done]);
record_trans([_Local| RestLocal], [Remote| Rest], Done) ->
  record_trans(RestLocal, Rest, [Remote| Done]).

new_ets(EtsName) -> 
  new_ets(EtsName, [set, named_table, public]).
new_ets(EtsName, Option) ->
  case ets:info(EtsName) of
    undefined -> 
      ets:new(EtsName, Option);
    _ ->
      ets:delete_all_objects(EtsName)
  end.

rpc_call(SvrId, Module, Function, Args) ->
  case name_cache:get_real_svr_addr(SvrId) of
    notfound ->
      log4erl:error("rpc_call: name_cache get_real_svr_addr notfound ~w", [SvrId]),
      svr_node_not_found;
    Node ->
      rpc:call(Node, Module, Function, Args)
  end.

rpc_call(SvrId, Module, Function, Args, TimeOut) ->
  case name_cache:get_real_svr_addr(SvrId) of
    notfound ->
      log4erl:error("rpc_call: name_cache get_real_svr_addr notfound ~w", [SvrId]),
      svr_node_not_found;
    Node ->
      rpc:call(Node, Module, Function, Args, TimeOut)
  end.

rpc_cast(SvrId, Module, Function, Args) ->
  case name_cache:get_real_svr_addr(SvrId) of
    notfound ->
      log4erl:error("rpc_cast: name_cache get_real_svr_addr notfound ~w", [SvrId]);
    Node ->
      rpc:cast(Node, Module, Function, Args)
  end.

do_multi_task(Re, FunParam) ->
  do_multi_task(Re, FunParam, false).

do_multi_task(Re, FunParam, Return) ->
  SvrList = mapreduce:get_tracer_list(Re),
  Father = self(),
  [proc_lib:spawn(fun() ->
    Rslt = rpc:call(Node, ?MODULE, do_multi_task_proc, [FunParam]),
    Father ! {task_res, {SvrId, Rslt}}
  end) || {SvrId, Node} <- SvrList],
  Len = length(SvrList),
  AllRes = multi_task_collect_res(Len, Return, []),
  case Return of
    true -> AllRes;
    false ->
      {all_server_cnt, length(AllRes)}
  end.

multi_task_collect_res(0, _Return, Done) -> Done;
multi_task_collect_res(Len, Return, Done) ->
  receive
    {task_res, {SvrId, {badrpc,nodedown}}} ->
      case tools:get_real_svrid(SvrId) =:= SvrId of
        false ->
          multi_task_collect_res(Len - 1, Return, Done);
        true ->
          io:format("~w~n", [{SvrId, nodedown}]),
          multi_task_collect_res(Len - 1, Return, [{SvrId, nodedown}| Done])
      end;
    {task_res, {SvrId, Rslt}} ->
      Return orelse io:format("~w~n", [{SvrId, Rslt}]),
      multi_task_collect_res(Len - 1, Return, [{SvrId, Rslt}| Done]);
    _ ->
      multi_task_collect_res(Len, Return, Done)
  end.

do_multi_task_proc(Fun) when is_function(Fun) ->
  Fun();
do_multi_task_proc({M, F, A}) ->
  apply(M, F, A);
do_multi_task_proc(_) ->
  invalid_command.

ets_foldl(Fun, Acc, Tab) ->
  ets_foldl_0(Tab, ets:first(Tab), Fun, Acc).
  
ets_foldl_0(_Tab, '$end_of_table', _Fun, Acc) -> Acc;
ets_foldl_0(Tab, Key, Fun, Acc) ->
  Acc2 = Fun(Tab, Key, Acc),
  ets_foldl_0(Tab, ets:next(Tab, Key), Fun, Acc2).


dets_foldl(Fun, Acc, Tab) ->
  dets_foldl_0(Tab, dets:first(Tab), Fun, Acc).
  
dets_foldl_0(_Tab, '$end_of_table', _Fun, Acc) -> Acc;
dets_foldl_0(Tab, Key, Fun, Acc) ->
  Acc2 = Fun(Tab, Key, Acc),
  dets_foldl_0(Tab, dets:next(Tab, Key), Fun, Acc2).
