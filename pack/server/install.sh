#!/bin/bash

source ./tools/publish/region_cfg.ini

CLIENT_DIR=../Client/assets
#CLIENT_DIR_TW=../../d-game/Client/assets.taiwan
#CLIENT_DIR_SEA=../../d-game/Client/assets.southeastasia
#CLIENT_DIR_VN=../../d-game/Client/assets.vietnam
#CLIENT_DIR_KR=../../d-game/Client/assets.korea
BTCHECK_DIR=./bt_check

REGION=cn

# 1. get region
while getopts "r:" arg
do
  case $arg in
    r)  
      REGION=$(get_region $OPTARG) ;;
    ?)  
      echo "unkonw argument"; exit 1 ;;
   esac
done
echo -e "\033[32mregion is: ${REGION} \033[0m"

# 2. fetch csv res
p4 sync -f $CLIENT_DIR/csv/...
p4 sync -f $CLIENT_DIR/lua/...
p4 sync -f $CLIENT_DIR/lib/...
p4 sync -f $CLIENT_DIR/btcheck-config.lua

#if [ ${REGION} == tw ]; then 
#  p4 sync $CLIENT_DIR_TW/...; 
#  echo "p4 pull taiwan assets."; 
#fi
#if [ ${REGION} == sea ]; then 
#  p4 sync $CLIENT_DIR_SEA/...;
#  echo "p4 pull southeast assets."; 
#fi
#if [ ${REGION} == vn ]; then
#  p4 sync $CLIENT_DIR_VN/...;
#  echo "p4 pull vietnam assets.";
#fi
#if [ ${REGION} == kr ]; then
#  p4 sync $CLIENT_DIR_KR/...;
#  echo "p4 pull korea assets.";
#fi

# 3. mkdir
if [ ! -d logs ]; then mkdir logs; fi
if [ ! -d csv ]; then mkdir csv; fi
if [ ! -d bt_check ]; then mkdir bt_check; fi

# 4. clean battle check files
rm -rf ./csv/*
rm -rf ${BTCHECK_DIR}/lib
rm -rf ${BTCHECK_DIR}/lua
rm -rf ${BTCHECK_DIR}/btcheck-config.lua

# 5. cp battle check files
cp -f ${CLIENT_DIR}/csv/*.csv ./csv/
#if [ ${REGION} == tw ]; then 
#  cp -f ${CLIENT_DIR_TW}/csv/*.csv ./csv/; 
#  echo "merge taiwan csv"; 
#fi
#
#if [ ${REGION} == sea ]; then 
#  cp -f ${CLIENT_DIR_SEA}/csv/*.csv ./csv/;
#  echo "merge sea csv"; 
#fi
#
#if [ ${REGION} == vn ]; then
#  cp -f ${CLIENT_DIR_VN}/csv/*.csv ./csv/;
#  echo "merge vietnam csv";
#fi

#if [ ${REGION} == kr ]; then
#  cp -f ${CLIENT_DIR_KR}/csv/*.csv ./csv/;
#  echo "merge korea csv";
#fi

cp -rf ${CLIENT_DIR}/lib/ ${BTCHECK_DIR}/lib/
cp -rf ${CLIENT_DIR}/lua/ ${BTCHECK_DIR}/lua/
cp -rf ${CLIENT_DIR}/btcheck-config.lua ${BTCHECK_DIR}

# 6. set file attrubites
chmod +x ${BTCHECK_DIR}/lua/run-server.bat
dos2unix ${BTCHECK_DIR}/lua/run-server.bat

# 7. set soft links
if [ ! -s ${BTCHECK_DIR}/csv ]; then
  ln -s ../csv ${BTCHECK_DIR}/csv
fi

if [ ! -s ${BTCHECK_DIR}/csproto ]; then
  ln -s ../msg ${BTCHECK_DIR}/csproto
fi

# 8. deploy
./deploy.sh
