#!/bin/bash
#usage: ./pack_version.sh [-r cn|tw] -v version

source ./tools/publish/region_cfg.ini

VERSION=noversion
REGION=cn

while getopts "r:v:" arg
do
  case $arg in
    r)
      REGION=$(get_region $OPTARG) ;;
    v)
      VERSION=$OPTARG ;;
    ?)
      echo "unkonw argument"; exit 1 ;;
   esac
done
echo -e "\033[32mregion is: ${REGION} \033[0m"

if [ ${VERSION} == noversion ]; then
  echo "right format: ./pack_version.sh [-r region] -v version";
  exit 1;
fi

VERSION=$VERSION.$REGION.tgz

SVR_VER=`pwd | rev | awk -F \/ '{print $2}' | rev`

p4 sync -f ...
./install.sh -r ${REGION}
path=$P4HOME/d-game/svr_versions
mkdir $path
out=$path/$VERSION
rm -f $out
svr_version=`echo $out | sed -e "s/.*v\(.*\..*\..*\..*\)\.svr\..\{2,6\}\.tgz/\1/" | cut -d '.' -f 4`
for i in ${REGION_ARRAY[@]}; do
  if [ `uname -s` == Linux ]; then
    sed -i "s/VERSION=.*/VERSION=${svr_version}/g" ./common_cfg/common_cfg.ini.online.$i
    sed -i "s/SVR_VERSION=.*/SVR_VERSION=${SVR_VER}/g" ./common_cfg/common_cfg.ini.online.$i
else
    sed -i out "s/VERSION=.*/VERSION=${svr_version}/g" ./common_cfg/common_cfg.ini.online.$i
    sed -i out "s/SVR_VERSION=.*/SVR_VERSION=${SVR_VER}/g" ./common_cfg/common_cfg.ini.online.$i
  fi
done

cd ..; tar -czvf $out server/; cd -

p4 add $out && p4 edit $out

