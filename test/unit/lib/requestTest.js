var expect = require('expect.js');

var request = require('../../../lib/request');

describe('request', function() {

    describe('setup', function() {
        var requestOptions;
        var requestCallback;
        var bogusRequestModule;
        var options;

        beforeEach(function() {
            requestOptions = undefined;
            requestCallback = undefined;
            bogusRequestModule = function(options, cb) {
                requestOptions = options;
                cb(false, false, JSON.stringify(options));
            };
            options = { unicorn: 'rainbows' };
            request.setup(bogusRequestModule);
        });

        it('Should setup and send request using provided request module', function(done) {
            request.sendRequest(options).then(function(response){
                expect(response).to.eql(options);
                done();
            })
        });
    });

});
