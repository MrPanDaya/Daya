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
import shortProjectJS
import re
import mergeJson

PngMap = {}

def moveFileTo(s1, t1):
    dir = os.path.dirname(t1)
    if not os.path.exists(dir):
        os.makedirs(dir)
    shutil.copy(s1, t1)

#拷贝res目录
def copyRes(srcDir, dstDir):
    ExcludeDirs = {}
    print(ExcludeDirs)

    dstPath = dstDir + '/'
    tempPath = dstDir + "/"
    count = 0
    mainPackageCount = 0
    for (parent, dirs, files) in os.walk(srcDir + "/res"):
        for f in files:
            if f == '.DS_Store':
                continue
            full_path = os.path.join(parent, f)
            rel_path = os.path.relpath(full_path, srcDir)
            rel_path = rel_path.replace("\\", "/")
            ext = os.path.splitext(rel_path)[1]
            moveFileTo(full_path, dstPath + rel_path)
            mainPackageCount += 1      
    print(count)
    print(mainPackageCount)

#拷贝res目录
def copyResRawAssets(srcDir, dstDir):
    ExcludeDirs = {}
    print(ExcludeDirs)

    dstPath = dstDir + '/'
    tempPath = dstDir + "/"
    count = 0
    mainPackageCount = 0
    for (parent, dirs, files) in os.walk(srcDir + "/res/raw-assets"):
        for f in files:
            if f == '.DS_Store':
                continue
            full_path = os.path.join(parent, f)
            rel_path = os.path.relpath(full_path, srcDir)
            rel_path = rel_path.replace("\\", "/")
            ext = os.path.splitext(rel_path)[1]
            moveFileTo(full_path, dstPath + rel_path)
            mainPackageCount += 1      
    print(count)
    print(mainPackageCount)

def copySrc(srcDir, dstDir):
    tempPath = dstDir + '/'
    for (parent, dirs, files) in os.walk(srcDir + "/src"):
        for f in files:
            filename = os.path.splitext(f)[0]
            if filename == 'manifest' or filename == 'CfgPackage' or filename == 'SubManifest':
                continue
            full_path = os.path.join(parent, f)
            rel_path = os.path.relpath(full_path, srcDir)
            rel_path = rel_path.replace("\\", "/")
            ext = os.path.splitext(rel_path)[1]
            if ext == ".js":
                print(rel_path)
                moveFileTo(full_path, tempPath + rel_path)

# 计算文件的MD5
def get_file_md5(file_path):
    basename, ext = os.path.splitext(file_path)
    if ext == '.js' or ext == '.plist' or ext == '.fsh' or ext == '.vsh':
        # shaders, lua 和 plist 文件使用 rU 方式读取，保证不受换行符影响
        f = open(file_path, 'rU')
    else:
        # 其他文件使用 rb 方式读取
        f = open(file_path, 'rb')
    content = f.read()
    f.close()
    return hashlib.md5(content).hexdigest()

def get_file_path_md5(dst, file_path, assetsObj):
    print(file_path)
    file_path = dst + file_path
    count = 0
    for (parent, dirs, files) in os.walk(file_path):
        for f in files:
            if f == '.DS_Store':
                continue
            full_path = os.path.join(parent, f)
            rel_path = os.path.relpath(full_path, dst)
            rel_path = rel_path.replace('\\', '/')
            assetsObj[rel_path] = get_file_md5(full_path)
            count += 1
    print(file_path, count)

def createManifestJS(dst):
    assets = {}
    get_file_path_md5(dst, '/src', assets)
    get_file_path_md5(dst, '/res', assets)
    # 写文件
    tmp_str = "(function() { window.CustomManifestAssets = holdString})();"
    tmp_str = tmp_str.replace("holdString", json.dumps(assets))
    manifest_js_path = utils.flat_path(os.path.join(dst, 'manifest.js'))
    file_m = open(manifest_js_path, "wb")
    file_m.writelines(tmp_str)
    file_m.close()


def start(version, srcDir, dstDir, packArgs):#遍历当前目录
    print(srcDir)
    print(dstDir)
    global PngMap
    # creator 生成的png映射表
    json_file = utils.flat_path(os.path.join(os.path.dirname(__file__), "PngMap.json"))
    #print(json_file)
    try:
        f = open(json_file)
        PngMap = json.load(f)
        f.close()
    except:
        pass
    
    #拷贝src目录
    copySrc(srcDir, dstDir)
    shortProjectJS.start(utils.flat_path(os.path.join(dstDir, "src/project.js")), 'h5', packArgs['currentChannel'])

    #拷贝res
    if packArgs['mergeJson']:
        copyResRawAssets(srcDir, dstDir)
        mergeJson.start(srcDir, dstDir, dstDir + '/src/assets/scripts/MergeJson.js')
    else:
        copyRes(srcDir, dstDir)

    #压缩png
    if packArgs['compressPng']:
        pngyu.start(dstDir + '/')

    #copy渠道相关的CfgPackage.js native.js
    if packArgs['cfgPackagePath']:
        moveFileTo(packArgs['cfgPackagePath'], dstDir + '/src/assets/scripts/CfgPackage.js')
    createManifestJS(dstDir)
