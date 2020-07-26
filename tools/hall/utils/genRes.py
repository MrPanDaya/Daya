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

PngMap = {}
bExclude = True
bMiniGame = False

def moveFileTo(s1, t1):
    dir = os.path.dirname(t1)
    if not os.path.exists(dir):
        os.makedirs(dir)
    shutil.copy(s1, t1)

# 排除导入到包里的文件
def needExclude(key, ExcludeDirs):
    global PngMap
    if key in PngMap:
        srcPath = PngMap[key]
        for i, val in enumerate(ExcludeDirs):
            if srcPath.find(val) != -1:
                print("sub png: " + key + " " + srcPath)
                return True
        return False
    else:
        print("no find key: " + key)
        return False

#拷贝res目录
def copyRes(srcDir, dstDir):
    json_file = utils.flat_path(os.path.join(os.path.dirname(__file__), "packet_exclude_dir.json"))
    print(json_file)
    ExcludeDirs = {}
    try:
        f = open(json_file)
        ExcludeDirs = json.load(f)['exclude_dir']
        f.close()
    except:
        pass
    print(ExcludeDirs)

    dstPath = dstDir + '/mainPackage/'
    tempPath = dstDir + "/exclude/"
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
            if bExclude:
                if ext == ".mp3":
                    #print("sub mp3: " + full_path)
                    count += 1
                    moveFileTo(full_path, tempPath + rel_path)
                elif ext == ".png" and needExclude(rel_path, ExcludeDirs):
                    count += 1
                    moveFileTo(full_path, tempPath + rel_path)
                elif ext == ".jpg" and needExclude(rel_path, ExcludeDirs):
                    count += 1
                    moveFileTo(full_path, tempPath + rel_path)
                else:
                    moveFileTo(full_path, dstPath + rel_path)
                    mainPackageCount += 1
            else:
                moveFileTo(full_path, dstPath + rel_path)
                mainPackageCount += 1     
    print(count)
    print(mainPackageCount)

    # 删除databin的导出文件
    if not bMiniGame:
        databin = dstPath + "res/import/7b/7b850c9d-894f-4296-8c82-7108bd1e9064.json"
        print(databin)
        if os.path.exists(databin):
            print("----------------------------------remove databin: ")
            os.remove(databin)

def copySrc(srcDir, dstDir):
    tempPath = dstDir + '/mainPackage/'
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
            if bMiniGame:
                rel_path = rel_path.replace('/', '-')
                assetsObj[rel_path] = get_file_md5(full_path)
            else:
                assetsObj[rel_path] = {
                    'size' : os.path.getsize(full_path),
                    'md5' : get_file_md5(full_path)
                }
            count += 1
    print(file_path, count)

def get_file_path_md5_1(dst, file_path, assetsObj):
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

def createSubManifestJS(dst):
    assets = {}
    get_file_path_md5_1(dst + '/exclude', '/res', assets)
    # 写文件
    tmp_str = "(function() { window.SubManifestAssets = holdString})();"
    tmp_str = tmp_str.replace("holdString", json.dumps(assets))
    manifest_js_path = utils.flat_path(os.path.join(dst + '/mainPackage', 'src/assets/scripts/SubManifest.js'))
    file_m = open(manifest_js_path, "wb")
    file_m.writelines(tmp_str)
    file_m.close()

def createManifestJS(dst):
    assets = {}
    get_file_path_md5(dst, '/src', assets)
    get_file_path_md5(dst, '/res', assets)
    # 写文件
    tmp_str = "(function() { window.CustomManifestAssets = holdString})();"
    tmp_str = tmp_str.replace("holdString", json.dumps(assets))
    manifest_js_path = utils.flat_path(os.path.join(dst, 'src/assets/scripts/manifest.js'))
    file_m = open(manifest_js_path, "wb")
    file_m.writelines(tmp_str)
    file_m.close()

#jsb-adapter main.js cacert.pem 文件
def copyCreator(dst):
    tempPath = dst + '/mainPackage/'
    creatorPath = utils.flat_path(os.path.join(os.path.dirname(__file__), "../../native"))
    print(creatorPath)
    for (parent, dirs, files) in os.walk(creatorPath):
        for f in files:
            if f == '.DS_Store':
                continue
            full_path = os.path.join(parent, f)
            rel_path = os.path.relpath(full_path, creatorPath)
            rel_path = rel_path.replace('\\', '/')
            moveFileTo(full_path, tempPath + rel_path)

