#!/bin/bash
source ./common_cfg.ini
source ./deploy_cfg.ini
source ./get_cookie.ini

cookie_name=`get_cookie_name ${SVR_ID}`

# deploy
./deploy.sh

#3. starting erlang service, simple deploy server everytime
echo "starting egame_app ..."

EBIN_DIR="./ebin"
EBIN_DIR+=" 3rd/erlang_protobuffs/ebin/"
EBIN_DIR+=" 3rd/log4erl/ebin/"
EBIN_DIR+=" 3rd/lager/ebin/"
EBIN_DIR+=" 3rd/lager/deps/goldrush/ebin"

# build args
ERL_PARAM="+P 300000"
ERL_PARAM+=" -smp enable"
ERL_PARAM+=" +K true"
ERL_PARAM+=" -pa ${EBIN_DIR}"
ERL_PARAM+=" -name ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP}"
ERL_PARAM+=" -setcookie ${cookie_name}"
ERL_PARAM+=" -mnesia dir '../mnesia_dir'"
ERL_PARAM+=" -env ERL_MAX_PORTS 102400"
ERL_PARAM+=" -env ERL_MAX_ETS_TABLES 20000"

if [[ $1 == "fg" ]]; then
  ERL_PARAM+=" -detached"
fi

# erl ${ERL_PARAM} -s egame_app
erl ${ERL_PARAM} -s egame_app



