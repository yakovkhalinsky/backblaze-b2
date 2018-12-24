exports.getAuthHeaderObject = function(accountId, applicationKey) {
    if (!accountId) {
        throw new Error('Invalid accountId');
    }
    if (!applicationKey) {
        throw new Error('Invalid applicationKey');
    }
    var base64 = Buffer.from(accountId + ':' + applicationKey, 'utf8').toString('base64');
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

exports.saveAuthContext = function (context, authResponse) {
    context.authorizationToken = authResponse.authorizationToken;
    context.apiUrl = authResponse.apiUrl;
    context.downloadUrl = authResponse.downloadUrl;
};

exports.getProcessFileSuccess = function(deferred) {
    return function(error, response, body, promise) {
        deferred = deferred || promise;
        if (error) {
            deferred.reject(error);
        } else if (response.statusCode !== 200) {
            deferred.reject(response.statusMessage);
        } else {
            deferred.resolve(response);
        }
    };
};

exports.processResponseGeneric = function (deferred) {
    return function(error, response, body, promise) {
        deferred = deferred || promise;
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
