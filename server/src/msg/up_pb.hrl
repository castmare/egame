%% -*- coding: utf-8 -*-
%% Automatically generated, do not edit
%% Generated by gpb_compile version 4.0.1

-ifndef(up_pb).
-define(up_pb, true).

-define(up_pb_gpb_version, "4.0.1").

-ifndef('TEAM_MEMBER_ST_PB_H').
-define('TEAM_MEMBER_ST_PB_H', true).
-record(team_member_st,
        {user_id                :: non_neg_integer() | undefined, % = 1, 32 bits
         state                  :: 'inviting' | 'unready' | 'ready' | integer() | undefined, % = 2, enum team_member_state
         elf_id                 :: non_neg_integer() | undefined, % = 3, 32 bits
         name                   :: iolist() | undefined, % = 4
         level                  :: non_neg_integer() | undefined % = 5, 32 bits
        }).
-endif.

-ifndef('TEAM_INVITE_PB_H').
-define('TEAM_INVITE_PB_H', true).
-record(team_invite,
        {role_id                :: non_neg_integer() % = 1, 32 bits
        }).
-endif.

-ifndef('CANCEL_MATCH_PB_H').
-define('CANCEL_MATCH_PB_H', true).
-record(cancel_match,
        {
        }).
-endif.

-ifndef('START_MATCH_PB_H').
-define('START_MATCH_PB_H', true).
-record(start_match,
        {
        }).
-endif.

-ifndef('MATCH_REQ_PB_H').
-define('MATCH_REQ_PB_H', true).
-record(match_req,
        {start                  :: #start_match{} | undefined, % = 1
         cancel                 :: #cancel_match{} | undefined % = 2
        }).
-endif.

-ifndef('TEAM_LEAVE_PB_H').
-define('TEAM_LEAVE_PB_H', true).
-record(team_leave,
        {
        }).
-endif.

-ifndef('TEAM_STATE_PB_H').
-define('TEAM_STATE_PB_H', true).
-record(team_state,
        {state                  :: 'inviting' | 'unready' | 'ready' | integer() % = 1, enum team_member_state
        }).
-endif.

-ifndef('TEAM_REFUSE_PB_H').
-define('TEAM_REFUSE_PB_H', true).
-record(team_refuse,
        {
        }).
-endif.

-ifndef('TEAM_ACCEPT_PB_H').
-define('TEAM_ACCEPT_PB_H', true).
-record(team_accept,
        {
        }).
-endif.

-ifndef('TEAM_REQ_PB_H').
-define('TEAM_REQ_PB_H', true).
-record(team_req,
        {invite                 :: #team_invite{} | undefined, % = 1
         accept                 :: #team_accept{} | undefined, % = 2
         refuse                 :: #team_refuse{} | undefined, % = 3
         state                  :: #team_state{} | undefined, % = 4
         leave                  :: #team_leave{} | undefined % = 5
        }).
-endif.

-ifndef('SELECT_MAGIC_PB_H').
-define('SELECT_MAGIC_PB_H', true).
-record(select_magic,
        {magic_id               :: non_neg_integer() % = 1, 32 bits
        }).
-endif.

-ifndef('MAGIC_REQ_PB_H').
-define('MAGIC_REQ_PB_H', true).
-record(magic_req,
        {select                 :: #select_magic{} | undefined % = 1
        }).
-endif.

-ifndef('RTNOTIFY_CALLBACK_PB_H').
-define('RTNOTIFY_CALLBACK_PB_H', true).
-record(rtnotify_callback,
        {data                   :: iolist() | undefined % = 1
        }).
-endif.

-ifndef('RTNOTIFY_KEEPALIVE_PB_H').
-define('RTNOTIFY_KEEPALIVE_PB_H', true).
-record(rtnotify_keepalive,
        {time                   :: non_neg_integer() | undefined % = 1, 32 bits
        }).
-endif.

-ifndef('RTNOTIFY_REGISTER_PB_H').
-define('RTNOTIFY_REGISTER_PB_H', true).
-record(rtnotify_register,
        {user_id                :: non_neg_integer() | undefined % = 1, 32 bits
        }).
-endif.

-ifndef('RTNOTIFY_REQ_PB_H').
-define('RTNOTIFY_REQ_PB_H', true).
-record(rtnotify_req,
        {register               :: #rtnotify_register{} | undefined, % = 1
         keepalive              :: #rtnotify_keepalive{} | undefined, % = 2
         callback               :: #rtnotify_callback{} | undefined % = 3
        }).
-endif.

-ifndef('LOOKUP_ROLE_PB_H').
-define('LOOKUP_ROLE_PB_H', true).
-record(lookup_role,
        {
        }).
