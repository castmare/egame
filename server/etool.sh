#!/bin/sh
#
# PROVIDE: mankiw
#
source ./deploy_cfg.ini
source ./get_cookie.ini

cookie=`get_cookie_name ${SVR_ID}`
cmd=${1:-other}

case ${cmd} in

p)      
        echo "P = rpc:call('${SVR_TYPE}_${SVR_ID}@${LOCAL_IP}', erlang, whereis, [$2]),  rpc:call('internal_$USER@`hostname -s`', erlang, process_info, [P])."  | \
             erl -name process_state@$LOCAL_IP -setcookie ${cookie} -hidden
        ;;
memory)
        erl -name m_etop@${LOCAL_IP} -setcookie ${cookie} -output text -hidden -s etop -s erlang halt -node ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP} -lines 20 -sort memory -in300 val 5 -tracing off 
        ;;      
msg_q) 
	erl -name m_etop@${LOCAL_IP} -setcookie ${cookie} -output text -hidden -s etop -s erlang halt -node ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP} -lines 20 -sort msg_q -in300 val 5 -tracing off 
	;;
	
reductions) 
	erl -name m_etop@${LOCAL_IP} -setcookie ${cookie} -output text -hidden -s etop -s erlang halt -node ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP} -lines 20 -sort reductions  -in300 val 5 -tracing off 
	;;
	
runtime ) 
	erl -name m_etop@${LOCAL_IP} -setcookie ${cookie} -output text -hidden -s etop -s erlang halt -node ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP} -lines 20 -sort runtime   -in300 val 5 -tracing off 
	;;
exe)
        
        echo "rpc:call('${SVR_TYPE}_${SVR_ID}@${LOCAL_IP}', $2, $3, $4)."  | \
             erl -name exec_api@${LOCAL_IP} -setcookie ${cookie} -hidden
	;; 
ets)

        echo "rpc:call('${SVR_TYPE}_${SVR_ID}@${LOCAL_IP}', ets, info, [$2])."  | \
             erl -name ets_info@${LOCAL_IP} -setcookie ${cookie} -hidden
        ;; 
etss)

        echo "rpc:call('${SVR_TYPE}_${SVR_ID}@${LOCAL_IP}', ets, i, [])."  | \
             erl -name ets_infos@${LOCAL_IP} -setcookie ${cookie} -hidden
        ;;

help)   
	echo ""
        echo "./etool.sh p battlecheck         : process_state"
        echo "./etool.sh memory                : etop sort by memory"
        echo "./etool.sh msg_q                 : etop sort by msg queue size"
		echo "./etool.sh reductions            : etop sort by reductions"
        echo "./etool.sh runtime               : etop sort by runtime"
        echo "./etool.sh exe erlang time []    ：run erlang api"
        echo "./etool.sh ets check_buffer      : lookup ets table info"
        echo "./etool.sh etss                  : lookup all ets tables info"
	echo ""
	;;
*)
        T=`ps -eo etime,args|grep beam|grep $USER |grep -v grep |grep -v push_service| awk '{print $1}'` 
	if [ "$T" != "" ]; then
	echo "server is runing! (last $T)"
	else
	echo "server is down,"
	fi
        echo "Usage: $0 help"
        exit 1
esac
