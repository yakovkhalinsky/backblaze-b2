const conf = require('../conf');

exports.addInfoHeaders = function(options, info) {
    const MAX_INFO_HEADERS = conf.MAX_INFO_HEADERS;
    let invalidKeys = [];
    if (info) {
        let keys = Object.keys(info);

        if (keys.length > MAX_INFO_HEADERS) {
            throw new Error(`Too many info headers: maximum of ${MAX_INFO_HEADERS} allowed`);
        }

        keys.forEach(addInfoHeader);

        if (invalidKeys.length) {
            throw new Error('Info header keys contain invalid characters: ' + invalidKeys.join('   '));
        }
    }

    function isValidHeader(header) {
        return /^[a-z0-9-_]+$/i.test(header);
    }

    function addInfoHeader(infoKey) {
        if (isValidHeader(infoKey)) {
            const key = 'X-Bz-Info-' + infoKey;
            options.headers[key] = encodeURIComponent(info[infoKey]);
        } else {
            return invalidKeys.push(infoKey);
        }
    }
};

exports.addBzHeaders = function(headers, targetObj) {
    const keys = Object.keys(headers);

    return keys.filter(isBzHeader)
        .map(getKeyObj)
        .map(setKeyValue);

    function isBzHeader(header) {
        return /^X-Bz-/i.test(header);
    }

    function getKeyObj(header) {
        const replacement = /^X-Bz-Info-/i.test(header) ? /X-Bz-Info-/i : /X-Bz-/i;
        return {
            original: header,
            header: camelCase(header.replace(replacement, ''))
        };
    }

    function setKeyValue(headerObj) {
        targetObj[headerObj.header] = headers[headerObj.original];
    }

    function camelCase(header) {
        return header.split('-')
            .map(firstLetterCapitalise)
            .join('');
    }

    function firstLetterCapitalise(word, index) {
        if (index === 0) { // skip first letter
            return word;
        }
        return word[0].toUpperCase() + word.substr(1);
    }
};
