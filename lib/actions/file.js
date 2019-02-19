const utils = require('./../utils');
const headersUtil = require('../headers');
const request = require('../request');
const conf = require('../../conf');
const sha1 = (value) => require('crypto').createHash('sha1').update(value).digest('hex');

exports.uploadFile = function(b2, args) {
    const uploadUrl = args.uploadUrl;
    const uploadAuthToken = args.uploadAuthToken;
    // Previous versions used filename (lowercase), so support that here
    const fileName = utils.getUrlEncodedFileName(args.fileName || args.filename);
    const data = args.data;
    const hash = args.hash;
    const info = args.info;
    const mime = args.mime;

    const options = {
        url: uploadUrl,
        method: 'POST',
        headers: {
            Authorization: uploadAuthToken,
            'Content-Type': mime || 'b2/x-auto',
            'Content-Length': data.byteLength || data.length,
            'X-Bz-File-Name': fileName,
            'X-Bz-Content-Sha1': hash || (data ? sha1(data) : null)
        },
        data: data,
        maxRedirects: 0,
        onUploadProgress: args.onUploadProgress || null
    };
    headersUtil.addInfoHeaders(options, info);
    return request.sendRequest(options);
};

exports.startLargeFile = function(b2, args) {
    const options = {
        url: getStartLargeFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: args.bucketId,
            fileName: args.fileName,
            contentType: args.contentType || 'b2/x-auto'
        }
    };
    return request.sendRequest(options);
};

exports.getUploadPartUrl = function(b2, args) {
    const options = {
        url: getGetUploadPartUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: args.fileId
        }
    };
    return request.sendRequest(options);
};

exports.uploadPart = function(b2, args) {
    const options = {
        url: args.uploadUrl,
        method: 'POST',
        headers: {
            Authorization: args.uploadAuthToken,
            'Content-Length': args.data.byteLength || args.data.length,
            'X-Bz-Part-Number': args.partNumber,
            'X-Bz-Content-Sha1': args.hash || (args.data ? sha1(args.data) : null)
        },
        data: args.data,
        onUploadProgress: args.onUploadProgress || null,
        maxRedirects: 0
    };
    return request.sendRequest(options);
};

exports.finishLargeFile = function(b2, args) {
    const options = {
        url: getFinishLargeFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: args.fileId,
            partSha1Array: args.partSha1Array
        }
    };
    return request.sendRequest(options);
};

exports.cancelLargeFile = function(b2, args) {
    const options = {
        url: getCancelLargeFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: args.fileId
        }
    };
    return request.sendRequest(options);
};

exports.listFileNames = function(b2, args) {
    const bucketId = args.bucketId;
    const startFileName = args.startFileName;
    const maxFileCount = args.maxFileCount;
    const prefix = args.prefix;
    const delimiter = args.delimiter;

    const options = {
        url: getListFilesUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId,
            startFileName: startFileName || '',
            maxFileCount: maxFileCount || 100,
            prefix: prefix || '',
            delimiter: delimiter || null
        }
    };
    return request.sendRequest(options, utils.getProcessFileSuccess(options));
};

exports.listFileVersions = function(b2, args) {
    const bucketId = args.bucketId;
    const startFileName = args.startFileName;
    const maxFileCount = args.maxFileCount;

    const options = {
        url: getListFileVersionsUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            startFileName: startFileName || '',
            maxFileCount: maxFileCount || 100
        }
    };
    return request.sendRequest(options);
};

exports.hideFile = function(b2, args) {
    const bucketId = args.bucketId;
    const fileName = args.fileName;

    const options = {
        url: getHideFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            fileName: fileName
        }
    };
    return request.sendRequest(options);
};

exports.getFileInfo = function(b2, fileId) {
    const options = {
        url: getFileInfoUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId
        }
    };
    return request.sendRequest(options);
};

exports.getDownloadAuthorization = function (b2, args) {
    const bucketId = args.bucketId;
    const fileNamePrefix = args.fileNamePrefix;
    const validDurationInSeconds = args.validDurationInSeconds;
    const b2ContentDisposition = args.b2ContentDisposition;

    const options = {
        url: getDownloadAuthorizationUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            fileNamePrefix: fileNamePrefix,
            validDurationInSeconds: validDurationInSeconds,
            b2ContentDisposition: b2ContentDisposition
        }
    };

    return request.sendRequest(options);
};

exports.downloadFileByName = function(b2, args) {
    const bucketName = args.bucketName;
    const fileName = utils.getUrlEncodedFileName(args.fileName);

    const options = {
        url: getDownloadFileByNameUrl(b2, bucketName, fileName),
        headers: utils.getAuthHeaderObjectWithToken(b2),
        responseType: args.responseType || null,
        encoding: null,
        transformResponse: args.transformResponse || null,
        onDownloadProgress: args.onDownloadProgress || null
    };

    const requestInstance = request.getInstance();
    return requestInstance(options, utils.getProcessFileSuccess());
};

exports.downloadFileById = function(b2, args) {
    const options = {
        url: getDownloadFileByIdUrl(b2, args.fileId),
        headers: utils.getAuthHeaderObjectWithToken(b2),
        responseType: args.responseType || null,
        encoding: null,
        transformResponse: args.transformResponse || null,
        onDownloadProgress: args.onDownloadProgress || null
    };

    const requestInstance = request.getInstance();
    return requestInstance(options, utils.getProcessFileSuccess());
};

exports.deleteFileVersion = function(b2, args) {
    const fileId = args.fileId;
    const fileName = args.fileName;

    const options = {
        url: getDeleteFileVersionUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId,
            fileName: fileName
        }
    };

    return request.sendRequest(options);
};

function getListFilesUrl(b2) {
    return getApiUrl(b2) + '/b2_list_file_names';
}

function getListFileVersionsUrl(b2) {
    return getApiUrl(b2) + '/b2_list_file_versions';
}

function getHideFileUrl(b2) {
    return getApiUrl(b2) + '/b2_hide_file';
}

function getFileInfoUrl(b2) {
    return getApiUrl(b2) + '/b2_get_file_info';
}

function getDownloadAuthorizationUrl(b2) {
    return getApiUrl(b2) + '/b2_get_download_authorization';
}

function getDownloadFileByNameUrl(b2, bucketName, fileName) {
    return b2.downloadUrl + '/file/' + bucketName + '/' + fileName;
}

function getDownloadFileByIdUrl(b2, fileId) {
    return b2.downloadUrl + conf.API_VERSION_URL + '/b2_download_file_by_id?fileId=' + fileId;
}

function getDeleteFileVersionUrl(b2) {
    return getApiUrl(b2) + '/b2_delete_file_version';
}

function getApiUrl(b2) {
    return b2.apiUrl + conf.API_VERSION_URL;
}

function getStartLargeFileUrl(b2) {
    return getApiUrl(b2) + '/b2_start_large_file';
}

function getGetUploadPartUrl(b2) {
    return getApiUrl(b2) + '/b2_get_upload_part_url';
}

function getFinishLargeFileUrl(b2) {
    return getApiUrl(b2) + '/b2_finish_large_file';
}

function getCancelLargeFileUrl(b2) {
    return getApiUrl(b2) + '/b2_cancel_large_file';
}
