const _ = require('lodash');
const utils = require('./../utils');
const request = require('../request');
const endpoints = require('../endpoints');

exports.CAPABILITIES = {
    LIST_KEYS: 'listKeys',
    WRITE_KEYS: 'writeKeys',
    DELETE_KEYS: 'deleteKeys',

    LIST_BUCKETS: 'listBuckets',
    WRITE_BUCKETS: 'writeBuckets',
    DELETE_BUCKETS: 'deleteBuckets',

    LIST_FILES: 'listFiles',
    READ_FILES: 'readFiles',
    SHARE_FILES: 'shareFiles',
    WRITE_FILES: 'writeFiles',
    DELETE_FILES: 'deleteFiles',
};

/**
 * @param {B2}       b2
 * @param {object}   args
 * @param {string[]} args.capabilities
 * @param {string}   args.keyName
 * @param {number}   args.[validDurationInSeconds] - expire key after seconds
 * @param {string}   args.[bucketId] - restrict key access to bucket
 * @param {string}   args.[namePrefix] - restrict key access to files starting
 *                                       with prefix (bucketId required)
 */
exports.create = function(b2, args) {
    const options = {
        url: endpoints(b2).createKeyUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            accountId:              b2.accountId,
            capabilities:           args.capabilities,
            keyName:                args.keyName,
            validDurationInSeconds: args.validDurationInSeconds,
            bucketId:               args.bucketId,
            namePrefix:             args.namePrefix,
        }
    };
    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};
