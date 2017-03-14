var conf = require('../../conf');
var request = require('./../request');
var utils = require('./../utils');

exports.authorize = function(b2) {
    var options = getRequestOptions(b2.accountId, b2.applicationKey);

    var requestInstance = request.getInstance();
    return requestInstance(options, utils.getProcessAuthSuccess(b2));
};

function getRequestOptions(accountId, applicationKey) {
    return {
        url: conf.API_AUTHORIZE__URL,
        headers: utils.getAuthHeaderObject(accountId, applicationKey)
    };
}