def createZip(zipDir, dst, versionName):
    tempPath = utils.flat_path(os.path.join(dst, "../temp"))
    publishPath = utils.flat_path(os.path.join(dst, "../publish"))
    print(tempPath)
    print(publishPath)
    #拷贝主包的资源生成为更新包
    if os.path.isdir(tempPath):
        time.sleep(0.01)
        shutil.rmtree(tempPath)
        time.sleep(0.01)
    #src目录
    mainPackageCfg = {
        'from': 'mainPackage/src',
        'to': 'src',
        'exclude': [
            '**/.DS_Store',
            '**/manifest.*',
        ]
    }
    excopy.copy_files_with_config(mainPackageCfg, dst, tempPath)
    #res目录
    mainPackageCfg = {
        'from': 'mainPackage/res',
        'to': 'res',
        'exclude': [
            '**/.DS_Store',
        ]
    }
    excopy.copy_files_with_config(mainPackageCfg, dst, tempPath)

    manifest = {}
    manifest["version"] = versionName
    manifest["packageUrl"] = ''
    manifest["remoteManifestUrl"] = ''
    manifest["remoteVersionUrl"] = ''
    manifest["searchPaths"] = []
    manifest["assets"] = {}

    assets = manifest["assets"]
    get_file_path_md5(tempPath, '/src', assets)
    get_file_path_md5(tempPath, '/res', assets)

    #创建project.manifest
    project_manifest = utils.flat_path(os.path.join(tempPath, 'project.manifest'))
    file_m = open(project_manifest, "wb")
    file_m.writelines(json.dumps(manifest))
    file_m.close()

    #创建version.manifest
    manifest["assets"] = {}
    version_manifest = utils.flat_path(os.path.join(tempPath, 'version.manifest'))
    file_m = open(version_manifest, "wb")
    file_m.writelines(json.dumps(manifest))
    file_m.close()

    #拷贝exclude目录
    if bExclude:
        excludePath = dst + '/exclude'
        for (parent, dirs, files) in os.walk(excludePath):
            for f in files:
                if f == '.DS_Store':
                    continue
                full_path = os.path.join(parent, f)
                rel_path = os.path.relpath(full_path, excludePath)
                rel_path = rel_path.replace('\\', '/')
                #print(rel_path)
                moveFileTo(full_path, tempPath + '/' + rel_path)
    if zipDir == '':
        zipDir = 'creator'
    #生成zip包
    out_dir = '%s/%s/%s.zip' % (publishPath, zipDir, versionName)
    utils.zip_folder(tempPath, out_dir)


def start(version, srcDir, dstDir, packArgs):#遍历当前目录
    print(srcDir)
    print(dstDir)
    global bExclude
    bExclude = packArgs['exclude']
    print(bExclude)
    global bMiniGame
    bMiniGame = packArgs['minigame']
    print('is minigame: ')
    print(bMiniGame)
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
    copyRes(srcDir, dstDir)

    #压缩png
    if packArgs['compressPng']:
        pngyu.start(dstDir + '/mainPackage')
        if bExclude:
            pngyu.start(dstDir + '/exclude')

    #加密png
    if packArgs['encrytPng']:
        encrytPng.traverseDir(dstDir)

    #拷贝src目录
    copySrc(srcDir, dstDir)

    #生成子包exclude md5信息集合到主包
    if bExclude:
        createSubManifestJS(dstDir)

    #copy creator
    copyCreator(dstDir)

    #copy渠道相关的CfgPackage.js native.js
    if packArgs['cfgPackagePath']:
        moveFileTo(packArgs['cfgPackagePath'], dstDir + '/mainPackage/src/assets/scripts/CfgPackage.js')
    if packArgs['nativePath']:
        moveFileTo(packArgs['nativePath'], dstDir + '/mainPackage/native.js')

    #加密js jsc
    if packArgs['encrytJS']:
        encrytJS.traverseDir(dstDir + '/mainPackage')

    if packArgs['confuseResImport']:
        coufuseResImport.start(dstDir + '/mainPackage/res')
        #替换自定义key的cocos-jsb文件
        scrJsbPath = utils.flat_path(os.path.join(os.path.dirname(__file__), "../../cocos/cocos2d-jsb.jsc"))
        moveFileTo(scrJsbPath, dstDir + '/mainPackage/src/cocos2d-jsb.jsc')

    #生成主包manifest.js
    if not bMiniGame:
        createManifestJS(dstDir + '/mainPackage')

    #加密manifest.js
    if packArgs['encrytJS']:
        encrytJS.traverseDir(dstDir + '/mainPackage')

    zipDir = ''
    if packArgs['zipDir']:
        zipDir = packArgs['zipDir']
    #生产远端资源包和更新包
    createZip(zipDir, dstDir, version)
