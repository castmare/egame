#!/bin/sh
source ./deploy_cfg.ini
source ./get_cookie.ini

cookie=`get_cookie_name ${SVR_ID}`
erl -name etop@${LOCAL_IP} -hidden -s etop -s erlang halt -output text -node ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP} -setcookie ${cookie} -tracing off $@

####### lines #######
# Number of lines (processes) to display. 
# Value: integer() 
# Default: 10
####### interval #######
# The time interval (in seconds) between each update of the display. 
# Value: integer() 
# Default: 5
####### accumulate #######
# If true the execution time and reductions are accumulated. 
# Value: boolean() 
# Default: false
####### sort #######
# Identifies what information to sort by. 
# Value: runtime | reductions | memory | msg_q 
# Default: runtime (reductions if tracing=off)
