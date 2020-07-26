#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os
import sys
import git
import json
import hashlib
import urllib2
import shutil
import subprocess
import textwrap
import package_utils

sys.path.append(os.path.normpath(os.path.join(os.path.dirname(__file__), '../hall/utils')))
sys.path.append(os.path.normpath(os.path.join(os.path.dirname(__file__), '../png_quant')))

import utils
import png_quant

from package_utils import ProjectJsonCreator
from package_utils import SubPackageBuilder
from package_utils import PackageLog

reload(sys)
sys.setdefaultencoding("utf-8")


class PackageState(object):
    def __init__(self, builder, state_name):
        self._builder = builder
        self._state_name = state_name

        PackageLog.log("=====================================================")
        PackageLog.log(u"开始运行：%s" % self._state_name)

    def go_next(self, builder):
        pass

    def run(self, builder):
        PackageLog.log(u"%s运行结束，准备进入到下一步" % self._state_name)
        builder.go_next()


class ParsingState(PackageState):
    def __init__(self, builder):
        PackageState.__init__(self, builder, "ParsingState")

    def go_next(self, builder):
        PackageState.go_next(self, builder)

        return GitOperationState(builder)

    def run(self, builder):
        builder.config_data = self.__parse_config_file(builder.config_path)
        builder.config_folder_path = os.path.join(os.path.dirname(builder.config_path), "config")
        builder.output_path = os.path.join(os.path.dirname(builder.config_path), "output")
        builder.resource_path = os.path.join(os.path.dirname(builder.config_path), "res")

        # print(json.dumps(builder.config_data, sort_keys=True, indent=4, separators=(",", ":")))

        builder.project_setting = builder.config_data.get("project_setting", {})
        builder.game_setting = builder.config_data.get("game_setting", {})
        builder.game_list_setting = builder.config_data.get("game_list_setting", {})
        builder.friend_list_setting = builder.config_data.get("friend_list_setting", {})

        if not builder.project_setting:
            raise IOError(u"无法读取配置文件中的\"project_setting\"设置信息，请检查配置文件是否正确")

        builder.project_name = builder.project_setting.get("project_name", "")
        if not builder.project_name:
            raise IOError(u"无法读取配置文件中的\"project_name\"设置信息，请检查配置文件是否正确")

        builder.pack_mode = builder.project_setting.get("pack_mode", "")
        if not builder.pack_mode:
            raise IOError(u"无法读取配置文件中的\"pack_mode\"设置信息，请检查配置文件是否正确")

        builder.wx_app_id = builder.project_setting.get("wx_app_id", "")
        if not builder.wx_app_id:
            raise IOError(u"无法读取配置文件中的\"wx_app_id\"设置信息，请检查配置文件是否正确")

        builder.app_key = builder.project_setting.get("app_key", "")
        if not builder.app_key:
            raise IOError(u"无法读取配置文件中的\"app_key\"设置信息，请检查配置文件是否正确")

        if not builder.game_setting:
            PackageLog.warning(u"没有在配置中找到\"game_setting\"字段")

        if not builder.game_list_setting:
            PackageLog.warning(u"没有在配置中找到\"game_list_setting\"字段")

        PackageLog.log(u"工程名：%s" % builder.project_name)
        PackageLog.log(u"打包模式：%s" % builder.pack_mode)
        PackageLog.log(u"微信App ID：%s" % builder.wx_app_id)
        PackageLog.log("App Key：%s" % builder.app_key)

        PackageState.run(self, builder)

    def __parse_config_file(self, path):
        if not os.path.exists(path):
            raise IOError(u"无法读取该路径的配置文件，请检查路径是否正确：%s" % path)

        with open(path) as f:
            data = json.load(f)

        return data


