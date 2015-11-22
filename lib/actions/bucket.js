var utils = require('./../utils');
var request = require('../request');

exports.TYPES = {
    ALL_PUBLIC: 'allPublic',
    ALL_PRIVATE: 'allPrivate'
};

exports.create = function(b2, bucketName, bucketType) {
    var options = {
        url: getCreateUrl(b2, bucketName, bucketType),
        qs: {
            accountId: b2.accountId,
            bucketName: bucketName,
            bucketType: bucketType
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    return request.sendRequest(options);
};

exports.delete = function(b2, bucketId) {
    var options = {
        url: getDeleteUrl(b2),
        method: 'POST',
        body: JSON.stringify({
            accountId: b2.accountId,
            bucketId: bucketId
        }),
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    return request.sendRequest(options);
};

function getCreateUrl(b2) {
    return getApiUrl(b2) + '/b2_create_bucket';
}

function getDeleteUrl(b2) {
    return getApiUrl(b2) + '/b2_delete_bucket'
}

function getApiUrl(b2) {
    return b2.apiUrl + '/b2api/v1';
}
