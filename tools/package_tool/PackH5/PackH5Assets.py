#!/usr/bin/python
# encoding=utf-8
# 生成 apk 安装包

import os
import sys
import time
import datetime
import json
import shutil
import re
import traceback
import hashlib

from xml.dom import minidom

default_encoding = 'utf-8'
if sys.getdefaultencoding() != default_encoding:
    reload(sys)
    sys.setdefaultencoding(default_encoding)

sys.path.append(os.path.normpath(os.path.join(os.path.dirname(__file__), '../utils')))
import excopy
import jsUtils
import utils
from logUtils import Logging
from logUtils import raise_known_error
from logUtils import KnownError
import genResH5

channelPath = ''
publishPath = ''
currentChannel = ''

class PackAPK(object):
    def __init__(self, args):
        self.no_rollback = args.no_rollback
        self.no_build_creator = args.no_build_creator
        self.root_dir = os.path.dirname("./")

        # 检查Creator的安装目录跟工程目录
        self.creator_proj_parth = utils.flat_path(os.path.join(os.path.dirname(__file__), '../../../../'))
        self.proj_parth = utils.flat_path(os.path.join(os.path.dirname(__file__), '../../../../build/web-mobile'))
        print(self.creator_proj_parth)
        print(self.proj_parth)

    # creator项目的编译
    def build_creator_proj(self):
        Logging.debug_msg('开始构建creator项目')
        Logging.debug_msg(self.creator_proj_parth)
        creator_exe_path = utils.check_environment_variable('CREATOR_PATH')
        try:
            if sys.platform == "win32":
                utils.run_shell('cd /d %s & CocosCreator.exe --path %s --build "platform=web-mobile;debug=false;md5Cache=false"' % (creator_exe_path, self.creator_proj_parth))
            else:
                creator_path = '/Applications/CocosCreator.app/Contents/MacOS/'
                utils.run_shell('%sCocosCreator --path %s --build "platform=web-mobile;debug=false;md5Cache=false"' % (creator_path, self.creator_proj_parth))
        except Exception as e:
            raise_known_error("Creator 项目命令行构建失败 msg=%s" % str(e))
        Logging.debug_msg('构建creator项目完成')

    def moveFileTo(self, s1, t1):
        dir = os.path.dirname(t1)
        if not os.path.exists(dir):
            os.makedirs(dir)
        shutil.copy(s1, t1)
    
    def do_build(self, no_build_creator, no_gen_assets):
        channel = raw_input("build h5 channel: ")
        global channelPath
        channelPath = utils.flat_path('./channels/' + channel)
        if not os.path.isdir(channelPath):
            print("未知渠道")
            return
        print(channel)
        print(channelPath)
        bVconsole = raw_input("use vconsole 1 or 0: ")
        print(bVconsole)
        global publishPath
        publishPath = utils.flat_path('./publish/' + channel)
        print(publishPath)

        #获得版本号
        cfgPath = channelPath + '/CfgPackage.js'
        f = open(cfgPath, 'rU')
        content = f.read()
        f.close()
        pattern = re.compile(r'\[([^\[\]]*)\]')   # 查找数字
        tb = pattern.findall(content)
        versionStr = tb[0]
        versionStr = versionStr.replace(",", ".")
        versionStr = versionStr.replace(" ", "")
        print('version: ' + versionStr)
        #获得渠道类名
        pattern = re.compile(r'window.CHANNEL_CLASS.*=.*\"(.*)\"')   # 查找数字
        tb = pattern.findall(content)
        global currentChannel
        currentChannel = tb[0]
        print('channel class:' + currentChannel)
        time.sleep(1)

        # 编译creator工程
        if not no_build_creator:
            self.build_creator_proj()

        if not no_gen_assets:
            if os.path.isdir(publishPath + '/src'):
                time.sleep(0.1)
                shutil.rmtree(publishPath + '/src')
                time.sleep(0.1)
            if os.path.isdir(publishPath + '/res'):
                time.sleep(0.1)
                shutil.rmtree(publishPath + '/res')
                time.sleep(0.1)

            packArgs = {}
            packArgs['confuseResImport'] = False
            packArgs['exclude'] = False
            packArgs['compressPng'] = True
            packArgs['encrytPng'] = False
            packArgs['encrytJS'] = False
            packArgs['cfgPackagePath'] = cfgPath
            packArgs['nativePath'] = ''
            packArgs['zipDir'] = 'minigame'
            packArgs['minigame'] = True
            packArgs['mergeJson'] = True
            packArgs['currentChannel'] = currentChannel
            genResH5.start(versionStr, self.proj_parth, publishPath, packArgs)

        self.publish(channel, bVconsole)
        
    
    def publish(self, channel, bVconsole):
        print('publish extend')
        sdkPath = ''
        packagePath = channelPath + '/package.json'
        if os.path.exists(packagePath):
            f = open(packagePath)
            package = json.load(f)
            f.close()
            print(package)
            # 添加引用sdk
            if package['sdk']:
                self.copySDK(package['sdk'])
                sdkPath = package['sdk']
        iosPath = utils.flat_path('./local')
        # 同步到publish
        copy_cfg = {
            'from': '.',
            'to': '.',
            'exclude': [
                '**/.DS_Store'
            ]
        }
        # 将构建出来的res、src、subpackages目录拷贝到打包目录
        excopy.copy_files_with_config(copy_cfg, iosPath, publishPath)
        
        # 给index.html替换时间戳
        self.setGenDate(utils.flat_path(publishPath + '/index.html'), sdkPath, bVconsole)

    def copySDK(self, sdk):
        path = channelPath + '/' + sdk
        dstPath = utils.flat_path(publishPath + '/' + sdk)
        if os.path.exists(path):
            self.moveFileTo(path, dstPath)

    def setGenDate(self, indexPath, sdkPath, bVconsole):
        f3 = open(indexPath)
        result = f3.read()
        f3.close()
        TimeTuple = time.localtime(time.time())
        fmt = '%Y%m%d%H%M%S'
        timeStr = time.strftime(fmt,TimeTuple)
        print(timeStr)
        sdkRef = '<script src="%s?_t=202001030929" charset="utf-8"></script>' % sdkPath
        if sdkPath == '':
            sdkRef = ''
        result = result.replace("<!--<script src=sdk.js></script>-->", sdkRef)
        str = ''
        if bVconsole == '1':
            str = '<script src=vconsole.min.js></script>'
        result = result.replace("<!--<script src=vConsole.js></script>-->", str)
        result = result.replace("202001030929", timeStr)
        result = result.replace('channel_hold_string', currentChannel)
        f2 = open(indexPath, "w")
        f2.writelines(result)
        f2.close()


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser(prog="PackAPK", description=utils.get_sys_encode_str("apk 安装包生成工具"))
    parser.add_argument("--no-gen-assets", dest="no_gen_assets", action='store_true', help=utils.get_sys_encode_str("若指定此参数，则不对资源文件进行加密。"))
    parser.add_argument("--no-build-creator", dest="no_build_creator", action='store_true', help=utils.get_sys_encode_str("指定是否命令行构建creator项目"))
    parser.add_argument("--no-rollback", dest="no_rollback", action='store_true', help=utils.get_sys_encode_str("若指定此参数，则不执行还原操作"))
    parser.add_argument("-v", "--version", dest="version", help=utils.get_sys_encode_str("指定配置文件"))
    (args, unknown) = parser.parse_known_args()

    # record the start time
    begin_time = time.time()
    try:
        if sys.platform == "win32":
            creator_exe_path = utils.check_environment_variable('CREATOR_PATH')
            if not os.path.isdir(creator_exe_path):
                raise_known_error("环境变量 CREATOR_PATH 未设置")
        if len(unknown) > 0:
            raise_known_error('未知参数 : %s' % unknown, KnownError.ERROR_WRONG_ARGS)
        print(args)
        packer = PackAPK(args)
        packer.do_build(args.no_build_creator, args.no_gen_assets)
    except KnownError as e:
        # a known exception, exit with the known error number
        sys.exit(e.get_error_no())
    except Exception:
        raise
    finally:
        # output the spend time
        end_time = time.time()
        Logging.log_msg('\n总共用时： %.2f 秒\n' % (end_time - begin_time))
