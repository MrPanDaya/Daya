#!/usr/bin/python
# encoding=utf-8
# 生成 apk 安装包

import os
import sys
import time
import datetime
import json
import shutil
import hashlib

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
import encrytPng

class hotUpdate(object):

    def __init__(self, args):
        # 配置文件
        self.batch_cfg_file = utils.flat_path(args.proj_cfg)
        if not os.path.isfile(self.batch_cfg_file):
            raise_known_error("文件 %s 不存在" % self.batch_cfg_file, KnownError.ERROR_PATH_NOT_FOUND)
        self.root_dir = os.path.dirname(self.batch_cfg_file)
        self.batch_info = self._parse_json(self.batch_cfg_file)
        if not self.batch_info:
            raise_known_error('解析文件 %s 失败' % self.batch_cfg_file, KnownError.ERROR_PARSE_FILE)

        self.app_id = self.batch_info['appid']
        self.channel_id = self.batch_info['channel']
        self.proj_parth = utils.flat_path(os.path.join(self.root_dir, self.batch_info['proj_root']))
        self.pack_parth = utils.flat_path(os.path.join(self.root_dir, self.batch_info['pack_root']))
        # 是否需要重编creator
        self.rebuild_creator = args.rebuild_creator
        if self.rebuild_creator:
            # 检查Creator的安装目录
            self.creator_exe_path = utils.check_environment_variable('CREATOR_PATH')
            if not os.path.isdir(self.creator_exe_path):
                raise_known_error("环境变量 CREATOR_PATH 未设置")
            self.creator_proj_path = utils.flat_path(os.path.join(self.proj_parth, '../../'))

        self.encrypt_res = args.encrypt_res

        Logging.debug_msg('是否重新编译creator工程 : %s' % self.rebuild_creator)
        Logging.debug_msg('是否加密图片资源 : %s' % self.encrypt_res)
        Logging.debug_msg('------------------------------------\n')

    def _parse_json(self, json_file):
        ret = None
        try:
            f = open(json_file)
            ret = json.load(f)
            f.close()
        except:
            pass

        return ret

    # 计算文件的MD5
    def get_file_md5(self, file_path):
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

    def get_file_path_md5(self, file_path, assetsObj):
        for (parent, dirs, files) in os.walk(file_path):
            for f in files:
                if f == '.DS_Store' or f == 'version.mainfest':
                    continue
                full_path = os.path.join(parent, f)
                rel_path = os.path.relpath(full_path, file_path)
                rel_path = rel_path.replace('\\', '/')
                assetsObj[rel_path] = {
                    'size' : os.path.getsize(full_path),
                    'md5' : self.get_file_md5(full_path)
                }

    # creator项目的编译
    def build_creator_proj(self):
        Logging.debug_msg('开始构建creator项目')
        try:
            if sys.platform == "win32":
                utils.run_shell('cd /d %s & CocosCreator.exe --path %s --build "platform=android;debug=false"' % (self.creator_exe_path, self.creator_proj_path))
            else:
                creator_path = '/Applications/CocosCreator.app/Contents/MacOS'
                utils.run_shell('pushd "%s";CocosCreator --path %s --build "platform=android;debug=false";popd' % (creator_path, self.creator_proj_path))
        except Exception as e:
            raise_known_error("Creator 项目命令行构建失败 msg=%s" % str(e))
        Logging.debug_msg('构建creator项目完成')

    def del_js_file(self, path, name):
        js_file_path = utils.flat_path(os.path.join(path, name + '.js'))
        if os.path.isfile(js_file_path):
            os.remove(js_file_path)
        jsc_file_path = utils.flat_path(os.path.join(path, name + '.jsc'))
        if os.path.isfile(jsc_file_path):
            os.remove(jsc_file_path)

    # 操作creator项目编译出来的资源
    def op_creator_res(self):
        # 删除本地配置文件 CustomScript.js
        custom_file_path = utils.flat_path(os.path.join(self.proj_parth, 'src/assets/scripts'))
        self.del_js_file(custom_file_path, 'CustomScript')

        # #压缩图片资源
        # exclude_dict = {
        #     "exclude_files": [
        #         # "*_s9.png"
        #     ],
        # }
        # if not self.no_encrypt:
        #     pq = png_quant.PngQuant(self.res_root_path, exclude_dict)
        #     pq.compress_images_in_path()

        # 加密图片
        if self.encrypt_res:
            Logging.debug_msg('开始加密图片资源')
            res_root_path = utils.flat_path(os.path.join(self.proj_parth, 'res'))
            encrytPng.traverseDir(res_root_path)
            Logging.debug_msg('开始图片资源加密完成')

    # 生成manifest结构体
    def gen_manifest_obj(self):
        Logging.debug_msg('正在生成manifest结构..')
        self.manifest_obj = {}
        self.manifest_obj["version"] = self.batch_info['version']
        self.manifest_obj["packageUrl"] = ''
        self.manifest_obj["remoteManifestUrl"] = ''
        self.manifest_obj["remoteVersionUrl"] = ''
        hotUpdateUrl = self.batch_info['url']
        if len(hotUpdateUrl) > 1:
            self.manifest_obj["packageUrl"] = hotUpdateUrl + ''
            self.manifest_obj["remoteManifestUrl"] = hotUpdateUrl + 'project.manifest'
            self.manifest_obj["remoteVersionUrl"] = hotUpdateUrl + 'version.manifest'

        # 先创建version.manifest
        version_manifest = utils.flat_path(os.path.join(self.temp_dir, 'version.manifest'))
        file_m = open(version_manifest, "wb")
        file_m.writelines(json.dumps(self.manifest_obj))
        file_m.close()

        self.manifest_obj["searchPaths"] = []
        self.manifest_obj["assets"] = {}

    def update_resources(self):
        Logging.debug_msg('正在拷贝资源到tmp目录..')
        # 拷贝资源到tmp目录
        for res in self.batch_info['include']:
            if not res:
                continue
            copy_cfg = {
                'from': res,
                'to': res,
                'exclude': [
                    '**/.DS_Store'
                ]
            }
            excopy.copy_files_with_config(copy_cfg, self.proj_parth, self.temp_dir)

        # 先删除CfgPackage.js或CfgPackage.jsc
        scripts_path = utils.flat_path(os.path.join(self.temp_dir, 'src/assets/scripts'))
        self.del_js_file(scripts_path, 'CfgPackage')
        self.del_js_file(scripts_path, 'manifest')

        # 替换CfgPackage.js文件
        pack_cfg_path = utils.flat_path(os.path.join(self.pack_parth, self.app_id, self.channel_id))
        copy_cfg = {
            'from': 'cfg',
            'to': 'src/assets/scripts',
            'exclude': [
                '**/.DS_Store'
            ]
        }
        excopy.copy_files_with_config(copy_cfg, pack_cfg_path, self.temp_dir)

        Logging.debug_msg('正在生成资源列表的md5信息..')
        # 生成资源列表的md5信息
        assetsObj = self.manifest_obj['assets']
        self.get_file_path_md5(self.temp_dir, assetsObj)

        # 替换掉文件 manifest.js
        tmp_str = "(function() { window.CustomManifestAssets = holdString})();"
        tmp_str = tmp_str.replace("holdString", json.dumps(assetsObj))
        src_path = utils.flat_path(os.path.join(self.temp_dir, 'src'))
        manifest_js_path = utils.flat_path(os.path.join(src_path, 'assets/scripts/manifest.js'))
        file_m = open(manifest_js_path, "wb")
        file_m.writelines(tmp_str)
        file_m.close()

        # 重新计算manifest.js的md5值
        rel_path = 'src/assets/scripts/manifest.js'
        assetsObj[rel_path] = {
            'size' : os.path.getsize(manifest_js_path),
            'md5' : self.get_file_md5(manifest_js_path)
        }

        Logging.debug_msg('生成project.manifest文件..')
        # 创建project.manifest
        version_manifest = utils.flat_path(os.path.join(self.temp_dir, 'project.manifest'))
        file_m = open(version_manifest, "wb")
        file_m.writelines(json.dumps(self.manifest_obj))
        file_m.close()

    # 生成zip压缩包
    def write_zip_file(self):
        Logging.debug_msg('正在生成压缩包..')
        # 创建目录
        cur_time_str = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d_%H%M%S')
        zip_name = '%s_%s_%s_%s.zip' % (self.app_id, self.channel_id, self.batch_info['version'], cur_time_str)
        output_dir = os.path.join(self.root_dir, 'output', zip_name)
        utils.zip_folder(self.temp_dir, output_dir)
        Logging.debug_msg('压缩包生成完成 %s ' % output_dir)

    def do_build(self):
        apk_rollback_obj = utils.FileRollback()
        apk_rollback_obj.record_file(utils.flat_path(os.path.join(self.proj_parth, 'main.js')))
        # 编译creator工程
        if self.rebuild_creator:
            self.build_creator_proj()
            # 删除和替换资源
            self.op_creator_res()

        # 清理temp目录
        self.temp_dir = os.path.join(self.root_dir, 'temp')
        if os.path.isdir(self.temp_dir):
            shutil.rmtree(self.temp_dir)
        os.makedirs(self.temp_dir)

        # 创建mainfest的结构体
        self.gen_manifest_obj()

        # 更新资源目录
        self.update_resources()

        # 生成zip包
        self.write_zip_file()

        apk_rollback_obj.do_rollback()
        shutil.rmtree(self.temp_dir)

        Logging.debug_msg('热更包打包完成!\n')
        Logging.debug_msg('------------------------------------')

if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser(prog="hotUpdate", description=utils.get_sys_encode_str("apk 安装包生成工具"))

    parser.add_argument("-c", "--cfg", dest="proj_cfg", required=True, help=utils.get_sys_encode_str("指定打包配置文件的路径。"))
    parser.add_argument("-rb", "--rebuild-creator", dest="rebuild_creator", action='store_true', help=utils.get_sys_encode_str("指定是否命令行构建creator项目"))
    parser.add_argument("-er", "--encrypt-res", dest="encrypt_res", action='store_true', help=utils.get_sys_encode_str("指定是否加密图片资源"))

    (args, unknown) = parser.parse_known_args()

    # record the start time
    begin_time = time.time()
    try:
        if len(unknown) > 0:
            raise_known_error('未知参数 : %s' % unknown, KnownError.ERROR_WRONG_ARGS)
        packer = hotUpdate(args)
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
