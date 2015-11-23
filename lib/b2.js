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
/*

B2.prototype.delete_file_version = function() {};

B2.prototype.download_file_by_id = function() {};

B2.prototype.download_file_by_name = function() {};

B2.prototype.get_file_info = function() {};

B2.prototype.get_upload_url = function() {};

B2.prototype.hide_file = function() {};

B2.prototype.list_file_names = function() {};

B2.prototype.list_file_versions = function() {};

B2.prototype.upload_file = function() {};
*/

module.exports = B2;
