const conf = require('../conf');

module.exports = function(b2) {
    const apiUrl = `${b2.apiUrl}${conf.API_VERSION_URL}`;
    return {
        // bucket actions
        createBucketUrl: `${apiUrl}/b2_create_bucket`,
        deleteBucketUrl: `${apiUrl}/b2_delete_bucket`,
        listBucketUrl: `${apiUrl}/b2_list_buckets`,
        updateBucketUrl: `${apiUrl}/b2_update_bucket`,
        getBucketUploadUrl: `${apiUrl}/b2_get_upload_url`,

        // file actions
        listFilesUrl: `${apiUrl}/b2_list_file_names`,
        listFileVersionsUrl: `${apiUrl}/b2_list_file_versions`,
        listPartsUrl: `${apiUrl}/b2_list_parts`,
        hideFileUrl: `${apiUrl}/b2_hide_file`,
        fileInfoUrl: `${apiUrl}/b2_get_file_info`,
        downloadAuthorizationUrl: `${apiUrl}/b2_get_download_authorization`,
        downloadFileByNameUrl: function(bucketName, fileName) {
            return `${b2.downloadUrl}/file/${bucketName}/${fileName}`;
        },
        downloadFileByIdUrl: function(fileId) {
            return `${b2.downloadUrl}${conf.API_VERSION_URL}/b2_download_file_by_id?fileId=${fileId}`;
        },
        deleteFileVersionUrl: `${apiUrl}/b2_delete_file_version`,
        startLargeFileUrl: `${apiUrl}/b2_start_large_file`,
        getUploadPartUrl: `${apiUrl}/b2_get_upload_part_url`,
        finishLargeFileUrl: `${apiUrl}/b2_finish_large_file`,
        cancelLargeFileUrl: `${apiUrl}/b2_cancel_large_file`,

        // key actions
        createKeyUrl: `${apiUrl}/b2_create_key`,
        deleteKeyUrl: `${apiUrl}/b2_delete_key`,
        listKeysUrl: `${apiUrl}/b2_list_keys`,
    };
};
