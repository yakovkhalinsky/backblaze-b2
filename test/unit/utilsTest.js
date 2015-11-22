var expect = require('expect.js');

var utils = require('../../lib/utils');

describe('utils', function() {

    describe('getAuthHeaderObject', function() {
       it('Should Base64 encode arguments as header for Authorization', function() {
           var accountId = 'unicorns';
           var applicationKey = 'rainbows';

           expect(utils.getAuthHeaderObject(accountId, applicationKey)).to.eql({ Authorization: 'Basic dW5pY29ybnM6cmFpbmJvd3M=' });
       })
    });

});
