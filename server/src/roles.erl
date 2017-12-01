%%%-------------------------------------------------------------------
%%% @doc 角色数据处理模块
%%%-------------------------------------------------------------------
-module(roles).
-author(lifan).

%%% API
-compile(export_all).

-include("record.hrl").
-include("settings.hrl").
-include("msg/common_pb.hrl").

%%%===================================================================
%%% API
%%%===================================================================

%% 初始化角色
role_init(#user{uid = UserID}, RoleID, RoleCID) ->
  Timenow = tools:timenow(),
  ElfID = get_efl_id(RoleCID),
  Role = #role{
    rid = RoleID,
    uid = UserID,
    eid = ElfID,
    create_time = Timenow,
    name_card = #name_card{
       name = ?DEFAULT_NAME,
       last_set_time = 0
     },
    level = 1,
    exp = 0
	},
  Role.

%% 打包成msg结构
pack_role(RoleID) when is_integer(RoleID) ->
  Role = memcache:get_role(RoleID),
  pack_role(Role);
   
pack_role(#role{name_card = NameCard} = Role) ->
  #role_st{
    role_id = Role#role.rid,
    elf_id = Role#role.eid,
    name_card = #name_card_st{
      name = NameCard#name_card.name,
      last_set_time = NameCard#name_card.last_set_time
     },
    level = Role#role.level,
    exp = Role#role.exp
  }.
    
 
%%%===================================================================
%%% Support
%%%===================================================================

get_efl_id(CID) -> CID.
