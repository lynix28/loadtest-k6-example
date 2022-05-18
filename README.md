# loadtest-k6-example
[![CircleCI](https://circleci.com/gh/lynix28/loadtest-k6-example/tree/master.svg?style=shield)](https://circleci.com/gh/lynix28/loadtest-k6-example/tree/master)

API Load testing example using K6 by Grafana Labs

How to run in local:
 - Create `reports` directory/folder
 - `k6 run ./test.js -c ./config.json --log-output file=reports/k6.log --log-format json --summary-export reports/report.json`