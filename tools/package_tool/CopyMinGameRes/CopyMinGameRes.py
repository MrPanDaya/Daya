#!/usr/bin/python
# encoding=utf-8
# 生成 apk 安装包

import os
import sys
import time
import datetime
import json
import re
import traceback

from xml.dom import minidom

default_encoding = 'utf-8'
if sys.getdefaultencoding() != default_encoding:
    reload(sys)
    sys.setdefaultencoding(default_encoding)

sys.path.append(os.path.normpath(os.path.join(os.path.dirname(__file__), '../utils')))
import excopy
import utils
from logUtils import Logging
from logUtils import raise_known_error
from logUtils import KnownError

# 配置文件格式：
class CopyMinGameRes(object):
    def __init__(self, args):
        self.batch_cfg_file = utils.flat_path(args.proj_cfg)
        if not os.path.isfile(self.batch_cfg_file):
            raise_known_error("文件 %s 不存在" % self.batch_cfg_file, KnownError.ERROR_PATH_NOT_FOUND)

        self.root_dir = os.path.dirname(self.batch_cfg_file)
        cur_time_str = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d')
        self.output_path = os.path.join(self.root_dir, 'output', cur_time_str)

        #配置文件数据
        self.batch_info = self.parse_json(self.batch_cfg_file)
        if not self.batch_info:
            raise_known_error('解析文件 %s 失败' % self.batch_cfg_file, KnownError.ERROR_PARSE_FILE)

        Logging.debug_msg('使用配置文件 : %s' % self.batch_cfg_file)
        Logging.debug_msg('----------------\n')

    def parse_json(self, json_file):
        ret = None
        try:
            f = open(json_file)
            ret = json.load(f)
            f.close()
        except:
            pass
        return ret

    def do_build(self):
        #各个游戏，各个渠道
        for game in self.batch_info.keys():
            game = utils.non_unicode_str(game)
            channels = self.batch_info[game]
            for channel_id in channels:
                Logging.debug_msg('----------------' + channel_id)
                try:
                    channel_str = utils.non_unicode_str(channel_id)
                    apk_cfg_file = os.path.join(self.root_dir, game, channel_str, 'package.json')
                    if not os.path.isfile(apk_cfg_file):
                        Logging.warn_msg('未找到 %s 文件' % apk_cfg_file)
                        return
                    pack_cfg_info = self.parse_json(apk_cfg_file)
                    if pack_cfg_info is None:
                        Logging.warn_msg('解析文件 %s 出错' % apk_cfg_file)
                        return

                    strResPath = utils.non_unicode_str(pack_cfg_info['res_path'])
                    res_path = utils.flat_path(os.path.join(self.root_dir, game, channel_str, strResPath))

                    strTargetpath = utils.non_unicode_str(pack_cfg_info['target_path'])
                    target_path = utils.flat_path(os.path.join(self.root_dir, strTargetpath))

                    copy_cfg = {
                        'from': '.',
                        'to': '.',
                        'exclude': ['**/.DS_Store']
                    }
                    excopy.copy_files_with_config(copy_cfg, res_path, target_path)
                except:
                    Logging.warn_msg('资源拷贝失败')
                finally:
                    Logging.debug_msg('finally :')
                Logging.debug_msg('----------------\n')

if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser(prog="CopyMinGameRes", description=utils.get_sys_encode_str("小游戏打包资源拷贝工具"))
    parser.add_argument("-c", "--cfg", dest="proj_cfg", required=True, help=utils.get_sys_encode_str("指定打包配置文件的路径。"))
    (args, unknown) = parser.parse_known_args()

    # record the start time
    begin_time = time.time()
    try:
        if len(unknown) > 0:
            raise_known_error('未知参数 : %s' % unknown, KnownError.ERROR_WRONG_ARGS)
        packer = CopyMinGameRes(args)
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
