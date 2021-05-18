# -*- coding:UTF-8 -*-
#重新命名creator导出的res-import 目录下的资源文件
import os
import time
import utils
import random
import shutil
import json
import hashlib

import excopy
import encrytPng
import pngyu
import encrytJS
import coufuseResImport
import re

def removeClass(inputStr, clsName):
    p1 = '%s:\[.*?\}\],' % clsName
    p2 = '\"%s\",' % clsName
    pattern1  = re.compile(p1)
    tb = pattern1.findall(inputStr)
    l = len(tb)
    ret = re.sub(p1, '', inputStr)
    if l > 0:
        #print(tb[0])
        ret = re.sub(p2, '', ret)
        print('remove class: ' + clsName)
    else:
        print('can not find class', clsName)
    #print(ret)
    return ret

# 移除其他渠道的代码
def start(path, pf, currentChannel):
    # creator 生成的png映射表
    json_file = utils.flat_path(os.path.join(os.path.dirname(__file__), "channel_class.json"))
    print(json_file)
    f = open(json_file)
    jsons = json.load(f)
    f.close()
    #
    # f = open(path, 'rU')
    # content = f.read()
    # f.close()
    # for key in jsons:
    #     curPf = jsons[key]
    #     idx = curPf.find('_base')
    #     if idx != -1:
    #         curPf = curPf.replace('_base', '')
    #         if curPf != pf:
    #             content = removeClass(content, key)
    #     elif curPf != pf:
    #         content = removeClass(content, key)
    #     elif currentChannel != key:
    #         content = removeClass(content, key)
    #
    # f = open(path, 'wb')
    # f.writelines(content)
    # f.close()