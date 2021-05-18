#!/usr/bin/python
# encoding=utf-8
# 扫描未使用的图片资源

import os
import sys
import time
import plistlib
import shutil

sys.path.append(os.path.normpath(os.path.join(os.path.dirname(__file__), './utils')))
import utils
from logUtils import Logging
from logUtils import raise_known_error
from logUtils import KnownError

reload(sys)
sys.setdefaultencoding("utf-8")

RES_FOLDERS = [ 'src' ]
RES_TYPES = [ '.png', '.jpg', '.mp3', '.plist', '.fnt' ]
STUDIO_PROJ_FOLDERS = [ 'cocosstudio_hall/cocosstudio' ]

PUBLISH_RES_FOLDER = 'res'
CHECK_FOLDERS = [ 'src', 'res' ]
CHECK_FILE_TYPES = [ '.js' ]

EXCLUDES = [
    "frameworks",
    "tools",
    "TexturePackerRes"
]

class Scanner(object):
    def __init__(self, args):
        self.delete = args.do_delete
        cur_dir = os.path.dirname(__file__)
        self.res_root_path = utils.flat_path(os.path.join(cur_dir, '../../../'))
        print(self.res_root_path)
        self.check_files = {}

    def _do_delete(self):
        pass

    def _do_add_check_files(self, key, value):
        unix_key = key.replace('\\', '/')

        if unix_key not in self.check_files:
            self.check_files[unix_key] = value
        else:
            Logging.warn_msg("%s 冲突：%s 和 %s" % (unix_key, self.check_files[unix_key], value))

    def _parse_plist(self, plist_path, relative_path):
        pl = plistlib.readPlist(plist_path)
        if not pl.has_key('frames'):
            return

        # 先将 plist 加入检查
        self._do_add_check_files(relative_path, plist_path)

        frames = pl["frames"]
        for key in frames:
            self._do_add_check_files(key, '%s#%s' % (plist_path, key))

    def _check_excludes(self, path):
        for exclude_path in EXCLUDES:
            if os.path.normpath(exclude_path) in path:
                return True

        return False

    def _is_in_unused_list(self, path):
        if isinstance(path, unicode):
            path = path.encode("utf-8")

        for un in self.unused:
            if isinstance(un, unicode):
                un = un.encode("utf-8")

            if path == un:
                return True

        return False

    def do_scan(self):
        # 获取需要检测的文件路径字符串
        types_count = {}
        Logging.debug_msg("---- start scanning ----")
        for folder in RES_FOLDERS:
            check_folder = utils.flat_path(os.path.join(self.res_root_path, folder))
            for parent, dirs, files in os.walk(check_folder):
                if self._check_excludes(parent):
                    continue

                for f in files:
                    base_name, ext = os.path.splitext(f)
                    full_path = os.path.join(parent, f)
                    relative_path = os.path.relpath(full_path, check_folder)

                    if ext in RES_TYPES:
                        # 统计资源数量
                        if types_count.has_key(ext):
                            types_count[ext] += 1
                        else:
                            types_count[ext] = 1

                        if ext == '.plist':
                            if not self._check_excludes(full_path):
                                self._parse_plist(full_path, relative_path)
                        else:
                            find_path = relative_path
                            if ext == '.png':
                                # png 可能是合图或者 fnt 字体，跳过
                                plist_path = os.path.join(parent, base_name + '.plist')
                                fnt_path = os.path.join(parent, base_name + '.fnt')
                                if os.path.isfile(plist_path) or os.path.isfile(fnt_path):
                                    find_path = None

                            if find_path:
                                self._do_add_check_files(find_path, full_path)

        for folder in STUDIO_PROJ_FOLDERS:
            studio_folder = utils.flat_path(os.path.join(self.res_root_path, folder))
            for parent, dirs, files in os.walk(studio_folder):
                for f in files:
                    base_name, ext = os.path.splitext(f)
                    full_path = os.path.join(parent, f)

                    if ext == '.csd':
                        if types_count.has_key(ext):
                            types_count[ext] += 1
                        else:
                            types_count[ext] = 1

                        relative_path = os.path.relpath(full_path, studio_folder)
                        relative_js  = os.path.join(os.path.dirname(relative_path), base_name + '.js')
                        js_path = os.path.join(self.res_root_path, PUBLISH_RES_FOLDER, relative_js)
                        if not os.path.isfile(js_path):
                            # 发布的 js 文件已经不存在了，不需要检查
                            continue

                        csd_js_file = base_name + '.js'
                        self._do_add_check_files(csd_js_file, full_path)

                        # 还需要加入 a.b.c 的检查
                        require_key = os.path.join(os.path.dirname(relative_path), base_name)
                        require_key = require_key.replace('/', '.')
                        require_key = require_key.replace('\\', '.')
                        self._do_add_check_files(require_key, full_path)

        Logging.debug_msg("\n")
        for ext in types_count:
            Logging.debug_msg("%s files: %d" % (ext, types_count[ext]))
        Logging.debug_msg("---- scan finished %d ----\n" % len(self.check_files))

        # Logging.debug_msg('need check files (%d):' % len(check_files))
        # for key in check_files:
        #     Logging.debug_msg('%s : %s' % (key, check_files[key]))


        # 读取需要检查的 js 文件内容
        js_files_info = {}
        for folder in CHECK_FOLDERS:
            check_folder = utils.flat_path(os.path.join(self.res_root_path, folder))
            for parent, dirs, files in os.walk(check_folder):
                if self._check_excludes(parent):
                    continue

                for f in files:
                    base_name, ext = os.path.splitext(f)
                    full_path = os.path.join(parent, f)
                    if ext in CHECK_FILE_TYPES:
                        # 读取文件内容
                        f = open(full_path)
                        content = f.read()
                        f.close()
                        js_files_info[full_path] = content

        # 进行检查
        self.unused = []
        self.used = []
        for key in self.check_files:
            tip_str = self.check_files[key]
            if tip_str in self.used:
                # 之前已经找到使用的地方了，直接跳过
                continue

            used = False
            for content_key in js_files_info:
                if self._check_excludes(content_key):
                    continue

                content = js_files_info[content_key]
                if content.find(key) >= 0:
                    used = True
                    break

            if used:
                self.used.append(tip_str)
                if tip_str in self.unused:
                    # 从 unused 中移除
                    self.unused.remove(tip_str)
            else:
                if not self._is_in_unused_list(tip_str):
                    # 之前未找到过，记录下来
                    self.unused.append(tip_str)

        # 输出未使用的文件
        Logging.debug_msg("unused file(%d):" % len(self.unused))
        unused_temp_path = utils.flat_path('~/Downloads/unused_files')
        if os.path.isdir(unused_temp_path):
            shutil.rmtree(unused_temp_path)
        os.makedirs(unused_temp_path)
        self.unused = sorted(self.unused)

        cur_dir = os.path.dirname(__file__)
        path = os.path.join(cur_dir, "unused_files.txt")
        unused_files = open(path, "w")

        for f in self.unused:
            unused_files.write(f + "\n")

        unused_files.close()

        if self.delete:
            self._do_delete()

if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser(prog="ScanUnusedRes", description=utils.get_sys_encode_str("扫描未使用的图片资源"))
    parser.add_argument("--do-delete", dest="do_delete", action='store_true', help=utils.get_sys_encode_str("慎用！！！若指定此参数，则未使用的资源将被删除。"))

    (args, unknown) = parser.parse_known_args()

    # record the start time
    begin_time = time.time()
    try:
        if len(unknown) > 0:
            raise_known_error('unknown args: %s' % unknown, KnownError.ERROR_WRONG_ARGS)

        scanner = Scanner(args)
        scanner.do_scan()
    except KnownError as e:
        # a known exception, exit with the known error number
        sys.exit(e.get_error_no())
    except Exception:
        raise
    finally:
        # output the spend time
        end_time = time.time()
        Logging.log_msg('\ntotal time: %.2f seconds\n' % (end_time - begin_time))
