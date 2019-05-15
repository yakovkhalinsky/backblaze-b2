const _ = require('lodash');
const conf = require('../../conf');
const request = require('./../request');
const utils = require('./../utils');

exports.authorize = function(b2, args) {
    // merge order matters here: later objects override earlier objects
    const options = _.merge({},
        _.get(args, 'axios', {}),
        getRequestOptions(b2),
        _.get(args, 'axiosOverride', {})
    );
    const axiosInstance = request.getInstance();
    return axiosInstance(options).then(function(res) {
        utils.saveAuthContext(b2, res.data);
        return res; // For testing and/or Promise chaining
    });
};

function getRequestOptions(b2) {
    return {
        url: conf.API_AUTHORIZE__URL,
        headers: utils.getAuthHeaderObject(b2)
    };
}
