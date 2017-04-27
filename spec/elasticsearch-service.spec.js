const esService = require('./../src/elasticsearch-service');

const bucketName = "bucket-name";

describe('elasticsearchService', () => {
    let esClient;

    beforeEach(() => {
        esClient = {
            snapshot: {
                createRepository: () => {},
                create: () => {}
            }
        };
    });

    describe('createRepository', () => {
        it('should sent the payload to create a repository', () => {
            esClient.snapshot = jasmine.createSpyObj('snapshot', ['createRepository']);
            let service       = new esService.ElasticSearchService(esClient, bucketName);

            service.createS3Repository();

            expect(esClient.snapshot.createRepository).toHaveBeenCalled();
        });
    });

    describe('createSnapshot', () => {
        it('should create the repository and create the snapshot', () => {
            esClient.snapshot = jasmine.createSpyObj('snapshot', ['create']);
            let service       = new esService.ElasticSearchService(esClient, bucketName);

            service.createSnapshot();

            expect(esClient.snapshot.create).toHaveBeenCalled();
        });
    });

    describe('backup', () => {
        it('should try to create the repository before creating the snapshot', done => {
            //esClient.snapshot = jasmine.createSpyObj('snapshot', ['create']);
            spyOn(esClient.snapshot, "create");
            spyOn(esClient.snapshot, "createRepository").and.callFake((params, cb) => {
                cb(null, { acknowledged: true }, "200");
            });
            let service       = new esService.ElasticSearchService(esClient, bucketName);

            service.backup();

            expect(esClient.snapshot.createRepository).toHaveBeenCalled();
            expect(esClient.snapshot.create).toHaveBeenCalled();

            done();
        });

        it('should not try to perform the snapshot if an error has occured during repository creation', () => {
            spyOn(esClient.snapshot, "create");
            spyOn(esClient.snapshot, "createRepository").and.callFake((params, cb) => {
                cb({ "error": "something went wrong" });
            });
            let service       = new esService.ElasticSearchService(esClient, bucketName);

            service.backup();

            expect(esClient.snapshot.createRepository).toHaveBeenCalled();
            expect(esClient.snapshot.create).not.toHaveBeenCalled();

        });

        it('should not try to perform the snapshot if the repository was not created/updated', () => {
            spyOn(esClient.snapshot, "create");
            spyOn(esClient.snapshot, "createRepository").and.callFake((params, cb) => {
                cb(null, { acknowledged: true }, "500");
            });
            let service       = new esService.ElasticSearchService(esClient, bucketName);

            service.backup();

            expect(esClient.snapshot.createRepository).toHaveBeenCalled();
            expect(esClient.snapshot.create).not.toHaveBeenCalled();
        });
    });
});


