'use strict';

const elasticsearch = require('elasticsearch');
const esService     = require('./src/elasticsearch-service');
const config        = require('aws-lambda-config');

exports.createSnapshot = (event, context, cb) => {
    console.log("Start.");
    config.getConfig(context, (err, cfg) => {
        const esClient = new elasticsearch.Client({
            host: cfg.elasticsearch.url,
            apiVersion: cfg.elasticsearch.version,
            sniffOnStart: true,
            requestTimeout: 10000
        });

        const service = new esService.ElasticSearchService(esClient, cfg.backup.bucketName, cfg.backup.clusterName);

        service.backup(cfg.backup.indices, (err, succ) => {
            if (err) {
                console.log("An ERROR has occurred:");
                console.log(err);
            } else {
                console.log("Snapshot successfully triggered.");
            }
        });
    });
};
