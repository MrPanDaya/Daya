# -*- coding: utf-8 -*-
import os,sys
import shutil
import json
import subprocess
from xml.dom import minidom

import excopy

sys.path.append(os.path.normpath(os.path.join(os.path.dirname(__file__), '../utils')))
import utils
from logUtils import raise_known_error, Logging

reload(sys)
sys.setdefaultencoding("utf-8")

class WebSubPackageBuilder(object):

    def __init__(self, rootPath):
        self.proj_path = rootPath

    def createSubPackageByModule(self, module, outputDir):
        content = "if(isWeb()){\n"
        classes = []
        search_path = os.path.join(self.proj_path, "games", module)
        if not os.path.exists(search_path):
            raise_known_error("module not found == %s" % search_path)
        # 注册 window 全局变量
        for parent, dirnames, filenames in os.walk(search_path):
            for filename in filenames:
                if filename[-3:] == ".js":
                    classname = filename[:-3]
                    classes.append(classname)
                    if classname == "game":
                        continue
                    if "manifest" in classname:
                        continue
                    content += "window." + classname + "=" + classname + "\n"
        # 注册GameManager
        for classname in classes:
            if "client_" + module == classname or module + "_client" == classname:
                content += "GameManager.registerGameClient(\"" + module + "\", " + classname + ");\n"
            if "rule_" + module == classname or module + "_rule" == classname:
                content += "GameManager.registerRuleClass(\"" + module + "\", " + classname + ");\n"
            if "config_" + module == classname or module + "_config" == classname:
                content += "GameManager.registerReplay(\"" + module + "\", " + classname + ");\n"
        content += "}"

        # 写入头文件
        filepath = os.path.join(self.proj_path, "games", "web_game", module + "_head.js")
        if os.path.exists(os.path.dirname(filepath)):
            shutil.rmtree(os.path.dirname(filepath))
        os.makedirs(os.path.dirname(filepath))
        with open(filepath, "w+") as file_object:
            try:
                file_object.write(content)
            except Exception as e:
                raise_known_error("写入文件失败 = %s" % filepath)

        temp_public_path = outputDir
        sub_game_file = os.path.join(temp_public_path, module + "_game.js")
        self.games_path = os.path.join(self.proj_path, "games")
        jsList = self.getCompileJsListByModule(module)
        self.buildAntFile(jsList, sub_game_file, module)

        # 拷贝游戏资源
        cfg_config = {
            "from" : ".",
            "to" : ".",
            "exclude" : [
                "*.js$",
                "TexturePackerRes",
                ".git",
                ".gitgnore"
            ]
        }
        excopy.copy_files_with_config(cfg_config, search_path, temp_public_path)
        # 删除web_games文件夹
        if os.path.exists(os.path.dirname(filepath)):
            shutil.rmtree(os.path.dirname(filepath))

    def buildAntFile(self, jsList, sub_game_file, module):
        """

        使用ant配置build.xml文件并执行closure compiler对指定的游戏目录进行编译和压缩

        :param jsList: 需要被closure compiler编译并压缩的js脚本列表
        :param sub_game_file: 被编译并压缩后的输出文件

        """

        # 检查Ant环境
        antRoot = self.checkEnvironmentVariable("ANT_ROOT")
        antPath = os.path.join(antRoot, "ant")


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
        root.setAttribute("basedir", self.proj_path)
        root.setAttribute("default", DEFAULT_TAG)

        taskdef = dom.createElement("taskdef")
        taskdef.setAttribute("name", TASK_NAME)
        taskdef.setAttribute("classname", TASK_CLASS_NAME)

        compiler_jar_path = os.path.join(
            self.proj_path,
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
        jscomp.setAttribute("output", sub_game_file)

        sources = dom.createElement("sources")
        sources.setAttribute("dir", "${basedir}")

        regfilepath = os.path.join(self.games_path, "web_game", module + "_head.js")
        if os.path.exists(regfilepath) == False:
            raise Exception("子包注册文件 sub_reg.js 不存在");
        regfilepath = os.path.relpath(regfilepath, self.proj_path)
        jsList.append(regfilepath)

        for filePath in jsList:
            file = dom.createElement("file")
            file.setAttribute("name", os.path.normpath(filePath))
            sources.appendChild(file)

        jscomp.appendChild(sources)
        target.appendChild(jscomp)
        root.appendChild(target)

        # 将构建好的内容写入build.xml文件
        buildXMLFile = os.path.join(os.path.dirname(sub_game_file), "build.xml")

        with open(buildXMLFile, "wb") as f:
            try:
                f.write(dom.toprettyxml())
                f.close()
            except Exception as e:
                raise Exception(buildXMLFile + " 写入文件失败 " + str(e))

        # 调用子进程执行ant
        command = "%s -f %s" % (antPath, buildXMLFile)
        ret = subprocess.call(command, shell=True)
        if ret != 0:
            raise Exception("打包子包失败 请检查语法错误")

        # 将不需要的build.xml删除
        if os.path.exists(buildXMLFile):
            try:
                os.remove(buildXMLFile)
            except Exception as e:
                raise Exception(buildXMLFile + " 文件删除失败 " + str(e))

    def checkEnvironmentVariable(self, key):

        """
            检查当前环境变量中，是否存在Key值对应的路径

            True: 返回路径
            False: 抛出异常
        """

        ret = None

        try:
            ret = os.environ[key]
        except Exception:
            Exception("无法在环境变量中检查到:" + key)

        return ret

    def getCompileJsListByModule(self, module):
        jsList = []
        preList = []
        postList = []
        gameConfigPath = os.path.join(self.proj_path, "games", module, "wxpack.json")
        if os.path.exists(gameConfigPath):
            gameConfig = utils.parse_json(gameConfigPath)
            preposition = gameConfig.get("preposition", [])
            for preFile in preposition:
                jsList.append(preFile)
                preList.append(preFile)
            postposition = gameConfig.get("postposition", [])
            for postFile in postposition:
                postList.append(postFile)
        else:
            Logging.log_msg("wxpack.json 文件不存在 %s" % gameConfigPath)

        for parent, dirnames, filenames in os.walk(self.games_path):
            relpath = os.path.relpath(parent, os.path.join(parent, ".."))
            isSamePath = os.path.normpath(os.path.abspath(os.path.join(parent, ".."))) == os.path.normpath(
                os.path.abspath(self.games_path))
            if module == relpath and isSamePath == True:
                for p, dirname, filenames in os.walk(parent):
                    for filename in filenames:
                        token = filename.split(".")
                        if len(token) != 2 or filename.split(".")[1] != "js":
                            continue

                        filename = os.path.join(os.path.normpath(p), filename)
                        filename = os.path.relpath(filename, self.proj_path)
                        filename = filename.replace("\\", "/")

                        isPass = False
                        for postFile in postList:
                            if postFile == filename:
                                isPass = True
                        for preFile in preList:
                            if preFile == filename:
                                isPass = True
                        if 'manifest' in filename:
                            isPass = True

                        if isPass == False:
                            jsList.append(filename)
        for postFile in postList:
            jsList.append(postFile)
        return jsList
