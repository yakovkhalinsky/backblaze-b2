
exports.getAuthHeaderObject = function(accountId, applicationKey) {
    if (!accountId) {
        throw new Error('Invalid accountId');
    }
    if (!applicationKey) {
        throw new Error('Invalid applicationKey');
    }
    var base64 = new Buffer(accountId + ':' + applicationKey).toString('base64');
    return {
        Authorization: 'Basic ' + base64
    };
};

exports.getAuthHeaderObjectWithToken = function(b2) {
    if (!b2) {
        throw new Error('Invalid B2 instance');
    }
    if (!b2.authorizationToken) {
        throw new Error('Invalid authorizationToken');
    }
    return {
        Authorization: b2.authorizationToken
    };
};

exports.parseJson = function(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        // got error
    }
};

exports.getProcessAuthSuccess = function(context, deferred) {
    return function(error, response, body) {
        if (error) {
            deferred.reject(error);
        } else {
            var authResponse = exports.parseJson(body);
            context.authorizationToken = authResponse.authorizationToken;
            context.apiUrl = authResponse.apiUrl;
            context.downloadUrl = authResponse.downloadUrl;
            deferred.resolve(authResponse);
        }
    };
};

exports.getProcessFileSuccess = function(deferred, processResponseFn) {
    return function(error, response, body) {
        if (error) {
            return deferred.reject(error);
        } else if (response.statusCode !== 200) {
            return deferred.reject(response.statusMessage);
        } else {
            deferred.resolve(processResponseFn(response, body));
        }
    };
};

exports.processResponseGeneric = function (deferred) {
    return function(error, response, body) {
        if (error) {
            return deferred.reject(error);
        } else {
            var genericResponse = exports.parseJson(body);
            deferred.resolve(genericResponse);
        }
    };
};

exports.getUrlEncodedFileName = function(fileName) {
    return fileName.split('/')
        .map(encodeURIComponent)
        .join('/');
};
