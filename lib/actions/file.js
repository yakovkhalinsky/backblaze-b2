const _ = require('lodash');
const utils = require('./../utils');
const headersUtil = require('../headers');
const request = require('../request');
const endpoints = require('../endpoints');
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
    const len = args.contentLength || data.byteLength || data.length;

    const options = {
        url: uploadUrl,
        method: 'POST',
        headers: {
            Authorization: uploadAuthToken,
            'Content-Type': mime || 'b2/x-auto',
            'Content-Length': len,
            'X-Bz-File-Name': fileName,
            'X-Bz-Content-Sha1': hash || (data ? sha1(data) : null)
        },
        data: data,
        maxRedirects: 0,
        onUploadProgress: args.onUploadProgress || null
    };

    headersUtil.addInfoHeaders(options, info);
    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.startLargeFile = function(b2, args) {
    const options = {
        url: endpoints(b2).startLargeFileUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: args.bucketId,
            fileName: args.fileName,
            contentType: args.contentType || 'b2/x-auto'
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.getUploadPartUrl = function(b2, args) {
    const options = {
        url: endpoints(b2).getUploadPartUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: args.fileId
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.uploadPart = function(b2, args) {
    const options = {
        url: args.uploadUrl,
        method: 'POST',
        headers: {
            Authorization: args.uploadAuthToken,
            'Content-Length': args.contentLength || args.data.byteLength || args.data.length,
            'X-Bz-Part-Number': args.partNumber,
            'X-Bz-Content-Sha1': args.hash || (args.data ? sha1(args.data) : null)
        },
        data: args.data,
        onUploadProgress: args.onUploadProgress || null,
        maxRedirects: 0
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.finishLargeFile = function(b2, args) {
    const options = {
        url: endpoints(b2).finishLargeFileUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: args.fileId,
            partSha1Array: args.partSha1Array
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.cancelLargeFile = function(b2, args) {
    const options = {
        url: endpoints(b2).cancelLargeFileUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: args.fileId
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.listFileNames = function(b2, args) {
    const bucketId = args.bucketId;
    const startFileName = args.startFileName;
    const maxFileCount = args.maxFileCount;
    const prefix = args.prefix;
    const delimiter = args.delimiter;

    const options = {
        url: endpoints(b2).listFilesUrl,
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

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ), utils.getProcessFileSuccess(options));
};

exports.listFileVersions = function(b2, args) {
    const bucketId = args.bucketId;
    const startFileName = args.startFileName;
    const startFileId = args.startFileId;
    const maxFileCount = args.maxFileCount;

    const options = {
        url: endpoints(b2).listFileVersionsUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            startFileName: startFileName || '',
            startFileId: startFileId,
            maxFileCount: maxFileCount || 100
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.listParts = function(b2, args) {
    const fileId = args.fileId;
    const startPartNumber = args.startPartNumber;
    const maxPartCount = args.maxPartCount;

    const options = {
        url: endpoints(b2).listPartsUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId,
            startPartNumber: startPartNumber || 0,
            maxPartCount: maxPartCount || 100
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.hideFile = function(b2, args) {
    const bucketId = args.bucketId;
    const fileName = args.fileName;

    const options = {
        url: endpoints(b2).hideFileUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            fileName: fileName
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.getFileInfo = function(b2, argsOrFileId) {
    /* we're allowing an args object OR fileId for backwards compatibility */
    let fileId = argsOrFileId;
    if (!_.isString(argsOrFileId)) {
        fileId = _.get(argsOrFileId, 'fileId');
    }

    const options = {
        url: endpoints(b2).fileInfoUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(argsOrFileId, 'axios', {}),
        options,
        _.get(argsOrFileId, 'axiosOverride', {})
    ));
};

exports.getDownloadAuthorization = function (b2, args) {
    const bucketId = args.bucketId;
    const fileNamePrefix = args.fileNamePrefix;
    const validDurationInSeconds = args.validDurationInSeconds;
    const b2ContentDisposition = args.b2ContentDisposition;

    const options = {
        url: endpoints(b2).downloadAuthorizationUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            bucketId: bucketId,
            fileNamePrefix: fileNamePrefix,
            validDurationInSeconds: validDurationInSeconds,
            b2ContentDisposition: b2ContentDisposition
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};

exports.downloadFileByName = function(b2, args) {
    const bucketName = args.bucketName;
    const fileName = utils.getUrlEncodedFileName(args.fileName);

    const options = {
        url: endpoints(b2).downloadFileByNameUrl(bucketName, fileName),
        headers: utils.getAuthHeaderObjectWithToken(b2),
        responseType: args.responseType || null,
        encoding: null,
        transformResponse: args.transformResponse || null,
        onDownloadProgress: args.onDownloadProgress || null
    };

    const requestInstance = request.getInstance();
    // merge order matters here: later objects override earlier objects
    return requestInstance(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ), utils.getProcessFileSuccess());


};

exports.downloadFileById = function(b2, args) {
    const options = {
        url: endpoints(b2).downloadFileByIdUrl(args.fileId),
        headers: utils.getAuthHeaderObjectWithToken(b2),
        responseType: args.responseType || null,
        encoding: null,
        transformResponse: args.transformResponse || null,
        onDownloadProgress: args.onDownloadProgress || null
    };

    const requestInstance = request.getInstance();
    // merge order matters here: later objects override earlier objects
    return requestInstance(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ), utils.getProcessFileSuccess());
};

exports.deleteFileVersion = function(b2, args) {
    const fileId = args.fileId;
    const fileName = args.fileName;

    const options = {
        url: endpoints(b2).deleteFileVersionUrl,
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        data: {
            fileId: fileId,
            fileName: fileName
        }
    };

    // merge order matters here: later objects override earlier objects
    return request.sendRequest(_.merge({},
        _.get(args, 'axios', {}),
        options,
        _.get(args, 'axiosOverride', {})
    ));
};
