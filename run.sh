#!/bin/bash

testcase=$1
discord_token=$2
discord_webhookid=$3
date=`date "+%Y%m%d_%H%M%S"`
title1="Testing Start"
message1="$testcase | $date"
title2="Testing Done"
message2="$testcase | $date"
run_counter=0

function send_notif () {
    if [ $run_counter != 1 ]
    then
        cd /app/go/bin
        ./shoutrrr send --url "discord://$discord_token@$discord_webhookid" --title "$title1" --message "$message1"
    else
        cd /app/go/bin
        ./shoutrrr send --url "discord://$discord_token@$discord_webhookid" --title "$title2" --message "$message2"
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