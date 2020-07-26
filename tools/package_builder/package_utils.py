#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os
import sys
import re
import string
import json
import shutil
import logging

from xml.dom import minidom


reload(sys)
sys.setdefaultencoding("utf-8")


def merge_folder(src, dst):
    for f in os.listdir(src):
        temp = os.path.join(src, f)

        if os.path.isdir(temp):
            shutil.copytree(temp, os.path.join(dst, f))
        elif os.path.isfile(temp):
            shutil.copyfile(temp, os.path.join(dst, f))


def get_environment_variable(key):
    """
        检查当前环境变量中，是否存在Key值对应的路径

        True: 返回路径
        False: 抛出异常
    """

    if key not in os.environ:
        raise ValueError(u"无法在环境变量中检查到: %s" % key)

    return os.environ[key]


def organize_files_with_wxpack(project_root, path, platform):
    wxpack = os.path.normpath(os.path.join(path, "wxpack.json"))
    if not os.path.exists(wxpack):
        raise IOError("无法读取配置文件:%s, 请检查该文件是否存在" % wxpack)

    with open(wxpack, "rb") as f:
        data = f.read()
        f.close()

    json_data = json.loads(data)

    preposition = json_data.get("preposition", [])
    postposition = json_data.get("postposition", [])
    exclude = json_data.get("exclude_" + platform, [])
    fileList = []

    # preposition files
    for jsFile in preposition:
        fileList.append(jsFile)

    # no order files
    for parent, dirnames, filenames in os.walk(path):
        if "native" in parent or "web" in parent or "abandoned" in parent:
            continue

        for filename in sorted(filenames):
            if re.search("[.]js$", filename) is None:
                continue

            jsfile = os.path.join(parent, filename)
            jsfile = os.path.relpath(jsfile, project_root)
            jsfile = jsfile.replace("\\", "/")
            # print(jsfile)

            passed = False
            # 跳过前置脚本
            for js in preposition:
                if js == jsfile:
                    passed = True
            # 跳过后置脚本
            for js in postposition:
                if js == jsfile:
                    passed = True
            # 跳过exclude正则表达式
            for pattern in exclude:
                if re.search(pattern, jsfile) is not None:
                    passed = True

            if passed:
                continue

            fileList.append(jsfile)

    # postposition files
    for postJsFile in postposition:
        fileList.append(postJsFile)

    return fileList


def copy_game_resources(modules, games, project_path, dst):
    res_exts = ["png", "jpg", "plist", "mp3", "atlas", "json"]

    dirs = []
    if modules:
        dirs.extend(modules)

    if games:
        dirs.extend(["games/" + game for game in games])

    for dir in dirs:
        dirname = os.path.join(project_path, dir)
        exclude = ["TexturePackerRes", "preload_res"]

        for parent, dirnames, filenames in os.walk(dirname):
            for filename in filenames:
                isResFile = False
                for ext in res_exts:
                    if re.search("[.]%s$"%ext, filename) != None:
                        isResFile = True
                        break;
                if isResFile == False:
                    continue

                isExclude = False
                for dir in exclude:
                    if dir in parent:
                        isExclude = True
                        break
                if isExclude:
                    continue

                srcfile = os.path.join(parent, filename)
                relpath = os.path.relpath(srcfile, project_path)
                reldirname = os.path.dirname(relpath)
                desdirname = os.path.join(dst, reldirname)
                # desdirname = desdirname.replace("src/", "")

                if os.path.exists(desdirname) == False:
                    os.makedirs(desdirname)

                desfile = os.path.join(desdirname, filename)
                PackageLog.log(u"拷贝文件 %s 到 %s" % (srcfile, desfile))
                shutil.copyfile(srcfile, desfile)

def decodeStr(str):
    # return str;
    return str.decode("utf-8").encode("gbk")

class PackageLog(object):
    @classmethod
    def basic_config(cls):
        logging.basicConfig(level=logging.INFO,
                            format="%(levelname)s - %(message)s")

    @classmethod
    def debug(cls, messages):
        if sys.platform == "win32":
            messages = decodeStr(messages)

        logging.debug(messages)

    @classmethod
    def log(cls, messages):
        if sys.platform == "win32":
            messages = decodeStr(messages)

        logging.info(messages)

    @classmethod
    def warning(cls, warning_message):
        if sys.platform == "win32":
            warning_message = decodeStr(warning_message)

        logging.warning(warning_message)

    @classmethod
    def error(cls, error_messages):
        if sys.platform == "win32":
            error_messages = decodeStr(error_messages)

        logging.error(error_messages)


