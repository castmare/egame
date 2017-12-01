#!/bin/sh
source ./deploy_cfg.ini
source ./get_cookie.ini

cookie=`get_cookie_name ${SVR_ID}`
3rd/entop/entop ${SVR_TYPE}_${SVR_ID}@${LOCAL_IP} -name entop@${LOCAL_IP} -setcookie ${cookie}

# Commands when running entop:

# [1-N]: Sort on column number 1 through N. Starts with first column (1) and up to N where N is the last column.

# r: Toggles the sorting order from ascending to descending and vice versa.

# q: Quits entop and return to the shell.

# Ctrl-C: Same as 'q'.

# '<' and '>': Moves the sorting column to the left or right respectively (these are the lower/greater-than-tags; not arrow keys).
