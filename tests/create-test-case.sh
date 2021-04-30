#!/bin/bash

thispath="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

jiraTicketId="$1"
if [ "$jiraTicketId" = "" ]; then
    echo "need a jira ticket id"
    exit -1
fi
testFile="$thispath/$jiraTicketId.test.ts"

title="$2"
if [ "$title" = "" ]; then
    title="test case title"
fi

cat $thispath/CC-xxx.test.ts.template | sed "s/%ID%/$jiraTicketId/g" |  sed "s/%TITLE%/$title/g" 
