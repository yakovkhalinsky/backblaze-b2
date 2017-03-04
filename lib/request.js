var q = require('q');
var progress = require('request-progress');

var utils = require('./utils');


var REQUEST;

exports.setup = function(requestObject) {
    REQUEST = requestObject;
};

exports.sendRequest = function(options) {
    var deferred = q.defer();

    var requestInstance = exports.getInstance();
    progress(requestInstance(options, utils.processResponseGeneric(deferred)))
        .on('progress', function (state) {
            deferred.notify(state);
        });

    return deferred.promise;
};

exports.getInstance = function() {
    if (!REQUEST) {
        REQUEST = require('request');
    }
    return REQUEST;
};
