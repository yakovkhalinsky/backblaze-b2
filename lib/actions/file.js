var sha1 = require('sha1');

var utils = require('./../utils');
var headersUtil = require('../headers');
var request = require('../request');
var conf = require('../../conf');

exports.uploadFile = function(b2, args) {
    var uploadUrl = args.uploadUrl;
    var uploadAuthToken = args.uploadAuthToken;
    var filename = utils.getUrlEncodedFileName(args.filename);
    var contentLength = args.contentLength;
    var data = args.data;
    var hash = args.hash;
    var info = args.info;
    var mime = args.mime;

    var options = {
        url: uploadUrl,
        method: 'POST',
        headers: {
            Authorization: uploadAuthToken,
            'Content-Type': mime || 'b2/x-auto',
            'Content-Length': contentLength || data.byteLength ? data.byteLength : data.length,
            'X-Bz-File-Name': filename,
            'X-Bz-Content-Sha1': hash || (data ? sha1(data) : null)
        },
        data: data,
        onUploadProgress: args.onUploadProgress || null
    };
    headersUtil.addInfoHeaders(options, info);
    return request.sendRequest(options);
};

exports.startLargeFile = function(b2, args) {
    var options = {
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
    var options = {
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
    var options = {
        url: args.uploadUrl,
        method: 'POST',
        headers: {
            Authorization: args.uploadAuthToken,
            'X-Bz-Part-Number': args.partNumber,
            'X-Bz-Content-Sha1': args.data ? sha1(args.data) : null
        },
        data: args.data,
        onUploadProgress: args.onUploadProgress || null
    };
    return request.sendRequest(options);
};

exports.finishLargeFile = function(b2, args) {
    var options = {
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
    var options = {
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
    var bucketId = args.bucketId;
    var startFileName = args.startFileName;
    var maxFileCount = args.maxFileCount;
    var prefix = args.prefix;
    var delimiter = args.delimiter;


    var options = {
        url: getListFilesUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            startFileName: startFileName ? startFileName : '',
            maxFileCount: maxFileCount ? maxFileCount : 100,
            prefix: prefix ? prefix : '',
            delimiter: delimiter ? delimiter : null

        }
    };
    return request.sendRequest(options, utils.getProcessFileSuccess(options));
};

exports.listFileVersions = function(b2, args) {
    var bucketId = args.bucketId;
    var startFileName = args.startFileName;
    var maxFileCount = args.maxFileCount;

    var options = {
        url: getListFileVersionsUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            startFileName: startFileName ? startFileName : '',
            maxFileCount: maxFileCount ? maxFileCount : 100
        }
    };
    return request.sendRequest(options);
};

exports.hideFile = function(b2, args) {
    var bucketId = args.bucketId;
    var fileName = args.fileName;

    var options = {
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
    var options = {
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
    var bucketId = args.bucketId;
    var fileNamePrefix = args.fileNamePrefix;
    var validDurationInSeconds = args.validDurationInSeconds;
    var b2ContentDisposition = args.b2ContentDisposition;

    var options = {
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
    var bucketName = args.bucketName;
    var fileName = utils.getUrlEncodedFileName(args.fileName);

    var options = {
        url: getDownloadFileByNameUrl(b2, bucketName, fileName),
        headers: utils.getAuthHeaderObjectWithToken(b2),
        responseType: args.responseType || null,
        encoding: null,
        transformResponse: args.transformResponse || null,
        onDownloadProgress: args.onDownloadProgress || null
    };

    var requestInstance = request.getInstance();
    return requestInstance(options, utils.getProcessFileSuccess());
};

exports.downloadFileById = function(b2, args) {
    var options = {
        url: getDownloadFileByIdUrl(b2, args.fileId),
        headers: utils.getAuthHeaderObjectWithToken(b2),
        responseType: args.responseType || null,
        encoding: null,
        transformResponse: args.transformResponse || null,
        onDownloadProgress: args.onDownloadProgress || null
    };

    var requestInstance = request.getInstance();
    return requestInstance(options, utils.getProcessFileSuccess());
};

exports.deleteFileVersion = function(b2, args) {
    var fileId = args.fileId;
    var fileName = args.fileName;

    var options = {
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
