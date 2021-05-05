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


def setJestExecutionStatus(jestJson, versionName, cycleName, folderName):
    boston = BostonRequest()
    
    versions = boston.get_versions()
    # {
    #   "10255": "Version 0.1.0",
    #   "10286": "Version 1.0.0",
    #   "10289": "Version 1.1.0",
    #   "10292": "Hotfix-0.1.4",
    # }
    versionId = get_key(versions, versionName)
    if not versionId:
        print("cannot find version ", versionName)
        quit(-1)

    cycles = boston.get_cycles(versionId)
    # {
    #   "-1": "Ad hoc",
    #   "06c555f7-2016-4b3c-b110-790c3560d3d5": "New Features",
    #   "5817f3cd-a632-4da7-80db-c78109f500a5": "Prod Validation",
    #   "327778f1-dc24-4eee-b1af-f35691113cca": "Regression Dev",
    #   "8c7772b8-6355-4f98-9557-ec8e148ed415": "Regression_STAGE"
    # }
    cycleId = get_key(cycles, cycleName)
    if not cycleId:
        print("cannot find cycle ", cycleName)
        quit(-1)

    if folderName :
        testCases = boston.get_by_cycle_and_folder_name(versionName, cycleName, folderName)
    else :
        testCases = boston.get_by_version_and_cycle_name(versionName, cycleName)

    testStatusDict = {}
    with open(jestJson) as f:
        jestTestResult = json.load(f)
    for testResult in jestTestResult.get("testResults"):
        fileName = testResult.get("name").split('/')
        jiraKey = 'CC-' + fileName[len(fileName)-1].split('-')[3]
        jiraIssue = boston.get_case(jiraKey)
        jiraId = jiraIssue.get('id')

        executions = testCases.get(jiraKey)
        if not executions:
            continue
        for one in executions:
            one.get("execution").get("issueId")
            executionStatus = testResult.get("status")
            executionId = one.get("execution").get("id")
            jiraIssueId = one.get("execution").get("issueId")
            execVersion = one.get("versionName")
            execCycle = one.get("execution").get("cycleName")
            execFolder = one.get("execution").get("folderName")
            cycleId = one.get("execution").get("cycleId")
            print(execVersion, "/", execCycle, "/", execFolder, "/", jiraKey, executionStatus)
            resp = boston.update_execution_status_by_id(executionId, executionStatus, jiraIssueId, versionId, cycleId)


