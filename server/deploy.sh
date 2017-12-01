#!/bin/bash
source ./common_cfg.ini
source ./deploy_cfg.ini

GAME_DB_NAME=egame_game_db_${SVR_ID}
OSS_DB_NAME=egame_oss_db_${SVR_ID}
USER=`whoami`

WS_MAIN_PORT=$(($MAIN_PORT+1))

# 1. replace dgame.app.template
SED_ENV=" s/'?debug'/${DEBUG}/g;"
SED_ENV+=" s/'?version'/${VERSION}/g;"
SED_ENV+=" s/'?main_port'/${MAIN_PORT}/g;"
SED_ENV+=" s/'?ws_main_port'/${WS_MAIN_PORT}/g;"
SED_ENV+=" s/'?svr_type'/${SVR_TYPE}/g;"
SED_ENV+=" s/'?svr_id'/${SVR_ID}/g;"
SED_ENV+=" s/'?svr_name'/${SVR_NAME}/g;"
SED_ENV+=" s/'?mnesia_dir'/${MNESIA_DIR}/g;"
SED_ENV+=" s/'?user'/${USER}/g;"
SED_ENV+=" s/'?game_db_server'/${GAME_DB_SERVER}/g;"
SED_ENV+=" s/'?game_db_name'/${GAME_DB_NAME}/g;"
SED_ENV+=" s/'?oss_db_server'/${OSS_DB_SERVER}/g;"
SED_ENV+=" s/'?oss_db_name'/${OSS_DB_NAME}/g;"
SED_ENV+=" s/'?svr_ip'/${LOCAL_IP}/g;"

sed -i -e "${SED_ENV}" ./ebin/egame.app
