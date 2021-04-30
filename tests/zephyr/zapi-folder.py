import multiprocessing
import operator
import shutil
import subprocess
import sys
import json
import os
import time

from zephyr_util import BostonRequest

if __name__ == '__main__':
    boston = BostonRequest()

    folders = boston.get_folders(10286, "327778f1-dc24-4eee-b1af-f35691113cca")    
    print(json.dumps(folders))
    
    testCases = boston.get_by_folder_or_cycle("Version 1.0.0", "Add new staff member")
    print(json.dumps(testCases))

    testCases = boston.get_by_folder_or_cycle("Version 1.0.0", "Prod Validation")
    print(json.dumps(testCases))
