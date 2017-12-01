#!/bin/sh

source ./deploy_cfg.ini
source ./get_cookie.ini

purge_type="soft_purge"
cookie=`get_cookie_name ${SVR_ID}`
node="${SVR_TYPE}_${SVR_ID}@${LOCAL_IP}"
erl_call_param="-name $node -c $cookie -r -a"

help()
{
    echo ""
    echo "Commands to hot udpate module:"
    echo "  mod_name       Hot update a module in ./src directory"
    echo "  file_path      Hot update a module that file path is file_path"
    echo "  dir_name       Hot update all modules in dir_name"
    echo "  multi_type     Can Combined use, multi mod_name|file_path|dir_name"
    echo ""
    echo "Optional parameters:"
    echo "  -help          Show help"
    echo "  -f             Purge code by code:purge. default code:soft_purge"
    echo "  -test          Compile file add -DTEST param"
    echo "  -export_all    Compile file add +export_all param"
    echo ""
}

compile_and_load_file()
{
  file_path=$1

  mod_name=`basename $file_path | cut -d '.' -f 1`

  erlc $param -o ebin +nowarn_export_all -W -I src/ $file_path
  erl_call $erl_call_param "code $purge_type [$mod_name]" 
  erl_call $erl_call_param "code load_file [$mod_name]"

  echo ""
}

update_code()
{
  file_name=$1

  if [[ -d $file_name ]]; then
    file_path=`find $file_name| grep .erl$`
  else
    file_path=`find src/| grep -w $file_name| grep .erl$`
    if [[ $file_path == "" ]]; then
      echo "error: \"$file_name\" isn't a filename"
      exit
    fi
  fi

  for var in $file_path
  do
    compile_and_load_file $var
  done
}

if [[ $# -lt 1 ]]; then
  help
  exit
fi

for var in $@
do
  case $var in
    -help) help
      ;;
    -test) param="$param -DTEST"
      ;;
    -export_all) param="$param +export_all"
      ;;
    -f) purge_type="purge"
      ;;
    *) all_file="$all_file $var"
  esac
done

for var in $all_file
do
  update_code $var
done
