# lambda-elastichsearch-snapshot

This is a lambda which trigger an ElasticSearch snapshot (and create a S3 repository). This lambda can be then
scheduled via CloudWatch to periodically backup your Elasticsearch indices.

## Requirements
- You need to install the [Elasticsearch Cloud AWS](https://github.com/elastic/elasticsearch-cloud-aws) plugin 

## Install

- Install the dependencies

```yarn install```

- Create the lambda function in AWS

Package the code `$ zip lambda-elasticsearch-snapshot -r .` and create the lambda in AWS or use e.g. Terraform
to provision the necessary infrastructure.

## Trigger backup
Use a Cloudwatch rule to trigger your Lambda with the contents of `lambda-elasticsearch-snapshot.json.dist` tailored
to your environment.

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
