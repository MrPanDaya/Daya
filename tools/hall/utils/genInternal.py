# -*- coding:UTF-8 -*-
#重新命名creator导出的res-import 目录下的资源文件
import os
import time
import utils
import random
import shutil
import json
import hashlib

def moveFileTo(s1, t1):
    if not os.path.exists(s1):
        return
    dir = os.path.dirname(t1)
    if not os.path.exists(dir):
        os.makedirs(dir)
    shutil.copy(s1, t1)

def start(src, dst):#遍历当前目录以及递归的子目录，找到所有的js jsc图片
    json_file = utils.flat_path(os.path.join(os.path.dirname(__file__), "interlnal.json"))
    ExcludeDirs = {}
    try:
        f = open(json_file)
        ExcludeDirs = json.load(f)
        f.close()
    except:
        pass
    #print(ExcludeDirs)
    for key in (ExcludeDirs):
        print(key)
        f1 = utils.flat_path(os.path.join(src, key))
        f2 = utils.flat_path(os.path.join(dst, key.replace('/', '-')))
        #print(f1, f2)
        moveFileTo(f1, f2)