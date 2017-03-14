var conf = require('../../conf');
var request = require('./../request');
var utils = require('./../utils');

exports.authorize = function(b2) {
    var options = getRequestOptions(b2.accountId, b2.applicationKey);

    var axiosInstance = request.getInstance();
    return axiosInstance(options).then(function(res) {
        utils.saveAuthContext(b2, res.data);
        return res; // For testing and/or Promise chaining
    });
};

function getRequestOptions(accountId, applicationKey) {
    return {
        url: conf.API_AUTHORIZE__URL,
        headers: utils.getAuthHeaderObject(accountId, applicationKey)
    };
}
