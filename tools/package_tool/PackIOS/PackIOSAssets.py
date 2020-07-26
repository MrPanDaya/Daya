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
import genRes

class PackAPK(object):
    def __init__(self, args):
        self.no_rollback = args.no_rollback
        self.no_encrypt = args.no_encrypt
        self.no_build_creator = args.no_build_creator
        self.root_dir = os.path.dirname("./")
        # self.temp_dir = os.path.join(self.root_dir, 'temp')
        cur_time_str = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d_%H%M%S')
        self.output_path = os.path.join(self.root_dir, 'output', cur_time_str)

        # 检查Creator的安装目录跟工程目录
        self.creator_proj_parth = utils.flat_path(os.path.join(self.root_dir, '../../'))
        if sys.platform == "win32":
            self.creator_exe_path = utils.check_environment_variable('CREATOR_PATH')
            if not os.path.isdir(self.creator_exe_path):
                raise_known_error("环境变量 CREATOR_PATH 未设置")
        self.proj_parth = utils.flat_path(os.path.join(os.path.dirname(__file__), '../../../../build/jsb-link'))

    # creator项目的编译
    def build_creator_proj(self):
        Logging.debug_msg('开始构建creator项目')
        Logging.debug_msg(self.creator_proj_parth)
        try:
            if sys.platform == "win32":
                utils.run_shell('cd /d %s & CocosCreator.exe --path %s --build "platform=ios;debug=false"' % (self.creator_exe_path, self.creator_proj_parth))
            else:
                creator_path = '/Applications/CocosCreator.app/Contents/MacOS/'
                utils.run_shell('%sCocosCreator --path %s --build "platform=ios;debug=false"' % (creator_path, self.creator_proj_parth))
        except Exception as e:
            raise_known_error("Creator 项目命令行构建失败 msg=%s" % str(e))
        Logging.debug_msg('构建creator项目完成')

    def do_build(self, no_build_creator):
        dst = utils.flat_path('./pack_temp/')
        print(dst)
        # 编译creator工程
        if not no_build_creator:
            self.build_creator_proj()

        cfgPath = utils.flat_path('./CfgPackage.js')
        #获得版本号
        f = open(cfgPath, 'rU')
        content = f.read()
        f.close()
        pattern = re.compile(r'\[([^\[\]]*)\]')   # 查找数字
        tb = pattern.findall(content)
        versionStr = tb[0]
        versionStr = versionStr.replace(",", ".")
        versionStr = versionStr.replace(" ", "")
        print('version: ' + versionStr)
        time.sleep(1)

        packArgs = {}
        packArgs['confuseResImport'] = False
        packArgs['exclude'] = False
        packArgs['compressPng'] = False
        packArgs['encrytPng'] = True
        packArgs['encrytJS'] = True
        packArgs['cfgPackagePath'] = cfgPath
        packArgs['nativePath'] = utils.flat_path('./native.js')
        packArgs['zipDir'] = ''
        packArgs['minigame'] = False
        genRes.start(versionStr, self.proj_parth, dst, packArgs)

        print("+++++++++++++++++++++sync ios-assets")
        iosPath = utils.flat_path(os.path.join(os.path.dirname(__file__), '../../../../ios-assets/src'))
        if os.path.isdir(iosPath):
            time.sleep(0.01)
            shutil.rmtree(iosPath)
            time.sleep(0.01)
        
        iosPath = utils.flat_path(os.path.join(os.path.dirname(__file__), '../../../../ios-assets/res'))
        if os.path.isdir(iosPath):
            time.sleep(0.01)
            shutil.rmtree(iosPath)
            time.sleep(0.01)

        iosPath = utils.flat_path(os.path.join(os.path.dirname(__file__), '../../../../ios-assets'))
        # 同步到ios-assets
        copy_cfg = {
            'from': '.',
            'to': '.',
            'exclude': [
                '**/.DS_Store'
            ]
        }
        # 将构建出来的res、src、subpackages目录拷贝到打包目录
        excopy.copy_files_with_config(copy_cfg, dst + '/mainPackage', iosPath)

if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser(prog="PackAPK", description=utils.get_sys_encode_str("apk 安装包生成工具"))
    parser.add_argument("--no-encrypt", dest="no_encrypt", action='store_true', help=utils.get_sys_encode_str("若指定此参数，则不对资源文件进行加密。"))
    parser.add_argument("--no-build-creator", dest="no_build_creator", action='store_true', help=utils.get_sys_encode_str("指定是否命令行构建creator项目"))
    parser.add_argument("--no-rollback", dest="no_rollback", action='store_true', help=utils.get_sys_encode_str("若指定此参数，则不执行还原操作"))
    parser.add_argument("-v", "--version", dest="version", help=utils.get_sys_encode_str("指定配置文件"))
    (args, unknown) = parser.parse_known_args()

    # record the start time
    begin_time = time.time()
    try:
        if len(unknown) > 0:
            raise_known_error('未知参数 : %s' % unknown, KnownError.ERROR_WRONG_ARGS)
        print(args)
        packer = PackAPK(args)
        packer.do_build(args.no_build_creator)
    except KnownError as e:
        # a known exception, exit with the known error number
        sys.exit(e.get_error_no())
    except Exception:
        raise
    finally:
        # output the spend time
        end_time = time.time()
        Logging.log_msg('\n总共用时： %.2f 秒\n' % (end_time - begin_time))
