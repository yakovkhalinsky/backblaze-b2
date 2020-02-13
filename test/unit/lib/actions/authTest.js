var expect = require('expect.js');

const utils = require('../../../../lib/utils');
var request = require('../../../../lib/request');
var auth = require('../../../../lib/actions/auth');

describe('actions/auth', function() {
    var requestOptions;
    var bogusAxiosModule;
    var authResponse;
    var actualAuthResponse;
    var errorMessage;
    var deferred;

    beforeEach(function() {
        requestOptions = null;
        authResponse = null;
        actualAuthResponse = null;
        errorMessage = null;
        deferred = new utils.Deferred();

        bogusAxiosModule = function(options) {
            requestOptions = options;
            return deferred.promise;
        };
        request.setup(bogusAxiosModule);
    });

    describe('authorize', function() {
        var b2;

        describe('using accountId', function() {
            beforeEach(function() {
                b2 = {
                    accountId: 'unicorns',
                    applicationKey: 'rainbows'
                };
            });

            describe('with valid response', function() {
                beforeEach(function(done) {

                    authResponse = {
                        data: {
                            accountId: 'unicorns',
                            authorizationToken: 'foo',
                            apiUrl: 'https://foo',
                            downloadUrl: 'https://bar'
                        }
                    };

                    // Resolve the promise that's set up above.
                    deferred.resolve(authResponse);

                    auth.authorize(b2).then(function(response) {
                        actualAuthResponse = response;
                        done();
                    });
                });

                it('Should set correct auth header in request options', function() {
                    expect(actualAuthResponse).to.eql(authResponse);
                    expect(requestOptions.headers).to.eql({ Authorization: 'Basic dW5pY29ybnM6cmFpbmJvd3M=' });
                });

                it('Should set auth request options and set fields on valid b2 instance', function() {
                    expect(b2.accountId).to.be('unicorns');
                    expect(b2.authorizationToken).to.be('foo');
                    expect(b2.apiUrl).to.be('https://foo');
                    expect(b2.downloadUrl).to.be('https://bar');
                });
            });

            describe('with error response', function() {
                var isRejected;
                var rejectedMessage;

                beforeEach(function(done) {
                    errorMessage = 'Something went wrong';
                    isRejected = false;
                    rejectedMessage = null;

                    // Reject the promise that's set up above
                    deferred.reject(errorMessage);

                    auth.authorize(b2).then(null, function(error) {
                        isRejected = true;
                        rejectedMessage = error;
                        done();
                    });
                });

                it('Should reject promise is error is received', function() {
                    expect(isRejected).to.be(true);
                    expect(rejectedMessage).to.be(errorMessage);
                });
            });
        });

        describe('using applicationId', function() {
            beforeEach(function() {
                b2 = {
                    applicationKeyId: 'kittens',
                    applicationKey: 'rainbows'
                };
            });

            describe('with valid response', function() {
                beforeEach(function(done) {

                    authResponse = {
                        data: {
                            accountId: 'unicorns',
                            authorizationToken: 'foo',
                            apiUrl: 'https://foo',
                            downloadUrl: 'https://bar'
                        }
                    };

                    // Resolve the promise that's set up above.
                    deferred.resolve(authResponse);

                    auth.authorize(b2).then(function(response) {
                        actualAuthResponse = response;
                        done();
                    });
                });

                it('Should set correct auth header in request options', function() {
                    expect(actualAuthResponse).to.eql(authResponse);
                    expect(requestOptions.headers).to.eql({ Authorization: 'Basic a2l0dGVuczpyYWluYm93cw==' });
                });

                it('Should set auth request options and set fields on valid b2 instance', function() {
                    expect(b2.accountId).to.be('unicorns');
                    expect(b2.authorizationToken).to.be('foo');
                    expect(b2.apiUrl).to.be('https://foo');
                    expect(b2.downloadUrl).to.be('https://bar');
                });
            });
        });
    });
});
