#!/bin/bash

# Dataset retrieved from https://data.cityofchicago.org/Transportation/Divvy-Bicycle-Stations-Historical/eq45-8inv
INPUT_FILE="datasets/Divvy_Bicycle_Stations_-_Historical.csv"
OUTPUT_FILE="datasets/chicago_docks.csv"

# This script parses the whole Chicago dataset and extracts only relevant information (i.e. specific year interval)
# Expected arguments:
# -f: from year
# -t: to year
while getopts f:t: opts; do
   case ${opts} in
      f) FROM_VAL=${OPTARG} ;;
      t) TO_VAL=${OPTARG} ;;
   esac
done

awk -F, -v FROM=$FROM_VAL -v TO=$TO_VAL '{
    split($2, t, " ");
    split(t[1], d, "/");
    if (d[3] >= FROM && d[3] <= TO) {
        print $0
    }
}' $INPUT_FILE > $OUTPUT_FILE
