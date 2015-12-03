var actions = require('./actions');

function B2(options) {
    this.accountId = options.accountId;
    this.applicationKey = options.applicationKey;
    this.authorizationToken = null;
    this.apiUrl = null;
    this.downloadUrl = null;
}

B2.prototype.BUCKET_TYPES = actions.bucket.TYPES;

B2.prototype.authorize = function() {
    return actions.auth.authorize(this, this.accountId, this.applicationKey);
};

B2.prototype.createBucket = function(bucketName, bucketType) {
    return actions.bucket.create(this, bucketName, bucketType);
};

B2.prototype.deleteBucket = function(bucketId) {
    return actions.bucket.delete(this, bucketId);
};

B2.prototype.listBuckets = function() {
    return actions.bucket.list(this);
};

B2.prototype.updateBucket = function(bucketId, bucketType) {
    return actions.bucket.update(this, bucketId, bucketType);
};

B2.prototype.getUploadUrl = function(bucketId) {
    return actions.bucket.getUploadUrl(this, bucketId);
};

// args:
// - uploadUrl
// - uploadAuthToken
// - filename
// - data
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

B2.prototype.getFileInfo = function(fileId) {
    return actions.file.getFileInfo(this, fileId);
};

// args:
// - bucketName
// - fileName
B2.prototype.downloadFileByName = function(args) {
    return actions.file.downloadFileByName(this, args);
};

/*
B2.prototype.delete_file_version = function() {};
B2.prototype.download_file_by_id = function() {};
*/

module.exports = B2;
