#!/bin/bash

# "pipeline" or "local"
run_on=$1

# name of test script
testcase=$2

# notification config "teams" or "discord"
notification=$3

# discord notification token
discord_token=$4
discord_webhookid=$5

date=$(date "+%Y%m%d_%H%M%S")
run_counter=0

function send_notif () {
    if [ $run_counter != 1 ]
    then
        start_time=$(date "+%d %h %Y, %H:%M:%S")
        title="Testing Start"
        message="Running $testcase on $start_time"
        cd /app/go/bin
        ./shoutrrr send --url "discord://$discord_token@$discord_webhookid" --title "$title" --message "$message"
    else
        end_time=$(date "+%d %h %Y, %H:%M:%S")
        title="Testing Completed"
        message="Test run ($testcase) is completed on $end_time"
        cd /app/go/bin
        ./shoutrrr send --url "discord://$discord_token@$discord_webhookid" --title "$title" --message "$message"
    fi
}

function help () {
    echo "format: ./run.sh [local / pipeline] [test script] [teams / discord] [token] [webhookid]"
    echo " "
    echo "sample:"
    echo "local    -> ./run.sh local test.js"
    echo "pipeline -> ./run.sh pipeline test.js discord 12345 67890"
}

function check_local () {
    if [ ! -z "$testcase" ] && [ -z "$notification" ] && [ -z "$discord_token" ] && [ -z "$discord_webhookid" ]
    then
        result=0
    else
        result=1
    fi
}

function check_pipeline () {
    if [ ! -z "$testcase" ] && [ ! -z "$notification" ] && [ ! -z "$discord_token" ] && [ ! -z "$discord_webhookid" ]
    then
        result=0
    fi
    if [ -z "$testcase" ]
    then
        result=1
    fi
    if [ -z "$notification" ]
    then
        result=1
    fi
    if [ -z "$discord_token" ]
    then
        result=1
    fi
    if [ -z "$discord_webhookid" ]
    then
        result=1
    fi
}

function run_k6 () {
    if [ "$run_on" == "local" ]
    then
        check_local
        if [ $result -eq 0 ]
        then
            cd /app
            k6 run $testcase -c ./config.json --log-output file=reports/k6_$date.log --log-format json --summary-export ./reports/report_$date.json
        else
            echo "invalid command"
            help
        fi
    elif [ "$run_on" == "pipeline" ]
    then
        check_pipeline
        if [ $result -eq 0 ]
        then
            send_notif
            cd /app
            k6 run $testcase -c ./config.json --log-output file=reports/k6_$date.log --log-format json --summary-export ./reports/report_$date.json -q
            run_counter=1
            send_notif
        else
            echo "invalid command"
            help
        fi
    else
        echo "invalid command"
        help
    fi
}

run_k6