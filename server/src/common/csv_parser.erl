-module(csv_parser).
-author('Ollir Zhang<ollir.h@gmail.com>').

-export([parse_file/1,
         parse_content/3,
         parse_content2/3,
         new_parse_content/3,
         sort_fields/3,
         fetch_contents_semantically/2,
         parse_times/1,
       init_ets/0,
       log_all_dup_keys/0]).

-export([test/1]).

%% for test only
%% -compile(export_all).

-define(CSV_KEYS_CACHE_ETS, csv_keys_cache_ets).
-define(DUP_CSV_ETS, dup_csv_ets).

init_ets() ->
  ets:new(?DUP_CSV_ETS, [set, named_table, public]).


%% read contents from csv file into list.
parse_file(File) ->
  {ok, Data} = file:read_file(File),
  Data2 = binary_to_list(Data),
  LineList = re:split(Data2, "\r\n|\n|\r", [{return, list}]),
  parse(LineList, []).

parse([], Done) -> lists:reverse(Done);
parse([L|R], Done) ->
  case L of
    [] -> parse(R, Done); %empty line.
    _L -> parse(R, [parse_line(L) | Done])
  end.

% TODO string:tokens/2 搞定！
% parse each line "xxx,yyy,zzz"
parse_line(Line) -> parse_line(Line, []).

parse_line([], Fields) -> lists:reverse(Fields);
parse_line("," ++ Line, Fields) -> parse_field(Line, Fields);
parse_line(Line, Fields) -> parse_field(Line, Fields).

%% each field
parse_field("\"" ++ Line, Fields) -> parse_field_q(Line, [], Fields);
parse_field(Line, Fields) -> parse_field(Line, [], Fields).

parse_field("," ++ _ = Line, Buf, Fields) -> parse_line(Line, [lists:reverse(Buf)|Fields]);
parse_field([C|Line], Buf, Fields) -> parse_field(Line, [C|Buf], Fields);
parse_field([], Buf, Fields) -> parse_line([], [lists:reverse(Buf)|Fields]).

