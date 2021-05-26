# -*- coding:UTF-8 -*-
# 重新命名creator导出的res-import 目录下的资源文件
import sys
import os

sys.path.append(os.path.normpath(os.path.join(os.path.dirname(__file__), '../utils')))

import time
import datetime
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

ConfigMap = {}

def moveFileTo(s1, t1):
    dir = os.path.dirname(t1)
    if not os.path.exists(dir):
        os.makedirs(dir)
    shutil.copy(s1, t1)


# 拷贝res目录
def copyRes(srcDir, dstDir, include_exts=None, exclude_exts=None):
    dstPath = dstDir + '/'
    count = 0
    mainPackageCount = 0
    for (parent, dirs, files) in os.walk(srcDir + "/assets"):
        for f in files:
            if f == '.DS_Store':
                continue
            full_path = os.path.join(parent, f)
            rel_path = os.path.relpath(full_path, srcDir)
            rel_path = rel_path.replace("\\", "/")
            moveFileTo(full_path, dstPath + rel_path)
            mainPackageCount += 1
    print("count:%s" % count)
    print("mainPackageCount:%s" % mainPackageCount)


# 拷贝res/raw-assets目录
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
            moveFileTo(full_path, dstPath + rel_path)
            mainPackageCount += 1
    print("count:%s" % count)
    print("mainPackageCount:%s" % mainPackageCount)


def match_include_rules(file_name, include_exts):
    splitext = os.path.splitext(file_name)
    ext = splitext[1]

    if not include_exts:
        return True

    if ext in include_exts:
        return True

    for rule in include_exts:
        if re.match(rule, file_name):
            return True

    return False


def match_exclude_rules(filename, rel_path, rules):
    if rules is None:
        return False

    if filename in rules:
        return True

    for rule in rules:
        if re.match(rule, rel_path):
            return True

    return False


def copySrc(srcDir, dstPath, include_exts=None, excludes=None):
    for (parent, dirs, files) in os.walk(srcDir):
        for file_name in files:
            splitext = os.path.splitext(file_name)
            filename = splitext[0]

            included = match_include_rules(file_name, include_exts)
            if not included:
                continue

            full_path = os.path.join(parent, file_name)
            rel_path = os.path.relpath(full_path, srcDir)
            rel_path = rel_path.replace("\\", "/")

            exclude = match_exclude_rules(filename, rel_path, excludes)
            if exclude:
                continue

            moveFileTo(full_path, os.path.join(dstPath, rel_path))


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
    print("file_path:%s" % file_path)
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


def createZip(zipDir, dst, versionName, ts_str):
    tempPath = utils.flat_path(os.path.join(dst, ""))
    publishPath = utils.flat_path(os.path.join(dst, "../publish"))
    print("tempPath:%s" % tempPath)
    print("publishPath:%s" % publishPath)

    manifest = {}
    manifest["version"] = versionName
    manifest["packageUrl"] = ''
    manifest["remoteManifestUrl"] = ''
    manifest["remoteVersionUrl"] = ''
    manifest["searchPaths"] = []
    manifest["assets"] = {}

    assets = manifest["assets"]
    get_file_path_md5(tempPath, '/res', assets)

    # 创建project.manifest
    project_manifest = utils.flat_path(os.path.join(tempPath, 'project.manifest'))
    file_m = open(project_manifest, "wb")
    file_m.writelines(json.dumps(manifest))
    file_m.close()

    # 生成zip包
    out_dir = '%s/%s_%s/%s.zip' % (publishPath, versionName, ts_str, versionName)
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
            # print("rel_path: %s"%rel_path)
            f = open(full_path)
            data = json.load(f)
            f.close()
            if type(data) == typeMap:
                jsType = data.get('__type__')
                if data.get('type') == 'cc.Texture2D':
                    print('remove texture json: ' + full_path)
                    if os.path.exists(full_path):
                        os.remove(full_path)


