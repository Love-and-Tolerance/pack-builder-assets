#!/usr/bin/env bash

shopt -s globstar
oxipng -o 6 -i 1 --strip safe .temp/repos/*/{,assets/**/}*.png --fix -q
