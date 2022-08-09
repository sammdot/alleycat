#!/usr/bin/env python3

import json
from os.path import abspath, dirname, join
from setuptools import setup


def get_version(path):
  with open(join(abspath(dirname(__file__)), path), "r") as file:
    return json.load(file).get("version")


setup(
  version=get_version("_version.json"),
)
