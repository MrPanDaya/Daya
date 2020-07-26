
# -*- coding:UTF-8 -*-
#该脚本用于加密png图片 使用python3以上版本解释执行
import os
import time
import random
CUR_DIR = os.getcwd()
print("cur_dir:",CUR_DIR)
#CUR_DIR = 'C:\\Users\\chenguanzhou\\Desktop'

filenum = 0
 
def isJS(absPath):#判断是否是js
    fileExt = os.path.splitext(absPath)[1]
    return fileExt == ".js"

def isJSC(absPath):#判断是否是jsc
    fileExt = os.path.splitext(absPath)[1]
    return fileExt == ".jsc"
 
def preProcessPng(pngData):#预处理图片数据
    """
    剪掉png的signature(8bytes),IEND(12Bytes)
    :param pngData:
    :return:
    """
    assert type(pngData) == bytes
    lostHeadData = pngData[8:]
    iendData = lostHeadData[-12:]
    if isSame(_PNGIEND, iendData, 12):#防止Png已经进行过外部软件的压缩,丢掉了IEND
        return lostHeadData[:-12]
    else:
        return lostHeadData
 
def encryptionJS(fileData):#加密操作 ascii占一个字节
    """
    加密png数据
    :param fileData:{bytes}预处理后的png数据
    :param key:{str}秘钥
    :return:{bytes}加密后的数据
    """
    klen= 4
    kindex = 0
    fileData = bytearray(fileData)
    _KEY = [0x32, 0x41, 0x07, 0x99] #随机密匙
    for i, v in enumerate(_KEY):
        _KEY[i] = random.randint(0, 255)

    for i,v in enumerate(fileData):
        if kindex >= klen:
            kindex = 0
        fileData[i] = v ^ _KEY[kindex]#加密
        kindex = kindex + 1
    _ENCRYSIG = [0xFF, 0x02, 0x43, 0x04, 0x55, 0x06]
    return bytearray(_ENCRYSIG) + bytearray(_KEY) + fileData

def encryptionJSC(fileData):#加密操作 ascii占一个字节
    """
    加密png数据
    :param fileData:{bytes}预处理后的png数据
    :param key:{str}秘钥
    :return:{bytes}加密后的数据
    """
    klen= 4
    kindex = 0
    fileData = bytearray(fileData)
    _KEY = [0x32, 0x41, 0x07, 0x99] #随机密匙
    for i, v in enumerate(_KEY):
        _KEY[i] = random.randint(0, 255)
    for i,v in enumerate(fileData):
        if kindex >= klen:
            kindex = 0
        fileData[i] = v ^ _KEY[kindex]#加密
        kindex = kindex + 1
    _ENCRYSIG = [0xFF, 0x02, 0x13, 0x34, 0x05, 0x56]
    return bytearray(_ENCRYSIG) + bytearray(_KEY) + fileData
 
#处理js
def processJS(filePath):
    global filenum
    fileData = None
    with open(filePath,'rb') as file:
        fileData = encryptionJS(file.read())
    os.remove(filePath)
    newPath = filePath.replace('.js', '.wlk')
    with open(newPath,'wb') as file: #覆盖新文件
        file.write(fileData)
    filenum = filenum + 1

#处理jsc
def processJSC(filePath):
    global filenum
    fileData = None
    with open(filePath,'rb') as file:
        fileData = encryptionJSC(file.read())
    os.remove(filePath)
    newPath = filePath.replace('.jsc', '.wlk')
    with open(newPath,'wb') as file: #覆盖新文件
        file.write(fileData)
    filenum = filenum + 1
 
 
 
def traverseDir(absDir):#遍历当前目录以及递归的子目录，找到所有的js jsc图片
    assert (os.path.isdir(absDir) and os.path.isabs(absDir))
    dirName = absDir
    for fileName in os.listdir(absDir):
        absFileName = os.path.join(dirName,fileName)
        if os.path.isdir(absFileName):#递归查找文件夹
            #print("absFileName:",absFileName)
            traverseDir(absFileName)
        elif isJS(absFileName):
            print("isJS:",absFileName)
            processJS(absFileName)
        elif isJSC(absFileName):
            print("isJSC:",absFileName)
            processJSC(absFileName)
        else:
            pass
 
 
 #------------------- 主函数-------------------------#
# start_clock = time.clock()
# filenum = 0
# #traverseDir(os.path.join(CUR_DIR,"png2"))
# traverseDir(CUR_DIR)
# end_clock = time.clock()
# time = (end_clock - start_clock)*1000
# print("encrypt %d Png Pictures"%filenum)
