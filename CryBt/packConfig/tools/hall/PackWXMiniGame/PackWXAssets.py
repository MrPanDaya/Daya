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
import genResMiniGame
import genInternal


class PackAPK(object):
    def __init__(self, args):
        self.no_rollback = args.no_rollback
        # self.no_encrypt = args.no_encrypt
        self.no_encrypt = True
        self.no_build_creator = args.no_build_creator
        self.is_qq = args.is_qq
        self.root_dir = os.path.dirname("./")

        # 检查Creator的安装目录跟工程目录
        self.creator_proj_path = utils.flat_path(os.path.join(os.path.dirname(__file__), '../../../../'))
        self.proj_parth = utils.flat_path(os.path.join(os.path.dirname(__file__), '../../../../build/wechatgame'))
        print("creator_proj_parth:%s" % self.creator_proj_path)
        print("proj_parth:%s" % self.proj_parth)

    # creator项目的编译
    def build_creator_proj(self):
        Logging.debug_msg('开始构建creator项目')
        Logging.debug_msg(self.creator_proj_path)
        try:
            # 删除之前构建生成的文件夹
            if os.path.isdir(self.proj_parth):
                shutil.rmtree(self.proj_parth)

            json_file = os.path.join(self.creator_proj_path, "settings/wechatgame.json")
            loads = self.readJson(json_file)
            loads["startSceneAssetBundle"] = False

            self.writeJson(json_file, loads)

            # https://docs.cocos.com/creator/manual/en/publish/publish-in-command-line.html
            buildoptions = ";".join([
                "platform=wechatgame",
                "buildPath=build",
                "debug=false",
                "sourceMaps=false",
                "md5Cache=true",
                "mainCompressionType=merge_all_json",
                "mainIsRemote=false"
            ])
            paramFmt = '--path {path} --build "{options}"'
            params = paramFmt.format(path=self.creator_proj_path, options=buildoptions)

            if sys.platform == "win32":
                creator_exe_path = utils.check_environment_variable('CREATOR_PATH')
                cmdline = 'cd /d "%s" & CocosCreator.exe %s' % (creator_exe_path, params)
                utils.run_shell(cmdline)
            else:
                creator_path = '/Applications/CocosCreator/Creator/2.4.3/CocosCreator.app/Contents/MacOS/CocosCreator'
                utils.run_shell('%s %s' % (creator_path, params))

        except Exception as e:
            raise_known_error("Creator 项目命令行构建失败 msg=%s" % str(e))
        Logging.debug_msg('构建creator项目完成')

    def writeJson(self, json_file, loads):
        f = open(json_file, "w")
        json.dump(loads, f)
        f.close()

    def readJson(self, json_file):
        f = open(json_file, "r")
        loads = json.load(f)
        f.close()
        return loads

    def do_build(self):
        dst = utils.flat_path('./temp/')
        print("dst:%s" % dst)
        # 编译creator工程
        if not self.no_build_creator:
            self.build_creator_proj()

        cfgPath = utils.flat_path('./CfgPackage.js')
        # 获得版本号
        f = open(cfgPath, 'rU')
        content = f.read()
        f.close()

        # 获取版本号
        pattern = re.compile(r'window\.APP_VERSION[ \t]*=[ \t]*\[([^\[\]]*)\]')  # 查找数字
        tb = pattern.findall(content)
        versionStr = tb[0]
        versionStr = versionStr.replace(",", ".")
        versionStr = versionStr.replace(" ", "")
        print('version: ' + versionStr)

        # 获得微信id wxappid: "wx31fa4358d97a7923"
        pattern = re.compile(r'wxappid[ \t]*:[ \t]*\"(.*)\"')
        tb = pattern.findall(content)
        wxid = tb[0]
        print('wxid:' + wxid)

        time.sleep(1)

        packArgs = {}
        packArgs['confuseResImport'] = False
        packArgs['exclude'] = False
        packArgs['compressPng'] = False
        packArgs['encrytPng'] = False
        packArgs['encrytJS'] = False
        packArgs['cfgPackagePath'] = cfgPath
        packArgs['nativePath'] = ''
        packArgs['zipDir'] = 'minigame'
        packArgs['minigame'] = True
        packArgs['mergeJson'] = True
        packArgs['wxid'] = wxid
        # packArgs['currentChannel'] = currentChannel

        file___ = os.path.split(__file__)[0]
        packArgs['mod_file_path'] = file___

        genResMiniGame.start(versionStr, self.proj_parth, dst, packArgs)

if __name__ == "__main__":
    from argparse import ArgumentParser

    parser = ArgumentParser(prog="PackAPK", description=utils.get_sys_encode_str("apk 安装包生成工具"))
    parser.add_argument("--no-encrypt", dest="no_encrypt", action='store_true',
                        help=utils.get_sys_encode_str("若指定此参数，则不对资源文件进行加密。"))
    parser.add_argument("--no-build-creator", dest="no_build_creator", action='store_true',
                        help=utils.get_sys_encode_str("指定是否命令行构建creator项目"))
    parser.add_argument("--no-rollback", dest="no_rollback", action='store_true',
                        help=utils.get_sys_encode_str("若指定此参数，则不执行还原操作"))
    parser.add_argument("-v", "--version", dest="version", help=utils.get_sys_encode_str("指定配置文件"))
    parser.add_argument("--qq", dest="is_qq", action='store_true', help=utils.get_sys_encode_str("指定是 QQ 小游戏"))

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
        packer.do_build()
    except KnownError as e:
        # a known exception, exit with the known error number
        sys.exit(e.get_error_no())
    except Exception:
        raise
    finally:
        # output the spend time
        end_time = time.time()
        Logging.log_msg('\n总共用时： %.2f 秒\n' % (end_time - begin_time))
