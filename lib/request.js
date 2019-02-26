const utils = require('./utils.js');
let REQUEST;

exports.setup = function(requestObject) {
    REQUEST = requestObject;
};

exports.sendRequest = function(options) {
    const requestInstance = exports.getInstance();
    return requestInstance(options, utils.processResponseGeneric());
};

exports.getInstance = function() {
    return REQUEST || require('axios');
};
