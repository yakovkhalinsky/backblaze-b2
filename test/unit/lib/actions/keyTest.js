const expect = require('expect.js');

const request = require('../../../../lib/request');
const utils = require('../../../../lib/utils');
const key = require('../../../../lib/actions/key');

describe('actions/key', function() {
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
                const options = {
                    capabilities: [
                        key.CAPABILITIES.READ_FILES,
                        key.CAPABILITIES.WRITE_FILES,
                    ],
                    keyName: 'my-key',
                    validDurationInSeconds: 3600,
                    bucketId: '1234abcd',
                    namePrefix: 'special_file_',
                };

                response = {
                    keyName: 'my-key',
                    applicationKeyId: '9876zyxw',
                    applicationKey: 'superdupersecret',
                    capabilities: [
                        'readFiles',
                        'writeFiles',
                    ],
                    accountId: '98765',
                    expirationTimestamp: 1570724488688,
                    bucketId: '1234abcd',
                    namePrefix: 'special_file_',
                };

                key.create(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_create_key',
                    method: 'POST',
                    data: {
                        accountId: '98765',
                        capabilities: [
                            'readFiles',
                            'writeFiles',
                        ],
                        keyName: 'my-key',
                        validDurationInSeconds: 3600,
                        bucketId: '1234abcd',
                        namePrefix: 'special_file_',
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                const options = {
                    capabilities: [],
                    keyName: 'my invalid key with spaces',
                    validDurationInSeconds: -3600,
                    namePrefix: 'no-bucket-id-given...',
                };

                errorMessage = 'Something went wrong';

                key.create(b2, options).then(null, function(error) {
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
                const options = {
                    applicationKeyId: '9876zyxw',
                };

                response = {
                    keyName: 'my-key',
                    applicationKeyId: '9876zyxw',
                    capabilities: [
                        'readFiles',
                        'writeFiles',
                    ],
                    accountId: '98765',
                    expirationTimestamp: 1570724488688,
                    bucketId: '1234abcd',
                    namePrefix: 'special_file_',
                };

                key.delete(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    method: 'POST',
                    url: 'https://foo/b2api/v2/b2_delete_key',
                    data: {
                        applicationKeyId: '9876zyxw',
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                const options = {
                    applicationKeyId: 'invalid key id',
                };

                errorMessage = 'Something went wrong';

                key.delete(b2, options).then(null, function(error) {
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
                const options = {
                    maxKeyCount: 10,
                    startApplicationKeyId: 'my-key-1',
                };

                response = {
                    keys: [
                        {
                            keyName: 'my-key-1',
                            applicationKeyId: '9876zyxw',
                            capabilities: [
                                'readFiles',
                                'writeFiles',
                            ],
                            accountId: '98765',
                            expirationTimestamp: 1570724488688,
                            bucketId: '1234abcd',
                            namePrefix: 'special_file_',
                        },
                        {
                            keyName: 'my-key-2',
                            applicationKeyId: '8765yxwv',
                            capabilities: [
                                'readFiles',
                            ],
                            accountId: '98765',
                        }
                    ],
                    nextApplicationKeyId: null,
                };

                key.list(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(actualResponse).to.eql(response);
                expect(requestOptions).to.eql({
                    method: 'POST',
                    url: 'https://foo/b2api/v2/b2_list_keys',
                    data: {
                        accountId: '98765',
                        maxKeyCount: 10,
                        startApplicationKeyId: 'my-key-1',
                    },
                    headers: { Authorization: 'unicorns and rainbows' }
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                key.list(b2).then(null, function(error) {
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