parse_field_q("\"\"" ++ Line, Buf, Fields) -> parse_field_q(Line, [$"|Buf], Fields);
parse_field_q("\"" ++ Line, Buf, Fields) -> parse_line(Line, [lists:reverse(Buf)|Fields]);
parse_field_q([C|Line], Buf, Fields) -> parse_field_q(Line, [C|Buf], Fields).

%% change content type according to table head.
parse_content(RecordName, TypeVal, Line) ->
  list_to_tuple([RecordName | parse_content2(TypeVal, Line, [])]).

%% 已经搞不懂这个函数的意思了我操！
new_parse_content(_TypeVal, [], Done) -> lists:reverse(Done);
new_parse_content(TypeVal, [Line|LineList], Done) ->
  [L|_LL] = Line,
  case L of
    [] -> new_parse_content(TypeVal, LineList, Done); %empty line!
  _L ->
    new_parse_content(TypeVal, LineList, [parse_content2(TypeVal, Line, []) | Done])

  end.

% start parse line
parse_content2(TypeVal, Line, []) ->
  parse_content4(TypeVal, Line, [], []).

% end parse line
parse_content4([], [], Ret, Keys) ->
  Keys1 = lists:reverse(Keys),
  case length(Keys1) of
    Len when Len > 0 ->
      ElemKey = list_to_tuple(Keys1),
        case ets:lookup(?CSV_KEYS_CACHE_ETS, ElemKey) of
          [] ->
            %%io:format("insert key: ~p~n", [ElemKey]),
            ets:insert(?CSV_KEYS_CACHE_ETS, {ElemKey});
          _ ->
            case get(dup_keys) of
              undefined -> error;
              Any -> put(dup_keys, [ElemKey | Any])
            end
        end;
    _ -> ok
  end,
  lists:reverse(Ret);

% foreach Type/Value parse
parse_content4([T|TL], [L|LL], Ret, Keys) ->
  {Val, NewKeys} = parse_content3(T, L, Keys),
  parse_content4(TL, LL, [Val | Ret], NewKeys). %% for multi keys

parse_content3([], _, Keys) -> {omit, Keys}; %if it starts with nothing, the server will omit this word
parse_content3([$O|_], _, Keys) -> {omit, Keys}; %if it starts with "O", the server will omit this word
parse_content3([$X|Key], Value, Keys) -> parse_content3(Key, Value, Keys);    %% X开头的Key是给客户端用的特殊标志，直接过滤掉
parse_content3([$U|Key], Value, Keys) -> parse_content3(Key, Value, Keys);    %% U头的Key是给战斗校验用的特殊标志，直接过滤掉

parse_content3("KN", Val, Keys) ->
  {RealValue, Keys1} = parse_content3("N", Val, Keys),
  NewKeys = [RealValue | Keys1],
  {RealValue, NewKeys};

parse_content3("KB", Val, Keys) ->
  {RealValue, Keys1} = parse_content3("B", Val, Keys),
  NewKeys = [RealValue | Keys1],
  {RealValue, NewKeys};
parse_content3("KS", Val, Keys) ->
  {RealValue, Keys1} = parse_content3("S", Val, Keys),
  NewKeys = [RealValue | Keys1],
  {RealValue, NewKeys};
parse_content3("NK", Val, Keys) ->
  {RealValue, Keys1} = parse_content3("N", Val, Keys),
  NewKeys = [RealValue | Keys1],
  {RealValue, NewKeys};
parse_content3("S", Val, Keys) ->
  DescUniBin = iolist_to_binary(Val),
  Str = unicode:characters_to_list(DescUniBin),
  {Str, Keys};
parse_content3("KAS", Val, Keys) -> % 以分号为分割符分割字符串，返回字符串列表
  {RealValue, Keys1} = parse_content3("AS", Val, Keys),
  NewKeys = [RealValue | Keys1],
  {RealValue, NewKeys};
parse_content3("AS", Val, Keys) -> % 以分号为分割符分割字符串，返回字符串列表
  A = string:tokens(Val, ";"),
  KeyAS = [parse_content3("S", X, Keys) || X <- A],
  {[AS || {AS, _Key} <- KeyAS], Keys};

parse_content3("B", "YES", Keys) -> {1, Keys};
parse_content3("B", "NO", Keys) -> {0, Keys};
parse_content3("B", [], Keys) -> {0, Keys};
parse_content3("N", [], Keys) -> {0, Keys};
parse_content3("N", Val, Keys) ->
  case string:to_float(Val) of
    {error, no_float} ->
      case string:to_integer(Val) of
        {error, _} ->
          log4erl:fatal("file ~p parse fail, keys ~w, bad arg ~p ~n", [get(csv_name), Keys, Val]),
          {error, Keys};
        {Num, [$E|Rest]} ->
          {N2, _} = string:to_float(string:concat("1.0E", Rest)),
          {N2 * Num, Keys} ; % "6E-05"这样的格式，没法顺利地转为float
        {Num, [$e|Rest]} ->
          {N2, _} = string:to_float(string:concat("1.0E", Rest)),
          {N2 * Num, Keys};
        {Num, _} -> {Num, Keys}
      end;
    {Num, _} -> {Num, Keys}
  end;
parse_content3("AN", Val, Keys) -> % 以分号为分割符分割数字，返回数组
  A = string:tokens(Val, ";"),
  ListKeys = [parse_content3("N", X, Keys) || X <- A],
  {[C || {C, _Key} <- ListKeys ], Keys};
parse_content3(_, Val, Keys) -> {Val, Keys}.

sort_fields(Sequence, Head, Line) ->
  Zip = lists:zip(Head, Line),
  sort_fields2(Sequence, Zip, []).

sort_fields2([], _Zip, Done) -> lists:reverse(Done);
sort_fields2([Column | Sequence], Zip, Done) ->
  case lists:keyfind(Column, 1, Zip) of
    {_, Val} -> sort_fields2(Sequence, Zip, [Val | Done]);
    false ->
      log4erl:info(">>> >>> ~p ~p~n", [Column, Zip]),
      io:format(">>> >>> ~p ~p~n", [Column, Zip]),
      error
  end.


%%%%%%% init key ets cache
init_ets(Table) ->
  ets:new(Table, [set, named_table, public]).
destroy_ets(Table) ->
  ets:delete(Table).

test(Csv) ->
  io:format(">>> parsing ~p~n", [Csv]),
  [TypeVal, _HEAD | Content] = parse_file(Csv),
  init_ets(?CSV_KEYS_CACHE_ETS),
  put(csv_name, Csv),
  put(dup_keys, []),
  new_parse_content(TypeVal, Content, []),
  insert_dup_keys(),
  erase(dup_keys),
  destroy_ets(?CSV_KEYS_CACHE_ETS),
  log_all_dup_keys(),
  ok.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


%% 根据给定的表头顺序，解析csv文件的内容
fetch_contents_semantically(Csv, Sequence) ->
  %io:format(">>> parsing ~p~n", [Csv]),
  [TypeVal, HEAD | Content] = parse_file(Csv),
  put(csv_name, Csv), %% 此处偷懒用了进程字典来存当前的csv表名 和 重复的keys list
  put(dup_keys, []),
  init_ets(?CSV_KEYS_CACHE_ETS),
  A = new_parse_content(TypeVal, Content, []),
  %%io:format("Content: ~p~n", [A]),
  insert_dup_keys(),
  erase(dup_keys),
  destroy_ets(?CSV_KEYS_CACHE_ETS),
  [sort_fields(Sequence, HEAD, X) || X <- A].

insert_dup_keys() ->
  case get(dup_keys) of
    undefined -> error;
    [] -> ok;
    Any ->
      case get(csv_name) of
        undefined -> error;
        CsvName -> ets:insert(?DUP_CSV_ETS, {CsvName, lists:reverse(Any)})
      end
  end.

log_all_dup_keys() ->
  DupKeyList = ets:tab2list(?DUP_CSV_ETS),
  case length(DupKeyList) of
    Len when Len > 0 ->
      log4erl:error("found dupkey: ~p~n", [DupKeyList]),
      io:format("found dupkey , check log.");
    _ -> ok
  end.


% 时间列表：解析XX:XX:XX字符串的列表
parse_times(Times) -> parse_times(Times, []).
parse_times([], Done) -> lists:reverse(Done);
parse_times([Time|Rest], Done) ->
  A = string:tokens(Time, ":"),
  TimeKeys = [parse_content3("N", X, []) || X <- A],
  Time2 = [Num || {Num, _Keys} <- TimeKeys],
  %% log4erl:info("Time2: ~p~n", [Time2]),
  parse_times(Rest, [list_to_tuple(Time2) | Done]).