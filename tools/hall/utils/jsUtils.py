#!/usr/bin/python
# encoding=utf-8

import os
import json
import plistlib
import shutil
import re
import string

import excopy
import utils

from logUtils import raise_known_error, KnownError, Logging

ALL_TYPES = ['web', 'minigame', 'native']

#web不过滤文件
WEB_IGNORE_FILE_LIST = ["WebGameCtrl.js", "native_hall_common.plist", "native_hall_common.png"]

def isRightType(filePath, moduleType=None):
    if not moduleType or moduleType == "web":
        return True

    for t in ALL_TYPES:
        # 所有平台都需要添加 minigame 资源与代码
        if t == moduleType or t == 'minigame':
            continue

        pattern1 = r'.*/%s/' % t
        pattern2 = r'^%s/' % t
        if re.match(pattern1, filePath) or re.match(pattern1, filePath):
            return False

    return True

#过滤文件(目前只有web平台)
def isFilterFile(moduleType, fileName):
    if moduleType != "web":
        return False

    #web忽略文件
    if isIgnoreFile(fileName, WEB_IGNORE_FILE_LIST):
        return False

    #web平台过滤native文件
    if string.find(fileName,"\\native\\") !=-1:
        return True

    return False

#过滤忽略文件
def isIgnoreFile(fileName, ignoreFileList):
    for key in ignoreFileList:
        if string.find(fileName, key) !=-1:
            return True

    return False

def seekFiles(rootPath, config, dirname, moduleType):
    fileList = []
    preposition = config.get("preposition", [])
    postposition = config.get("postposition", [])

    excludeList = []
    if moduleType == "native":
        excludeList = config.get("exclude_native", [])

    if moduleType == "web":
        excludeList = config.get("exclude_web", [])

    for jsFile in preposition:
        if isRightType(jsFile, moduleType):
            fileList.append(jsFile)

    for parent, dirnames, filenames in os.walk(dirname):
        for filename in filenames:
            basename, ext = os.path.splitext(filename)
            if ext != '.js':
                continue

            rel_path = os.path.relpath(parent, rootPath)
            jsfile = os.path.join(rel_path, filename)
            #过滤指定js文件
            if isFilterFile(moduleType, jsfile):
                continue

            jsfile = jsfile.replace("\\", "/")

            passed = False
            if (jsfile in preposition) or (jsfile in postposition):
                passed = True
            elif filename.startswith("manifest_") or filename.endswith('_manifest.js'):
                passed = True
            elif not isRightType(jsfile, moduleType):
                passed = True
            else:
                for excludeFile in excludeList:
                    if excludeFile == jsfile:
                        passed = True
                        break
            if not passed:
                fileList.append(jsfile)

    for postJsFile in postposition:
        if isRightType(postJsFile, moduleType):
            fileList.append(postJsFile)

    return fileList

def refreshProjectJson(rootPath, modules, isCleanJSList, moduleType=None):
    if modules == None or len(modules) < 1:
        raise_known_error("modules 参数错误，需要传入模块名称如：src/libs games/common games/pk_common等")
    projectFilePath = os.path.join(rootPath, "project.json")
    projectData = utils.parse_json(projectFilePath)
    if not isCleanJSList:
        fileList = []
        for module in modules:
            configPath = os.path.join(rootPath, module, "wxpack.json")
            if os.path.exists(configPath):
                commonConfig = utils.parse_json(configPath)
            else:
                commonConfig = {}
            dirname = os.path.join(rootPath, module)
            fileList += seekFiles(rootPath, commonConfig, dirname, moduleType)
        projectData['jsList'] = []
        projectData['jsList'] = fileList[:]
    else:
        projectData['jsList'] = []
    # save project.json
    projectFile = open(projectFilePath, 'w+')
    try:
        str = json.dumps(projectData, indent=4, separators=(',', ':'))
        projectFile.write(str)
    finally:
        projectFile.close()