class GitOperationState(PackageState):
    def __init__(self, builder):
        self.__remote_git_info = dict()
        PackageState.__init__(self, builder, "GitOperationState")

    def ___git_operation(self, path, name, git_info, mode):
        # 检查remote的git信息
        if mode == "remote" and not git_info:
            raise git.exc.GitError(u"对%s进行版本操作时，发现了无效或空的git版本信息，请检查远程的版本文件内容后重试" % name)

        # 检查git信息是否为空
        if mode == "local" and not git_info:
            PackageLog.log(u"跳过%s，不做任何版本控制操作" % name)
            return

        # 检查path是否为git repo路径
        if not os.path.exists(path):
            raise git.exc.GitError(u"该git仓库路径不存在，请检查后重试：%s" % path)

        if name == "src/libs":
            path = os.path.dirname(path)

        repo = git.Repo(path)

        # 更新该remote的所有信息到本地
        # checkout到相应的分支/tag/节点
        # 并对分支做拉取代码的操作
        self.__fetch(repo, git_info.get("remote", "origin"))
        if "tag" in git_info:
            self.__fetch_tags(repo, git_info.get("remote", "origin"))
            self.__checkout_with_tag(repo, git_info["tag"], False)
        elif "sha1" in git_info:
            self.__checkout_with_hash(repo, git_info["sha1"], False)
        elif "branch" in git_info:
            self.__checkout_with_branch(repo, git_info.get("remote", "origin"), git_info["branch"], False)
            self.__pull(repo, git_info.get("remote", "origin"), git_info["branch"])

    def __clone(self, repo_path, save_path):
        PackageLog.log(u"开始克隆代码 %s 到 %s" % (repo_path, save_path))
        git.Repo.clone_from(save_path, save_path)

    def __checkout_with_branch(self, repo, remote, branch, force=False):
        if not branch:
            raise git.exc.GitError(u"branch为空，请检查配置文件中%s的branch配置" % str(repo))

        if branch in repo.branches:
            self.__checkout(repo, branch, force)
        else:
            remote_branches = [
                remote_branch.replace(" ", "") for remote_branch in repo.git.branch("-r").split('\n')]

            for remote_branch in remote_branches:
                if "HEAD" in remote_branch:
                    continue

                r, b = remote_branch.split("/")
                if r == remote and b == branch:
                    self.__checkout(repo, branch, force)
                    return

            raise git.exc.GitError("无效的branch：%s, 请检查配置文件中%s的branch值" % (branch, str(repo)))

    def __checkout_with_hash(self, repo, hash_code, force=False):
        if not hash_code:
            raise git.exc.GitError("当前的sha1值为空, 请检查配置文件中%s的sha1值" % str(repo))

        self.__checkout(repo, hash_code, force)

    def __checkout_with_tag(self, repo, tag, force=False):
        if not tag:
            raise git.exc.GitError("当前%s的tag为空, 请检查配置文件中的tag值" % str(repo))

        if tag not in repo.tags:
            raise git.exc.GitError("无效的tag：%s, 请检查配置文件中%s的tag值" % (tag, str(repo)))

        self.__checkout(repo, tag, force)

    def __checkout(self, repo, dst, force=False):
        PackageLog.log(u"%s checkout到%s" % (str(repo), dst))
        repo.git.checkout(dst, force=force)

    def __pull(self, repo, remote, branch):
        if not remote:
            raise git.exc.GitError(u"remote为空，无法进行pull操作，请检查配置文件中%s的remote配置" % str(repo))

        if not branch:
            raise git.exc.GitError(u"branch为空，无法进行pull操作，请检查配置文件中%s的branch配置" % str(repo))

        if not self.__check_remote(repo, remote):
            raise git.exc.GitError(u"无效的远程仓库名：%s，请检查配置文件中%s的remote值" % (remote, str(repo)))

        if branch not in repo.branches:
            raise git.exc.GitError(u"无效的分支名：%s，请检查配置文件中%s的branch值" % (branch, str(repo)))

        PackageLog.log(u"从%s:%s进行pull操作" % (remote, branch))
        repo.git.pull(remote, branch)

    def __fetch_tags(self, repo, remote):
        if not remote:
            raise git.exc.GitError(u"remote为空，无法进行fetch操作，请检查%s的remote是否有效" % str(repo))

        repo.git.fetch(remote, "--tags", "-f")

    def __fetch(self, repo, remote):
        if not remote:
            raise git.exc.GitError(u"remote为空，无法进行fetch操作，请检查%s的remote是否有效" % str(repo))

        repo.git.fetch(remote)

    def __download_git_info_from_remote(self):
        response = urllib2.urlopen(
            "http://192.168.67.10:81/honghui/JSVersion/raw/master/minigame.json")

        data = response.read()
        if not data:
            raise IOError(u"下载版本控制信息失败，请检查你的网络或链接后重试")

        self.__remote_git_info = json.loads(data)
        if not self.__remote_git_info:
            raise IOError(u"版本信息解析失败，请检查远程版本信息配置后再重试")

    def __get_remote_git_info_with_name(self, name):
        if name == "src/libs":
            return self.__remote_git_info.get("src", {})

        return self.__remote_git_info.get(name, {})

    def __check_remote_git_info_with_name(self, name):
        if name == "src/libs":
            name = "src"

        return name in self.__remote_git_info

    def __check_remote(self, repo, remote_name):
        for remote in repo.remotes:
            if remote_name == str(remote):
                return True

        return False

    def __check_local_git_info(self):
        setting = self._builder.project_setting
        component_list = setting.get("component_list", [])
        game_list = setting.get("game_list", [])

        has_git_list = [("git" in cp) for cp in component_list]
        has_git_list.extend([("git" in game) for game in game_list])

        return False not in has_git_list

    def go_next(self, builder):
        PackageState.go_next(self, builder)

        if builder.without_code:
            return ResourceState(builder)

        return FileOperationState(builder)

    def run(self, builder):
        setting = builder.project_setting

        # 检查本地的git信息
        if not self.__check_local_git_info():
            self.__download_git_info_from_remote()

        component_list = setting.get("component_list", [])
        for cp in component_list:
            name = cp.get("name", "")
            component_path = os.path.join(
                builder.project_root_path, os.path.normpath(name))

            # 去掉打入主包的游戏短名中的games/
            # 不包含games/common, games/pk_common, games/mj_common这三个模块
            if "games/" in name and \
                    ("common" not in name and
                     "pk_common" not in name and
                     "mj_common" not in name):
                name = name.replace("games/", "")

            # 检查是否有本地的git信息
            if "git" not in cp and not self.__check_remote_git_info_with_name(name):
                continue

            git_info = dict()
            mode = ""
            if "git" in cp:
                git_info = cp.get("git")
                mode = "local"
            elif self.__check_remote_git_info_with_name(name):
                git_info = self.__get_remote_git_info_with_name(name)
                mode = "remote"

            self.___git_operation(component_path, name, git_info, mode)

        game_list = setting.get("game_list", [])
        for game in game_list:
            name = game.get("name", "")
            game_path = os.path.join(
                builder.project_root_path, "games", name)

            if name == "common" or \
                    name == "mj_common" or \
                    name == "pk_common":
                name = "games/" + name

            if "git" not in game and not self.__check_remote_git_info_with_name(name):
                continue

            git_info = dict()
            mode = ""
            if "git" in game:
                git_info = game.get("git")
                mode = "local"
            elif self.__check_remote_git_info_with_name(name):
                git_info = self.__get_remote_git_info_with_name(name)
                mode = "remote"

            self.___git_operation(game_path, "games" + "/" + name, git_info, mode)

        PackageState.run(self, builder)


