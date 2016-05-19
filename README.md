# Lambda-EC2Stat
Send the statistics information of EC2 instances to the Slack channel.

# style

```txt
=====================
2016-05-19 13:01:07 UTC
[m3.large]:
    running: 1
[m3.medium]:
    running: 3
[c3.large]:
    running: 28
    terminated: 2
[m1.small]:
    running: 8
[t1.micro]:
    running: 4
[r3.xlarge]:
    running: 1
[t2.small]:
    running: 1
[c1.medium]:
    running: 5
[r3.large]:
    running: 1
[c3.xlarge]:
    running: 1
-----
total:
    running: 53
    terminated: 2
=====================
```

# Settings for Lambda

* choose the "lambda-canary" function.
* Upload the zip file.

# Need to do

* edit src/credential.json
* input the slack url, slack channel and message user name on index.js.