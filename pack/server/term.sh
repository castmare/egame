#!/bin/bash
source ./deploy_cfg.ini
source ./get_cookie.ini

cookie=`get_cookie_name ${SVR_ID}`
erl -hidden -name term_`date +%Y%m%d%H%M%S`@${LOCAL_IP} -setcookie ${cookie} -remsh ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP}
