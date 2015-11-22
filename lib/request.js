var q = require('q');

var utils = require('./utils');

var REQUEST;

exports.setup = function(requestObject) {
    REQUEST = requestObject;
};

exports.getRequest = function() {
    if (!REQUEST) {
        REQUEST = require('request');
    }
    return REQUEST;
};

exports.sendRequest = function(options) {
    var deferred = q.defer();

    var requestInstance = exports.getRequest();
    requestInstance(options, utils.processResponseGeneric(deferred));

    return deferred.promise;
};
