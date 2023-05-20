# loadtest-k6-example
[![CircleCI](https://circleci.com/gh/lynix28/loadtest-k6-example/tree/master.svg?style=shield)](https://circleci.com/gh/lynix28/loadtest-k6-example/tree/master)

API Load testing example using K6 by Grafana Labs

<h3><ins>How to run in local:</h3>

Create `reports` directory
- `k6 run ./test.js -c ./config.json --log-output file=reports/k6.log --log-format json --summary-export reports/report.json`

<h3><ins>More script example:</h3>

- Check on `script-example` directory

<h3><ins>How the report look like ?</h3>
 
![image](https://github.com/lynix28/loadtest-k6-example/assets/102797648/1ad6ba36-a08e-4c55-ab50-dc7670aeb0b0)

 <h3><ins>K6 + Shoutrrr</h3> 

Do u want to run the test with notification but u do not have K6 Cloud membership ?
U can use **'Shoutrrr'**, but need some setup to make it work, for example u can check my `Dockerfile` and `run.sh` (sorry the shell-script it quite mess).

After u done with the setup, u can run it by this command
`./run.sh pipeline test.js discord $DISCORD_TOKEN $DISCORD_WEBHOOKID` (remember to give the **'run.sh'** an execute permission)
Once u do it correctly, It will show like this

![image](https://github.com/lynix28/loadtest-k6-example/assets/102797648/9fda6ea8-9bb4-4366-bf52-0b664a225764)
