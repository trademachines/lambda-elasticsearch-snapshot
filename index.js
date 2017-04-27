const assert        = require('assert');
const elasticsearch = require('elasticsearch');
const esService     = require('./src/elasticsearch-service');

exports.handle = (event, context, cb) => {
  if (!!event.ping) {
    console.log("Ping. Pong.");
    return cb(null, {pong: true});
  }

  console.log("Start.");

  const esClient = new elasticsearch.Client({
    host:           event.elasticsearch.url,
    apiVersion:     event.elasticsearch.version,
    sniffOnStart:   true,
    requestTimeout: 10000
  });

  const service = new esService.ElasticSearchService(
    esClient,
    event.backup.bucketName,
    event.backup.clusterName
  );

  service.backup(event.backup.indices, (err, succ) => {
    if (err) {
      console.log("An ERROR has occurred:");
      console.log(err);
    } else {
      console.log("Snapshot successfully triggered.");
    }
  });
};
