# -*- coding:UTF-8 -*-
#重新命名creator导出的res-import 目录下的资源文件
import os
import time
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

def writeJson(path, tb):
    # 写文件
    tmp_str = "(function() { window.MergeJson = holdString})();"
    tmp_str = tmp_str.replace("holdString", json.dumps(tb))
    file_m = open(path, "wb")
    file_m.writelines(tmp_str)
    file_m.close()

def start(srcDir, dstDir, genPath):#遍历当前目录以及递归的子目录，找到所有的js jsc图片
    typeMap = type({})
    typeList = type([])
    spriteFrameTotal = 0
    audioClipTotal = 0
    spriteAtlasTotal = 0
    otherCount = 0

    listTotal = 0
    mergeTb_Single = {}
    total = 0
    print(srcDir + '/res/import')
    for (parent, dirs, files) in os.walk(srcDir + '/res/import'):
        for f in files:
            if f == '.DS_Store':
                continue
            total += 1
            full_path = os.path.join(parent, f)
            relPath = os.path.relpath(full_path, srcDir)
            rel_path = relPath.replace("\\", "/")
            #print(rel_path)
            f = open(full_path)
            data = json.load(f)
            f.close()
            content = json.dumps(data)
            if type(data) == typeMap:
                jsType = data.get('__type__')
                if jsType == 'cc.SpriteFrame':
                    #print(data.get('__type__'), rel_path)
                    spriteFrameTotal += 1
                    mergeTb_Single[rel_path] = content
                    continue
                elif jsType == 'cc.AudioClip':
                    #print(data.get('__type__'), rel_path)
                    audioClipTotal += 1
                    mergeTb_Single[rel_path] = content
                    continue
                elif jsType == 'cc.SpriteAtlas':
                    #print(data.get('__type__'), rel_path)
                    spriteAtlasTotal += 1
                    mergeTb_Single[rel_path] = content
                    continue
                elif jsType:
                    #print(data.get('__type__'), rel_path)
                    size = os.path.getsize(full_path)
                    if size < 7 * 1024:
                        print('other: ' + rel_path)
                        otherCount += 1
                        mergeTb_Single[rel_path] = content
                        continue
            elif type(data) == typeList:
                size = os.path.getsize(full_path)
                if size < 7 * 1024:
                    print(rel_path, size)
                    mergeTb_Single[rel_path] = content
                    listTotal += 1
                    continue
            moveFileTo(full_path, dstDir + '/' + relPath)
            
    print(spriteFrameTotal)
    print(audioClipTotal)
    print(spriteAtlasTotal)
    print(otherCount)
    mapCount = spriteFrameTotal + audioClipTotal + spriteAtlasTotal + otherCount
    print('merge map count:', mapCount)
    writeJson(genPath, mergeTb_Single)

    print(listTotal)
    print(total)
    print('no merge count', total - mapCount - listTotal)

#------------------- 主函数-------------------------#
# start_clock = time.clock()
# CUR_DIR = os.getcwd()
# start(CUR_DIR + '/res/import', CUR_DIR + '/test')
# end_clock = time.clock()
# time = (end_clock - start_clock)*1000
# print(time)