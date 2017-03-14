var utils = require('./utils.js');
var REQUEST;

exports.setup = function(requestObject) {
    REQUEST = requestObject;
};

exports.sendRequest = function(options) {
    var requestInstance = exports.getInstance();
    return requestInstance(options, utils.processResponseGeneric());
};

exports.getInstance = function() {
    return REQUEST || require('axios');
};
