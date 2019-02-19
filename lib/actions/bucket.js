const _ = require('lodash');
const utils = require('./../utils');
const request = require('../request');
const conf = require('../../conf');

exports.TYPES = {
    ALL_PUBLIC: 'allPublic',
    ALL_PRIVATE: 'allPrivate'
};

exports.create = function(b2, argsOrBucketName, undefOrBucketType) {
    // we're allowing an args object OR bucketName and bucketType for backwards compatibility
    let bucketName = argsOrBucketName;
    let bucketType = undefOrBucketType;
    if (!_.isString(argsOrBucketName)) {
        bucketName = _.get(argsOrBucketName, 'bucketName');
        bucketType = _.get(argsOrBucketName, 'bucketType');
    }
    const options = {
        url: getCreateUrl(b2, bucketName, bucketType),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            accountId: b2.accountId,
            bucketName: bucketName,
            bucketType: bucketType
        }
    };
    return request.sendRequest(options);
};

exports.delete = function(b2, argsOrBucketId) {
    // we're allowing an args object OR bucketId for backwards compatibility
    let bucketId = argsOrBucketId;
    if (!_.isString(argsOrBucketId)) {
        bucketId = _.get(argsOrBucketId, 'bucketId');
    }
    const options = {
        url: getDeleteUrl(b2),
        method: 'POST',
        data: {
            accountId: b2.accountId,
            bucketId: bucketId
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    return request.sendRequest(options);
};

exports.list = function(b2, args) {
    const options = {
        url: getListUrl(b2),
        method: 'POST',
        data: {
            accountId: b2.accountId
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)

    };
    return request.sendRequest(options);
};

// https://www.backblaze.com/b2/docs/b2_list_buckets.html
exports.get = function(b2, args) {
    const data = {
        accountId: b2.accountId,
    };

    // only one of these can/should be used at a time
    if (args.bucketName) {
        data.bucketName = args.bucketName;
    } else if (args.bucketId) {
        data.bucketId = args.bucketId;
    }

    const options = {
        url: getListUrl(b2),
        method: 'POST',
        data,
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    return request.sendRequest(options);
};

exports.update = function(b2, argsOrBucketId, undefOrBucketType) {
    // we're allowing an args object OR bucketId and bucketType for backwards compatibility
    let bucketId = argsOrBucketId;
    let bucketType = undefOrBucketType;
    if (!_.isString(argsOrBucketId)) {
        bucketId = _.get(argsOrBucketId, 'bucketId');
        bucketType = _.get(argsOrBucketId, 'bucketType');
    }
    const options = {
        url: getUpdateUrl(b2),
        method: 'POST',
        data: {
            accountId: b2.accountId,
            bucketId: bucketId,
            bucketType: bucketType
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    return request.sendRequest(options);
};

exports.getUploadUrl = function(b2, argsOrBucketId) {
    // we're allowing an args object OR bucketId for backwards compatibility
    let bucketId = argsOrBucketId;
    if (!_.isString(argsOrBucketId)) {
        bucketId = _.get(argsOrBucketId, 'bucketId');
    }
    const options = {
        url: getGetUploadUrl(b2),
        method: 'POST',
        data: {
            bucketId: bucketId
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    return request.sendRequest(options);
};

function getCreateUrl(b2) {
    return getApiUrl(b2) + '/b2_create_bucket';
}

function getDeleteUrl(b2) {
    return getApiUrl(b2) + '/b2_delete_bucket';
}

function getListUrl(b2) {
    return getApiUrl(b2) + '/b2_list_buckets';
}

function getUpdateUrl(b2) {
    return getApiUrl(b2) + '/b2_update_bucket';
}

function getGetUploadUrl(b2) {
    return getApiUrl(b2) + '/b2_get_upload_url';
}

function getApiUrl(b2) {
    return b2.apiUrl + conf.API_VERSION_URL;
}
