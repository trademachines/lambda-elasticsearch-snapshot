'use strict';

const defaultRegion = "eu-west-1";
const defaultEnv    = "dev";

const dateFormat = require('dateformat');
const async      = require('async');

exports.ElasticSearchService = class {
    constructor(client, bucketName, env, region) {
        this.client     = client;
        this.bucketName = bucketName;
        this.env        = env || defaultEnv;
        this.region     = region || defaultRegion;
    }

    createS3Repository(cb) {
        let params = {
            "method": "PUT",
            "repository": this.bucketName,
            "body": {
                "type": "s3",
                "settings": {
                    "compress": true,
                    "bucket": this.bucketName,
                    "region": this.region,
                    "base_path": this.env
                }
            }
        };

        this.client.snapshot.createRepository(params, cb);
    }

    createSnapshot(indices, cb) {
        let snapshotName = "snapshot_" + dateFormat(new Date(), "yyyymmddHHMM");
        let params       = {
            "repository": this.bucketName,
            "waitForCompletion": false,
            "snapshot": snapshotName,
            "body": { "indices" : indices }
        };

        this.client.snapshot.create(params, cb);
    }

    backup(indices, callback) {
        async.waterfall([
            (cb) => this.createS3Repository(cb),
            (response, status, cb) => {
                if (status == 200) {
                    this.createSnapshot(indices, cb);
                }
            }
        ], (err, result) => {
            if (callback) callback(err, result);
        });
    }
};