class FileOperationState(PackageState):
    def __init__(self, builder):
        PackageState.__init__(self, builder, "FileOperationState")

    def __backup(self, backup_root_path, backup_files, backup_to):
        if not os.path.exists(backup_to):
            raise IOError(u"无法进行备份操作，该备份目录不存在：%s" % backup_to)

        for f in backup_files:
            backup_path = os.path.join(backup_root_path, f)
            if not os.path.exists(backup_path):
                PackageLog.warning(u"该文件: %s不存在，无法备份该文件：%s" % (f, backup_path))
                continue

            backup_to_path = os.path.join(backup_to, f)
            backup_to_folder = os.path.dirname(backup_to_path)
            if not os.path.exists(backup_to_folder):
                PackageLog.log(u"创建文件目录: %s" % backup_to_folder)
                os.makedirs(backup_to_folder)

            PackageLog.log(u"备份:%s到%s" % (backup_path, backup_to_path))
            shutil.copyfile(backup_path, backup_to_path)

    def __backup_project_json(self, project_json_file, backup_to):
        if not os.path.exists(os.path.dirname(backup_to)):
            raise IOError(u"无法对\"project.json\"进行备份操作，该备份目录不存在：%s" % backup_to)

        PackageLog.log(u"备份:%s到%s" % (project_json_file, backup_to))
        shutil.copyfile(project_json_file, backup_to)

    def __clean(self, path):
        shutil.rmtree(path, ignore_errors=True)

    def __replace_res(self, replace_root_path, replace_to):
        if not os.path.exists(replace_to):
            raise IOError(u"无法进行替换操作，该目录不存在：%s" % replace_to)

        for root, folders, files in os.walk(replace_root_path):
            for f in files:
                real_path = os.path.relpath(
                    os.path.join(root, f), replace_root_path)

                replace_to_file = os.path.join(replace_to, real_path)
                replace_to_folder = os.path.dirname(replace_to_file)
                if not os.path.exists(replace_to_folder):
                    os.makedirs(replace_to_folder)

                shutil.copyfile(
                    os.path.join(root, f),
                    replace_to_file
                )

    def __replace_files(self, replace_root_path, replace_to):
        if not os.path.exists(replace_to):
            raise IOError(u"无法进行替换操作，该目录不存在：%s" % replace_to)

        # 遍历config目录下所有需要替换的文件
        self._builder.replace_file_list = list()
        for root, folders, files in os.walk(replace_root_path):
            for f in files:
                real_path = os.path.relpath(
                    os.path.join(root, f), replace_root_path)
                self._builder.replace_file_list.append(real_path)

        self.__backup(replace_to, self._builder.replace_file_list, self._builder.temp_path)

        # 替换文件
        for replace_file in self._builder.replace_file_list:
            replace_to_file = os.path.join(replace_to, replace_file)
            replace_to_folder = os.path.dirname(replace_to_file)
            if not os.path.exists(replace_to_folder):
                PackageLog.log(u"创建：%s文件夹" % replace_to_folder)
                os.makedirs(replace_to_folder)

            replace_file = os.path.join(replace_root_path, replace_file)
            PackageLog.log(u"开始替换：%s 到 %s" % (replace_file, replace_to_file))
            shutil.copyfile(
                replace_file,
                replace_to_file
            )

    def __copy_local_resources(self, modules, games, project_path, dst):
        package_utils.copy_game_resources(modules, games, project_path, dst)

    def __copy_preload_resources(self, src, dst):
        for parent, dirnames, filenames in os.walk(src):
            if "native" in parent or "web" in parent or "abandoned" in parent:
                continue

            for filename in filenames:
                dst_parent = os.path.join(dst, os.path.relpath(parent, src))
                if not os.path.exists(dst_parent):
                    os.makedirs(dst_parent)

                shutil.copyfile(
                    os.path.join(parent, filename),
                    os.path.join(dst_parent, filename)
                )

    def __make_main_package_file(self, project_root, modules, excludes, output_path, has_game_common=False):
        main_package_builder = package_utils.MainPackageBuilder()
        main_package_builder.build(project_root, modules, excludes, output_path, has_game_common)

    def __make_sub_package_file(self, project_root, games, excludes, mode, output_path):
        commons = [common for common in games if "common" in common or "area" in common]
        games = [game for game in games if game not in commons]
        sub_packages = []

        sub_package_builder = package_utils.SubPackageBuilder()
        if len(commons) > 0:
            sub_package_builder.build(project_root, commons, "game_common", mode, output_path)
            sub_packages.append("game_common_sub_package.js")

        for game in games:
            sub_package_builder.build(project_root, [game], game, mode, output_path)
            sub_packages.append(game + "_sub_package.js")

        return sub_packages

    def __update_main_package_files(self, project_root, folders, platform, others):
        ProjectJsonCreator.update_files(project_root, folders, platform, others)

    def __update_sub_package_files_singly(self, project_root, project_name, folders, platform):
        commons = [common for common in folders if "common" in common]
        commons.extend([area for area in folders if "area" in area])
        games = [game for game in folders if game not in commons]

        files = []
        for common in commons:
            path = os.path.join(project_root, "games", common)
            files.extend(package_utils.organize_files_with_wxpack(project_root, path, platform))

        if len(commons) > 0:
            other = os.path.join(project_root, "games", "mini_game", "game_common_sub_package.js")
            files.append(other)

            SubPackageBuilder.create_build_xml(
                project_root, files, os.path.join(project_root, "publish", project_name, "games"), "game_common")

        for game in games:
            files = []
            path = os.path.join(project_root, "games", game)
            files.extend(package_utils.organize_files_with_wxpack(project_root, path, platform))

            other = os.path.join(project_root, "games", "mini_game", game + "_sub_package.js")
            files.append(other)

            SubPackageBuilder.create_build_xml(
                project_root, files, os.path.join(project_root, "publish", project_name, "games"), game)

    def __update_sub_package_files(self, project_root, project_name, folders, platform, others):
        files = list()

        if "common" in folders:
            path = os.path.join(project_root, "games", "common")
            files.extend(package_utils.organize_files_with_wxpack(project_root, path, platform))

            index = folders.index("common")
            folders.pop(index)

        if "pk_common" in folders:
            path = os.path.join(project_root, "games", "pk_common")
            files.extend(package_utils.organize_files_with_wxpack(project_root, path, platform))

            index = folders.index("pk_common")
            folders.pop(index)

        if "mj_common" in folders:
            path = os.path.join(project_root, "games", "mj_common")
            files.extend(package_utils.organize_files_with_wxpack(project_root, path, platform))

            index = folders.index("mj_common")
            folders.pop(index)

        for folder in folders:
            if "area" not in folder:
                continue

            path = os.path.join(project_root, "games", folder)
            files.extend(package_utils.organize_files_with_wxpack(project_root, path, platform))

        for folder in folders:
            if "area" in folder:
                continue

            path = os.path.join(project_root, "games", folder)
            files.extend(package_utils.organize_files_with_wxpack(project_root, path, platform))

        if others:
            files.extend(others)

        SubPackageBuilder.create_build_xml(
            project_root, files, os.path.join(project_root, "publish", project_name, "games"))

    def __update_project_json_file(self, project_root, project_name, games, app_id, without_sub_package=False):
        project_config_json = os.path.join(project_root, "publish", project_name, "project.config.json")
        if not os.path.exists(project_config_json):
            raise IOError(u"无法读取该路径的配置文件，请检查路径是否正确：%s" % project_config_json)

        with open(project_config_json, "rb") as f:
            data = json.load(f)
            f.close()

        data["projectname"] = project_name
        data["appid"] = app_id

        with open(project_config_json, "wb") as f:
            json.dump(data, f, indent=4, separators=(',', ': '), ensure_ascii=False)
            f.close()

        game_json_file = os.path.join(
            os.path.join(project_root, "publish", project_name), "game.json")

        with open(game_json_file, "rb") as f:
            data = json.load(f)
            f.close()

        if without_sub_package:
            del data['subpackages']
        else:
            subpackages = []

            commons = [common for common in games if "common" in common or "area" in common]
            games = [game for game in games if game not in commons]

            if len(commons) > 0:
                game_common = {
                    "name": "game_common",
                    "root": "games/game_common.js"
                }
                subpackages.append(game_common)

            for game in games:
                f = game + ".js"
                subpackage = {
                    "name": game,
                    "root": "games/" + f
                }
                subpackages.append(subpackage)

            data['subpackages'] = subpackages

        with open(game_json_file, "wb") as f:
            json.dump(data, f, indent=4, separators=(',', ': '), ensure_ascii=False)
            f.close()

    def __make_cfg_package_js_file(self, wx_app_id, app_key, game_setting, save_path):
        # 检查config目录是否存在
        if not os.path.exists(save_path):
            os.makedirs(save_path)

        # 根据配置文件，生成json数据
        package_config = dict()
        package_info = dict()

        package_info["WX_APP_ID"] = wx_app_id
        package_info["APP_KEY"] = app_key

        game_setting_keys = [
            "box_id",
            "app_name",
            "channel_id",
            "hall_app_version",
            "region_code",
            "package_type",
            "update_url_prefix",
            "same_mp_appids",
            "display_games",
            "contain_area",
            "is_quyou"
        ]

        custom_key_map = {
            # key in config.json    key in CfgPackage.js
            "ICP": "COMPANY_ICP",
            "ISBN": "COMPANY_ISBN_NUM",
            "wx_ad_adunit": "WEIXIN_AD_ADUNIT",
        }
        for k in game_setting:
            v = game_setting[k]
            if k in game_setting_keys:
                pack_cfg_key = k.upper()
                package_info[pack_cfg_key] = v

            if k in custom_key_map:
                pack_cfg_key = custom_key_map[k]
                package_info[pack_cfg_key] = v

        package_info["PAY_CONFIG"] = dict()

        pay_infos = game_setting["pay"]
        for config_key, value in pay_infos.items():
            package_info["PAY_CONFIG"][config_key] = {
                "env": value["env"],
                "offerId": value["offer_id"]
            }

        package_config[game_setting["app_id"]] = package_info

        # 生成CfgPackage.js的代码
        cfg_package_js_content = """
        "use strict"

        var DEBUG = %(debug_output)s

        var APP_ID = %(app_id)s

        var PACKAGE_CFG = JSON.parse('""" % game_setting

        # 去除缩进
        cfg_package_js_content = textwrap.dedent(cfg_package_js_content)
        cfg_package_js_content += json.dumps(package_config)
        cfg_package_js_content += "');"

        # 写入文件
        cfg_package_js_file_path = os.path.join(save_path, "CfgPackage.js")
        with open(cfg_package_js_file_path, "wb") as f:
            f.write(cfg_package_js_content)
            f.close()

    def __make_local_cfg_game_js_file(self, game_list_setting, save_path):
        # 检查config目录是否存在
        if not os.path.exists(save_path):
            os.makedirs(save_path)

        # 根据配置文件，生成json数据
        game_list = dict()

        if "collection_cfg" in game_list_setting:
            game_list["collection_cfg"] = game_list_setting["collection_cfg"]

        if "review_cfg" in game_list_setting:
            game_list["review_cfg"] = game_list_setting["review_cfg"]

        if "default" in game_list_setting:
            game_list["default"] = game_list_setting["default"]

        if "friend" in game_list_setting:
            game_list["friend"] = game_list_setting["friend"]

        # 生成LocalCfgGame.js的代码
        local_cfg_game_js_content = """
        "use strict"

        var GAMELIST = JSON.parse('"""

        # 去除缩进
        local_cfg_game_js_content = textwrap.dedent(local_cfg_game_js_content)
        # 将json字符串拼到JSON.parse的方法里面：JSON.parse(json_string)
        local_cfg_game_js_content += json.dumps(game_list)
        local_cfg_game_js_content += "');"
        local_cfg_game_js_content += "\n\n"

        if self._builder.friend_list_setting:
            local_cfg_game_js_content += "var FRIEND_LIST = JSON.parse('"
            local_cfg_game_js_content += json.dumps(self._builder.friend_list_setting)
            local_cfg_game_js_content += "');"

        # 写入文件
        local_cfg_game_js_path = os.path.join(save_path, "LocalCfgGame.js")
        with open(local_cfg_game_js_path, "wb") as f:
            f.write(local_cfg_game_js_content)
            f.close()

    def __make_hard_code_js_file(self, mp_appid_list, component_names, game_names, save_to):
        if not os.path.exists(save_to):
            raise OSError(u"%s目录不存在，请检查后重试")

        code = ""

        # 生成小程序跳转列表
        PackageLog.log(u"生成小程序跳转列表到主包中")
        code += self.__make_navigate_to_mp_appid_js_code(mp_appid_list)
        code += "\n"

        # 生成小程序跳转列表
        PackageLog.log(u"生成游戏子包列表到主包中")
        code += self.__make_subpackage_list_js_code(game_names)
        code += "\n"

        # 生成小程序跳转列表
        PackageLog.log(u"生成游戏短名列表到主包中")
        code += self.__make_short_name_list_js_code(component_names, game_names)
        code += "\n"

        # 写入文件
        save_path = os.path.join(self._builder.project_root_path, "src", "libs", "HardCode.js")
        with open(save_path, "wb") as f:
            f.write(code)
            f.close()

    def __make_subpackage_list_js_code(self, games):
        ret = self.__has_common_in_game_list()

        games = [game for game in games if "common" not in game and "area" not in game]
        code = "var GAME_SHORT_NAME_LIST = ["

        for index, game in enumerate(games):
            if index == 0:
                code += "\"" + game + "\""
            else:
                code += "," + "\"" + game + "\""

        if ret:
            code += ("" if len(games) == 0 else ",") + "\"" + "game_common" + "\""

        code += "];"
        code = textwrap.dedent(code)

        return code

    def __make_short_name_list_js_code(self, components, games):
        root = self._builder.project_root_path
        content = dict()
        code = "var GAME_SHORT_NAME_DICT = JSON.parse('"

        for component in components:
            wxpack = os.path.join(root, component, "wxpack.json")
            with open(wxpack, "rb") as f:
                data = f.read()
                f.close()

            json_data = json.loads(data)
            version = json_data.get("version", 0)

            if component == "src/libs":
                component = "hall"

            if "games/" in component:
                component = component.split("/")[1]

            content[component] = {"version": version}

        for game in games:
            wxpack = os.path.join(root, "games", game, "wxpack.json")
            with open(wxpack, "rb") as f:
                data = f.read()
                f.close()

            json_data = json.loads(data)
            version = json_data.get("version", 0)
            content[game] = {"version": version}

        code += json.dumps(content)
        code += "');"
        code = textwrap.dedent(code)

        return code

    def __make_navigate_to_mp_appid_js_code(self, app_id_list):
        code = "var DIRECT_NAVIGATE_APPIDS = ["

        for index, appid in enumerate(app_id_list):
            if index == 0:
                code += "\"" + appid + "\""
            else:
                code += "," + "\"" + appid + "\""

        code += "];"

        code = textwrap.dedent(code)
        return code

    def __add_app_id_list_to_game_json(self, app_id_list, game_json_file_path):
        if not os.path.exists(game_json_file_path):
            raise OSError("添到App列表到game.json, 失败无法找到该文件: %s" % game_json_file_path)

        with open(game_json_file_path, "rb") as f:
            data = json.load(f)
            data["navigateToMiniProgramAppIdList"] = app_id_list
            f.close()

        with open(game_json_file_path, "wb") as f:
            json.dump(data, f, sort_keys=True, indent=2, separators=(',', ':'), ensure_ascii=False)

    def __add_user_location_description(self, game_json_file_path):
        if not os.path.exists(game_json_file_path):
            raise OSError(u"添到位置信息失败，无法找到该文件: %s" % game_json_file_path)

        with open(game_json_file_path, "rb") as f:
            data = json.load(f)
            f.close()

        user_location = dict()
        user_location["desc"] = u"您的位置信息将用于GPS定位和测距~"

        permission = data.get("permission", dict())
        permission["scope.userLocation"] = user_location

        data["permission"] = permission

        with open(game_json_file_path, "wb") as f:
            json.dump(data, f, sort_keys=True, indent=2, separators=(',', ':'), ensure_ascii=False)

    def __has_common_in_game_list(self):
        game_list = self._builder.project_setting["game_list"]
        game_names = [game.get("name", "") for game in game_list]

        for game in game_names:
            if "common" in game or "area" in game:
                return True

        return False

    def go_next(self, builder):
        PackageState.go_next(self, builder)

        return BuildingState(builder)

    def run(self, builder):
        # 得到当前工程的根目录和打包模式
        root = builder.project_root_path
        mode = builder.pack_mode
        project_name = builder.project_setting.get("project_name", "")
        mini_game_path = os.path.join(root, "games", "mini_game")

        # 创建工程目录
        output_path = os.path.join(root, "publish", project_name)
        if os.path.exists(output_path):
            shutil.rmtree(output_path, ignore_errors=True)

        PackageLog.log(u"创建工程目录：%s" % output_path)
        os.makedirs(output_path)

        # 拷贝工程模板文件
        wechat_lib_path = os.path.join(root, "src", "frameworks", "WeChatGame")
        PackageLog.log(u"拷贝模板文件：%s 到工程目录：%s" % (wechat_lib_path, output_path))
        package_utils.merge_folder(wechat_lib_path, output_path)

        # 遍历需要被编译的模块和游戏
        component_list = builder.project_setting["component_list"]
        game_list = builder.project_setting["game_list"]

        component_names = [cp.get("name", "") for cp in component_list]
        game_names = [game.get("name", "") for game in game_list]

        # 得到模块中所有需要被排除的文件
        component_excludes = list()
        for component in component_list:
            if "exclude" in component:
                component_excludes.extend(component["exclude"])

        component_excludes = [os.path.join(root, ex).replace("\\", "/") for ex in component_excludes]

        # 检查game_setting
        if builder.game_setting:
            wx_app_id = builder.project_setting["wx_app_id"]
            app_key = builder.project_setting["app_key"]

            # 生成CfgPackage.js文件
            PackageLog.log(u"生成CfgPackage.js文件")
            self.__make_cfg_package_js_file(
                wx_app_id, app_key, builder.game_setting, os.path.join(builder.config_folder_path, "libs"))

        # 检查game_list_setting
        if builder.game_list_setting:
            # 生成LocalCgfGame.js文件
            PackageLog.log(u"生成LocalCgfGame.js文件")
            self.__make_local_cfg_game_js_file(
                builder.game_list_setting, os.path.join(builder.config_folder_path, "libs"))

        # 检查navigate_to_mp_appid_list字段
        mp_appid_list = builder.project_setting.get("navigate_to_mp_appid_list", [])
        save_to = os.path.join(builder.config_folder_path, "libs")

        self.__make_hard_code_js_file(mp_appid_list, component_names, game_names, save_to)

        if mp_appid_list:
            game_json_path = os.path.join(output_path, "game.json")
            self.__add_app_id_list_to_game_json(mp_appid_list, game_json_path)

        # 将游戏短名列表写入代码中
        # self.__make_short_name_list_js_file(game_names, save_to)
        # self.__make_subpackage_list_js_file(game_names, save_to)

        # 检查package_type的类型，如果是字符串则转换为int再做比值操作
        package_type = builder.game_setting.get("package_type")
        if isinstance(package_type, basestring):
            package_type = int(package_type)

        # 检查package_type是否大于201小于300
        if 201 < package_type < 300:
            # 添加位置信息字段到game.json文件中
            game_json_path = os.path.join(output_path, "game.json")
            self.__add_user_location_description(game_json_path)

        # 检查config目录是否存在
        if os.path.exists(builder.config_folder_path):
            # 替换config下的文件到相对应的资源目录
            project_src_path = os.path.join(builder.project_root_path, "src")
            PackageLog.log(u"替换：%s目录中的资源到：%s" % (builder.config_folder_path, project_src_path))
            self.__replace_files(builder.config_folder_path, project_src_path)

        # 拷贝预加载资源
        preload_res = os.path.join(root, "src", "libs", "preload_res")
        dst_preload_res = os.path.join(output_path, "src", "libs", "preload_res")
        PackageLog.log(u"拷贝预加载文件：%s 到工程目录：%s" % (preload_res, dst_preload_res))
        self.__copy_preload_resources(preload_res, dst_preload_res)

        # 备份工程配置
        self.__backup_project_json(
            os.path.join(builder.project_root_path, "project.json"),
            os.path.join(builder.temp_path, "project.json")
        )

        if mode == "release":
            commons = [common for common in game_names if "common" in common or "area" in common]

            # 生成package.js文件
            PackageLog.log(u"生成主包文件")
            self.__make_main_package_file(root, component_names, component_excludes, mini_game_path, len(commons) > 0)

            PackageLog.log(u"生成子包文件")
            self.__make_sub_package_file(root, game_names, [], mode, mini_game_path)

            # 更新主包project.json文件
            PackageLog.log(u"更新project.json文件")
            self.__update_main_package_files(
                root, component_names, "minigame", ["games/mini_game/main_package.js"])

            # 更新子包js文件列表
            PackageLog.log(u"更新子包js文件列表")
            self.__update_sub_package_files_singly(
                root, project_name, game_names, "minigame")

        elif mode == "develop":
            # 生成package.js文件
            PackageLog.log(u"生成主包文件")
            sub_packages = self.__make_sub_package_file(root, game_names, [], mode, mini_game_path)

            # 更新主包project.json文件
            folders = []
            folders.extend(component_names)
            folders.extend(["games/" + game for game in game_names])

            PackageLog.log(u"更新project.json文件")

            self.__update_main_package_files(
                root,
                folders,
                "minigame",
                ["games/mini_game/" + sub_package for sub_package in sub_packages]
            )

            # 拷贝本地资源文件
            PackageLog.log(u"拷贝本地资源文件到")
            self.__copy_local_resources(component_names, game_names, root, output_path)
            self.__replace_res(builder.resource_path, os.path.join(output_path, "src"))

        # 更新微信小游戏的工程配置
        PackageLog.log(u"更新微信小游戏的工程配置")
        self.__update_project_json_file(
            root, project_name, game_names, builder.project_setting["wx_app_id"],
            without_sub_package=(mode == "develop"))

        PackageState.run(self, builder)


