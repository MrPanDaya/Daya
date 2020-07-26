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

PngMap = {}

def moveFileTo(s1, t1):
    dir = os.path.dirname(t1)
    if not os.path.exists(dir):
        os.makedirs(dir)
    shutil.copy(s1, t1)

#拷贝res目录
def copyRes(srcDir, dstDir):
    dstPath = dstDir + '/'
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

#拷贝res/raw-assets目录
def copyResRawAssets(srcDir, dstDir):
    dstPath = dstDir + '/'
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
    dstPath = utils.flat_path(os.path.join(dstDir, "../project")) + '/'
    for (parent, dirs, files) in os.walk(srcDir + "/src"):
        for f in files:
            filename = os.path.splitext(f)[0]
            if filename == 'manifest' or filename == 'CfgPackage' or filename == 'SubManifest':
                continue
            full_path = os.path.join(parent, f)
            rel_path = os.path.relpath(full_path, srcDir)
            rel_path = rel_path.replace("\\", "/")
            ext = os.path.splitext(rel_path)[1]
            if ext == ".js" or ext == ".jsc":
                print(rel_path)
                moveFileTo(full_path, dstPath + rel_path)

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
            rel_path = rel_path.replace('\\', '-')
            assetsObj[rel_path] = get_file_md5(full_path)
            count += 1
    print(file_path, count)

def createZip(zipDir, dst, versionName):
    tempPath = utils.flat_path(os.path.join(dst, ""))
    publishPath = utils.flat_path(os.path.join(dst, "../publish"))
    print(tempPath)
    print(publishPath)

    manifest = {}
    manifest["version"] = versionName
    manifest["packageUrl"] = ''
    manifest["remoteManifestUrl"] = ''
    manifest["remoteVersionUrl"] = ''
    manifest["searchPaths"] = []
    manifest["assets"] = {}

    assets = manifest["assets"]
    get_file_path_md5(tempPath, '/res', assets)

    #创建project.manifest
    project_manifest = utils.flat_path(os.path.join(tempPath, 'project.manifest'))
    file_m = open(project_manifest, "wb")
    file_m.writelines(json.dumps(manifest))
    file_m.close()

    #生成zip包
    out_dir = '%s/%s.zip' % (publishPath, versionName)
    utils.zip_folder(tempPath, out_dir)

# 移除旧版的导出的texture2d.json
def removeTextureJson(srcDir):
    typeMap = type({})
    for (parent, dirs, files) in os.walk(srcDir):
        for f in files:
            if f == '.DS_Store':
                continue
            ext = os.path.splitext(f)[1]
            if ext != '.json':
                continue
            full_path = os.path.join(parent, f)
            #print(rel_path)
            f = open(full_path)
            data = json.load(f)
            f.close()
            if type(data) == typeMap:
                jsType = data.get('__type__')
                if data.get('type') == 'cc.Texture2D':
                    print('remove texture json: ' + full_path)
                    if os.path.exists(full_path):
                        os.remove(full_path)

def mergeJson(srcDir, dstDir, genPath):#合并json
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
    maxSize = 5 * 1024

    pattern = re.compile(r'res.{11}(.*).json')   # 查找数字
    for (parent, dirs, files) in os.walk(srcDir + '/res/import'):
        for f in files:
            if f == '.DS_Store':
                continue
            total += 1
            full_path = os.path.join(parent, f)
            relPath = os.path.relpath(full_path, srcDir)
            rel_path = relPath.replace("\\", "/")
            tb = pattern.findall(rel_path)
            rel_path = tb[0]
            #print(rel_path)
            f = open(full_path)
            data = json.load(f)
            f.close()
            content = json.dumps(data)
            if type(data) == typeMap:
                jsType = data.get('__type__')
                if data.get('type') == 'cc.Texture2D':
                    print(rel_path)
                    inter = utils.flat_path(os.path.join(dstDir, "../project/internal/"))
                    moveFileTo(full_path, inter + '/' + rel_path + '.json')
                    continue
                elif jsType == 'cc.SpriteFrame':
                    spriteFrameTotal += 1
                    mergeTb_Single[rel_path] = content
                    continue
                elif jsType == 'cc.AudioClip':
                    audioClipTotal += 1
                    mergeTb_Single[rel_path] = content
                    continue
                elif jsType == 'cc.SpriteAtlas':
                    spriteAtlasTotal += 1
                    mergeTb_Single[rel_path] = content
                    continue
                elif jsType:
                    size = os.path.getsize(full_path)
                    if size < maxSize:
                        #print('other: ' + rel_path)
                        otherCount += 1
                        mergeTb_Single[rel_path] = content
                        continue
            elif type(data) == typeList:
                size = os.path.getsize(full_path)
                if size < maxSize:
                    #print(rel_path, size)
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
    
    tmp_str = json.dumps(mergeTb_Single)
    tmp_str = tmp_str.replace(' ', '')
    file_m = open(genPath, "wb")
    file_m.writelines(tmp_str)
    file_m.close()

    print(listTotal)
    print(total)
    print('no merge count', total - mapCount - listTotal)


def start(version, srcDir, dstDir, packArgs):#遍历当前目录
    # removeClass('--------------,AndroidXiaomi:[function(t,e,i){}],--------------', 'AndroidXiaomi')
    # if True:
    #     return
    print(srcDir)
    print(dstDir)
    if os.path.isdir(dstDir):
        time.sleep(0.01)
        shutil.rmtree(dstDir)
        time.sleep(0.01)
    global PngMap
    # creator 生成的png映射表
    json_file = utils.flat_path(os.path.join(os.path.dirname(__file__), "PngMap.json"))
    print(json_file)
    try:
        f = open(json_file)
        PngMap = json.load(f)
        f.close()
    except:
        pass
    #拷贝src目录
    copySrc(srcDir, dstDir)
    shortProjectJS.start(utils.flat_path(os.path.join(dstDir, "../project/src/project.js")), 'minigame', packArgs['currentChannel'])

    removeTextureJson(utils.flat_path(os.path.join(dstDir, "../project/internal/")))
    #拷贝res
    if packArgs['mergeJson']:
        copyResRawAssets(srcDir, dstDir)
        mergeJson(srcDir, dstDir, dstDir + '/res/MergeJson.json')
    else:
        copyRes(srcDir, dstDir)
    #压缩png
    if packArgs['compressPng']:
        pngyu.start(dstDir)

    #copy渠道相关的CfgPackage.js
    if packArgs['cfgPackagePath']:
        dstPath = utils.flat_path(os.path.join(dstDir, "../project")) + '/'
        moveFileTo(packArgs['cfgPackagePath'], dstPath + 'src/assets/scripts/CfgPackage.js')

    zipDir = ''
    #生产远端资源包和更新包
    createZip(zipDir, dstDir, version)
