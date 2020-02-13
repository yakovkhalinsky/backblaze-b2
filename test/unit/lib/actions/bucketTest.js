const expect = require('expect.js');

const request = require('../../../../lib/request');
const utils = require('../../../../lib/utils');
const bucket = require('../../../../lib/actions/bucket');

describe('actions/bucket', function() {
    let requestOptions;
    let bogusRequestModule;
    let response;
    let actualResponse;
    let errorMessage;
    let b2;

    beforeEach(function() {
        errorMessage = undefined;
        actualResponse = undefined;

        b2 = {
            accountId: '98765',
            authorizationToken: 'unicorns and rainbows',
            apiUrl: 'https://foo'
        };

        bogusRequestModule = function(options, cb) {
            let deferred = new utils.Deferred();
            requestOptions = options;
            cb(errorMessage, false, JSON.stringify(response), deferred);

            return deferred.promise;
        };

        request.setup(bogusRequestModule);
    });

    describe('create', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { bucketId: '1234abcd' };

                bucket.create(b2, 'foo', 'bar').then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_create_bucket',
                    method: 'POST',
                    data: {
                        accountId: '98765',
                        bucketName: 'foo',
                        bucketType: 'bar'
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                bucket.create(b2, 'foo', 'bar').then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('delete', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { bucketId: '1234abcd' };

                bucket.delete(b2, '1234abcd').then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    method: 'POST',
                    url: 'https://foo/b2api/v2/b2_delete_bucket',
                    data: {
                        accountId: '98765',
                        bucketId: '1234abcd'
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                bucket.delete(b2, '1234abcd').then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('list', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = {
                    buckets:[
                        {
                            accountId: '1234abcd',
                            bucketId: '1234abcd',
                            bucketName: 'bucket-foo',
                            bucketType: 'allPrivate'
                        },
                        {
                            accountId: '1234abcd',
                            bucketId: '2456efgh',
                            bucketName: 'thngs-bar',
                            bucketType: 'allPrivate'
                        }
                    ]
                };

                bucket.list(b2).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    method: 'POST',
                    url: 'https://foo/b2api/v2/b2_list_buckets',
                    data: {
                        accountId: '98765'
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                bucket.list(b2).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('get', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = {
                    buckets:[
                        {
                            accountId: '98765',
                            bucketId: '1234abcd',
                            bucketName: 'bucket-foo',
                            bucketType: 'allPrivate',
                            bucketInfo: {},
                            corsRules: [],
                            lifecycleRules: [],
                            revision: 1
                        }
                    ]
                };

                bucket.get(b2, {bucketName: 'bucket-foo'}).then((response) => {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    method: 'POST',
                    url: 'https://foo/b2api/v2/b2_list_buckets',
                    data: {
                        accountId: '98765',
                        bucketName: 'bucket-foo'
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with response containing no buckets', function() {

            beforeEach(function(done) {
                errorMessage = 'unauthorized';

                bucket.get(b2, {bucketName: 'not-a-real-bucket'}).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                // status code is 401
                expect(actualResponse).to.be(errorMessage);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                bucket.get(b2, {}).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('update', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = {
                    accountId: '1234abcd',
                    bucketId: '1234abcd',
                    bucketName: 'bucket-foo',
                    bucketType: 'allPublic'
                };

                bucket.update(b2, '1234abcd', bucket.TYPES.ALL_PUBLIC).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    method: 'POST',
                    url: 'https://foo/b2api/v2/b2_update_bucket',
                    data: {
                        accountId: '98765',
                        bucketId: '1234abcd',
                        bucketType: 'allPublic'
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                bucket.update(b2, '1234abcd', bucket.TYPES.ALL_PUBLIC).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('getUploadUrl', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = {
                    authorizationToken: 'this_is_your_auth_token',
                    bucketId: '1234abcd',
                    uploadUrl: 'https://foo-001.backblaze.com/b2api/v2/b2_upload_file/abcd1234/unicorns_and_rainbows'
                };

                bucket.getUploadUrl(b2, '1234abcd').then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    method: 'POST',
                    url: 'https://foo/b2api/v2/b2_get_upload_url',
                    data: {
                        bucketId: '1234abcd'
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                bucket.getUploadUrl(b2, '1234abcd').then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

});
