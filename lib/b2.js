const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const request = require('./request');
const actions = require('./actions');

function B2(options) {
    this.accountId = options.accountId;
    this.applicationKeyId = options.applicationKeyId;
    this.applicationKey = options.applicationKey;
    this.authorizationToken = null;
    this.apiUrl = null;
    this.downloadUrl = null;
    /*
        allows an optional axios config object that overrides the default axios config
        creates new axios instance so that axios-retry isn't injected into the user's code if they also use axios
    */
    const axiosClient = axios.create(Object.assign({ /* no defaults for now */ }, options.axios));
    /*
        allows an optional retry config object that overrides the default retry behaviour
        please see https://github.com/softonic/axios-retry for additional options
        retries 3 times by default
        retries only on network errors and 5xx errors on indempotent requests (GET, HEAD, OPTIONS, PUT, or DELETE) by default
    */
    axiosRetry(axiosClient, Object.assign({ retries: 3 }, options.retry));
    request.setup(axiosClient);
}

B2.prototype.BUCKET_TYPES = actions.bucket.TYPES;

B2.prototype.authorize = function(args) {
    return actions.auth.authorize(this, args);
};

B2.prototype.createBucket = function(argsOrBucketName, undefOrBucketType) {
    return actions.bucket.create(this, argsOrBucketName, undefOrBucketType);
};

B2.prototype.deleteBucket = function(argsOrBucketId) {
    return actions.bucket.delete(this, argsOrBucketId);
};

B2.prototype.listBuckets = function(args) {
    return actions.bucket.list(this, args);
};

// args:
// - bucketName
// - bucketId
B2.prototype.getBucket = function(args) {
    return actions.bucket.get(this, args);
};

B2.prototype.updateBucket = function(argsOrBucketId, undefOrBucketType) {
    return actions.bucket.update(this, argsOrBucketId, undefOrBucketType);
};

B2.prototype.getUploadUrl = function(argsOrBucketId) {
    return actions.bucket.getUploadUrl(this, argsOrBucketId);
};

// args:
// - uploadUrl
// - uploadAuthToken
// - fileName
// - data
// - hash (optional)
B2.prototype.uploadFile = function(args) {
    return actions.file.uploadFile(this, args);
};

// args:
// - bucketId
// - startFileName (optional)
// - maxFileCount (optional)
B2.prototype.listFileNames = function(args) {
    return actions.file.listFileNames(this, args);
};

// args:
// - bucketId
// - startFileName (optional)
// - maxFileCount (optional)
B2.prototype.listFileVersions = function(args) {
    return actions.file.listFileVersions(this, args);
};

// args:
// - bucketId
// - fileName
B2.prototype.hideFile = function(args) {
    return actions.file.hideFile(this, args);
};

// args:
// - fileId
B2.prototype.getFileInfo = function(argsOrFileId) {
    return actions.file.getFileInfo(this, argsOrFileId);
};

// args:
// - bucketId
// - fileNamePrefix
// - validDurationInSeconds
// - b2ContentDisposition
B2.prototype.getDownloadAuthorization = function(args) {
    return actions.file.getDownloadAuthorization(this, args);
};

// args:
// - bucketName
// - fileName
B2.prototype.downloadFileByName = function(args) {
    return actions.file.downloadFileByName(this, args);
};

B2.prototype.downloadFileById = function(args) {
    return actions.file.downloadFileById(this, args);
};

// args:
// - fileId
// - fileName
B2.prototype.deleteFileVersion = function(args) {
    return actions.file.deleteFileVersion(this, args);
};

// b2_cancel_large_file
B2.prototype.cancelLargeFile = function(args) {
    return actions.file.cancelLargeFile(this, args);
};

// b2_finish_large_file
B2.prototype.finishLargeFile = function(args) {
    return actions.file.finishLargeFile(this, args);
};

// b2_list_parts
// args:
// - fileId
// - [startPartNumber]
// - [maxPartCount]
B2.prototype.listParts = function(args) {
    return actions.file.listParts(this, args);
};

// b2_list_unfinished_large_files
B2.prototype.listUnfinishedLargeFiles = notYetImplemented;

// b2_start_large_file
B2.prototype.startLargeFile = function(args) {
    return actions.file.startLargeFile(this, args);
};

B2.prototype.getUploadPartUrl = function(args) {
    return actions.file.getUploadPartUrl(this, args);
};

// b2_upload_part
B2.prototype.uploadPart = function(args) {
    return actions.file.uploadPart(this, args);
};

B2.prototype.KEY_CAPABILITIES = actions.key.CAPABILITIES;

// args:
// - capabilities
// - keyName
// - [validDurationInSeconds]
// - [bucketId]
// - [namePrefix]
B2.prototype.createKey = function(args) {
    return actions.key.create(this, args);
};

// args:
// - applicationKeyId
B2.prototype.deleteKey = function(args) {
    return actions.key.delete(this, args);
};

// args:
// - [maxKeyCount]
// - [startApplicationKeyId]
B2.prototype.listKeys = function(args) {
    return actions.key.list(this, args);
};

function notYetImplemented() {
    return Promise.reject('Feature not yet implemented');
}

module.exports = B2;
