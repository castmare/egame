%% Copyright
-ifndef(SETTINGS_HRL).
-define(SETTINGS_HRL, settings).

-define(ACCEPT_NUM, 8).                     % accept进程数

-define(LOG4ERL_CONF, "priv/log4erl.conf").
-define(DETS_PATH, "dets_files").

-define(DEFAULT_NAME, "NickName").

%% 协议密钥
-define(CRYPT_KEY, <<"182173557">>).

%% protobuff协议
-define(ALL_PB_FILE, [common, up, down]). 
-define(PB_PATH(Name), lists:concat(["msg/", Name, ".proto"])).
-define(PB_COMPILE_OP, [{output_include_dir, "ebin/"}, {output_ebin_dir, "ebin/"}, {compile_flags, [export_all]}, {imports_dir, ["msg/"]}]).

%%%===================================================================
%%% General Macro
%%%===================================================================


%% log的宏
-ifdef(TEST).
-define(LOG(A, B), log4erl:info(A, B)).
-else.
-define(LOG(A, B), true).
-endif.

-ifdef(OK_IF).
-define(OK_IF(IsTrue, Error), case IsTrue of true -> ok; _ -> Error end).
-endif.

-ifdef(OK_IF_NOT).
-define(OK_IF_NOT(IsTrue, Error), case IsTrue of false -> ok; _ -> Error end).
-endif.

%% 未定义宏
-ifndef(UNDEF).
-define(UNDEF, undefined).
-endif.

-ifndef(NOTFOUND).
-define(NOTFOUND, notfound).
-endif.

-define(STACK, erlang:get_stacktrace()).

%% 玩家数据ETS表
-define(USER_ETS, user_ets).

%% 角色数据ETS表
-define(ROLE_ETS, role_ets).

%% slow db 同时允许存在的最大后台写入进程数量
-define(SLOW_DB_PROC_MAX, 10).
-define(USER_SLOW_DB, user_slow_db).
-define(ROLE_SLOW_DB, role_slow_db).


-endif.
