%%%-------------------------------------------------------------------
%%% @doc 数据持久化模块
%%%-------------------------------------------------------------------
-module(persistence).
-author(lifan).

%%% API
-compile(export_all).

-include("record.hrl").
-include("settings.hrl").

-define(USER_DETS, user_dets).
-define(ROLE_DETS, role_dets).

-define(ALL_DETS_LIST, [
	{?USER_DETS, [{keypos, #user.uid}]},
	{?ROLE_DETS, [{keypos, #role.rid}]},
	edge
]).

%%%===================================================================
%%% API
%%%===================================================================
init(DetsPath) ->
	init_all_dets(DetsPath, ?ALL_DETS_LIST),
	ok.

%% 获取玩家
get_user(UserID) ->
	case dets:lookup(?USER_DETS, UserID) of
		[] -> ?NOTFOUND;
		[User] -> User
	end.

%% 插入玩家
insert_user(User) ->
	dets:insert(?USER_DETS, User).

%% 获取角色
get_role(RoleID) ->
	case dets:lookup(?ROLE_DETS, RoleID) of
		[] -> ?NOTFOUND;
		[Role] -> Role
	end.

%% 插入角色
insert_role(Role) ->
	dets:insert(?ROLE_DETS, Role).

get_device_id_dict() ->
		Fun = fun(Tab, UserID, Dict) ->
			[#user{device_id = DeviceID, svr_id = SvrID}] = dets:lookup(Tab, UserID),
			dict:store(DeviceID, {UserID, SvrID}, Dict)
		end,
 		dets_foldl(Fun, dict:new(), ?USER_DETS).
%%%===================================================================
%%% Support
%%%===================================================================

init_all_dets(_, [edge]) -> finish;
init_all_dets(Path, [{Name, Opts} | Rest]) ->
	FileName = Path ++ atom_to_list(Name),
	case dets:open_file(Name, [{file, FileName}] ++ Opts) of
		{ok, Name} ->
			log4erl:info("persistence:init_dets ~w success", [Name]),
			init_all_dets(Path, Rest);
		{error, Reason} ->
			log4erl:error("persistence:init_dets ~w failed ~p", [Name, Reason]),
			throw("persistence init dets error")
	end.

dets_foldl(Fun, Acc, Tab) ->
	dets_foldl_0(Tab, dets:first(Tab), Fun, Acc).
	
dets_foldl_0(_Tab, '$end_of_table', _Fun, Acc) -> Acc;
dets_foldl_0(Tab, Key, Fun, Acc) ->
	Acc2 = Fun(Tab, Key, Acc),
	dets_foldl_0(Tab, dets:next(Tab, Key), Fun, Acc2).