-endif.

-ifndef('SELECT_ROLE_PB_H').
-define('SELECT_ROLE_PB_H', true).
-record(select_role,
        {role_id                :: non_neg_integer() % = 1, 32 bits
        }).
-endif.

-ifndef('CREATE_ROLE_PB_H').
-define('CREATE_ROLE_PB_H', true).
-record(create_role,
        {role_cid               :: non_neg_integer() % = 1, 32 bits
        }).
-endif.

-ifndef('ROLE_REQ_PB_H').
-define('ROLE_REQ_PB_H', true).
-record(role_req,
        {create                 :: #create_role{} | undefined, % = 1
         select                 :: #select_role{} | undefined, % = 2
         lookup                 :: #lookup_role{} | undefined % = 3
        }).
-endif.

-ifndef('LOGIN_REQ_PB_H').
-define('LOGIN_REQ_PB_H', true).
-record(login_req,
        {device_id              :: iolist(),        % = 1
         version                :: iolist()         % = 2
        }).
-endif.

-ifndef('SDK_LOGIN_REQ_PB_H').
-define('SDK_LOGIN_REQ_PB_H', true).
-record(sdk_login_req,
        {
        }).
-endif.

-ifndef('UP_MSG_PB_H').
-define('UP_MSG_PB_H', true).
-record(up_msg,
        {sequence               :: non_neg_integer(), % = 1, 32 bits
         repeat                 :: boolean() | 0 | 1, % = 2
         user_id                :: non_neg_integer(), % = 3, 32 bits
         role_id                :: non_neg_integer(), % = 4, 32 bits
         sdk_login              :: #sdk_login_req{} | undefined, % = 5
         login                  :: #login_req{} | undefined, % = 6
         role                   :: #role_req{} | undefined, % = 7
         rtnotify               :: #rtnotify_req{} | undefined, % = 8
         magic                  :: #magic_req{} | undefined, % = 9
         team                   :: #team_req{} | undefined, % = 10
         match                  :: #match_req{} | undefined % = 11
        }).
-endif.

-ifndef('ROLE_SUMMARY_ST_PB_H').
-define('ROLE_SUMMARY_ST_PB_H', true).
-record(role_summary_st,
        {role_id                :: non_neg_integer() | undefined, % = 1, 32 bits
         elf_id                 :: non_neg_integer() | undefined, % = 2, 32 bits
         name                   :: iolist() | undefined, % = 3
         level                  :: non_neg_integer() | undefined % = 4, 32 bits
        }).
-endif.

-ifndef('BATTLE_TEAM_MEMBER_PB_H').
-define('BATTLE_TEAM_MEMBER_PB_H', true).
-record(battle_team_member,
        {role_id                :: non_neg_integer() | undefined, % = 1, 32 bits
         elf_id                 :: non_neg_integer() | undefined, % = 2, 32 bits
         name                   :: iolist() | undefined, % = 3
         level                  :: non_neg_integer() | undefined, % = 4, 32 bits
         team_id                :: non_neg_integer() | undefined % = 5, 32 bits
        }).
-endif.

-ifndef('BATTLE_TEAM_PB_H').
-define('BATTLE_TEAM_PB_H', true).
-record(battle_team,
        {members = []           :: [#battle_team_member{}] | undefined % = 1
        }).
-endif.

-ifndef('NAME_CARD_ST_PB_H').
-define('NAME_CARD_ST_PB_H', true).
-record(name_card_st,
        {name                   :: iolist() | undefined, % = 1
         last_set_time          :: non_neg_integer() | undefined % = 2, 32 bits
        }).
-endif.

-ifndef('TEAM_INFO_ST_PB_H').
-define('TEAM_INFO_ST_PB_H', true).
-record(team_info_st,
        {members = []           :: [#team_member_st{}] | undefined, % = 1
         leader_id              :: non_neg_integer() | undefined % = 2, 32 bits
        }).
-endif.

-ifndef('BATTLE_STAT_PB_H').
-define('BATTLE_STAT_PB_H', true).
-record(battle_stat,
        {
        }).
-endif.

-ifndef('ROLE_ST_PB_H').
-define('ROLE_ST_PB_H', true).
-record(role_st,
        {role_id                :: non_neg_integer() | undefined, % = 1, 32 bits
         elf_id                 :: non_neg_integer() | undefined, % = 2, 32 bits
         name_card              :: #name_card_st{} | undefined, % = 3
         level                  :: non_neg_integer() | undefined, % = 4, 32 bits
         exp                    :: non_neg_integer() | undefined % = 5, 32 bits
        }).
-endif.

-endif.
