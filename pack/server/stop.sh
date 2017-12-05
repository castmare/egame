#!/bin/bash
source ./deploy_cfg.ini
source ./get_cookie.ini

cookie_name=`get_cookie_name ${SVR_ID}`

# 1. stop monitor
killall -q -u${USER} svr_mon.sh

# 2. stop gameserver
echo "stop gamesvr ..."
rslt=`erl_call -name ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP} -c ${cookie_name} -r -a 'egame_app stop' 2>&1`
if [ -z "$rslt" ]; then
  echo "egame stop success"
else
  echo "egame stop fail, reason $rslt"
fi