def createManifestFile(rootPath, module, moduleType=None, specVer=None):
    if os.path.exists(rootPath) == False:
        raise_known_error("root path is not found ===" + rootPath, KnownError.ERROR_PATH_NOT_FOUND)
    configPath = os.path.join(rootPath, module, "wxpack.json")
    if not os.path.exists(configPath):
        raise_known_error("%s not found" % configPath, KnownError.ERROR_PATH_NOT_FOUND)
    commonConfig = utils.parse_json(configPath)

    if specVer is None:
        if not commonConfig.has_key('version'):
            raise_known_error("%s/wxpack.json 必须包含version参数" % module)
        version = commonConfig.get("version", 1)
    else:
        version = specVer

    dirname = os.path.join(rootPath, module)
    basename = os.path.basename(dirname)
    filename = os.path.join(dirname, "manifest_" + basename + ".js")

    if os.path.exists(dirname) == False:
        raise_known_error("module path is not exists ===" + module, KnownError.ERROR_PATH_NOT_FOUND)
    codeStr = "function manifest_"
    codeStr += basename
    codeStr += "() {\nreturn "
    data = {}
    data["version"] = version
    fileList = seekFiles(rootPath, commonConfig, dirname, moduleType)
    data["jslist"] = fileList
    str = json.dumps(data, indent=4, separators=(',', ': '))
    codeStr += str
    codeStr += "}\n"
    codeStr += 'manifest_'
    codeStr += basename
    codeStr += "()"
    file_object = open(filename, 'w+')
    try:
        file_object.write(codeStr)
    finally:
        file_object.close()

    # 生成 plist 资源映射表
    refreshAssetManager(rootPath, module)

def copyResourceByJsModule(rootPath, modulePath, desPath, moduleType=None):
    if not os.path.exists(modulePath):
        raise_known_error("module path not found %s" % modulePath, KnownError.ERROR_PATH_NOT_FOUND)
    if not os.path.exists(desPath):
        raise_known_error("desPath path not found %s" % desPath, KnownError.ERROR_PATH_NOT_FOUND)
    # 拷贝所有非 js 文件
    excludes = ["TexturePackerRes", "preload_res"]
    for parent, dirnames, filenames in os.walk(modulePath):
        for filename in filenames:
            if filename[:1] == ".":
                continue
            if filename[-3:] == ".js":
                continue
            isExclude = False
            for exclude in excludes:
                if exclude in parent:
                    isExclude = True
                    break
            if isExclude:
                continue

            srcfile = os.path.join(parent, filename)
            relpath = os.path.relpath(srcfile, rootPath)
            #过滤指定资源文件
            if isFilterFile(moduleType, srcfile):
                continue
            reldirname = os.path.dirname(relpath)
            desdirname = os.path.join(desPath, reldirname)
            desfile = os.path.join(desdirname, filename)
            print("copy %s to %s" % (srcfile, desfile))

            if not os.path.exists(desdirname):
                os.makedirs(desdirname)
            shutil.copyfile(srcfile, desfile)

# 根据资源路径生成对应模块资源文件映射
# rootPath: 项目根路径
# module: 模块名 "src/libs"
def refreshAssetManager(rootPath, module):
    # 遍历资源文件夹
    assetMap = {}
    resList = [module]
    if module == "src/libs":
        resList.append("src/res")

    assetFilePath = os.path.join(rootPath, "%s/plistResMap.json" % module)

    for path in resList:
        resPath = os.path.join(rootPath, path)
        print "resPath===" + resPath
        if not os.path.isdir(resPath):
            raise_known_error("refreshAssetManager 传入的资源文件夹路径不存在 path=" + resPath)

        for parent, dirnames, filenames in os.walk(resPath):
            for filename in filenames:
                if filename[-6:] == ".plist":
                    plistPath = os.path.join(parent, filename)
                    relPath = os.path.relpath(plistPath, rootPath)
                    relPath = relPath.replace("\\", "/")    # pc 上针对斜杆做替换，避免识别不到正确的文件路径
                    print "plist===" + plistPath
                    # 读取 plist
                    plistMap = plistlib.readPlist(plistPath)
                    frameList = plistMap.get("frames", None)
                    if (frameList != None):
                        for key in frameList:
                            if key[-4:] == ".png":
                                assetMap[key] = relPath
    with open(assetFilePath, "w+") as f:
        json.dump(assetMap, f)