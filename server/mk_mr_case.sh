#!/bin/bash

if [ $# -ne 1 ]; then
  echo "usage: ./make_mr_case.sh mapreduce_case/filename"
  exit 0
fi

erlc -o ebin -W $1
