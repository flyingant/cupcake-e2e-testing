import multiprocessing
import operator
import shutil
import subprocess
import sys
import json
import os
import time

from set_jest_execuation_status import setJestExecutionStatus 

if __name__ == '__main__':

    if len(sys.argv) < 3:
        print("cmd jest-result-json version cycle folder")
        quit(-1)

    jestJson = sys.argv[1]  # jest result json file
    versionName = sys.argv[2]
    cycleName = sys.argv[3]
    folderName = sys.argv[4]

    if not versionName:
        print ('No version name specified. Skip Zephyr process')
        quit(0)
    if not cycleName:
        print ('No cycle name specified. Skip Zephyr process')
        quit(0)
        
    setJestExecutionStatus(jestJson, versionName, cycleName, folderName)