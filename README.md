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

## Restore

Nothing special here, just the standard way of restoring snapshots. You can find additional informations/configuration options in the [official Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-snapshots.html#_restore)

List the availables snapshots:

```
curl -XGET http://your-es-url/_snapshot/your-bucket-name/_all?pretty
```

Restore:

```
curl -XPOST http://your-es-url/_snapshot/your-bucket-name/snapshot-id/_restore -d '{ 
	"indices": "yourindices",
	"ignore_unavailable": "true",
	"include_aliases": false,
	"rename_pattern": "(.+)",
    "rename_replacement": "restored_index_$1"
}'
```
