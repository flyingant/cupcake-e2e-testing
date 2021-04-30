import multiprocessing
import operator
import shutil
import subprocess
import sys
import json
import os
import time

from zephyr_util import BostonRequest

def get_key(dict, val):
    for key, value in dict.items():
         if val == value:
             return key
 
    return None


if __name__ == '__main__':

    if len(sys.argv) < 5:
        print("cmd version-name, cycle-name jira-key execution-status")
        quit(-1)

    versionName = sys.argv[1]   # "Version 1.0.0"
    cycleName = sys.argv[2]     # "Prod Validation"
    jiraKey = sys.argv[3]       # CC-XXX
    testStatus = sys.argv[4]    # passed / failed / blocked

    boston = BostonRequest()
    
    versions = boston.get_versions()
    # {
    #   "10255": "Version 0.1.0",
    #   "10286": "Version 1.0.0",
    #   "10289": "Version 1.1.0",
    #   "10292": "Hotfix-0.1.4",
    # }
    versionId = get_key(versions, versionName)

    cycles = boston.get_cycles(versionId)
    # {
    #   "-1": "Ad hoc",
    #   "06c555f7-2016-4b3c-b110-790c3560d3d5": "New Features",
    #   "5817f3cd-a632-4da7-80db-c78109f500a5": "Prod Validation",
    #   "327778f1-dc24-4eee-b1af-f35691113cca": "Regression Dev",
    #   "8c7772b8-6355-4f98-9557-ec8e148ed415": "Regression_STAGE"
    # }
    print(json.dumps(cycles))
    cycleId = get_key(cycles, cycleName)

    case = boston.get_case(jiraKey)
    jiraId = case.get('id')

    testCases = boston.get_by_folder_or_cycle(versionName, cycleName)
    # {
    #   "39157": "5817f3cd-a632-4da7-80db-c78109f500a5",
    #   "40128": "5817f3cd-a632-4da7-80db-c78109f500a5",
    #   "33718": "5817f3cd-a632-4da7-80db-c78109f500a5"
    # }
    print(json.dumps(testCases))

    cycleOfCase = testCases.get(jiraKey)
    if cycleOfCase is None:
        print('{"error":"not in the cycle"}')
        quit(-1)

    print("boston.update_execution_status_by_id", cycleOfCase.get("execution").get("id"))
    boston.update_execution_status_by_id(cycleOfCase.get("execution").get("id"))

