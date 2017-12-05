%%%-------------------------------------------------------------------
%%% @doc 玩家数据处理模块
%%%-------------------------------------------------------------------
-module(users).
-author(lifan).

-export([init/0]).

-compile(export_all).


-include("record.hrl").
-include("settings.hrl").
-include("user_init.hrl").
-include("msg/common_pb.hrl").
-include("msg/down_pb.hrl").

%%%===================================================================
%%% API
%%%===================================================================

init() -> ok.

sdk_login() -> ok.

%% 玩家登录
login(#login_param{device_id = DeviceID, svr_id = SvrID} = Param) ->
	try
    User = case memcache:get_user_from_deviceid(DeviceID, SvrID) of
      ?UNDEF -> throw(no_user);
      #user{} = User0 -> User0;
      User0 when element(1, User0) =:= user -> throw(bad_user);
      _ -> throw(unknown_user)
    end,
    UserID = User#user.uid,
    put(userid, UserID),
    RoleSummarys = pack_role_summarys(User),
    LoginReply = #login_reply{
      result = role_list,
      user_id = UserID,
      roles = RoleSummarys
     },
    LoginReply2 = case RoleSummarys of
      [#role_summary_st{role_id = RoleID}] -> 
        LoginReply#login_reply{
          result = default_role,
          role = roles:pack_role(RoleID)
        };
      _ -> LoginReply
    end,
    #down_msg{login = LoginReply2}
  catch
    throw:no_user ->
      NewUser = create_new_user(Param),
      #down_msg{
        login = #login_reply{
          result = role_list,
          user_id = NewUser#user.uid,
          roles = pack_role_summarys(NewUser)
        }
      };
    throw:Reason ->
      log4erl:error("users:login failed, reason ~w, param ~p ~p~n", [Reason, Param, ?STACK]),
      Reason;
    E:R ->
      log4erl:error("users:login error, ~w reason ~w, param ~p, ~p ~n", [E, R, Param, ?STACK]),
      login_error
  end.

pack_role_summarys(#user{roles = Roles}) ->
  pack_role_summarys(Roles, []).

pack_role_summarys([], Rslt) -> lists:reverse(Rslt);
pack_role_summarys([Role|Rest], Rslt) ->
  Packed = #role_summary_st{
    role_id = Role#role_summary.rid,
    elf_id  = Role#role_summary.eid,
    name    = Role#role_summary.name,
    level   = Role#role_summary.level
  },
  pack_role_summarys(Rest, [Packed|Rslt]).

create_new_user(#login_param{device_id = DeviceID, svr_id = SvrID, from = From}) ->
  UserID = generate_user_id(DeviceID, SvrID),  
  User = user_init(UserID, DeviceID, SvrID, From),
  create_new_roles(User, [1, 2, 3], []).

user_init(UserID, DeviceID, SvrID, From) ->
  Timenow = tools:timenow(),
  Roles = [],
  UserDict = dict:new(),
  <<UUID:45>> = <<SvrID:21, UserID:24>>,
  User = #user{
    uid = UserID,
    device_id = DeviceID,
    uuid = UUID,
    create_time = Timenow,
    login_time = Timenow,
    from_type = From,
    userdict = UserDict,
    roles = Roles
  },
  User.
    
generate_user_id(DeviceID, SvrID) ->
  memcache:register_deviceid(DeviceID, SvrID).


generate_role_id(#user{uid = UserID, roles = Roles}) ->
  Fun = fun(#role_summary{rid = RoleID}, MaxID) -> max(RoleID, MaxID) end,
  lists:foldl(Fun, UserID * 10 + 1, Roles).


create_new_roles(User, [], Roles) ->
  memcache:write_db(User),
  lists:foreach(fun memcache:write_db/1, Roles),
  User;

create_new_roles(#user{roles = Roles} = User, [RoleCID|Rest], Rslt) ->
  RoleID = generate_role_id(User),
  NewRole = roles:role_init(User, RoleID, RoleCID),
  RoleSummary = roles:get_role_summary(NewRole),
  NewUser = User#user{roles = Roles ++ [RoleSummary]},
  create_new_roles(NewUser, Rest, [NewRole|Rslt]).


%% 创建角色
create_new_role(#user{roles = Roles} = User, RoleCID) ->
  RoleID = generate_role_id(User),
  NewRole = roles:role_init(User, RoleID, RoleCID),
  RoleSummary = roles:get_role_summary(NewRole),
  NewUser = User#user{roles = Roles ++ [RoleSummary]},
  memcache:write_db(NewUser, NewRole),
  log4erl:info("users:create_new_role success user_id ~w role_id ~w cid ~w", 
    [User#user.uid, RoleID, RoleCID]),
  {success, roles:pack_role(NewRole)}.
  




