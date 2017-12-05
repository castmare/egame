%% 角色数据存取DB的接口
%% 调用slow_db进行缓写操作
-module(role_db).
-author('Ollir Zhang<ollir.h@gmail.com>').

-include("record.hrl").
-include("settings.hrl").

-export([prepare/0, insert/1, update/1]). % MySQL操作
-export([init/0,
         get_role/1,
         insert_role/1,
         update_role/1,
         insert_role_without_slow_db/1]).

% 准备MySQL和玩家操作相关的一些语句
prepare() -> ok.

init() ->
  io:format("preparing role_ets ~n"),
  case ets:info(?ROLE_ETS) of
    undefined ->
      ets:new(?ROLE_ETS, [set, named_table, public, compressed,
                          {keypos, #role.rid},
                          {heir, whereis(init_sup), []}
                         ]);
    _ ->
      log4erl:error("role slow_db crashed, and call prepare again."),
      already_created
  end.

% slow_db在缓写的时候，根据RoleID把玩家写到MySQL中
insert(RoleID) ->
  case ets:lookup(?ROLE_ETS, RoleID) of
    [] ->
      log4erl:error("try to insert RoleID(~p) into db but in role_ets not found.", [RoleID]),
      ok;
    [Role] when is_record(Role, role) ->
      persistence:insert_role(Role)
  end.

% slow_db在缓写的时候，根据RoleID更新MySQL中的数据
update(RoleID) -> insert(RoleID).

% 这是DB对外暴露的接口 ------------------------

% 获取玩家
get_role(RoleID) ->
  case ets:lookup(?ROLE_ETS, RoleID) of
    [] ->
      case persistence:get_role(RoleID) of
        Role when is_record(Role, role) ->
          ets:insert(?ROLE_ETS, Role),
          Role;
        Err -> Err
      end;
    [Role] when is_record(Role, role) -> Role
  end.

insert_role(Role = #role{rid = RoleID}) ->
  ets:insert(?ROLE_ETS, Role),
  slow_db:insert(?ROLE_SLOW_DB, RoleID).

update_role(Role = #role{rid = RoleID}) ->
  ets:insert(?ROLE_ETS, Role),
  slow_db:update(?ROLE_SLOW_DB, RoleID).

insert_role_without_slow_db(Role) ->
  ets:insert(?ROLE_ETS, Role),
  persistence:insert_role(Role).
