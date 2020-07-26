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
class PackAPK(object):
    CFG_GAME_NAME = 'game_name'
    CFG_PKG_NAME = 'pkg_name'
    CFG_VERSION_CODE = 'version_code'
    CFG_VERSION_NAME = 'version_name'
    CFG_CHANNEL_ID = 'channel_id'
    CFG_JAVA_RES = 'java_res'
    CFG_LIBS = 'libs'
    CFG_SIGN = 'sign'
    CFG_SIGN_FILE = 'file'
    CFG_SIGN_PASSWORD = 'password'
    CFG_SIGN_ALIAS = 'alias'
    CFG_SIGN_ALIAS_PASSWORD = 'alias_password'
    CFG_APP_SCHEME = 'app_scheme'
    CFG_THIRD_PART = 'is_third_part'

    CHECK_CFG_INFO = {
        CFG_GAME_NAME : { "type" : "string" },
        CFG_PKG_NAME : { "type" : "string" },
        CFG_VERSION_CODE: {"type": "string"},
        CFG_VERSION_NAME: {"type": "string"},
        CFG_CHANNEL_ID: {"type": "string"},
        CFG_JAVA_RES: {"type":"dir_list"},
        CFG_LIBS: {"type": "dir_list"},
        CFG_APP_SCHEME: {"type": "string"},
        "%s.%s" % (CFG_SIGN, CFG_SIGN_FILE): {"type": "file"},
        "%s.%s" % (CFG_SIGN, CFG_SIGN_PASSWORD) : {"type": "string"},
        "%s.%s" % (CFG_SIGN, CFG_SIGN_ALIAS) : {"type": "string"},
        "%s.%s" % (CFG_SIGN, CFG_SIGN_ALIAS_PASSWORD) : {"type": "string"},
    }

    def __init__(self, args):
        self.batch_cfg_file = utils.flat_path(args.proj_cfg)
        if not os.path.isfile(self.batch_cfg_file):
            raise_known_error("文件 %s 不存在" % self.batch_cfg_file, KnownError.ERROR_PATH_NOT_FOUND)
        self.no_rollback = args.no_rollback
        self.root_dir = os.path.dirname(self.batch_cfg_file)
        cur_time_str = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d_%H%M%S')
        self.output_path = os.path.join(self.root_dir, 'output', cur_time_str)
        #配置文件数据
        self.batch_info = self._parse_json(self.batch_cfg_file)
        if not self.batch_info:
            raise_known_error('解析文件 %s 失败' % self.batch_cfg_file, KnownError.ERROR_PARSE_FILE)

        # 检查 android sdk 环境变量
        self.sdk_root = utils.flat_path(utils.check_environment_variable('ANDROID_SDK_ROOT'))

        self.build_result = {}
        cur_dir = os.path.dirname(__file__)
        self.proj_parth = utils.flat_path(os.path.join(cur_dir, '../../../jsb-default'))
        self.proj_android_path = utils.flat_path(os.path.join(self.proj_parth, 'project_android_20'))

        if not os.path.isdir(self.proj_android_path):
            raise_known_error("未找到 Android 工程文件夹 %s" % self.proj_android_path)

        self.android_manifest = os.path.join(self.proj_android_path, 'launcher/src/main/AndroidManifest.xml')

        self.java_files = []
        for parent, dirs, files in os.walk(utils.flat_path(os.path.join(self.proj_android_path, 'unityLibrary/src/main/java'))):
            for f in files:
                filename, ext = os.path.splitext(f)
                if ext.lower() == '.java':
                    self.java_files.append(os.path.join(parent, f))

        Logging.debug_msg('使用配置文件 : %s' % self.batch_cfg_file)
        Logging.debug_msg('是否禁用还原 : %s' % self.no_rollback)
        Logging.debug_msg('Android 工程路径 : %s' % self.proj_android_path)
        Logging.debug_msg('----------------\n')

    def _parse_json(self, json_file):
        ret = None
        try:
            f = open(json_file)
            ret = json.load(f)
            f.close()
        except:
            pass

        return ret

    def get_string(self, var):
        if isinstance(var, int):
            return '%d' % var

        return utils.non_unicode_str(var)

    def _check_cfg_info(self, cfg_info, dir):
        ret = None
        sample_str = None
        for key in PackAPK.CHECK_CFG_INFO.keys():
            key_paths = key.split('.')
            check_info = PackAPK.CHECK_CFG_INFO[key]
            sample_str = check_info.get("sample")
            if len(key_paths) > 1:
                parent = cfg_info.get(key_paths[0], None)
                if (parent is None) or (not isinstance(parent, dict)):
                    ret = "配置文件中 %s 的值错误" % parent
                    break
                check_value = parent.get(key_paths[1], None)
            else:
                check_value = cfg_info.get(key, None)

            if check_value is None:
                ret = "配置文件中 %s 的值错误" % key
                break

            check_value = utils.non_unicode_str(check_value)
            if check_info["type"] == 'file':
                check_value = utils.flat_path(os.path.join(dir, check_value))
                if not os.path.isfile(check_value):
                    ret = "配置文件中 %s 的值并不是一个有效的文件" % key
                    break
            elif check_info["type"] == 'dir':
                check_value = utils.flat_path(os.path.join(dir, check_value))
                if not os.path.isdir(check_value):
                    ret = "配置文件中 %s 的值并不是一个有效的文件夹" % key
                    break
            elif check_info["type"] == 'dir_list':
                if not self._check_dir_list(dir, check_value):
                    ret = "配置文件中 %s 的值并不是一个有效的文件夹列表" % check_value
                    break
            else:
                if not isinstance(check_value, str):
                    ret = "配置文件中 %s 的值并不是字符串" % key
                    break

                pattern = check_info.get("pattern")
                if pattern:
                    match = re.match(pattern, check_value)
                    if not match:
                        ret = "配置文件中 %s 的值格式错误" % key
                        break

        if ret and sample_str:
            ret = "%s，正确示例：%s " % (ret, sample_str)

        return ret

    def _check_dir_list(self, dir, dir_list):
        ret = True
        check_list = dir_list.split(',')
        for p in check_list:
            check_value = utils.flat_path(os.path.join(dir, p.strip()))
            if not os.path.isdir(check_value):
                ret = False
                break

        return ret

    #修改渠道
    def _modify_apihelper(self, channel_id, isThirdPart, rollback_obj):
        library_android_path = utils.flat_path(os.path.join(self.proj_parth, 'project_android_20/unityLibrary'))
        nativeHelper = os.path.join(library_android_path, 'src/main/java/com/weile/api/ApiHelper.java')
        # 备份文件
        rollback_obj.record_file(utils.flat_path(nativeHelper))
        f = open(nativeHelper)
        lines = f.readlines()
        f.close()

        new_lines = []
        pattern_channelId = 'private static int ChannelId ='
        pattern_thirdPart = 'private static boolean isThirdPart ='
        strThirdPart = "false"
        if isThirdPart:
            strThirdPart = "true"
        for line in lines:
            check_str = line.strip()
            matchChannelId = re.match(pattern_channelId, check_str)
            if matchChannelId:
                line = '\tprivate static int ChannelId = ' + channel_id + ';\n'
            matchThirdPart = re.match(pattern_thirdPart, check_str)
            if matchThirdPart:
                line = '\tprivate static boolean isThirdPart = ' + strThirdPart + ';\n'

            new_lines.append(line)

        f = open(nativeHelper, 'w')
        f.writelines(new_lines)
        f.close()

    def _modify_java_files(self, new_pkg_name, rollback_obj):
        pattern = r'^import[ \t].*\.R;'
        for java in self.java_files:
            # 备份文件
            rollback_obj.record_file(java)
            f = open(java)
            lines = f.readlines()
            f.close()

            new_lines = []
            for line in lines:
                check_str = line.strip()
                match = re.match(pattern, check_str)
                if match:
                    line = 'import %s.R;\n' % new_pkg_name

                new_lines.append(line)

            f = open(java, 'w')
            f.writelines(new_lines)
            f.close()

    def _modify_manifest(self, pkg_name, ver_name, ver_code, rollback_obj):
        #备份文件
        rollback_obj.record_file(utils.flat_path(self.android_manifest))

        f = open(self.android_manifest)
        old_lines = f.readlines()
        f.close()

        patterns = {
            r'.*package[ \t]*=[ \t]*\"(.*)\"' : {
                'replaced' : False,
                'value' : pkg_name,
            },
            r'.*android:versionCode[ \t]*=[ \t]*"(.*)"' :  {
                'replaced' : False,
                'value' : ver_code,
            },
            r'.*android:versionName[ \t]*=[ \t]*"(.*)"' :  {
                'replaced' : False,
                'value' : ver_name,
            },
        }
        new_lines = []
        for line in old_lines:
            for pattern in patterns:
                pattern_info = patterns[pattern]
                if pattern_info['replaced']:
                    continue

                match = re.match(pattern, line)
                if match:
                    pattern_info['replaced'] = True
                    line = line.replace(match.group(1), pattern_info['value'])

            new_lines.append(line)

        f = open(self.android_manifest, 'w')
        f.writelines(new_lines)
        f.close()

    def _modify_strings_xml(self, new_name, app_scheme):
        file_path = utils.flat_path(os.path.join(self.proj_android_path, 'launcher/src/main/res/values/strings.xml'))
        doc_node = minidom.parse(file_path)
        root_node = doc_node.getElementsByTagName('resources')[0]
        string_nodes = root_node.getElementsByTagName('string')
        for node in string_nodes:
            node_name = node.getAttribute('name')
            if node_name == 'app_name':
                node.firstChild.replaceWholeText(new_name.decode('utf-8'))

            if node_name == 'schemename':
                node.firstChild.replaceWholeText(app_scheme.decode('utf-8'))

        new_content = doc_node.toprettyxml(encoding='utf-8')
        # new_content 可能会出现空行，这里进行处理，删除空行
        lines = new_content.split('\n')
        new_lines = []
        for line in lines:
            if line.strip() != '':
                new_lines.append(line)

        f = open(file_path, 'w')
        f.write('\n'.join(new_lines))
        f.close()

    def _modify_res(self, apk_cfg_info, cfg_dir, rollback_obj):
        #备份res
        rollback_obj.record_folder(os.path.join(self.proj_android_path, 'launcher/src/main/res'))
        for p in apk_cfg_info[PackAPK.CFG_JAVA_RES].split(','):
            java_res_path = utils.flat_path(os.path.join(cfg_dir, p.strip()))
            copy_cfg = {
                'from': '.',
                'to': 'res',
                'exclude': [
                    '**/.DS_Store'
                ]
            }
            res_path = utils.flat_path(os.path.join(self.proj_android_path, 'launcher/src/main'))
            excopy.copy_files_with_config(copy_cfg, java_res_path, res_path)

    def _modify_libs(self, apk_cfg_info, cfg_dir, rollback_obj):
        #备份res
        rollback_obj.record_folder(os.path.join(self.proj_android_path, 'unityLibrary/libs'))
        #应用宝渠道的话需要删除微信sdk
        if apk_cfg_info[PackAPK.CFG_CHANNEL_ID] == "210":
            wx_sdk_file = os.path.join(self.proj_android_path, 'unityLibrary/libs/wechat-sdk-android-without-mta-6.6.4.jar')
            if os.path.exists(wx_sdk_file):
                os.remove(wx_sdk_file)

        for p in apk_cfg_info[PackAPK.CFG_LIBS].split(','):
            libs_path = utils.flat_path(os.path.join(cfg_dir, p.strip()))
            copy_cfg = {
                'from': '.',
                'to': 'libs',
                'exclude': [
                    '**/.DS_Store'
                ]
            }
            res_path = utils.flat_path(os.path.join(self.proj_android_path, 'unityLibrary'))
            excopy.copy_files_with_config(copy_cfg, libs_path, res_path)

    def setGradleConfig(self, rollback_obj, cfg_dir, apk_cfg_info, apk_name):
        print("set gradle config")

        gradle_config_path = utils.flat_path(os.path.join(self.proj_android_path, 'launcher/config.gradle'))
        cfg_file_path = utils.flat_path(os.path.join(cfg_dir, "package.json"))
        if sys.platform == "win32":
            cfg_file_path = cfg_file_path.replace("\\", "/")

        rollback_obj.record_file(gradle_config_path)
        # 设置 packagePath 路径
        data = []
        f = open(gradle_config_path)
        lines = f.readlines()
        f.close()
        for line in lines:
            if (line.find('def packagePath =') == 0):
                line = 'def packagePath = \"%s\"' % cfg_file_path + '\n'
            data.append(line)
        f = open(gradle_config_path, "w")
        f.writelines(data)
        f.close()

        apk_cfg_info = utils.parse_json(cfg_file_path)
        keystore_path = utils.flat_path(os.path.join(cfg_dir, apk_cfg_info[PackAPK.CFG_SIGN][PackAPK.CFG_SIGN_FILE]))
        if sys.platform == "win32":
            keystore_path = keystore_path.replace("\\", "/")
        apk_cfg_info['sign']['storefile'] = keystore_path
        apk_cfg_info['sign']['output_apk_dir'] = self.output_path
        apk_cfg_info['sign']['output_apk_name'] = apk_name

        # save package.json
        packageFile = open(cfg_file_path, 'w+')
        try:
            str = json.dumps(apk_cfg_info, ensure_ascii=False, indent=4, separators=(',', ':'))
            packageFile.write(str)
        except:
            raise_known_error("write package.json error!")
        finally:
            packageFile.close()

    def build_apk_gradle(self, rollback_obj, cfg_dir, apk_cfg_info, apk_name):
        # 最终 apk 文件名格式为：GAMENAME_PKGNAME_APPID_CHANNELID_VERNAME_VERCODE.apk
        # Logging.debug_msg('修改apk文件名 game_name=%s pkg_name=%s app_id=%s channel_id=%s ver_name=%s ver_code=%s' % (game_name, pkg_name, app_id, channel_id, ver_name, ver_code))

        # 修改签名文件
        Logging.debug_msg('修改签名文件')
        self.setGradleConfig(rollback_obj, cfg_dir, apk_cfg_info, apk_name)
        try:
            if sys.platform == "win32":
                utils.run_shell('cd /d %s & set ANDROID_HOME="%s" & gradlew clean & gradlew aR --stacktrace' % (self.proj_android_path, self.sdk_root))
            else:
                utils.run_shell('pushd "%s";export ANDROID_HOME="%s";./gradlew clean;./gradlew aR --stacktrace;popd' % (self.proj_android_path, self.sdk_root))
        except Exception as e:
            raise_known_error("gradle 命令行打包失败 msg=%s" % str(e))

        Logging.debug_msg('gradle配置文件修改完成')

    def build_one_apk(self, app_id, channel_id, rollback_obj):
        apk_cfg_file = os.path.join(self.root_dir, app_id, channel_id, 'package.json')
        if not os.path.isfile(apk_cfg_file):
            Logging.warn_msg('未找到 %s 文件，打包失败1' % apk_cfg_file)
            return

        Logging.debug_msg('开始使用配置文件 %s 打包' % apk_cfg_file)
        apk_cfg_info = self._parse_json(apk_cfg_file)
        if apk_cfg_info is None:
            Logging.warn_msg('解析文件 %s 出错，打包失败2' % apk_cfg_file)
            return

        cfg_dir = os.path.dirname(apk_cfg_file)

        check_ret = self._check_cfg_info(apk_cfg_info, cfg_dir)
        if check_ret:
            Logging.warn_msg(check_ret + ',打包失败5')
            return

        # gradle需要修改 package.json 配置文件
        rollback_obj.record_file(apk_cfg_file)
        game_name = utils.non_unicode_str(apk_cfg_info[PackAPK.CFG_GAME_NAME])
        pkg_name = utils.non_unicode_str(apk_cfg_info[PackAPK.CFG_PKG_NAME])
        ver_name = utils.non_unicode_str(apk_cfg_info[PackAPK.CFG_VERSION_NAME])
        ver_code = utils.non_unicode_str(apk_cfg_info[PackAPK.CFG_VERSION_CODE])
        app_scheme = utils.non_unicode_str(apk_cfg_info[PackAPK.CFG_APP_SCHEME])

        # 修改 strings.xml
        self._modify_strings_xml(game_name, app_scheme)
        # 修改渠道号
        isThirdPart = apk_cfg_info.get(PackAPK.CFG_THIRD_PART, False)
        self._modify_apihelper(apk_cfg_info[PackAPK.CFG_CHANNEL_ID], isThirdPart, rollback_obj)
        # 修改 java 文件中 R 的包名
        self._modify_java_files(pkg_name, rollback_obj)

        # 修改 AndroidManifest.xml
        self._modify_manifest(pkg_name, ver_name, ver_code, rollback_obj)

        # 替换 res
        self._modify_res(apk_cfg_info, cfg_dir, rollback_obj);

        # 替换 libs
        self._modify_libs(apk_cfg_info, cfg_dir, rollback_obj);

         # 最终 apk 文件名格式为：GAMENAME_PKGNAME_APPID_CHANNELID_VERNAME_VERCODE.apk
        Logging.debug_msg('生成apk文件名')
        name_infos = [game_name, pkg_name, app_id, channel_id, ver_name, ver_code]

        # 文件名增加时间戳
        Logging.debug_msg('文件名增加时间戳')
        cur_time_str = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d_%H%M%S')
        name_infos.append(cur_time_str)

        apk_name = '_'.join(name_infos) + '.apk'
        out_file_path = os.path.join(self.output_path, apk_name)
        if not os.path.isdir(self.output_path):
            os.makedirs(self.output_path)

        # 进行 gradle 打包
        Logging.debug_msg('进行 gradle 打包')
        try:
            self.build_apk_gradle(rollback_obj, cfg_dir, apk_cfg_info, apk_name)
            self.build_result['%s_%s' % (app_id, channel_id)] = out_file_path
        except:
            print 'traceback.format_exc():\n%s' % traceback.format_exc()
            return

    def do_build(self):
        #各个渠道的打包
        for app_id in self.batch_info.keys():
            app_id = utils.non_unicode_str(app_id)
            channels = self.batch_info[app_id]
            for channel_id in channels:
                Logging.debug_msg('----------------')
                apk_rollback_obj = utils.FileRollback()
                try:
                    channel_str = self.get_string(channel_id)
                    self.build_result['%s_%s' % (app_id, channel_str)] = ''
                    self.build_one_apk(app_id, channel_str, apk_rollback_obj)
                except:
                    Logging.warn_msg('打包失败')
                finally:
                    Logging.debug_msg('finally :')
                    if not self.no_rollback:
                        apk_rollback_obj.do_rollback()
                Logging.debug_msg('----------------\n')

        Logging.debug_msg('\n打包结果汇总 :')
        for key in self.build_result.keys():
            ids = key.split('_')
            value = self.build_result[key]
            if value and os.path.isfile(utils.get_sys_encode_str(value)):
                Logging.debug_msg('APP_ID : %s, CHANNEL_ID : %s。打包成功。apk 路径 : %s' % (ids[0], ids[1], value))
            else:
                Logging.debug_msg('APP_ID : %s, CHANNEL_ID : %s。打包失败。' % (ids[0], ids[1]))
        #打开目录
        os.system("start explorer %s" % self.output_path)


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser(prog="PackAPK", description=utils.get_sys_encode_str("apk 安装包生成工具"))

    parser.add_argument("-c", "--cfg", dest="proj_cfg", required=True, help=utils.get_sys_encode_str("指定打包配置文件的路径。"))
    parser.add_argument("--no-rollback", dest="no_rollback", action='store_true', help=utils.get_sys_encode_str("若指定此参数，则不执行还原操作"))

    (args, unknown) = parser.parse_known_args()

    # record the start time
    begin_time = time.time()
    try:
        if len(unknown) > 0:
            raise_known_error('未知参数 : %s' % unknown, KnownError.ERROR_WRONG_ARGS)
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
