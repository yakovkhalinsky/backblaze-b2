var conf = require('../conf');

exports.addInfoHeaders = function(options, info) {
    var MAX_INFO_HEADERS = conf.MAX_INFO_HEADERS;
    var invalidKeys = [];
    if (info) {
        var keys = Object.keys(info);

        if (keys.length > MAX_INFO_HEADERS) {
            throw new Error('Too many info headers: maximum of ' + MAX_INFO_HEADERS + ' allowed');
        }

        keys.forEach(addInfoHeader);

        if (invalidKeys.length) {
            throw new Error('Info header keys contain invalid characters: ' + invalidKeys.join('   '));
        }
    }

    function isValidHeader(header) {
        return /^[a-z0-9\-]+$/i.test(header);
    }

    function addInfoHeader(infoKey) {
        if (isValidHeader(infoKey)) {
            var key = 'X-Bz-Info-' + infoKey;
            options.headers[key] = encodeURIComponent(info[infoKey]);
        } else {
            return invalidKeys.push(infoKey);
        }
    }
};