def nop():
    pass

def isShaderJson(fullPath):
    f = open(fullPath)
    content = f.read()
    f.close()

    if content.find("cc.EffectAsset") > 0:
        print('%s is a shader json!' % fullPath)
        return True

    return False

def mergeJson(srcDir, dstDir, genPath):  # 合并json
    typeMap = type({})
    typeList = type([])
    spriteFrameTotal = 0
    audioClipTotal = 0
    spriteAtlasTotal = 0
    otherCount = 0

    listTotal = 0
    mergeTb_Single = {}
    total = 0
    walk_path = os.path.join(srcDir, 'assets')
    print(walk_path)
    maxSize = 5 * 1024

    pattern = re.compile(r'assets/.*/import/[0-9a-f]{2}/([0-9a-f-]+)\.[0-9a-f]{5}\.json')  # 查找数字
    for (parent, dirs, files) in os.walk(walk_path):
        for f in files:
            if f == '.DS_Store':
                continue
            if f.find("03062a345") != -1:
                nop()
            if parent.find("import") == -1:
                continue

            if parent.find("internal") != -1:
                continue

            total += 1
            full_path = os.path.join(parent, f)
            relPath = os.path.relpath(full_path, srcDir)
            rel_path = relPath.replace("\\", "/")
            tb = pattern.findall(rel_path)
            rel_path = tb[0]
            # print("rel_path: %s"%rel_path)
            f = open(full_path)
            data = json.load(f)
            f.close()
            content = json.dumps(data)
            if type(data) == typeMap:
                jsType = data.get('__type__')
                # if data.get('type') == 'cc.Texture2D':
                #     print("rel_path:%s" % rel_path)
                #     inter = utils.flat_path(os.path.join(dstDir, "../project/internal/"))
                #     moveFileTo(full_path, inter + '/' + rel_path + '.json')
                #     continue
                # el
                if jsType == 'cc.SpriteFrame':
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
                        # print('other: ' + rel_path)
                        otherCount += 1
                        mergeTb_Single[rel_path] = content
                        continue
            elif type(data) == typeList:
                size = os.path.getsize(full_path)
                if size < maxSize and (not isShaderJson(full_path)):
                    # print(rel_path, size)
                    mergeTb_Single[rel_path] = content
                    listTotal += 1
                    continue
            moveFileTo(full_path, dstDir + '/' + relPath)

    print("spriteFrameTotal:%s" % spriteFrameTotal)
    print("audioClipTotal:%s" % audioClipTotal)
    print("spriteAtlasTotal:%s" % spriteAtlasTotal)
    print("otherCount:%s" % otherCount)
    mapCount = spriteFrameTotal + audioClipTotal + spriteAtlasTotal + otherCount
    print('merge map count:', mapCount)

    tmp_str = json.dumps(mergeTb_Single)
    tmp_str = tmp_str.replace(' ', '')
    file_m = open(genPath, "wb")
    file_m.writelines(tmp_str)
    file_m.close()

    print("listTotal:%s" % listTotal)
    print("total:%s" % total)
    print('no merge count', total - mapCount - listTotal)

def modify_proj_cfg(filePath, projName, packArgs):
    f = open(filePath)
    info = json.load(f)
    f.close()

    info['appid'] = packArgs['wxid']
    info['projectname'] = projName

    f = open(filePath, 'w')
    json.dump(info, f, indent=2, ensure_ascii=False)
    f.close()

def udpateMergeJsonMD5(filePath, newName):
    print("+++++++++++++++++++++++++++")
    print(filePath)
    f3 = open(filePath)
    result = f3.read()
    f3.close()
    sdkRef = 'var mergeJsonMd5 = "%s"' % newName
    result = result.replace('var mergeJsonMd5 = "md5"', sdkRef)

    f2 = open(filePath, "w")
    f2.writelines(result)
    f2.close()

