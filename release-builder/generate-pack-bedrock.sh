#!/usr/bin/env bash

lt_version=$(jq .repos.base.version ../assets/bedrock.json | tr -d '"')

mkdir ./{repos,zips}

cd ./zips
rm -rf *
cd ../repos
rm -rf *

function make_pack() {
    if [ $1 == "base" ]; then
        echo $1
        filename=$(jq .repos.$1.filename ../../assets/bedrock.json | tr -d '"' | sed s/{version}/$lt_version/g | sed s/.mcpack//g)
        url=$(jq .repos.$1.url ../../assets/bedrock.json | tr -d '"')
        folder=$(echo $url | awk -F '/' '{print  $NF}')
        git clone $url
        cd ./$folder
        zip -rq9 ../../zips/"$filename-source.zip" *
        for file in `find -name '*.png'`
        do
            oxipng -o 6 -i 1 --strip safe $file --fix
        done
        zip -rq9 ../../zips/"$filename.mcpack" *
        cd ..
    elif [ $1 == addons ]; then
        echo $1 $2
        filename=$(jq .repos.$1[$2].filename ../../assets/bedrock.json | tr -d '"' | sed s/{version}/$lt_version/g | sed s/.mcpack//g)
        url=$(jq .repos.$1[$2].url ../../assets/bedrock.json | tr -d '"')
        folder=$(echo $url | awk -F '/' '{print  $NF}')
        git clone $url
        cd ./$folder
        zip -rq9 ../../zips/"$filename-source.zip" *
        for file in `find -name '*.png'`
        do
            oxipng -o 6 -i 1 --strip safe $file --fix
        done
        zip -rq9 ../../zips/"$filename.mcpack" *
        cd ..
    fi
}

make_pack "base"

addon_count=$(jq '.repos.addons | length' ../../assets/bedrock.json)

for ((addon = 0 ; addon <= addon_count - 1 ; addon++)); do
    make_pack "addons" $addon
done



