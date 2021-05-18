#!/usr/bin/env python

import os
import sys
import subprocess
import glob

class PngQuant:
    def __init__(self, root_path, exclude_dict={}):

        self.command_path = os.path.join(
            os.path.abspath(os.path.dirname(__file__)),
            "bin",
            "win32" if sys.platform == "win32" else "mac",
            "pngquant.exe" if sys.platform == "win32" else "pngquant"
        )

        self.root_path = root_path
        self.exclude_dict = exclude_dict
        self.exclude_files = self.exclude_dict.get("exclude_files", [])
        self.exclude_folders = self.exclude_dict.get("exclude_folders", [])

    def compress_image(self, image):
        if not os.path.exists(image):
            raise Exception("image cannot be None")

        command_list = [
            self.command_path,
            "--ext=.png",
            "--force",
            image
        ]

        print("start compressing: " + image)
        command = " ".join(command_list)

        ret = subprocess.call(command, shell=True)
        if ret < 0:
            raise Exception("error:" + str(ret) + " compressing failed: " + image)

    def compress_images_in_path(self,):
        if not os.path.exists(self.root_path):
            raise Exception("the root_path: " + self.root_path + "cannot be found")

        for parent, dirs, files in os.walk(self.root_path):
            path = os.path.relpath(parent, self.root_path)
            if self.check_exclude_folder(path):
                continue

            for f in files:
                name, ext = os.path.splitext(f)

                if self.check_exclude_file(parent, f):
                    continue

                if ext != ".png":
                    continue

                self.compress_image(os.path.join(parent, f))

    def check_exclude_folder(self, path):
        for exclude in self.exclude_folders:
            if exclude in path:
                return True

        return False

    def check_exclude_file(self, root, f):
        for ef in self.exclude_files:
            search_path = os.path.join(root, ef)
            search_list = glob.glob(search_path)
            search_list = [os.path.split(item)[1] for item in search_list]

            if f in search_list:
                return True

        return False
