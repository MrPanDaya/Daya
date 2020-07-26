# -*- coding:UTF-8 -*-
#该脚本用于压缩png图片 使用python3以上版本解释执行
import os
import time
import utils
import json

PngMap = {}
Uncompress = {}
ext_path = ""

def isPNG(absPath):#判断是否是PNG图片
    fileExt = os.path.splitext(absPath)[1]
    isPngExt = (fileExt == ".png" or fileExt == ".PNG")
    return isPngExt

#处理图片
def processPNG(filePath):
    cmd = ext_path + " --force --ext .png  " + filePath + " --speed 1"
    # print(cmd)
    os.system(cmd)

def traverseDir(absDir):#遍历当前目录以及递归的子目录，找到所有的png图片
    # test = "db://assets/resources/common/textures/bl_vip_10.png/bl_vip_10"
    # print(test.find("/common/"))
    count = 0
    compress_count = 0
    for (parent, dirs, files) in os.walk(absDir):
            for f in files:
                full_path = os.path.join(parent, f)
                rel_path = os.path.relpath(full_path, absDir)
                rel_path = rel_path.replace("\\", "/")
                ext = os.path.splitext(rel_path)[1]
                if ext == ".png":
                    count += 1
                    if needCompress(rel_path):
                        compress_count += 1
                        processPNG(full_path)
    print(count, compress_count)

def needCompress(key):
    global PngMap
    if key in PngMap:
        srcPath = PngMap[key]
        #print(srcPath)
        for i, val in enumerate(Uncompress):
            if srcPath.find(val) != -1:
                return False
        print("compress png: " + key + " " + srcPath)
        return True
    else:
        return False

def start(absDir):#遍历当前目录以及递归的子目录，找到所有的png图片
    global ext_path
    global PngMap
    global Uncompress
    ext_path = utils.flat_path(os.path.join(os.path.dirname(__file__), "../../png_quant/bin/win32/pngquant"))
    print(ext_path)
    absDir = utils.flat_path(absDir)
    print(absDir)
    json_file = utils.flat_path(os.path.join(os.path.dirname(__file__), "PngMap.json"))
    print(json_file)
    try:
        f = open(json_file)
        PngMap = json.load(f)
        f.close()
    except:
        pass

    #print(PngMap['res/raw-assets/6a/6a811324-26ea-4e78-b238-4509160c26ad.png'])
    json_file = utils.flat_path(os.path.join(os.path.dirname(__file__), "uncompress.json"))
    print(json_file)
    try:
        f = open(json_file)
        Uncompress = json.load(f)['uncompress_dir']
        f.close()
    except:
        pass
    print(Uncompress)
    traverseDir(absDir)