class ProjectJsonCreator(object):
    def __init__(self):
        pass

    @classmethod
    def update_files(cls, project_root, folders, platform, others):
        files = []

        if "src/libs" not in folders:
            raise IOError(u"在component_list中没有找到\"src/libs\"的配置，请检查后重试")

        path = os.path.join(project_root, "src/libs")
        files.extend(organize_files_with_wxpack(project_root, path, platform))

        index = folders.index("src/libs")
        folders.pop(index)

        if "games/common" in folders:
            path = os.path.join(project_root, "games/common")
            files.extend(organize_files_with_wxpack(project_root, path, platform))

            index = folders.index("games/common")
            folders.pop(index)

        if "games/pk_common" in folders:
            path = os.path.join(project_root, "games/pk_common")
            files.extend(organize_files_with_wxpack(project_root, path, platform))

            index = folders.index("games/pk_common")
            folders.pop(index)

        if "games/mj_common" in folders:
            path = os.path.join(project_root, "games/mj_common")
            files.extend(organize_files_with_wxpack(project_root, path, platform))

            index = folders.index("games/mj_common")
            folders.pop(index)

        for folder in folders:
            if "area" not in folder:
                continue

            path = os.path.join(project_root, folder)
            files.extend(organize_files_with_wxpack(project_root, path, platform))

        for folder in folders:
            if "area" in folder:
                continue

            if "games" not in folder:
                continue

            path = os.path.join(project_root, folder)
            files.extend(organize_files_with_wxpack(project_root, path, platform))

        if others:
            files.extend(others)

        project_json_path = os.path.join(project_root, "project.json")
        with open(project_json_path, "rb") as f:
            data = f.read()
            f.close()

        project_json_data = json.loads(data)
        project_json_data["jsList"] = files

        with open(project_json_path, "w") as f:
            json.dump(project_json_data, f, indent=4, separators=(',', ': '), ensure_ascii=False)


