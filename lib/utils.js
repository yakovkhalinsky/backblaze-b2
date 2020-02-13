// use: let deferred = new Deferred();
/** Backwards compatible Promise.defer() function */
exports.Deferred = function() {
    // credit: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred#Backwards_and_forwards_compatible_helper
    this.resolve = null;
    this.reject = null;
    this.promise = new Promise(function(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }.bind(this));

    Object.freeze(this);
};

exports.getAuthHeaderObject = function(b2) {
    const id = b2.applicationKeyId || b2.accountId;
    if (!id) {
        throw new Error('Invalid accountId or applicationKeyId');
    }
    if (!b2.applicationKey) {
        throw new Error('Invalid applicationKey');
    }
    let base64 = Buffer.from(id + ':' + b2.applicationKey).toString('base64');
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
    context.accountId = authResponse.accountId;
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
            let genericResponse = exports.parseJson(body);
            deferred.resolve(genericResponse);
        }
    };
};

exports.getUrlEncodedFileName = function(fileName) {
    return fileName.split('/')
        .map(encodeURIComponent)
        .join('/');
};
