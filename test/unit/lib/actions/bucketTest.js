var expect = require('expect.js');

var request = require('../../../../lib/request');
var bucket = require('../../../../lib/actions/bucket');

describe('actions/bucket', function() {
    var requestOptions;
    var bogusRequestModule;
    var response;
    var actualResponse;
    var errorMessage;
    var b2;

    beforeEach(function() {
        errorMessage = undefined;
        actualResponse = undefined;

        b2 = {
            accountId: '98765',
            authorizationToken: 'unicorns and rainbows',
            apiUrl: 'https://foo'
        };

        bogusRequestModule = function(options, cb) {
            requestOptions = options;
            cb(errorMessage, false, JSON.stringify(response));
            var  bogusRequestObject = function() {
                // Fake event subscribe that supports method chaining
                this.on = function() {return this;};
            };
            return new bogusRequestObject();
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
                    url: 'https://foo/b2api/v1/b2_create_bucket',
                    qs: { accountId: '98765',
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
                    url: 'https://foo/b2api/v1/b2_delete_bucket',
                    body: '{"accountId":"98765","bucketId":"1234abcd"}',
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
                    url: 'https://foo/b2api/v1/b2_list_buckets',
                    body: '{"accountId":"98765"}',
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
                    url: 'https://foo/b2api/v1/b2_update_bucket',
                    body: '{"accountId":"98765","bucketId":"1234abcd","bucketType":"allPublic"}',
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
                    uploadUrl: 'https://foo-001.backblaze.com/b2api/v1/b2_upload_file/abcd1234/unicorns_and_rainbows'
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
                    url: 'https://foo/b2api/v1/b2_get_upload_url',
                    body: '{"bucketId":"1234abcd"}',
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
