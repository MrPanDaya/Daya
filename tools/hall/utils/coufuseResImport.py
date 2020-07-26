# -*- coding:UTF-8 -*-
#重新命名creator导出的res 目录下的资源文件
import os
import time
import random
import shutil
import json

originKey = '0123456789abcdef'
newKey = 'fedcba9876543210'
keyMap = {}

def calcOtherName(scrName):
    idx = -1
    ret = ''
    for i in scrName:
        idx += 1
        if idx < 2:
            ret += i
        elif i == '-':
            ret += i
        else:
            ret += keyMap[i]
    print(scrName + ' : ' + ret)
    return ret

def start(absDir):#遍历当前目录以及递归的子目录，找到所有的png图片
    idx = 0
    for s in originKey:
        keyMap[s] = newKey[idx]
        idx += 1
    print(keyMap)

    for (parent, dirs, files) in os.walk(absDir):
        for f in files:
            filename = os.path.splitext(f)[0]
            if len(filename) != 36:
                continue
            newFilename = calcOtherName(filename)
            full_path = os.path.join(parent, f)
            newFullPath = full_path.replace(filename, newFilename)
            os.rename(full_path, newFullPath)

#------------------- 主函数-------------------------#
# start_clock = time.clock()
# start('./res')
# end_clock = time.clock()
# time = (end_clock - start_clock)*1000

    
    