def start(version, srcDir, dstDir, packArgs):  # 遍历当前目录
    global ConfigMap

    print("srcDir:%s" % srcDir)
    print("dstDir:%s" % dstDir)
    if os.path.isdir(dstDir):
        time.sleep(0.01)
        shutil.rmtree(dstDir)
        time.sleep(0.01)

    dst_project_path = utils.flat_path(os.path.join(dstDir, "../project")) + '/'
    if os.path.isdir(dst_project_path):
        shutil.rmtree(dst_project_path)
    os.makedirs(dst_project_path)

    # 拷贝src目录
    copySrc(srcDir, dst_project_path, [".js"],  # build\wechatgame\src   >>>>  packConfig\minigame\wx\project
            ['manifest',
             'CfgPackage',
             'SubManifest'])

    path_src_internal = os.path.join(srcDir, "assets/internal")
    path_dst_internal = os.path.join(dst_project_path, "assets/internal")
    copySrc(path_src_internal, path_dst_internal)

    path_src_main = os.path.join(srcDir, "assets/main")
    path_dst_main = os.path.join(dst_project_path, "assets/main")
    copySrc(path_src_main, path_dst_main, [r"config\..*json"])

    # path = utils.flat_path(os.path.join(dstDir, "../project/src/project.js"))
    # shortProjectJS.start(path, 'minigame', packArgs['currentChannel'])

    flat_path = utils.flat_path(os.path.join(dstDir, "../project/internal/"))
    removeTextureJson(flat_path)
    # 拷贝res

    assetSrc = os.path.normpath(os.path.join(srcDir, "assets"))
    assetDst = os.path.normpath(os.path.join(dstDir, "assets"))
    mergeJsonMd5 = ""
    if 'mergeJson' in packArgs and packArgs['mergeJson']:
        copySrc(assetSrc, assetDst, None, [r".*\.js$", r".*\.js\.map$", r".*/import/[0-9a-f]{2}/.*\.json$"])
        # copyResRawAssets(srcDir, dstDir)

        out_put = dstDir + '/assets/MergeJson.json'
        configMapPath = os.path.join(srcDir, "ConfigMap.json")
        f = open(configMapPath)
        ConfigMap = json.load(f)
        f.close()

        mergeJson(srcDir, dstDir, out_put)
        mergeJsonMd5 = get_file_md5(out_put)  
    else:
        copySrc(assetSrc, assetDst, None, [r".*\.js$", r".*\.js\.map"])

    path_ = packArgs['mod_file_path']
    tmplt_name = "mini_tmplt"
    src_tmplt = os.path.normpath(os.path.join(path_, tmplt_name))
    copySrc(src_tmplt, dst_project_path)

    udpateMergeJsonMD5(dst_project_path + '/hooks.js', mergeJsonMd5)

    # 修改项目配置
    cfg_file = os.path.join(dst_project_path, 'project.config.json')
    proj_name = 'fishClient-' + os.path.basename(os.path.dirname(dstDir))
    modify_proj_cfg(cfg_file, proj_name, packArgs)

    # copy渠道相关的CfgPackage.js
    if packArgs['cfgPackagePath']:
        moveFileTo(packArgs['cfgPackagePath'], dst_project_path + 'src/assets/scripts/CfgPackage.js')

    # project 文件夹压缩备份
    ts_str = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d_%H%M%S')
    dst_proj_zip_path = utils.flat_path(os.path.join(os.path.dirname(dstDir), 'publish', '%s_%s' % (version, ts_str), 'project.zip'))
    utils.zip_folder(dst_project_path, dst_proj_zip_path)

    # 压缩png
    if packArgs['compressPng']:
        pngyu.start(os.path.join(dstDir, "assets"), os.path.join(srcDir, "PngMap.json"))

    zipDir = ''
    # 生产远端资源包和更新包
    createZip(zipDir, dstDir, version, ts_str)
    shutil.rmtree(dstDir)  # 删除临时目录
