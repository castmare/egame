#! /bin/bash
# check PLT
dialyzer --plt_info > /dev/null
if [ $? -ne 0 ];then
  echo "build plt..."
  dialyzer --build_plt --apps erts kernel stdlib
fi
function usage(){
 echo "NAME: run dialyzer"
 echo "SYNOPSIS: sh run_dialyzer [source_dir [result_file]]"
 echo "source_dir default is src"
 echo "result_file default is dialyzer.result"
}
function analyse(){
  if [ ! -d $1 ];then
    echo "dir $1 not exist"
    exit 1
  fi
  PARAM=""
  DIRS=`find $1 -type d`
  for dir in $DIRS
    do
      PARAM+=" --src $dir"
    done
  dialyzer $PARAM -o $2
}
DEF_SOURCE_DIR=src
DEF_DIALYZER_RESULT=dialyzer.result
if [ $# -eq 0 ];then
  analyse $DEF_SOURCE_DIR $DEF_DIALYZER_RESULT
elif [ $# -eq 1 ];then
  if [ $1 == "-h" ];then
    usage
  else
    analyse $1 $DEF_DIALYZER_RESULT
  fi
elif [ $# -eq 2 ];then
  analyse $1 $2
else
  usage
fi