class BuildingState(PackageState):
    def __init__(self, builder):
        PackageState.__init__(self, builder, "BuildingState")

    def go_next(self, builder):
        PackageState.go_next(self, builder)

        if builder.without_res:
            return None

        return ResourceState(builder)

    def run(self, builder):

        # 选择编译模式
        # 编译主包到临文件夹
        # 得到当前工程的根目录和打包模式
        root = builder.project_root_path
        mode = builder.pack_mode
        project_name = builder.project_setting.get("project_name", "")

        # 得到当前工程中的cocos-console路径
        # 调用命令编译打包
        cocos_console = os.path.join(
            root, "src", "frameworks", "cocos2d-x", "tools", "cocos2d-console", "bin", "cocos.py")
        output = os.path.join(root, "publish", project_name)

        PackageLog.log(u"开始构造主包")
        self.__run_command(
            "python",
            cocos_console,
            "compile",
            "-s",
            os.path.join(root, "src"),
            "-p",
            "web",
            "-m",
            "release",
            "-o",
            output
        )
        PackageLog.log(u"构造主包结束")

        if mode == "release":
            game_list = builder.project_setting["game_list"]
            game_names = [game.get("name", "") for game in game_list]

            commons = [common for common in game_names if "common" in common or "area" in common]
            games = [game for game in game_names if game not in commons]

            if len(commons) > 0:
                PackageLog.log(u"开始构造依赖组件子包")
                build_xml_file = os.path.join(root, "games", "mini_game", "game_common.xml")
                self.__run_ant(build_xml_file)
                PackageLog.log(u"构造依赖组件子包结束")

            for game in games:
                # 使用ant编译打包游戏子包
                PackageLog.log(u"开始构造子包")
                build_xml_file = os.path.join(root, "games", "mini_game", game + ".xml")
                self.__run_ant(build_xml_file)
                PackageLog.log(u"构造子包结束")

        PackageState.run(self, builder)

    def __run_command(self, command, *parameters):
        command = command + " " + " ".join(parameters)
        PackageLog.log(u"运行命令行：%s" % command)

        ret = subprocess.call(command, shell=True)
        if ret != 0:
            raise OSError(u"打包失败，请检查语法错误")

    def __run_ant(self, build_xml_file):
        ant_root = package_utils.get_environment_variable("ANT_ROOT")
        ant_path = os.path.join(ant_root, "ant")

        # 调用子进程执行ant
        command = "%s -f %s" % (ant_path, build_xml_file)
        PackageLog.log(u"运行命令行：%s" % command)
        ret = subprocess.call(command, shell=True)
        if ret != 0:
            raise OSError(u"打包子包失败，请检查语法错误")


