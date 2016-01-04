var expect = require('expect.js');

var request = require('../../../../lib/request');
var auth = require('../../../../lib/actions/auth');

describe('actions/auth', function() {
    var requestOptions;
    var bogusRequestModule;
    var authResponse;
    var actualAuthResponse;
    var errorMessage;

    beforeEach(function() {
        requestOptions = null;
        authResponse = null;
        actualAuthResponse = null;
        errorMessage = null;

        bogusRequestModule = function(options, cb) {
            requestOptions = options;
            cb(errorMessage, false, JSON.stringify(authResponse));
        };

        request.setup(bogusRequestModule);
    });

    describe('authorize', function() {
        var b2;

        beforeEach(function() {
            b2 = {
                accountId: 'unicorns',
                applicationKey: 'rainbows'
            };
        });

        describe('with valid response', function() {

            beforeEach(function(done) {
                authResponse = {
                    authorizationToken: 'foo',
                    apiUrl: 'https://foo',
                    downloadUrl: 'https://bar'
                };

                auth.authorize(b2).then(function(response) {
                    actualAuthResponse = response;
                    done();
                });
            });

            it('Should set correct auth header in request options', function() {
                expect(actualAuthResponse).to.eql({
                    authorizationToken: 'foo',
                    apiUrl: 'https://foo',
                    downloadUrl: 'https://bar'
                });
                expect(requestOptions.headers).to.eql({ Authorization: 'Basic dW5pY29ybnM6cmFpbmJvd3M=' });
            });

            it('Should set auth request options and set fields on valid b2 instance', function() {
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

});
