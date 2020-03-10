var expect = require('expect.js');

const utils = require('../../../../lib/utils');
var request = require('../../../../lib/request');
var file = require('../../../../lib/actions/file');

describe('actions/file', function() {
    var requestOptions;
    var bogusRequestModule;
    var response;
    var actualResponse;
    var errorMessage;
    var b2;
    var options;

    beforeEach(function() {
        errorMessage = undefined;
        actualResponse = undefined;

        b2 = {
            accountId: '98765',
            authorizationToken: 'unicorns and rainbows',
            apiUrl: 'https://foo',
            downloadUrl: 'https://download'
        };

        bogusRequestModule = function(options, cb) {
            var deferred = new utils.Deferred();
            requestOptions = options;
            cb(errorMessage, false, JSON.stringify(response), deferred);
            return deferred.promise;
        };

        request.setup(bogusRequestModule);
    });

    describe('uploadFile', function() {

        beforeEach(function() {
            options = {
                uploadUrl: 'https://uploadUrl',
                uploadAuthToken: 'uploadauthtoken',
                fileName: 'foo.txt',
                data: 'some text file content'
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.uploadFile(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://uploadUrl',
                    method: 'POST',
                    headers:
                    { Authorization: 'uploadauthtoken',
                        'Content-Type': 'b2/x-auto',
                        'Content-Length': 22,
                        'X-Bz-File-Name': 'foo.txt',
                        'X-Bz-Content-Sha1': '332e7f863695677895a406aff6d60acf7e84ea22' },
                    data: 'some text file content',
                    maxRedirects: 0,
                    onUploadProgress: null
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.uploadFile(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

        describe('with info headers', function() {

            beforeEach(function(done) {
                options = {
                    uploadUrl: 'https://uploadUrl',
                    uploadAuthToken: 'uploadauthtoken',
                    fileName: 'foo.txt',
                    data: 'some text file content',
                    info: {
                        foo:  'bar',
                        unicorns: 'rainbows'
                    },
                    maxRedirects: 0,
                };

                file.uploadFile(b2, options).then(function() {
                    done();
                });
            });

            it('should properly add x-bz-info headers', function() {
                expect(requestOptions).to.eql({
                    url: 'https://uploadUrl',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'uploadauthtoken',
                        'Content-Type': 'b2/x-auto',
                        'Content-Length': 22,
                        'X-Bz-File-Name': 'foo.txt',
                        'X-Bz-Content-Sha1': '332e7f863695677895a406aff6d60acf7e84ea22',
                        'X-Bz-Info-foo': 'bar',
                        'X-Bz-Info-unicorns': 'rainbows'
                    },
                    maxRedirects: 0,
                    data: 'some text file content',
                    onUploadProgress: null
                });
            });

        });

        describe('with no mime type specified', function() {

            beforeEach(function(done) {
                options = {
                    uploadUrl: 'https://uploadUrl',
                    uploadAuthToken: 'uploadauthtoken',
                    fileName: 'foo.txt',
                    data: 'some text file content',
                    info: {
                        foo:  'bar',
                        unicorns: 'rainbows'
                    }
                };

                file.uploadFile(b2, options).then(function() {
                    done();
                });
            });

            it('should default mime-type in headers', function() {
                expect(requestOptions.headers['Content-Type']).to.equal('b2/x-auto');
            });

        });

        describe('with mime type specified', function() {

            beforeEach(function(done) {
                options = {
                    uploadUrl: 'https://uploadUrl',
                    uploadAuthToken: 'uploadauthtoken',
                    fileName: 'foo.txt',
                    mime: 'foo/type',
                    data: 'some text file content',
                    info: {
                        foo:  'bar',
                        unicorns: 'rainbows'
                    }
                };

                file.uploadFile(b2, options).then(function() {
                    done();
                });
            });

            it('should properly mime-type in headers', function() {
                expect(requestOptions.headers['Content-Type']).to.equal('foo/type');
            });

        });

        describe('with no hash specified', function() {

            beforeEach(function(done) {
                options = {
                    uploadUrl: 'https://uploadUrl',
                    uploadAuthToken: 'uploadauthtoken',
                    fileName: 'foo.txt',
                    data: 'some text file content'
                };

                file.uploadFile(b2, options).then(function() {
                    done();
                });
            });

            it('should hash the data for x-bz-content-sha1 in headers', function() {
                expect(requestOptions.headers['X-Bz-Content-Sha1']).to.equal('332e7f863695677895a406aff6d60acf7e84ea22');
            });

        });

        describe('with hash specified', function() {

            beforeEach(function(done) {
                options = {
                    uploadUrl: 'https://uploadUrl',
                    uploadAuthToken: 'uploadauthtoken',
                    fileName: 'foo.txt',
                    data: 'some text file content',
                    hash: 'my hash value'
                };

                file.uploadFile(b2, options).then(function() {
                    done();
                });
            });

            it('should properly set x-bz-content-sha1 in headers', function() {
                expect(requestOptions.headers['X-Bz-Content-Sha1']).to.equal('my hash value');
            });

        });

        describe('with contentLength specified', function() {

            beforeEach(function(done) {
                options.data = 'more than 3';
                options.contentLength = 3;

                file.uploadFile(b2, options).then(function() {
                    done();
                });
            });

            it('should override Content-Length header', function() {
                expect(requestOptions.headers['Content-Length']).to.equal(3);
            });

        });

    });

    describe('uploadPart', function() {

        describe('with good response and with specified hash', function() {
            beforeEach(function(done) {
                options = {
                    uploadUrl: 'https://uploadUrl',
                    uploadAuthToken: 'uploadauthtoken',
                    data: 'some text file content',
                    partNumber: 3,
                    hash: 'my hash value'
                };

                file.uploadPart(b2, options).then(function() {
                    done();
                });
            });

            it('should properly set x-bz-content-sha1 in headers', function() {
                expect(requestOptions.headers['X-Bz-Content-Sha1']).to.equal('my hash value');
            });

            it('should properly set content-length in headers', function() {
                expect(requestOptions.headers['Content-Length']).to.equal(22);
            });

            it('should properly set x-bz-part-number in headers', function() {
                expect(requestOptions.headers['X-Bz-Part-Number']).to.equal(3);
            });
        });

        describe('with good response and with no hash specified', function() {
            beforeEach(function(done) {
                options = {
                    uploadUrl: 'https://uploadUrl',
                    uploadAuthToken: 'uploadauthtoken',
                    partNumber: 7,
                    data: 'some text file content'
                };

                file.uploadPart(b2, options).then(function() {
                    done();
                });
            });

            it('should properly set x-bz-content-sha1 in headers', function() {
                expect(requestOptions.headers['X-Bz-Content-Sha1']).to.equal('332e7f863695677895a406aff6d60acf7e84ea22');
            });
        });

        describe('with contentLength specified', function() {
            beforeEach(function(done) {
                options.data = 'more than 3';
                options.contentLength = 3;

                file.uploadPart(b2, options).then(function() {
                    done();
                });
            });

            it('should override Content-Length header', function() {
                expect(requestOptions.headers['Content-Length']).to.equal(3);
            });
        });
    });

    describe('listFileNames', function() {

        beforeEach(function() {
            options = {
                bucketId: '123abc',
                startFileName: 'unicorns.png',
                maxFileCount: 200
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.listFileNames(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_list_file_names',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    data: {
                        bucketId: '123abc',
                        startFileName: 'unicorns.png',
                        maxFileCount: 200,
                        prefix: '',
                        delimiter: null
                    }
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.listFileNames(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('listFileVersions', function() {

        beforeEach(function() {
            options = {
                bucketId: '123abc',
                startFileName: 'unicorns.png',
                startFileId: 'someID',
                maxFileCount: 200
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.listFileVersions(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_list_file_versions',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    data: {
                        bucketId: '123abc',
                        startFileName: 'unicorns.png',
                        startFileId: 'someID',
                        maxFileCount: 200
                    }
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.listFileVersions(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('hideFile', function() {

        beforeEach(function() {
            options = {
                bucketId: '123abc',
                fileName: 'unicorns-and_rainbows!@#$%^&.png'
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.hideFile(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response (filename to be encoded)', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_hide_file',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    data: {
                        bucketId: '123abc',
                        fileName: 'unicorns-and_rainbows!@#$%^&.png'
                    }
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.hideFile(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('getFileInfo', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.getFileInfo(b2, 'abc123').then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_get_file_info',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    data: {
                        fileId: 'abc123'
                    }
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.getFileInfo(b2, 'abc123').then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('getDownloadAuthorization', function() {
        beforeEach(function() {
            options = {
                bucketId: '123abc',
                fileNamePrefix: '/pets',
                validDurationInSeconds: 604800,
                b2ContentDisposition: 'some content disposition'
            };
        });

        describe('with good response', function() {
            beforeEach(function(done) {
                response = { foo: '1234' };

                file.getDownloadAuthorization(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_get_download_authorization',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    data: {
                        bucketId: '123abc',
                        fileNamePrefix: '/pets',
                        validDurationInSeconds: 604800,
                        b2ContentDisposition: 'some content disposition'
                    }
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {
            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.getDownloadAuthorization(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });
    });

    describe('downloadFileByName', function() {

        beforeEach(function() {
            options = {
                bucketName: 'unicornBox',
                fileName: 'unicorns-and_rainbows!@#$%^&.png'
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = {
                    headers: {
                        'x-bz-file-id': 'fileIdAbcd1234',
                        'x-bz-file-name': 'unicorns-download.png',
                        'x-bz-content-sha1': 'file_hash'
                    },
                    statusCode: 200,
                    contentSha1: 'file_hash',
                    data: 'file contents',
                    fileId: 'fileIdAbcd1234',
                    fileName: 'unicorns-download.png'
                };

                bogusRequestModule = function(options, cb) {
                    var deferred = new utils.Deferred();
                    requestOptions = options;
                    cb(errorMessage, response, 'file contents', deferred);

                    return deferred.promise;
                };

                request.setup(bogusRequestModule);

                file.downloadFileByName(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response (filename to be encoded)', function() {
                expect(requestOptions).to.eql({
                    url: 'https://download/file/unicornBox/unicorns-and_rainbows!%40%23%24%25%5E%26.png',
                    encoding: null,
                    headers: {
                        Authorization: 'unicorns and rainbows'
                    },
                    onDownloadProgress: null,
                    responseType: null,
                    transformResponse: null
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.downloadFileByName(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('downloadFileById', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = {
                    headers: {
                        'x-bz-file-id': 'fileIdAbcd1234',
                        'x-bz-file-name': 'unicorns-download.png',
                        'x-bz-content-sha1': 'file_hash'
                    },
                    statusCode: 200
                };

                bogusRequestModule = function(options, cb) {
                    var deferred = new utils.Deferred();
                    requestOptions = options;
                    cb(errorMessage, response, 'file contents', deferred);

                    return deferred.promise;
                };

                request.setup(bogusRequestModule);

                file.downloadFileById(b2, {fileId: 'abcd1234'}).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://download/b2api/v2/b2_download_file_by_id?fileId=abcd1234',
                    headers: {
                        Authorization: 'unicorns and rainbows'
                    },
                    encoding: null,
                    onDownloadProgress: null,
                    responseType: null,
                    transformResponse: null
                });
                expect(actualResponse).to.eql({
                    headers: {
                        'x-bz-file-id': 'fileIdAbcd1234',
                        'x-bz-file-name': 'unicorns-download.png',
                        'x-bz-content-sha1': 'file_hash'
                    },
                    statusCode: 200
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.downloadFileById(b2, '1234abcd').then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('deleteFileVersion', function() {

        beforeEach(function() {
            options = {
                fileId: 'abcd1234',
                fileName: 'unicorns-and_rainbows!@#$%^&.png'
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.deleteFileVersion(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response  (filename to be encoded)', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_delete_file_version',
                    method: 'POST',
                    headers: {
                        Authorization: 'unicorns and rainbows'
                    },
                    data: {
                        fileId: 'abcd1234',
                        fileName: 'unicorns-and_rainbows!@#$%^&.png'
                    }
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.deleteFileVersion(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('listParts', function() {
        function buildPartsResponse(fileId, count) {
            return {
                parts: Array.from({length: count})
                    .map((_, i) => ({
                        fileId,
                        partNumber: i + 1,
                        contentLength: 10000,
                        contentSha1: 'hash',
                        uploadTimestamp: new Date().getTime() - (60 - Math.random(3600)) * 1000
                    })),
                nextPartNumber: count
            };
        }

        beforeEach(function() {
            options = {
                fileId: 'abcd1234',
                startPartNumber: 0,
                maxPartCount: 1000
            };
        });

        describe('with good response', function() {
            beforeEach(function(done) {
                response = buildPartsResponse('file-id', 200);

                file.listParts(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v2/b2_list_parts',
                    method: 'POST',
                    headers: {
                        Authorization: 'unicorns and rainbows'
                    },
                    data: {
                        fileId: 'abcd1234',
                        startPartNumber: 0,
                        maxPartCount: 1000
                    }
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.listParts(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });
    });
});
