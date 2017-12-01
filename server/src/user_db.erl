%% 玩家数据存取DB的接口
%% 调用slow_db进行缓写操作
-module(user_db).
-author('Ollir Zhang<ollir.h@gmail.com>').

-include("record.hrl").
-include("settings.hrl").

-export([prepare/0, insert/1, update/1]). % MySQL操作
-export([init/0,
         get_user/1,
         insert_user/1,
         update_user/1,
         insert_user_without_slow_db/1]).

% 准备MySQL和玩家操作相关的一些语句
prepare() -> ok.

init() ->
  io:format("preparing user_ets ~n"),
  case ets:info(?USER_ETS) of
    undefined ->
      ets:new(?USER_ETS, [set, named_table, public, compressed,
                          {keypos, #user.uid},
                          {heir, whereis(init_sup), []}
                         ]);
    _ ->
      log4erl:error("user slow_db crashed, and call prepare again."),
      already_created
  end.

% slow_db在缓写的时候，根据UID把玩家写到MySQL中
insert(UID) ->
  case ets:lookup(?USER_ETS, UID) of
    [] ->
      log4erl:error("try to insert UID(~p) into db but in user_ets not found.", [UID]),
      ok;
    [User] when is_record(User, user) ->
      persistence:insert_user(User)
  end.

% slow_db在缓写的时候，根据UID更新MySQL中的数据
update(UID) -> insert(UID).

% 获取玩家
get_user(UID) ->
  case ets:lookup(?USER_ETS, UID) of
    [] ->
      case persistence:get_user(UID) of
        User when is_record(User, user) ->
          ets:insert(?USER_ETS, User),
          User;
        Err -> Err
      end;
    [User] when is_record(User, user) -> User
  end.

% 存玩家，包括：1. 写memcache 2. 写MySQL
insert_user(User = #user{uid = UID}) ->
  ets:insert(?USER_ETS, User),
  slow_db:insert(?USER_SLOW_DB, UID).

% 更新玩家
update_user(User = #user{uid = UID}) ->
  ets:insert(?USER_ETS, User),
  slow_db:update(?USER_SLOW_DB, UID).

% 直接插入DB，开服时用
insert_user_without_slow_db(User) ->
  ets:insert(?USER_ETS, User),
  persistence:insert_user(User).
