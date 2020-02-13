var expect = require('expect.js');

const utils = require('../../../lib/utils');

describe('utils', function() {

    var err;

    beforeEach(function() {
        err = {
            message: ''
        };
    });

    describe('getAuthHeaderObject', function() {
        it('Should get header object with Base64 encoded Authorization header using accountId', function() {
            const b2 = {
                accountId: 'unicorns',
                applicationKey: 'rainbows'
            };
            expect(utils.getAuthHeaderObject(b2)).to.eql({ Authorization: 'Basic dW5pY29ybnM6cmFpbmJvd3M=' });
        });

        it('Should get header object with Base64 encoded Authorization header using applicationKeyId', function() {
            const b2 = {
                applicationKeyId: 'unicorns',
                applicationKey: 'rainbows'
            };
            expect(utils.getAuthHeaderObject(b2)).to.eql({ Authorization: 'Basic dW5pY29ybnM6cmFpbmJvd3M=' });
        });

        it('Should throw error given invalid accountId or applicationKeyId', function() {
            const b2 = {
                applicationKey: 'rainbows'
            };
            try {
                utils.getAuthHeaderObject(b2);
            } catch (e) {
                err = e;
            }
            expect(err.message).to.be('Invalid accountId or applicationKeyId');
        });

        it('Should throw error given invalid applicationKey', function() {
            const b2 = {
                accountId: 'unicorns'
            };
            try {
                utils.getAuthHeaderObject(b2);
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
            try {
                utils.getAuthHeaderObjectWithToken(undefined);
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

            expect(resolvedJson).to.eql({ statusCode: 200 });
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