class MainPackageBuilder(object):
    def __init__(self):
        pass

    def __get_files(self, project_root, modules, excludes):
        build_files = []
        for module in modules:
            include_path = os.path.normpath(
                os.path.join(project_root, module)
            )

            if os.path.isfile(include_path):
                PackageLog.log(u"主包构造器：跳过该文件: %s" % include_path)
                continue

            build_files.extend(self.__check_files(include_path, excludes))

        build_files.sort()
        return build_files

    def __get_global_value_info(self, files):
        infos = []
        for file in files:
            markComment = 0
            needMarkComment = False
            markClosure = 0
            needMarkClosure = False
            markArray = 0
            needMarkArray = False
            globalVals = []
            for line in open(file):
                # clera \n mark
                temp = string.replace(line, '\n', '')

                # ignore 'use strict'
                usestrictPattern = re.compile(r'.*use strict.*')
                if re.search(usestrictPattern, temp):
                    continue

                oneLineCommentPattern = re.compile(r'.*/\*.*\*/.*')
                if re.search(oneLineCommentPattern, temp):
                    pos1 = temp.index('/*')
                    temp1 = temp[0:pos1]
                    pos2 = temp.index('*/') + 2
                    temp2 = temp[pos2:len(temp)]
                    temp = temp1 + ' ' + temp2

                # check mutiple line comment
                mtlLineCommentStartPattern = re.compile(r'.*/\*.*')
                mtlLineCommentEndPattern = re.compile(r'.*\*/.*')
                if re.search(mtlLineCommentStartPattern, temp) and not re.match(mtlLineCommentEndPattern, temp):
                    pos = temp.index('/*')
                    temp = temp[0:pos]
                    needMarkComment = True

                if re.search(mtlLineCommentEndPattern, temp):
                    pos = temp.index('*/') + 2
                    temp = temp[pos:len(temp)]
                    if needMarkComment:
                        needMarkComment = False
                    else:
                        markComment = markComment - 1

                # check single line comment
                oneLineCommentPattern = re.compile(r'.*//.*')
                ignoreCommentPattern = re.compile(r'.*://.*')
                if re.search(oneLineCommentPattern, temp) and not re.match(ignoreCommentPattern, temp):
                    pos = temp.index('//')
                    temp = temp[0:pos]

                # after clear comment
                if temp != '' and markComment == 0:
                    count1 = temp.count('{')
                    count2 = temp.count('}')
                    delta = count1 - count2
                    if delta == 0 and count1 > 0 and count2 > 0:
                        pos1 = temp.index('{')
                        pos2 = temp.rindex('}') + 1
                        temp1 = temp[0:pos1]
                        temp2 = temp[pos2:len(temp)]
                        temp = temp1 + ' ' + temp2
                    if delta > 0:
                        pos = temp.index('{')
                        temp = temp[0:pos]
                        needMarkClosure = True

                    if delta < 0:
                        pos = temp.rindex('}') + 1
                        temp = temp[pos:len(temp)]
                        markClosure = markClosure + delta

                    # after clear closure
                    if temp != '' and markClosure == 0:
                        forPattern = re.compile(r'\s*for\s+(.*).*')
                        ifPattern = re.compile(r'\s*if\s+(.*).*')
                        if not re.match(forPattern, temp) and not re.match(ifPattern, temp):

                            countArr1 = temp.count('[')
                            countArr2 = temp.count(']')
                            deltaArr = countArr1 - countArr2
                            if deltaArr == 0 and countArr1 > 0 and countArr2 > 0:
                                pos1 = temp.index('[')
                                pos2 = temp.rindex(']') + 1
                                temp1 = temp[0:pos1]
                                temp2 = temp[pos2:len(temp)]
                                temp = temp1 + ' ' + temp2
                            if deltaArr > 0:
                                pos = temp.index('[')
                                temp = temp[0:pos]
                                needMarkArray = True

                            if deltaArr < 0:
                                pos = temp.rindex(']') + 1
                                temp = temp[pos:len(temp)]
                                markArray = markArray + deltaArr

                            # after clear array
                            if temp != '' and markArray == 0:
                                valDefinePattern = re.compile(r'\s*var\s+\S+\s*=.*')
                                mValDef = re.match(valDefinePattern, temp)

                                funcDefinePattern = re.compile(r'\s*function\s+\S+\s*(.*).*')
                                mfuncDef = re.match(funcDefinePattern, temp)

                                ccExtendPattern = re.compile(r'\s*cc\.\S+\s*=.*')
                                mCCExt = re.match(ccExtendPattern, temp)

                                # matched value define\ function define\ cc extend
                                if mValDef or mfuncDef or mCCExt:
                                    if mValDef:
                                        start = temp.index('var') + 3
                                        end = temp.index('=')
                                        val = temp[start:end]
                                        val = string.replace(val, ' ', '')
                                        if not val in globalVals:
                                            globalVals.append(val)
                                    if mfuncDef:
                                        start = temp.index('function') + len('function')
                                        end = temp.index('(')
                                        val = temp[start:end]
                                        val = string.replace(val, ' ', '')
                                        if not val in globalVals:
                                            globalVals.append(val)
                                    if mCCExt:
                                        end = temp.index('=')
                                        val = temp[0:end]
                                        val = string.replace(val, ' ', '')
                                        if not val in globalVals:
                                            globalVals.append(val)

                            if needMarkArray:
                                markArray = markArray + deltaArr
                                needMarkArray = False

                    if needMarkClosure:
                        markClosure = markClosure + delta
                        needMarkClosure = False

                if needMarkComment:
                    markComment = markComment + 1
                    needMarkComment = False

            info = {}
            info['file'] = file
            info['globalVals'] = globalVals
            infos.append(info)

        return infos

    def __check_files(self, path, excludes):
        include_files = []
        for root, folders, files in os.walk(path):
            for f in files:
                f = os.path.join(root, f)
                if self.__is_include(root, f, excludes):
                    include_files.append(f)

        return include_files

    def __is_include(self, root, f, excludes):
        if "native" in root or "web" in root or "abandoned" in root:
            return False

        f = f.replace('\\', '/')

        if not f.endswith(".js"):
            return False

        for ex in excludes:
            if ex in f:
                return False

        filename = os.path.basename(f)
        if filename.startswith("manifest_") or filename.endswith('_manifest.js'):
            return False

        return True

    def build(self, project_root, modules, excludes, output_path, has_game_common=False):
        if not os.path.exists(output_path):
            os.mkdir(output_path)

        filename = "main_package.js"
        output_file = os.path.join(output_path, filename)

        files = self.__get_files(project_root, modules, excludes)
        global_value_info = self.__get_global_value_info(files)

        with open(output_file, "w") as f:
            f.write("\"use strict\"\n")
            f.write("\n")

            for info in global_value_info:
                file_info = "// " + info['file'] + "\n"
                f.write(file_info)
                for val in info["globalVals"]:
                    line = "window." + val + " = " + val + "\n"
                    f.write(line)
                f.write("\n")

            f.write("var sp=sp||{};{window.sp=sp};\n")  # hard code!
            f.write("var ccs=ccs||{};window.ccs=ccs;\n")  # hard code!
            f.write("var ccui=ccui||{};window.ccui=ccui;\n")  # hard code!


