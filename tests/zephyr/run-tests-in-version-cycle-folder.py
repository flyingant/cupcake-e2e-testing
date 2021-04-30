import multiprocessing
import operator
import shutil
import subprocess
import sys
import json
import os
import time
import glob
import random
from shutil import copyfile

from zephyr_util import BostonRequest

def get_key(dict, val):
    for key, value in dict.items():
         if val == value:
             return key
 
    return None

def getTestKeyAndFileDict(dir):
    jiraKeys = {}
    files = glob.glob(dir + "/CC-*.test.ts")
    for f in files:
        jiraKeys['CC-' + f.split('-')[3]] = f
    return jiraKeys


if __name__ == '__main__':

    if len(sys.argv) < 3:
        print("cmd version-name cycle-name folder-name [jira-key]")
        quit(-1)

    versionName = sys.argv[1]       # "Version 1.0.0"
    cycleName = sys.argv[2]         # "Prod Validation"
    folderName = sys.argv[3]        # "Login Page"
    targetTestCaseJiraKey = None
    if len(sys.argv) > 4: 
        targetTestCaseJiraKey = sys.argv[4]
    testFileDir = "tests/functional/" # sys.argv[4]       # test files dir

    boston = BostonRequest()
    
    versions = boston.get_versions()
    # {
    #   "10255": "Version 0.1.0",
    #   "10286": "Version 1.0.0",
    #   "10289": "Version 1.1.0",
    #   "10292": "Hotfix-0.1.4",
    # }
    versionId = get_key(versions, versionName)

# find all test cases in the version and cycle/folder
    if folderName :
        testCases = boston.get_by_cycle_and_folder_name(versionName, cycleName, folderName)
    else :
        testCases = boston.get_by_version_and_cycle_name(versionName, cycleName)

    testJiraKeyAndFileNameDict = getTestKeyAndFileDict(testFileDir)

    testExecutions = {}
    for jiraKey, zobj in testCases.items():
        include = False
        if targetTestCaseJiraKey:
            if jiraKey == targetTestCaseJiraKey:
                include = True
        else:
            include = True
        if not include:
            continue
        jiraId = zobj[0].get("execution").get("issueId")
        testFile = testJiraKeyAndFileNameDict.get(jiraKey)
        if testFile:
            testExecutions[jiraId] = {"key": jiraKey, "file": testFile}
    
# create a temp directory to hold all test files
    tmpDir = "./tests/temp_" + str(random.randrange(10000, 99999))
    os.mkdir(tmpDir)

    # copy test files over
    for issueId, keyAndFile in testExecutions.items():
        src = keyAndFile.get("file")
        fileNames = src.split("/")
        fileName = fileNames[len(fileNames)-1]
        dst = tmpDir + "/" + fileName
        copyfile(src, dst)

# run the tests
    cmd = "npm test -- --runInBand --passWithNoTests --json --outputFile=" + tmpDir + "/jest-result.json " + tmpDir
    os.system(cmd)

# set test execution result
    testStatusDict = {}
    with open(tmpDir + "/jest-result.json") as f:
        jestTestResult = json.load(f)
    for testResult in jestTestResult.get("testResults"):
        fileName = testResult.get("name")
        jiraKey = 'CC-' + fileName.split('-')[3]

        executions = testCases.get(jiraKey)
        for one in executions:
            one.get("execution").get("issueId")
            executionStatus = testResult.get("status")
            executionId = one.get("execution").get("id")
            jiraIssueId = one.get("execution").get("issueId")
            cycleId = one.get("execution").get("cycleId")
            print("update_execution_status_by_id", executionId, executionStatus, jiraKey)
            resp = boston.update_execution_status_by_id(executionId, executionStatus, jiraIssueId, versionId, cycleId)
            print(resp)


# delete test files and the temp directory
    for issueId, keyAndFile in testExecutions.items():
        src = keyAndFile.get("file")
        fileNames = src.split("/")
        fileName = fileNames[len(fileNames)-1]
        dst = tmpDir + "/" + fileName
        os.remove(dst)

    os.rmdir(tmpDir)

