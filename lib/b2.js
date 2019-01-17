const actions = require('./actions');

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

B2.prototype.getFileInfo = function(fileId) {
    return actions.file.getFileInfo(this, fileId);
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

B2.prototype.downloadFileById = function(fileId) {
    return actions.file.downloadFileById(this, fileId);
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
B2.prototype.listParts = notYetImplemented;

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

function notYetImplemented() {
    return Promise.reject('Feature not yet implemented');
}

module.exports = B2;
