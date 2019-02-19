const conf = require('../../conf');
const request = require('./../request');
const utils = require('./../utils');

exports.authorize = function(b2, args) {
    const options = getRequestOptions(b2.accountId, b2.applicationKey);

    const axiosInstance = request.getInstance();
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
