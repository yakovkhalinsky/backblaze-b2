const _ = require('lodash');
const utils = require('./../utils');
const request = require('../request');
const endpoints = require('../endpoints');

exports.TYPES = {
    ALL_PUBLIC: 'allPublic',
    ALL_PRIVATE: 'allPrivate'
};

// https://www.backblaze.com/b2/docs/b2_create_bucket.html
const BUCKET_PROPS = [
    'bucketName', 'bucketId', 'bucketType', 'bucketInfo', 'corsRules', 'fileLockEnabled', 'lifecycleRules',
    'replicationConfiguration', 'defaultServerSideEncryption'
];

exports.create = function(b2, argsOrBucketName, undefOrBucketType) {
    // we're allowing an args object OR bucketName and bucketType for backwards compatibility
    const data = {
        accountId: b2.accountId
    };

    if (!_.isString(argsOrBucketName)) {
        Object.assign(data, _.pick(argsOrBucketName, BUCKET_PROPS));
    } else {
        Object.assign(data, {
            bucketName: argsOrBucketName,
            bucketType: undefOrBucketType
        });
    }

    const options = {
        url: endpoints(b2).createBucketUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data
    };
    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(argsOrBucketName, 'axios', {}),
        options,
        _.get(argsOrBucketName, 'axiosOverride', {})
    ));
};

exports.delete = function(b2, argsOrBucketId) {
    // we're allowing an args object OR bucketId for backwards compatibility
    let bucketId = argsOrBucketId;
    if (!_.isString(argsOrBucketId)) {
        bucketId = _.get(argsOrBucketId, 'bucketId');
    }
    const options = {
        url: endpoints(b2).deleteBucketUrl,
        method: 'POST',
        data: {
            accountId: b2.accountId,
            bucketId: bucketId
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(argsOrBucketId, 'axios', {}),
        options,
        _.get(argsOrBucketId, 'axiosOverride', {})
    ));
};

exports.list = function(b2, args) {
    const options = {
        url: endpoints(b2).listBucketUrl,
        method: 'POST',
        data: {
            accountId: b2.accountId
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)

    };
    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
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
        url: endpoints(b2).listBucketUrl,
        method: 'POST',
        data,
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.update = function(b2, argsOrBucketId, undefOrBucketType) {
    // we're allowing an args object OR bucketId and bucketType for backwards compatibility
    const data = {
        accountId: b2.accountId
    };

    if (!_.isString(argsOrBucketId)) {
        Object.assign(data, _.pick(argsOrBucketId, BUCKET_PROPS));
    } else {
        Object.assign(data, {
            bucketId: argsOrBucketId,
            bucketType: undefOrBucketType
        });
    }

    const options = {
        url: endpoints(b2).updateBucketUrl,
        method: 'POST',
        data,
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(argsOrBucketId, 'axios', {}),
        options,
        _.get(argsOrBucketId, 'axiosOverride', {})
    ));
};

exports.getUploadUrl = function(b2, argsOrBucketId) {
    // we're allowing an args object OR bucketId for backwards compatibility
    let bucketId = argsOrBucketId;
    if (!_.isString(argsOrBucketId)) {
        bucketId = _.get(argsOrBucketId, 'bucketId');
    }
    const options = {
        url: endpoints(b2).getBucketUploadUrl,
        method: 'POST',
        data: {
            bucketId: bucketId
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };
    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(argsOrBucketId, 'axios', {}),
        options,
        _.get(argsOrBucketId, 'axiosOverride', {})
    ));
};
