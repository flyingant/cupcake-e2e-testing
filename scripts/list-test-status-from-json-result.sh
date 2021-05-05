jq -r '.testResults[] | .status'  tests/output_*/jest-result.json  > /tmp/status
jq -r '.testResults[] | .name'  tests/output_*/jest-result.json | cut -f4 -d '-' > /tmp/key
paste /tmp/key /tmp/status > /tmp/cc-e2e-test-result.txt
