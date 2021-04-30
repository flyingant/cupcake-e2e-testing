from json import JSONDecodeError

import jwt
import time
import hashlib
import requests
import json

PROD_URL = "https://prod-api.zephyr4jiracloud.com/connect"
JIRA_CASE_URL = "/rest/api/2/issue/"
VERSION_CASE_URL = "/rest/api/2/project/CC/versions"
CYCLES_ENDPOINT = "/public/rest/api/1.0/cycles/search"
FOLDERS_ENDPOINT = "/public/rest/api/1.0/folders"
QUERY_SEARCH_ENDPOINT = "/public/rest/api/1.0/zql/search"
EXECUTION_URL = "/public/rest/api/1.0/execution"

STATUS_MAP = {
    "passed": 1,
    "failed": 2,
    "blocked": 4
}
ID_DEF = 'id'

Z_USER = "admin@bscdv.com"
Z_ACCESS_KEY = "YWY2YmY5NzUtZmJmZC0zZDk3LWFmMDMtNGM3NGEyMjIyNmJmIDVjZDVkYzQzYWVlMzA4MGRjMmY1ZmUwMCBVU0VSX0RFRkFVTFRfTkFNRQ"
Z_SECRET_KEY = "HfSlWtIhb2gnO3gwfQ7Q18Mch5kB9Xh5uV-7vt99rs4"

JIRA_URL = "https://teamsolace.atlassian.net"
JIRA_USER = "admin@bscdv.com"
JIRA_PASS = "x5OjSneaFl6GQVCVMRkfFD65"
JIRA_ACCESS_TOKEN = 'x5OjSneaFl6GQVCVMRkfFD65'

USER_TO_ASSIGN = "anastasiia.dedikova"

EXPIRE_SESSION_TIME = 3600
STATUS_OK = 200
DEFAULT_PROJECT_ID = 10159


class JWTGenerator:

    def __init__(self, *, user, access_key, secret_key):
        self.user = user
        self.access_key = access_key
        self.secret_key = secret_key
        self.expire = EXPIRE_SESSION_TIME

    def jwt(self, url, data, method):

        url_normalized = url.replace(PROD_URL, "")
        canonical_URI, *canonical_query_string = url_normalized.split('?')

        if method in ["POST", "PUT"]:
            canonical_query_string = []
        else:
            canonical_query_string = ["{}={}".format(k, v) for k, v in data]

        canonical_request = "{}&{}&{}".format(method, canonical_URI, '&'.join(canonical_query_string))
        canonical_request_encoded = canonical_request.encode('utf-8')

        qsh = hashlib.sha256(canonical_request_encoded).hexdigest()

        payload = {
            'sub': self.user,
            'qsh': qsh,
            'iss': self.access_key,
            'exp': time.time() + self.expire,
            'iat': time.time()
        }
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        return token

    def headers(self, url, data, method):
        headers = {
            'Authorization': 'JWT ' + self.jwt(url, data, method),
            'zapiAccessKey': self.access_key
        }
        return headers


class JiraRequest:

    @staticmethod
    def get(url, data):
        headers = {"Accept": "application/json"}

        resp = requests.get(url, params=data, headers=headers, auth=(JIRA_USER, JIRA_PASS))
        if resp.status_code == STATUS_OK:
            return resp.json()

        resp.raise_for_status()


class Request:
    jwt = JWTGenerator(
        user=Z_USER,
        access_key=Z_ACCESS_KEY,
        secret_key=Z_SECRET_KEY,

    )
    session = requests.Session()

    @staticmethod
    def post(url, data):
        headers = Request.jwt.headers(url, data, 'POST')
        headers.update({"Content-Type": "application/json"})

        return requests.post(url, data=json.dumps(dict(data)), headers=headers)

    @staticmethod
    def put(url, data):
        headers = Request.jwt.headers(url, data, 'PUT')
        headers.update({"Content-Type": "application/json"})

        return requests.put(url, data=json.dumps(dict(data)), headers=headers)

    @staticmethod
    def get(url, data):
        headers = Request.jwt.headers(url, data, 'GET')
        headers.update({"Content-Type": "text/plain"})
        return requests.get(url, params=data, headers=headers)

    @staticmethod
    def delete(url, data):
        headers = Request.jwt.headers(url, data, 'DELETE')
        headers.update({"Content-Type": "application/json"})
        return requests.delete(url, data=json.dumps(dict(data)), headers=headers)


