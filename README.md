# lambda-elastichsearch-snapshot

This is a lambda which trigger an ElasticSearch snapshot (and create a S3 repository). This lambda can be then scheduled via CloudWatch to periodically backup your elasticsearch indices.

## Requirements
- You need to install the [Elasticsearch Cloud AWS](https://github.com/elastic/elasticsearch-cloud-aws) plugin 

## Install

- Install the dependencies

```npm install```

- Create the lambda function in AWS

Package the code `$ zip lambda-elasticsearch-snapshot -r .` and create the lambda in AWS.

- Create the configuration file

Rename the file `lambda-elasticsearch-snapshot.json.dist` with `<name of your lambda>.json` and put it in S3. (check https://github.com/gilt/aws-lambda-config to find where exactly this file should be stored) 