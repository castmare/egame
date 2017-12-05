-include("settings.hrl").

-define(INIT_HERO, [1]).

-define(INIT_TASK, [#usertask{line = 40,
                              id = 1,
                              status = working, 
                              task_progress_type = completestage,
                              task_progress_id = 4,
                              task_target = 0}]).

-define(INIT_TAVERN, [#tavern_record{type = green
                     , limit = #limit_record{type = ?LR_TARVERN
                     , cur_point = 0
                     , max_point = 5
                     , use_cd = 600
                     , last_restore_time = tools:timenow()
                     , restore_type = by_time
                     , restore_hour = 0}}

                   , #tavern_record{type = blue
                     , limit = #limit_record{type = ?LR_TARVERN
                     , cur_point = 0
                     , max_point = 1
                     , use_cd = 0
                     , last_restore_time = tools:timenow()
                     , restore_type = by_interval
                     , restore_interval = 24*60*60}}
                     
                   , #tavern_record{type = purple
                     , limit = #limit_record{type = ?LR_TARVERN
                     , cur_point = 0
                     , max_point = 1
                     , use_cd = 0
                     , last_restore_time = tools:timenow()
                     , restore_type = by_interval
                     , restore_interval = 48*60*60}}
                    ]).

-define(INIT_LADDER, #ladder{limit = #limit_record{type = ?LR_LADDER_BAT
                              , cur_point = 0
                              , max_point = tools:get_ladder_arena_limit()
                              , use_cd = 600
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                           , buy_limit = #limit_record{type = ?LR_LADDER_BUY
                              , cur_point = 0
                              , max_point = vip_level
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                           , lineup = []
                           , share_limit = #limit_record{type = ?LR_LADDER_SHARE
                              , cur_point = 0
                              , max_point = 5
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                           , fight_limit = #limit_record{type = ?LR_LADDER_FIGHT
                              , cur_point = 0
                              , max_point = 10
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_interval
                              , restore_interval = 30*60}}).

-define(INIT_ARENA, #arena{limit = #limit_record{type = ?LR_ARENA_BAT
                              , cur_point = 0
                              , max_point = tools:get_ladder_arena_limit()
                              , use_cd = 600
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                        , buy_limit = #limit_record{type = ?LR_ARENA_BUY
                              , cur_point = 0
                              , max_point = vip_level
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                              , lineup1 = []
                              , lineup2 = []
                              , lineup3 = []
                              , last_reward_time = 0
                              , acc_honour_point = 0
                            }).

-define(INIT_LEGEND_ARENA, #legend_arena{
   limit = #limit_record{
      type = ?LR_LEGEND_ARENA_BAT, 
      cur_point = 0, 
      max_point = legend_arena_config:get_battle_cnt(), 
      use_cd = legend_arena_config:get_battle_cd(), 
      last_restore_time = tools:timenow(), 
      restore_type = by_time, 
      restore_hour = 5
   },
   buy_limit = #limit_record{
      type = ?LR_LEGEND_ARENA_BUY, 
      cur_point = 0, 
      max_point = vip_level, 
      use_cd = 0, 
      last_restore_time = tools:timenow(), 
      restore_type = by_time, 
      restore_hour = 5
   }
}).


-define(INIT_TBC, #tbc{limit = #limit_record{type = ?LR_TBC
                              , cur_point = 0
                              , max_point = vip_level
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                           , gs_history = queue:new()
                           , mode = normal
                           , best_stage = 0
                           , mode_history = []
                           , rush_guides = []          % 远征推荐英雄列表
                           , energy_bean = 0
                           , weekly_bonus = #tbc_weekly_bonus{}
                           , hell_box = #tbc_hell_box{}
                           }).

-define(INIT_WORLD_CHAT, #limit_record{type = ?LR_WORLD_CHAT
                              , cur_point = 0
                              , max_point = ?CHAT_DEFAULT_TIMES
                              , use_cd = 10
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5
                           }).


-define(INIT_CHAT_ROOM_CHAT, #limit_record{type = ?LR_GROUP_CHAT
                              , cur_point = 0
                              , max_point = 10000000
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5
                           }).

-define(INIT_GUILD_CHAT, #limit_record{type = ?LR_GUILD_CHAT
                              , cur_point = 0
                              , max_point = 10000000
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5
                           }).

-define(INIT_PERSONAL_CHAT, #limit_record{type = ?LR_PERSONAL_CHAT
                              , cur_point = 0
                              , max_point = 10000000
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5
                           }).

-define(INIT_GUILD, #user_guild{hire_limit = #limit_record{type = ?LR_GUILD_HIRE
                              , cur_point = 0
                              , max_point = 1
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                           , worship_limit = #limit_record{type = ?LR_GUILD_WORSHIP
                              , cur_point = 0
                              , max_point = vip_level
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                           , worship_target_limit = #limit_record{type = ?LR_GUILD_WORSHIP_TAR
                              , cur_point = 0
                              , max_point = 1
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                              }).

-define(INIT_EXCAV, #user_excav{search_limit = #limit_record{type = ?LR_EXCAV_SEARCH
                              , cur_point = 0
                              , max_point = 1000000
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_time
                              , restore_hour = 5}
                              }).

-define(ANCIENT_REMAIN, #user_remain{create_time = 0
                                   , gs = 0
                                   , invite_history = []
                                   , state = vanish
                                   , guild_id = 0}).
-define(INIT_INVITATION, #invitation{be_invited_code = undefined
                              , invitation_code = undefined
                              , invited_players = []
                              , invitor = undefined}).
-define(INIT_FASHION, #fashion{current_clothes = 0, clothes = []}).

-define(INIT_DREAMLAND, #dreamland{stageinfo_time = tools:timenow(), countinfo_time=tools:timenow()}).

-define(INIT_WARSCHOOL, #warschool{level = 1
                           , levelup_endtime = 0
                           , research_skill=#warschool_research_skill{}
                           , books = []
                           }).
-define(INIT_EQUIP_FORGE,#equip_forge{}).

-define(INIT_MIGRATE, #migrate{limit = #limit_record{type = ?LR_MIGRATE
                              , cur_point = 0
                              , max_point = vip_level
                              , use_cd = 7*24*60*60
                              , last_restore_time = tools:timenow()
                              , restore_type = by_days
                              , restore_interval = 15}
                              }).

-define(INIT_MENTORSHIP, #mentorship{limit = #limit_record{type = ?LR_MENTORSHIP
                              , cur_point = 0
                              , max_point = 1
                              , use_cd = 0
                              , last_restore_time = tools:timenow()
                              , restore_type = by_interval
                              , restore_interval = 3*24*60*60
                              }}).

-define(INIT_OFFLINE_QUEST, #offline_quest{
                              diamond_limit = #diamond_limit{groups = [], last_change = 0},
                              bread = #bread{current = 50, last_change = tools:timenow()}
                              }).
-define(INIT_COOK, #cook{
                    talent = common,
                    exps   = [],
                    fuel   = #cook_fuel{amount = 100, buy_times = 0},
                    bag    = #cook_bag{}}).

-define(INIT_NEWSOUL, #newsoul{}).