class BostonRequest(Request):
    def __init__(self):
        self.prod_url = PROD_URL

    def get_by_version_and_cycle_name(self, version_name, cycle_name):
        """
        ZAPI.
        This method performed zql request. Get all test cases from request
        and returns dictionary with issueId and cycleId from api response.

        :param version_name: Version name of application (like in JIRA).
        :param cycle_name: Name of cycle (like in JIRA. example "Ad-hoc", "Regression" etc).
        :return: Dictionary with issueId and cycleId.
        """
        url = QUERY_SEARCH_ENDPOINT

        payload = {
            "zqlQuery": 'project = Cupcake AND fixVersion = "{}" AND cycleName = "{}"'.format(version_name, cycle_name)
        }
        resp = "-1"
        try:
            resp = self.post("{}{}".format(self.prod_url, url), data=sorted(payload.items(), key=lambda x: x[0])).json().get(
                "searchObjectList")
        except JSONDecodeError:
            return resp

        issueKeyAndValue = {}
        for i in resp:
            issueKey = i.get("issueKey")
            executions = issueKeyAndValue.get(issueKey)
            if not executions:
                executions = []
                issueKeyAndValue[issueKey] = executions
            executions.append(i)
        return issueKeyAndValue


    def get_by_cycle_and_folder_name(self, version_name, cycle_name, folder_name):
        """
        ZAPI.
        This method performed zql request. Get all test cases from request
        and returns dictionary with issueId and cycleId from api response.

        :param version_name: Version name of application (like in JIRA).
        :param cycle_name: Name of cycle (like in JIRA. example "Ad-hoc", "Regression" etc).
        :return: Dictionary with issueId and cycleId.
        """
        url = QUERY_SEARCH_ENDPOINT

        payload = {
            "zqlQuery": 'project = Cupcake AND fixVersion = "{}" AND folderName = "{}" AND cycleName = "{}"'.format(version_name, folder_name, cycle_name)
        }
        resp = "-1"
        try:
            resp = self.post("{}{}".format(self.prod_url, url), data=sorted(payload.items(), key=lambda x: x[0])).json().get(
                "searchObjectList")
        except JSONDecodeError:
            return resp

        issueKeyAndValue = {}
        for i in resp:
            issueKey = i.get("issueKey")
            executions = issueKeyAndValue.get(issueKey)
            if not executions:
                executions = []
                issueKeyAndValue[issueKey] = executions
            executions.append(i)
            
        return issueKeyAndValue


    def get_by_query_for_delete(self, version_name, cycle_name):
        """
        ZAPI.
        This method performed zql request. Get all test cases from request
        and returns dictionary with executionId and issueId from api response.

        :param version_name: Version name of application (like in JIRA).
        :param cycle_name: Name of cycle (like in JIRA. example "Ad-hoc", "Regression" etc).
        :return: Dictionary with executionId and issueId.
        """
        url = QUERY_SEARCH_ENDPOINT

        payload = {
            "zqlQuery": 'project = Cupcake AND fixVersion = "{}" AND cycleName = "{}"'.format(version_name, cycle_name)
        }
        resp = self.post("{}{}".format(self.prod_url, url), data=sorted(payload.items(), key=lambda x: x[0])).json().get(
            "searchObjectList")
        execution_id_issue_id = {i.get("execution").get("id"): i.get("execution").get("issueId") for i in resp}
        return execution_id_issue_id



    def get_folders(self, version_id, cycleId):
        url = FOLDERS_ENDPOINT

        payload = {
            "projectId": DEFAULT_PROJECT_ID,
            "versionId": version_id,
            "cycleId": cycleId
        }

        resp = self.get('{}{}'.format(self.prod_url, url), data=sorted(payload.items(), key=lambda x: x[0])).json()
        return resp




    def get_cycles(self, version_id):
        """
        ZAPI.
        This method performed request to api. Get all cycles by version id (JIRA)
        and returns dictionary with id and name of cycles from api response.

        :param version_id: Version id of application (like in JIRA).
        :return: Dictionary with id and name of test cycles.
       """
        url = CYCLES_ENDPOINT

        payload = {
            "expand": "executionSummaries",
            "projectId": DEFAULT_PROJECT_ID,
            "versionId": version_id
        }

        resp = self.get('{}{}'.format(self.prod_url, url), data=sorted(payload.items(), key=lambda x: x[0])).json()
        cycle_id_name = {i.get("id"): i.get("name") for i in resp}
        return cycle_id_name

    def get_case(self, case_key):
        """
        JIRA API.
        This method performed request to api. Get test case and
        by case name in Jira.

        :param case_key: Case id like in Jira and test specs (example SOL-1).
        :return: Test case Id (api version).
        """
        url = "{}{}{}".format(JIRA_URL, JIRA_CASE_URL, case_key)

        resp = JiraRequest.get(url, data={})
        if resp:
            return resp

        return None

    def get_versions(self):
        """
        JIRA API.
        This method performed request to api. Get versions
        of Solace project.

        :return: Id and name of Solace project version (example id - 10018, name - Android 2.0).
        """
        url = "{}{}".format(JIRA_URL, VERSION_CASE_URL)

        resp = JiraRequest.get(url, data={})
        if resp:
            id_name_versions = {i.get("id"): i.get("name") for i in resp}
            return id_name_versions

        return None


    def update_execution_status_by_id(self, execution_id, status, issueId, versionId, cycleId):
        url = EXECUTION_URL

        payload = {
            "status":
                {
                    "id": STATUS_MAP[status]
                },

            "id": execution_id,
            "projectId": DEFAULT_PROJECT_ID,
            "issueId": issueId,
            "cycleId": cycleId or -1,
            "versionId": versionId,
            "assigneeType": "currentUser"
        }

        test_execution = self.put("{}{}/{}".format(self.prod_url, url, execution_id), data=sorted(payload.items(), key=lambda x: x[0]))

        if test_execution.status_code == STATUS_OK:
            execution_id = test_execution.json().get('execution', {}).get('id')
            return self.put("{}{}/{}".format(self.prod_url, url, execution_id), data=sorted(payload.items(), key=lambda x: x[0]))

        return None


    def execute_test(self, issue_id, status, version_id=-1, cycle_id=None):
        """
        ZAPI.
        This method performed request to api. Execute test.

        :param issue_id: Id of test case (like in api).
        :param status: Run result.
        :param version_id: Id of version, where case was running.
        :param cycle_id: Id of test cycle.
        """
        url = EXECUTION_URL

        payload = {
            "status":
                {
                    "id": STATUS_MAP[status]
                },

            "projectId": DEFAULT_PROJECT_ID,
            "issueId": issue_id,
            "cycleId": cycle_id or -1,
            "versionId": version_id,
            "assigneeType": "currentUser"
        }

        test_execution = self.post("{}{}".format(self.prod_url, url), data=sorted(payload.items(), key=lambda x: x[0]))

        if test_execution.status_code == STATUS_OK:
            execution_id = test_execution.json().get('execution', {}).get('id')

            return self.put("{}{}/{}".format(self.prod_url, url, execution_id), data=sorted(payload.items(), key=lambda x: x[0]))

        print("Couldn't get execution_id for case: {}. Error is: {}".format(issue_id, test_execution.text))

        return None

    def delete_execution(self, execution_id, issue_id):
        """
        ZAPI.
        This method performed request to api. Delete execution.

        :param execution_id: Id of test execution.
        :param issue_id: Id of test case (like in api).
        """
        url = EXECUTION_URL + "/{}?issueId={}".format(execution_id, issue_id)

        payload = {
            "issueId": issue_id
        }
        self.delete("{}{}".format(self.prod_url, url), data=sorted(payload.items(), key=lambda x: x[0])).json()
