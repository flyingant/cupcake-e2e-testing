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

    if len(sys.argv) < 4:
        print("cmd version-name, cycle-name jest-result-json")
        quit(-1)

    versionName = sys.argv[1]   # "Version 1.0.0"
    cycleName = sys.argv[2]     # "Prod Validation"
    jestJson = sys.argv[3]      # jest result json file

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
    cycleId = get_key(cycles, cycleName)


    testCases = boston.get_by_version_and_cycle_name(versionName, cycleName)
    # {
    #   "39157": "5817f3cd-a632-4da7-80db-c78109f500a5",
    #   "40128": "5817f3cd-a632-4da7-80db-c78109f500a5",
    #   "33718": "5817f3cd-a632-4da7-80db-c78109f500a5"
    # }


    testStatusDict = {}
    with open(jestJson) as f:
        jestTestResult = json.load(f)
    for testResult in jestTestResult.get("testResults"):
        fileName = testResult.get("name")
        jiraKey = 'CC-' + fileName.split('-')[3]
        jiraIssue = boston.get_case(jiraKey)
        jiraId = jiraIssue.get('id')

        cycleOfCase = testCases.get(int(jiraId))
        if cycleOfCase:
            testStatusDict[jiraId] = testResult.get("status")

    for testCaseId, executionResult in testStatusDict.items():
        # # boston.execute_test(jiraId, testStatus, versionId, cycleId)
        print("boston.execute_test", testCaseId, executionResult, versionId, cycleId)