class ResourceState(PackageState):
    def __init__(self, builder):
        project_setting = builder.project_setting
        game_setting = builder.game_setting

        self.__project_root_path = builder.project_root_path
        self.__output_path = builder.output_path
        self.__temp_path = os.path.join(self.__output_path, "temp")
        self.__resource_path = builder.resource_path

        version = game_setting["hall_app_version"]
        self.__version = str(version[0]) + "." + str(version[1]) + "." + str(version[2])
        self.__temp_version_path = os.path.join(
            self.__temp_path,
            self.__version
        )

        self.__brand = project_setting.get("brand", "")
        self.__product_id = project_setting.get("product_id", "")

        if not self.__brand:
            raise IOError(u"无法读取配置文件中的\"brand\"信息，请检查配置文件是否正确")

        if not self.__product_id:
            raise IOError(u"无法读取配置文件中的\"product_id\"信息，请检查配置文件是否正确")

        self.__product_entry_icon_path = os.path.join(
            builder.project_root_path,
            "src",
            "product_entry_icon",
            self.__brand,
            str(self.__product_id) + ".png"
        )

        self.__app_title_image_path = os.path.join(
            builder.project_root_path,
            "src",
            "guideDownApp_title_img",
            self.__brand,
            str(self.__product_id) + ".png"
        )

        self.__exclude = []

        PackageState.__init__(self, builder, "ResourceState")

    def __convert_project_root(self, includes, root):
        return [
            include["from"].replace("$PROJ_ROOT", root) + ";" + include["to"]
            for include in includes
        ]

    def __conver_project_root_with_type(self, names, root, type):
        file_list = list()

        for name in names:
            relative_path = os.path.join("games", name) if type == "game" else name
            wxpack_file = os.path.join(root, os.path.normpath(relative_path), "wxpack.json")

            if not os.path.exists(wxpack_file):
                raise OSError(u"在%s目录下没有发现wxpack.json文件" % name)

            with open(wxpack_file, "rb") as f:
                data = json.load(f)
                f.close()

            resources = data.get("resources", [])
            if not resources:
                PackageLog.warning(u"没有在%s的wxpack.json文件中找到\"resources\"字段或相关内容" % name)
                continue

            includes = self.__convert_project_root(resources, root)
            file_list.extend([include for include in includes if include not in file_list])

        return file_list

    def __clean(self):
        if os.path.exists(self.__temp_path):
            shutil.rmtree(self.__temp_path)

    def __make_temp_folder(self):
        self.__clean()
        os.makedirs(self.__temp_path)

    def __copy_file_with_line_endings(self, src, dst):
        if not os.path.exists(src):
            raise OSError("找不到该文件：%s, 无法读取内容并替换换行符" % src)

        f = open(src, 'rU')
        content = f.read()
        f.close()

        dir_name = os.path.dirname(dst)
        if not os.path.exists(dir_name):
            raise OSError(u"目标目录不存在，无法写入替换后的内容" % dst)

        f = open(dst, 'wb')
        f.write(content)
        f.close()

    def __copy_files(self, copy_infos):
        infos = []

        for info in copy_infos:
            info_list = info.split(";")
            if len(info_list) > 2:
                raise OSError(u"拷贝资源信息不正确：%s" % info)

            if len(info_list) == 1:
                full_path = utils.flat_path(info)
                dst_path = os.path.basename(info)
            else:
                full_path = utils.flat_path(info_list[0])
                dst_path = info_list[1]

            infos.append({
                "src_path": full_path,
                "dst_path": dst_path
            })

        for info in infos:
            src_path = info["src_path"]
            dst_path = os.path.join(self.__temp_version_path, info["dst_path"])
            dst_path = os.path.normpath(
                os.path.abspath(os.path.expanduser(dst_path)))

            for parent, folders, files in os.walk(src_path):
                if "native" in parent or "web" in parent or "abandoned" in parent:
                    continue

                for f in files:
                    rel_parent_path = os.path.relpath(parent, src_path)
                    dst_file_path = os.path.join(dst_path, rel_parent_path)
                    dst_file_path = os.path.abspath(dst_file_path)

                    if not os.path.exists(dst_file_path):
                        os.makedirs(dst_file_path)

                    file_path = os.path.join(parent, f)
                    basename, ext = os.path.splitext(file_path)
                    # shaders, lua 和 plist 文件使用 rU 方式读取，保证不受换行符影响
                    if ext == '.js' or ext == '.plist' or ext == '.fsh' or ext == '.vsh':
                        self.__copy_file_with_line_endings(file_path, os.path.join(dst_file_path, f))
                    else:
                        shutil.copyfile(
                            os.path.join(parent, f),
                            os.path.join(dst_file_path, f),
                        )

    def __replace_files(self):
        for parent, folders, files in os.walk(self.__resource_path):
            for f in files:
                rel_file_path = os.path.relpath(parent, self.__resource_path)
                dst_file_path = os.path.join(self.__temp_version_path, "src", rel_file_path)
                dst_file_path = os.path.abspath(dst_file_path)

                if not os.path.exists(dst_file_path):
                    os.makedirs(dst_file_path)

                file_path = os.path.join(parent, f)
                basename, ext = os.path.splitext(file_path)
                if ext == '.js' or ext == '.plist' or ext == '.fsh' or ext == '.vsh':
                    # shaders, lua 和 plist 文件使用 rU 方式读取，保证不受换行符影响
                    self.__copy_file_with_line_endings(file_path, os.path.join(dst_file_path, f))
                else:
                    shutil.copyfile(
                        os.path.join(parent, f),
                        os.path.join(dst_file_path, f),
                    )

    def __replace_icon_with_product_id(self):
        if not os.path.exists(self.__product_entry_icon_path):
            raise OSError(u"替换icon资源失败，请检查该替换资源：%s" % self.__product_entry_icon_path)

        dst = os.path.join(self.__temp_version_path, "src", "libs", "images", "replaceable")
        if not os.path.exists(dst):
            os.makedirs(dst)

        shutil.copyfile(self.__product_entry_icon_path, os.path.join(dst, "entry.png"))

    def __replace_app_title_image(self):
        if not os.path.exists(self.__app_title_image_path):
            raise OSError(u"替换app title image资源失败，请检查该替换资源：%s" % self.__app_title_image_path)

        dst = os.path.join(self.__temp_version_path, "src", "libs", "images", "replaceable")
        if not os.path.exists(dst):
            os.makedirs(dst)

        shutil.copyfile(self.__app_title_image_path, os.path.join(dst, "downApp_title.png"))

    def __compress_images_in_path(self):
        exclude_dict = {
            "exclude_files": [
                "*_s9.png",
                "minigame_games_icons"
            ],

            "exclude_folders": [
            ]
        }

        # 压缩图片资源
        pq = png_quant.PngQuant(self.__temp_version_path, exclude_dict)
        pq.compress_images_in_path()

    def __get_file_hash(self, file_path):
        basename, ext = os.path.splitext(file_path)
        if ext == '.js' or ext == '.plist' or ext == '.fsh' or ext == '.vsh':
            # shaders, lua 和 plist 文件使用 rU 方式读取，保证不受换行符影响
            f = open(file_path, 'rU')
        else:
            f = open(file_path, 'rb')

        content = f.read()
        f.close()

        return hashlib.md5(content).hexdigest().upper()

    def __get_files_info(self):
        cur_files_info = {}
        for (parent, dirs, files) in os.walk(self.__temp_version_path):
            if "native" in parent or "web" in parent or "abandoned" in parent:
                continue

            for f in files:
                if f == '.DS_Store' or f == '.git':
                    continue

                full_path = os.path.join(parent, f)
                if self.__exclude and utils.is_in_rule(full_path, self.__temp_version_path, self.__exclude):
                    PackageLog.log('%s 文件被排除了，不写入配置表' % full_path)
                    continue

                rel_path = os.path.relpath(full_path, self.__temp_version_path)
                rel_path = rel_path.replace('\\', '/')
                hash = self.__get_file_hash(full_path)
                size = os.path.getsize(full_path)
                cur_files_info[rel_path] = {
                    'hash': hash,
                    'size': size
                }
        return cur_files_info

    def __write_config_file(self, infos):
        json_file_path = os.path.join(self.__temp_path, '%s%s.json' % (self.__version, "_0"))
        json_lines = [
            '{"files":{'
        ]
        isFirst = True
        for key in infos:
            hash = infos[key]['hash']
            size = infos[key]['size']
            if isFirst:
                line = '"%s":{"hash":"%s","size":"%s"}' % (key, hash, size)
                isFirst = False
            else:
                line = ',"%s":{"hash":"%s","size":"%s"}' % (key, hash, size)
            json_lines.append(line)
        json_lines.append('}}')
        # 保存json文件
        f = open(json_file_path, 'w')
        f.writelines(json_lines)
        f.close()
        PackageLog.log(u"配置文件写入完成")
        PackageLog.log(u"生成压缩包")
        # 创建目录
        # cur_time_str = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d_%H%M%S')
        out_dir = '%s/%s_%s.zip' % (self.__output_path, self._builder.project_name, self.__version)
        utils.zip_folder(self.__temp_path, out_dir)
        PackageLog.log(u"压缩包生成完成:%s" % out_dir)

    def go_next(self, builder):
        PackageState.go_next(self, builder)

    def run(self, builder):
        # 清空临时目录
        self.__clean()
        self.__make_temp_folder()

        # 得到组件和游戏类别的名称
        names = list()

        component_list = builder.project_setting["component_list"]
        component_names = [cp.get("name", "") for cp in component_list]

        game_list = builder.project_setting["game_list"]
        game_names = [game.get("name", "") for game in game_list]

        names.extend(
            self.__conver_project_root_with_type(component_names, self.__project_root_path, "component"))
        names.extend(
            self.__conver_project_root_with_type(game_names, self.__project_root_path, "game"))

        # 拷贝相关的资源到目标目录
        PackageLog.log(u"拷贝资源至资源目录")
        self.__copy_files(names)
        self.__replace_files()
        self.__replace_icon_with_product_id()
        self.__replace_app_title_image()

        # 压缩资源
        PackageLog.log(u"压缩资源")
        self.__compress_images_in_path()

        # 将文件信息写入配置
        PackageLog.log(u"写入资源信息")
        infos = self.__get_files_info()
        self.__write_config_file(infos)

        PackageLog.log(u"资源打包完成")

        PackageState.run(self, builder)


