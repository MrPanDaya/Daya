# -*- coding:UTF-8 -*-
#该脚本用于压缩png图片 使用python3以上版本解释执行
import os
import time
import utils
import json
import re

from logUtils import Logging
from logUtils import raise_known_error
from logUtils import KnownError

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
    Logging.debug_msg("Total image count : %d. Compress count : %d" % (count, compress_count))

def needCompress(key):
    global PngMap
    # folder, basename = os.path.split(key)
    # pattern = r"([a-f0-9\-]+)\.[a-f0-9\-]{5}\.png"
    # m = re.match(pattern, basename)
    # if not m:
    #     Logging.warn_msg("The file path %s is not in right format." % key)
    #     return False
    #
    # checkKey = os.path.join(folder, "%s.png" % m.group(1))
    checkKey = key.replace('\\', '/')
    if PngMap.has_key(checkKey):
        srcPath = os.path.dirname(PngMap[checkKey])
        srcPath = srcPath.lstrip("db://assets/")
        base, ext = os.path.splitext(srcPath)
        if (ext == ".plist"):
            srcPath = base + '.png'

        # 检查不需要压缩的文件夹
        unDirs = Uncompress.get('dirs', [])
        for d in unDirs:
            if srcPath.startswith(d):
                Logging.warn_msg("%s in uncompress dir : %s" % (key, d))
                return False

        # 检查不需要压缩的文件
        unFiles = Uncompress.get('files', [])
        for f in unFiles:
            if srcPath == f:
                Logging.warn_msg("%s is uncompress file %s" % (key, f))
                return False

        Logging.debug_msg("Compress image : %s (%s)" % (key, srcPath))
        return True
    else:
        Logging.warn_msg("%s is not found in PngMap.json" % checkKey)
        return False

def start(absDir, pngMapPath):#遍历当前目录以及递归的子目录，找到所有的png图片
    global ext_path
    global PngMap
    global Uncompress

    Logging.debug_msg("----- Handle image compress begin. ----")
    if utils.os_is_win32():
        ext_path = utils.flat_path(os.path.join(os.path.dirname(__file__), "../../png_quant/bin/win32/pngquant"))
    else:
        ext_path = utils.flat_path(os.path.join(os.path.dirname(__file__), "../../png_quant/bin/mac/pngquant"))
    Logging.debug_msg("Tool path : " + ext_path)
    absDir = utils.flat_path(absDir)
    Logging.debug_msg("Handle images path : " + absDir)
    Logging.debug_msg("PngMap.json path : " + pngMapPath)
    try:
        f = open(pngMapPath)
        PngMap = json.load(f)
        f.close()
    except:
        pass

    #print(PngMap['res/raw-assets/6a/6a811324-26ea-4e78-b238-4509160c26ad.png'])
    json_file = utils.flat_path(os.path.join(os.path.dirname(__file__), "uncompress.json"))
    Logging.debug_msg("uncompress.json path :" + json_file)
    try:
        f = open(json_file)
        Uncompress = json.load(f)
        f.close()
    except:
        pass

    traverseDir(absDir)

    Logging.debug_msg("----- Handle image compress end. ----")
