var q = require('q');

var conf = require('../../conf');
var request = require('./../request');
var utils = require('./../utils');

exports.authorize = function(b2) {
    var deferred = q.defer();
    var options = getRequestOptions(b2.accountId, b2.applicationKey);

    var requestInstance = request.getInstance();
    requestInstance(options, utils.getProcessAuthSuccess(b2, deferred));

    return deferred.promise;
};

function getRequestOptions(accountId, applicationKey) {
    return {
        url: conf.API_AUTHORIZE__URL,
        headers: utils.getAuthHeaderObject(accountId, applicationKey)
    };
}