class CleaningState(PackageState):
    def __init__(self, builder):
        PackageState.__init__(self, builder, "CleaningState")

    def go_next(self, builder):
        PackageState.go_next(self, builder)

    def run(self, builder):
        root = builder.project_root_path

        # 清理mini_game目录
        mini_game_path = os.path.join(root, "games", "mini_game")
        if os.path.exists(mini_game_path):
            PackageLog.log(u"清理：%s目录" % mini_game_path)
            shutil.rmtree(mini_game_path)

        os.makedirs(mini_game_path)

        project_name = builder.project_setting.get("project_name", "")
        project_path = os.path.join(root, "publish", project_name)

        # 清理html5目录
        html5_path = os.path.join(root, "publish", "html5")
        if os.path.exists(html5_path):
            PackageLog.log(u"清理：%s目录" % html5_path)
            shutil.rmtree(html5_path, ignore_errors=True)

        # 清理工程目录下的build.xml和index.html
        build_xml_file = os.path.join(project_path, "build.xml")
        index_html_file = os.path.join(project_path, "index.html")
        res_folder = os.path.join(project_path, "src", "res")

        if os.path.exists(build_xml_file):
            PackageLog.log(u"清理：%s文件" % build_xml_file)
            os.remove(build_xml_file)

        if os.path.exists(index_html_file):
            PackageLog.log(u"清理：%s文件" % index_html_file)
            os.remove(index_html_file)

        if os.path.exists(res_folder):
            PackageLog.log(u"清理：%s目录" % res_folder)
            shutil.rmtree(res_folder, ignore_errors=True)

        # 清理game_short_name_list
        hard_code_file = os.path.join(root, "src", "libs", "HardCode.js")
        if os.path.exists(hard_code_file):
            PackageLog.log(u"清理：%s文件" % hard_code_file)
            os.remove(hard_code_file)

        # 还原之前被覆盖的文件
        temp_path = builder.temp_path
        restore_to = os.path.join(root, "src")

        PackageLog.log(u"还原%s中的文件到%s" % (temp_path, restore_to))
        # 替换文件
        for replace_file in builder.replace_file_list:
            restore_to_file = os.path.join(restore_to, replace_file)

            if not os.path.exists(restore_to_file):
                os.remove(restore_to_file)
                continue

            shutil.copyfile(
                os.path.join(temp_path, replace_file),
                restore_to_file
            )

        # 还原project.json
        project_json_file = os.path.join(temp_path, "project.json")
        restore_to_file = os.path.join(root, "project.json")
        if os.path.exists(project_json_file):
            PackageLog.log(u"还原：%s文件到%s" % ("project.json", root))
            shutil.copyfile(project_json_file, restore_to_file)
        else:
            PackageLog.warning(u"在备份目录中没有找到\"project.json\"文件，无法还原到%s" % root)

        PackageLog.log(u"删除临时目录%s" % temp_path)
        shutil.rmtree(temp_path, ignore_errors=True)

        resource_temp_path = os.path.join(builder.output_path, "temp")
        PackageLog.log(u"删除临时的资源目录%s" % resource_temp_path)
        shutil.rmtree(resource_temp_path, ignore_errors=True)

        PackageLog.log(u"%s运行结束" % self._state_name)
        PackageLog.log("=====================================================")
