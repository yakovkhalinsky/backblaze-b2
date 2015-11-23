var expect = require('expect.js');

var utils = require('../../../lib/utils');

describe('utils', function() {

    describe('getAuthHeaderObject', function() {
        it('Should get header object with Base64 encoded Authorization header', function() {
            var accountId = 'unicorns';
            var applicationKey = 'rainbows';

            expect(utils.getAuthHeaderObject(accountId, applicationKey)).to.eql({ Authorization: 'Basic dW5pY29ybnM6cmFpbmJvd3M=' });
        });

        it('Should throw error given invalid accountId', function() {
            var accountId = undefined;
            var applicationKey = 'rainbows';
            try {
                utils.getAuthHeaderObject(accountId, applicationKey);
            } catch (e) {
                expect(e.message).to.be('Invalid accountId');
            }
        });

        it('Should throw error given invalid applicationKey', function() {
            var accountId = 'unicorns';
            var applicationKey = undefined;
            try {
                utils.getAuthHeaderObject(accountId, applicationKey);
            } catch (e) {
                expect(e.message).to.be('Invalid applicationKey');
            }
        });
    });

    describe('getAuthHeaderObjectWithToken', function() {
        it('Should get header object with already retrieved authorization token', function() {
            var b2 = {
                authorizationToken: 'unicorns-foo'
            };

            expect(utils.getAuthHeaderObjectWithToken(b2)).to.eql({ Authorization: 'unicorns-foo' });
        });

        it('Should throw error given b2 object is not defined or falsey', function() {
            var b2 = undefined;
            try {
                utils.getAuthHeaderObjectWithToken(b2);
            } catch (e) {
                expect(e.message).to.be('Invalid B2 instance');
            }
        });

        it('Should throw error given b2 object has no valid authorizationToken', function() {
            var b2 = {};
            try {
                utils.getAuthHeaderObjectWithToken(b2);
            } catch (e) {
                expect(e.message).to.be('Invalid authorizationToken');
            }
        });
    });

    describe('parseJson', function() {
        it('Should return valid JSON object from string', function() {
            expect(utils.parseJson('{ "unicorn": "foo" }')).to.eql({ unicorn: 'foo' });
        });

        it('Should return undefined without throwing error when parsing invalid JSON string', function() {
            expect(utils.parseJson('{ "unicorn": foo }')).to.be(undefined);
        });
    });

    describe('getProcessAuthSuccess', function() {
        var bogusAuthPromise;
        var isResolved;
        var rejectMessage;
        var b2;
        var fn;
        var responseBody;

        beforeEach(function() {
            isResolved = false;
            rejectMessage = undefined;
            bogusAuthPromise = {
                resolve: function() {
                    isResolved = true;
                },
                reject: function(message) {
                    rejectMessage = message;
                }
            };
            b2 = {};
            fn = utils.getProcessAuthSuccess(b2, bogusAuthPromise);
            responseBody = '{ "authorizationToken": "unicorns", "apiUrl": "https://foo", "downloadUrl": "https://bar" }';
        });

        it('Should correctly resolve promise and set properties on b2 instance object', function() {
            fn(false, false, responseBody);

            expect(rejectMessage).to.be(undefined);
            expect(isResolved).to.be(true);
            expect(b2.authorizationToken).to.be('unicorns');
            expect(b2.apiUrl).to.be('https://foo');
            expect(b2.downloadUrl).to.be('https://bar');
        });

        it('Should correctly reject promise when error is received in function call', function() {
            fn('Something went wrong', false, responseBody);

            expect(rejectMessage).to.be('Something went wrong');
            expect(isResolved).to.be(false);
            expect(b2.authorizationToken).to.be(undefined);
            expect(b2.apiUrl).to.be(undefined);
            expect(b2.downloadUrl).to.be(undefined);
        });
    });

    describe('processResponseGeneric', function() {
        var bogusAuthPromise;
        var resolvedJson;
        var rejectMessage;
        var fn;
        var responseBody;

        beforeEach(function() {
            resolvedJson = undefined;
            rejectMessage = undefined;
            bogusAuthPromise = {
                resolve: function(json) {
                    resolvedJson = json;
                },
                reject: function(message) {
                    rejectMessage = message;
                }
            };
            fn = utils.processResponseGeneric(bogusAuthPromise);
            responseBody = '{ "unicorn": "rainbows" }';
        });

        it('Should correctly resolve with parsed JSON of response body', function() {
            fn(false, false, responseBody);

            expect(resolvedJson).to.eql({ unicorn: 'rainbows' });
            expect(rejectMessage).to.be(undefined);
        });

        it('Should correctly reject', function() {
            fn('Something went wrong', false, responseBody);

            expect(resolvedJson).to.eql(undefined);
            expect(rejectMessage).to.be('Something went wrong');
        });

    });

});
