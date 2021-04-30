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
    
    versions = boston.get_versions()
    print(json.dumps(versions))

# {
#   "10255": "Version 0.1.0",
#   "10261": "Version 0.1.1",
#   "10264": "Version 0.1.2",
#   "10269": "Version 0.1.3",
#   "10274": "Version 0.2.0",
#   "10280": "Version 0.1.4",
#   "10286": "Version 1.0.0",
#   "10289": "Version 1.1.0",
#   "10292": "Hotfix-0.1.4",
#   "10298": "Version 1.2.0",
#   "10303": "Version 1.3.0"
# }

    cycles = boston.get_cycles(10286)
    print(json.dumps(cycles))

# {
#   "-1": "Ad hoc",
#   "06c555f7-2016-4b3c-b110-790c3560d3d5": "New Features",
#   "5817f3cd-a632-4da7-80db-c78109f500a5": "Prod Validation",
#   "327778f1-dc24-4eee-b1af-f35691113cca": "Regression Dev",
#   "8c7772b8-6355-4f98-9557-ec8e148ed415": "Regression_STAGE"
# }

    testCases = boston.get_by_version_and_cycle_name("Version 1.0.0", "Prod Validation")
    print(json.dumps(testCases))

# {
#   "39157": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "40128": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "40586": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "39154": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "39130": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35261": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33073": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33323": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35485": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "36758": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35575": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33715": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35296": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "36008": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33671": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35488": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35320": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35741": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33177": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35265": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33082": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "34491": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "34587": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32886": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33268": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32872": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33269": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33930": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32769": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35313": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33324": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "34768": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "34845": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33079": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35257": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32884": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32791": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "34277": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33265": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32887": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "36763": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32914": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "34672": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33224": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "39374": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32771": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32880": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32917": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32787": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "36761": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "32883": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "34464": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35567": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "35539": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33665": "5817f3cd-a632-4da7-80db-c78109f500a5",
#   "33718": "5817f3cd-a632-4da7-80db-c78109f500a5"
# }

    boston.execute_test(33718, 'passed', 10286, "5817f3cd-a632-4da7-80db-c78109f500a5")


