var expect = require('expect.js');

var headers = require('../../../lib/headers');

describe('headers', function() {

    var options;
    var info;
    var err;

    beforeEach(function() {
        options = {
            headers: {}
        };

        info = null;

        err = {
            message: ''
        };
    });

    describe('addInfoHeaders', function() {

        it('should add the provided key/values to the headers properties of the options argument', function() {
            info = {
                under_score: 'under_score',
                foo: 'bar',
                unicorns: 'rainbows'
            };

            headers.addInfoHeaders(options, info);

            expect(options.headers).to.eql({
                'X-Bz-Info-under_score': 'under_score',
                'X-Bz-Info-foo': 'bar',
                'X-Bz-Info-unicorns': 'rainbows'
            });
        });

        it('should throw an error when too many info headers are added', function() {
            info = {
                a: 'foo',
                b: 'foo',
                c: 'foo',
                d: 'foo',
                e: 'foo',
                f: 'foo',
                g: 'foo',
                h: 'foo',
                i: 'foo',
                j: 'foo',
                k: 'foo'
            };

            try {
                headers.addInfoHeaders(options, info);
            } catch (e) {
                err = e;
            }
            expect(err.message).to.be('Too many info headers: maximum of 10 allowed');
        });

        it('should throw an error with a list of keys that have invalid characters', function() {
            info = {
                'abcsABC-!@#$_': 'woh bad key',
                'defgDEF-)(*&^:"': 'very bad key'
            };

            try {
                headers.addInfoHeaders(options, info);
            } catch (e) {
                err = e;
            }
            expect(err.message).to.be('Info header keys contain invalid characters: abcsABC-!@#$_   defgDEF-)(*&^:"');
        });

    });

});
