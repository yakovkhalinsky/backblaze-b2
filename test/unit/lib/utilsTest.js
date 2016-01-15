var expect = require('expect.js');

var utils = require('../../../lib/utils');

describe('utils', function() {

    var err;

    beforeEach(function() {
        err = {
            message: ''
        };
    });

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
                err = e;
            }
            expect(err.message).to.be('Invalid accountId');
        });

        it('Should throw error given invalid applicationKey', function() {
            var accountId = 'unicorns';
            var applicationKey = undefined;
            try {
                utils.getAuthHeaderObject(accountId, applicationKey);
            } catch (e) {
                err = e;
            }
            expect(err.message).to.be('Invalid applicationKey');
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
                err = e;
            }
            expect(err.message).to.be('Invalid B2 instance');
        });

        it('Should throw error given b2 object has no valid authorizationToken', function() {
            var b2 = {};
            try {
                utils.getAuthHeaderObjectWithToken(b2);
            } catch (e) {
                err = e;
            }
            expect(err.message).to.be('Invalid authorizationToken');
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
        var resolvedWith;
        var rejectMessage;
        var b2;
        var fn;
        var responseBody;

        beforeEach(function() {
            resolvedWith= undefined;
            rejectMessage = undefined;
            bogusAuthPromise = {
                resolve: function(response) {
                    resolvedWith = response;
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
            expect(resolvedWith).to.eql({
                authorizationToken: 'unicorns',
                apiUrl: 'https://foo',
                downloadUrl: 'https://bar'
            });
            expect(b2.authorizationToken).to.be('unicorns');
            expect(b2.apiUrl).to.be('https://foo');
            expect(b2.downloadUrl).to.be('https://bar');
        });

        it('Should correctly reject promise when error is received in function call', function() {
            fn('Something went wrong', false, responseBody);

            expect(rejectMessage).to.be('Something went wrong');
            expect(resolvedWith).to.be(undefined);
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

    describe('getProcessFileSuccess', function() {
        var bogusPromise;
        var resolvedJson;
        var rejectMessage;
        var fn;
        var responseBody;

        beforeEach(function() {
            resolvedJson = undefined;
            rejectMessage = undefined;
            bogusPromise = {
                resolve: function(json) {
                    resolvedJson = json;
                },
                reject: function(message) {
                    rejectMessage = message;
                }
            };
            fn = utils.getProcessFileSuccess(bogusPromise, function() { return { foo: 'bar' }; });
            responseBody = '{ "unicorn": "rainbows" }';
        });

        it('Should correctly resolve with parsed JSON of response body', function() {
            fn(false, { statusCode: 200 }, 'file contents');

            expect(resolvedJson).to.eql({ foo: 'bar' });
            expect(rejectMessage).to.be(undefined);
        });

        it('Should correctly reject with non 200 status code', function() {
            fn(null, { statusCode: 404, statusMessage: 'Not Found' }, responseBody);

            expect(resolvedJson).to.eql(undefined);
            expect(rejectMessage).to.be('Not Found');
        });

        it('Should correctly reject', function() {
            fn('Something went wrong', false, responseBody);

            expect(resolvedJson).to.eql(undefined);
            expect(rejectMessage).to.be('Something went wrong');
        });
    });

    describe('getUrlEncodedFileName', function() {
        it('Should correctly encode a fileName with no paths', function() {
            expect(utils.getUrlEncodedFileName('unicorns and rainbows !@#$%^&')).to.equal('unicorns%20and%20rainbows%20!%40%23%24%25%5E%26');
        });

        it('Should correctly encode a fileName with paths', function() {
            expect(utils.getUrlEncodedFileName('foo/bar/unicorns and rainbows !@#$%^&')).to.equal('foo/bar/unicorns%20and%20rainbows%20!%40%23%24%25%5E%26');
        });
    });

});
