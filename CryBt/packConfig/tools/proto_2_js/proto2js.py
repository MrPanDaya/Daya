#!/usr/bin/python
# encoding=utf-8
# proto转换工具

import os
import sys
import time
import shutil

sys.path.append(os.path.normpath(os.path.join(os.path.dirname(__file__), '../utils')))
import utils
from logUtils import Logging
from logUtils import raise_known_error
from logUtils import KnownError

reload(sys)
# sys.setdefaultencoding("utf-8")

class Proto2Js():
    def __init__(self):
        self.root_path = os.path.dirname(__file__)
        self.js_path = utils.flat_path(os.path.join(self.root_path, 'json'))
        self.proto_path = utils.flat_path(os.path.join(self.root_path, 'proto'))
        self.target_path = utils.flat_path(os.path.join(self.root_path, '../../../assets/scripts/common/core/network/pb'))
        Logging.log_msg("root_path:%s" % self.root_path)
        Logging.log_msg("target_path:%s \n" % self.target_path)

    def build(self):
        Logging.log_msg("star build proto gen proto.js\n")

        #批处理
        try:
            utils.run_shell('pbjs -t json proto/fishing.proto > json/fishing.js')
        except Exception as e:
            raise_known_error("生成proto.js文件失败 msg=%s" % str(e))

        #修改文件增加'module.exports ='
        jsFile = utils.flat_path(os.path.join(self.js_path, 'fishing.js'))
        f1 = open(jsFile, "r")
        result = f1.read()
        f1.close()
        oResult = "module.exports = %s " % result
        f2 = open(jsFile, "w")
        f2.writelines(oResult)
        f2.close()
        Logging.log_msg("out file:%s" % jsFile)

        #将fishing.js文件拷贝到客户端的pb目录
        if os.path.exists(self.target_path):
            shutil.copy(jsFile, self.target_path)
            Logging.log_msg("move file fishing.js to path : %s \n" % self.target_path)

        Logging.log_msg("proto build success")



if __name__ == "__main__":
    # record the start time
    begin_time = time.time()
    try:
        scanner = Proto2Js()
        scanner.build()
    except KnownError as e:
        # a known exception, exit with the known error number
        sys.exit(e.get_error_no())
    except Exception:
        raise
    finally:
        # output the spend time
        end_time = time.time()
        Logging.log_msg('total time: %.2f second' % (end_time - begin_time))