class SubPackageBuilder(object):
    def __init__(self):
        pass

    def __get_js_file_names(self, path):
        for parent, dirs, files in os.walk(path):
            if "native" in parent or "web" in parent or "abandoned" in parent:
                continue

            for f in files:
                name, ext = os.path.splitext(f)

                if "manifest" in f:
                    continue

                if ext != ".js":
                    continue

                yield name

    def make_sub_package_content(self, content_name, path):
        content = ""
        for file_name in self.__get_js_file_names(path):
            if file_name != "game":
                content += "window." + file_name + "=" + file_name + "\n"

            if "client_" + content_name == file_name or content_name + "_client" == file_name:
                content += "GameManager.registerGameClient(\"" + content_name + "\", " + file_name + ");\n"

            if "rule_" + content_name == file_name or content_name + "_rule" == file_name:
                content += "GameManager.registerRuleClass(\"" + content_name + "\", " + file_name + ");\n"

            if "config_" + content_name == file_name or content_name + "_config" == file_name:
                content += "GameManager.registerReplay(\"" + content_name + "\", " + file_name + ");\n"

        return content

    def build(self, root, games, package_name, mode, output_path):
        content = "if(isMiniGame()) {\n"
        for game in games:
            path = os.path.join(root, "games", game)
            content += "\n"
            content += self.make_sub_package_content(game, path)

        if mode == "develop":
            content += "MiniGameEvent._loadedStates[\"{package_name}\"] = true\n".format(package_name=package_name)
            content += "Loader.IS_LOCAL_RES = true\n"

        content += "}"

        output_file_path = os.path.join(output_path, package_name + "_sub_package" + ".js")
        with open(output_file_path, "wb") as f:
            f.write(content)

    @classmethod
    def create_build_xml(cls, project_root, js_list, output, file_name="game"):
        """

        使用ant配置build.xml文件并执行closure compiler对指定的游戏目录进行编译和压缩

        :param jsList: 需要被closure compiler编译并压缩的js脚本列表
        :param sub_game_file: 被编译并压缩后的输出文件

        """

        # 检查Ant环境
        ant_root = get_environment_variable("ANT_ROOT")
        ant_path = os.path.join(ant_root, "ant")

        # 配置压缩参数
        DEFAULT_TAG = "compile"
        TASK_NAME = "jscomp"
        TASK_CLASS_NAME = "com.google.javascript.jscomp.ant.CompileTask"
        COMPLICATION_LEVEL = "simple"
        WARNING_LEVEL = "quiet"
        DEBUG = "false"

        # 构建build.xml文件
        imp = minidom.getDOMImplementation()
        dom = imp.createDocument(None, "project", None)

        root = dom.documentElement
        root.setAttribute("name", "compress project")
        root.setAttribute("basedir", project_root)
        root.setAttribute("default", DEFAULT_TAG)

        taskdef = dom.createElement("taskdef")
        taskdef.setAttribute("name", TASK_NAME)
        taskdef.setAttribute("classname", TASK_CLASS_NAME)

        compiler_jar_path = os.path.join(
            project_root,
            "src",
            "frameworks",
            "cocos2d-html5",
            "tools",
            "compiler",
            "compiler.jar")

        taskdef.setAttribute("classpath", compiler_jar_path)
        root.appendChild(taskdef)

        target = dom.createElement("target")
        target.setAttribute("name", "compile")

        jscomp = dom.createElement("jscomp")
        jscomp.setAttribute("compilationLevel", COMPLICATION_LEVEL)
        jscomp.setAttribute("warning", WARNING_LEVEL)

        jscomp.setAttribute("debug", DEBUG)
        jscomp.setAttribute("output", os.path.join(output, file_name + ".js"))

        sources = dom.createElement("sources")
        sources.setAttribute("dir", "${basedir}")

        for filePath in js_list:
            f = dom.createElement("file")
            f.setAttribute("name", os.path.normpath(filePath))
            sources.appendChild(f)

        jscomp.appendChild(sources)
        target.appendChild(jscomp)
        root.appendChild(target)

        # 将构建好的内容写入build.xml文件
        build_xml_file = os.path.join(project_root, "games", "mini_game", file_name + ".xml")

        with open(build_xml_file, "wb") as f:
            try:
                f.write(dom.toprettyxml())
                f.close()
            except Exception as e:
                raise IOError(u"%s写入文件失败: %s" % (build_xml_file, str(e)))
