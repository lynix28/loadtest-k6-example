#!/bin/bash

testcase=$1
discord_token=$2
discord_webhookid=$3
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

function run_k6 () {
    cd /app
    k6 run $testcase -c ./config.json --log-output file=reports/k6_$date.log --log-format json --summary-export ./reports/report_$date.json -q
    run_counter=1
}

send_notif
run_k6
send_notif