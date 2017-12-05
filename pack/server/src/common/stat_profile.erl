%性能分析工具

-module(stat_profile).

-export([init/0, clear/0, stat/3, stat/4, report/0]).

init() ->
  ets:new(stat_profile_time_ets, [public, named_table, set, {write_concurrency, true}]),
  ets:new(stat_profile_cnt_ets, [public, named_table, set, {write_concurrency, true}]).

clear() ->
  ets:delete_all_objects(stat_profile_time_ets),
  ets:delete_all_objects(stat_profile_cnt_ets).

stat(M, F, A) ->
  GetKeyFun = fun(M1, F1, _A) -> {M1, F1} end,
  stat(M, F, A, GetKeyFun).

stat(M, F, A, GetKeyFun) ->
  Key = GetKeyFun(M, F, A),
  {Time, Ret} = timer:tc(M, F, A),
  case ets:lookup(stat_profile_time_ets, Key) of
    [] -> ets:insert(stat_profile_time_ets, {Key, Time});
    [_] -> ets:update_counter(stat_profile_time_ets, Key, Time)
  end,
  case ets:lookup(stat_profile_cnt_ets, Key) of
    [] -> ets:insert(stat_profile_cnt_ets, {Key, 1});
    [_] -> ets:update_counter(stat_profile_cnt_ets, Key, 1)
  end,
  Ret.

report() ->
  {ok, FD} = file:open("stat_profile.txt", [write]),
  io:format(FD, "~s\n", [lists:duplicate(90, $-)]),
  io:format(FD, "~-50s | ~-10s | ~-10s | ~-10s |\n", ["item", "cnt", "time(us)", "avg(us)"]),
  io:format(FD, "~s\n", [lists:duplicate(90, $-)]),
  [begin
    [{_, Cnt}] = ets:lookup(stat_profile_cnt_ets, Key),
    io:format(FD, "~-50s | ~-10.10B | ~-10.10B | ~-10.10B |\n"
        , [tools:term_to_string(Key), Cnt, Time, Time div Cnt])
  end || {Key, Time} <- lists:keysort(2, ets:tab2list(stat_profile_time_ets))],
  file:close(FD).
