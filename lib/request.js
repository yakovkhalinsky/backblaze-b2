var q = require('q');

var utils = require('./utils');

var REQUEST;

exports.setup = function(requestObject) {
    REQUEST = requestObject;
};

exports.sendRequest = function(options) {
    var deferred = q.defer();

    var requestInstance = exports.getInstance();
    requestInstance(options, utils.processResponseGeneric(deferred));

    return deferred.promise;
};

exports.getInstance = function() {
    if (!REQUEST) {
        REQUEST = require('request');
    }
    return REQUEST;
};
