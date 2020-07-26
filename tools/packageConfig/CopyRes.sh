#!/usr/bin/env bash
SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)
python $SHELL_FOLDER/../package_tool/CopyMinGameRes/CopyMinGameRes.py -c $SHELL_FOLDER/config.json
