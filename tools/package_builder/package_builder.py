#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os
import git
import shutil

import argparse
import package_state

from package_utils import PackageLog

class PackageBuilder(object):
    """小游戏打包器

    控制和触发小游戏在打包过程中的每个状态,监控错误和输出日志

    属性：
        _state: 当前正在操作的状态
    """

    def __init__(self, state, config_path, without_res=False, without_code=False, split_subpackage=False):
        self._state = state

        self._without_res = without_res
        self._without_code = without_code
        self._split_subpackage = split_subpackage

        self._config_path = os.path.normpath(config_path)
        self._config_folder_path = os.path.dirname(config_path)
        self._config_data = dict()

        self._output_path = ""

        self._resource_path = ""

        self._temp_path = os.path.join(self._config_folder_path, "temp")
        if os.path.exists(self._temp_path):
            shutil.rmtree(self._temp_path, ignore_errors=True)

        os.makedirs(self._temp_path)

        self._replace_file_list = list()

        self._project_setting = dict()
        self._game_setting = dict()
        self._game_list_setting = dict()
        self._friend_list_setting = dict()
        self._resources_setting = dict()

        self._project_name = ""
        self._pack_mode = ""
        self._wx_app_id = ""
        self._app_key = ""

        self._project_root_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", ".."))

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, value):
        self._state = value

    @property
    def without_res(self):
        return self._without_res

    @without_res.setter
    def without_res(self, value):
        self._without_res = value

    @property
    def without_code(self):
        return self._without_code

    @without_code.setter
    def without_code(self, value):
        self._without_code = value

    @property
    def split_subpackage(self):
        return self._split_subpackage

    @split_subpackage.setter
    def split_subpackage(self, value):
        self._split_subpackage = value

    @property
    def config_data(self):
        return self._config_data

    @config_data.setter
    def config_data(self, value):
        if isinstance(value, dict):
            self._config_data = value

    @property
    def config_path(self):
        return self._config_path

    @config_path.setter
    def config_path(self, value):
        self._config_path = value

    @property
    def config_folder_path(self):
        return self._config_folder_path

    @config_folder_path.setter
    def config_folder_path(self, value):
        self._config_folder_path = value

    @property
    def output_path(self):
        return self._output_path

    @output_path.setter
    def output_path(self, value):
        self._output_path = value

    @property
    def resource_path(self):
        return self._resource_path

    @resource_path.setter
    def resource_path(self, value):
        self._resource_path = value

    @property
    def replace_file_list(self):
        return self._replace_file_list

    @replace_file_list.setter
    def replace_file_list(self, value):
        self._replace_file_list = value

    @property
    def temp_path(self):
        return self._temp_path

    @temp_path.setter
    def temp_path(self, value):
        self._temp_path = value

    @property
    def project_setting(self):
        return self._project_setting

    @project_setting.setter
    def project_setting(self, value):
        self._project_setting = value

    @property
    def game_setting(self):
        return self._game_setting

    @game_setting.setter
    def game_setting(self, value):
        self._game_setting = value

    @property
    def game_list_setting(self):
        return self._game_list_setting

    @game_list_setting.setter
    def game_list_setting(self, value):
        self._game_list_setting = value

    @property
    def friend_list_setting(self):
        return self._friend_list_setting

    @friend_list_setting.setter
    def friend_list_setting(self, value):
        self._friend_list_setting = value

    @property
    def resources_setting(self):
        return self._resources_setting

    @resources_setting.setter
    def resources_setting(self, value):
        self._resources_setting = value

    @property
    def project_root_path(self):
        return self._project_root_path

    @project_root_path.setter
    def project_root_path(self, value):
        self._project_root_path = value

    @property
    def pack_mode(self):
        return self._pack_mode

    @pack_mode.setter
    def pack_mode(self, value):
        self._pack_mode = value

    @property
    def project_name(self):
        return self._project_name

    @project_name.setter
    def project_name(self, value):
        self._project_name = value

    @property
    def wx_app_id(self):
        return self._wx_app_id

    @wx_app_id.setter
    def wx_app_id(self, value):
        self._wx_app_id = value

    @property
    def app_key(self):
        return self._app_key

    @app_key.setter
    def app_key(self, value):
        self._app_key = value

    def go_next(self):
        ""u"操作和转移当前状态至下一状态"""

        # 获取当前状态的下一状态
        self._state = self._state.go_next(self)
        if self._state is not None:
            # 运行下一状态
            self.run()

    def run(self):
        ""u"运行当前状态"""
        self._state.run(self)


if __name__ == "__main__":

    builder = None
    succeed = False

    PackageLog.basic_config()

    try:
        # 获取配置文件路径
        parser = argparse.ArgumentParser()
        parser.add_argument("--config-path", dest="config_path")
        parser.add_argument("--without-res", dest="without_res", action="store_true")
        parser.add_argument("--without-code", dest="without_code", action="store_true")
        parser.add_argument("--split-subpackage", dest="split_subpackage", action="store_true")
        args = parser.parse_args()

        if not args.config_path:
            raise ValueError(u"无法解析配置文件的路径，请查看--config-path的参数设置")

        # 构建builder,并运行ParsingState
        builder = PackageBuilder(None, args.config_path, args.without_res, args.without_code)

        # 构建ParsingState
        parsing_state = package_state.ParsingState(builder)

        # 开始打包
        builder.state = parsing_state
        builder.run()
    except ValueError as e:
        PackageLog.error(str(e))
    except OSError as e:
        PackageLog.error(str(e))
    except git.exc.GitError as e:
        PackageLog.error(str(e))
    except IOError as e:
        PackageLog.error(str(e))
    else:
        succeed = True
    finally:
        try:
            cleaning_state = package_state.CleaningState(builder)
            cleaning_state.run(builder)
        except (OSError, IOError) as e:
            PackageLog.error(str(e))

        if succeed:
            PackageLog.log(u"打包成功")
        else:
            PackageLog.log(u"打包失败")
