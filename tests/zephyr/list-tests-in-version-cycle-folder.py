import sys

from zephyr_util import BostonRequest

def get_key(dict, val):
    for key, value in dict.items():
         if val == value:
             return key
 
    return None

if __name__ == '__main__':

    if len(sys.argv) < 2:
        print("cmd version-name cycle-name [folder-name]")
        quit(-1)

    versionName = sys.argv[1]       # "Version 1.0.0"
    cycleName = sys.argv[2]         # "Prod Validation"

    folderName = None        # "Login Page"
    if len(sys.argv) > 3:
        folderName = sys.argv[3]

    boston = BostonRequest()
    
    if folderName :
        testCases = boston.get_by_cycle_and_folder_name(versionName, cycleName, folderName)
    else :
        testCases = boston.get_by_version_and_cycle_name(versionName, cycleName)

    for jiraKey, zobj in testCases.items():
        jiraId = zobj[0].get("execution").get("issueId")
        print(str(jiraId) + "\t" + jiraKey)
    
