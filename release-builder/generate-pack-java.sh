#!/usr/bin/env bash

lt_version=$(jq .repos.base.version ../assets/java.json | tr -d '"')
pack_format=$(jq .repos.base.pack_format ../assets/java.json | tr -d '"')
filename=$(jq .templates.filename ../assets/java.json | tr -d '"' | sed s/{version}/$lt_version/g | sed s/{format}/$pack_format/g | sed s/-{ids}.zip//g)

if [ -f ./urls.txt ]; then
    rm urls.txt
fi

grep 'github.com/Love-and-Tolerance' ../assets/java.json | while read -r line ; do
    url=$(echo $line | sed 's/"url": "//g' | tr -d '",')
    printf "$line\n"
    echo $url >> urls.txt
done

cat urls.txt | uniq >> newurls.txt
mv newurls.txt urls.txt

mkdir ./{repos,zips}

cd ./zips
rm -rf *
cd ../repos
rm -rf *

while read url; do
    git clone "$url"
    git fetch --all
    git pull --all
    name=$(echo $url | awk -F '/' '{print  $NF}')
    cd $name
    branches=$(echo $(git branch --all | grep 'remote' | grep -v " -> ") | tr " " "\n")
    for branch in $branches
    do
        branchname=$(echo $branch | sed 's/remotes\/origin\///g')
        git switch "$branchname" --discard-changes
        zip -rq9 ../../zips/"$filename-$name-$branchname-source.zip" *
        for file in `find -name '*.png'`
        do
            oxipng -o 6 -i 1 --strip safe $file --fix
        done
        zip -rq9 ../../zips/"$filename-$name-$branchname.zip" *
    done
    cd ..
done < ../urls.txt

