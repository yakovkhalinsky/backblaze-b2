### Backblaze B2 Node.js Library
[![npm version](https://badge.fury.io/js/backblaze-b2.svg)](https://badge.fury.io/js/backblaze-b2) [![Build Status](https://travis-ci.org/yakovkhalinsky/backblaze-b2.svg?branch=master)](https://travis-ci.org/yakovkhalinsky/backblaze-b2)

This library uses promises, so all actions on a `B2` instance return a promise in the following pattern

    b2.instanceFunction(arg1, arg2).then(
        successFn(response) { ... },
        errorFn(err) { ... }
    );


### Status of project

See the [CHANGELOG](https://github.com/yakovkhalinsky/backblaze-b2/blob/master/CHANGELOG.md) for a history of updates.


### Contributing and Suggestions for Changes and Fixes

Contributions and questions are welcome. If you are looking for something to help with, please have a look at the
[ISSUES](https://github.com/yakovkhalinsky/backblaze-b2/issues) or add an issue if there is something you would like to see or fix.

Make sure you use the `.editorconfig` in your IDE/editor when writing code.

Pull Requests should include:

*   Updated example in README.md
*   Update exiting tests, or add new tests to cover code changes

If you are adding tests, add these to `/test/unit`. Make sure the test is named `fooTest.js` and
is located in a similar folder to the node module that is being tested.

Always run `npm test` before you commit.

### Upgrading from 0.9.x to 1.0.x

For this update, we've switched the back end HTTP request library from `request` to `axios` as it has better Promise and progress support built in. However, there are a couple changes that will break your code and ruin your day. Here are the changes:
*  The Promise resolution has a different data structure. Where previously, the request response data was the root object in the promise resolution (`res`), this data now resides in `res.data`.
*  In v0.9.12, we added request progress reporting via the third parameter to `then()`. Because we are no longer using the same promise library, this functionality has been removed. However, progress reporting is still available by passing a callback function into the `b2.method()` that you're calling. See the documentation below for details.
* In v0.9.x, `b2.downloadFileById()` accepted a `fileId` parameter as a String or Number. As of 1.0.0, the first parameter is now expected to be a plain Object of arguments.

### Usage

    var B2 = require('backblaze-b2');

    // All functions on the b2 instance return the response from the B2 API in the success callback
    // i.e. b2.foo(...).then(function(b2JsonResponse) {})

    // create b2 object instance
    var b2 = new B2({
        accountId: 'accountId',
        applicationKey: 'applicationKey'
    });

    // authorize with provided credentials
    b2.authorize();  // returns promise

    // create bucket
    b2.createBucket(
      bucketName,
      bucketType, // one of `allPublic`, `allPrivate`
      bucketInfo // optional info object to be stored with the bucket. Useful for setting cache control: { "Cache-Control": "max-age=600" }
    );  // returns promise

    // delete bucket
    b2.deleteBucket(bucketId);  // returns promise

    // list buckets
    b2.listBuckets();  // returns promise

    // update bucket2
    b2.updateBucket(bucketId, bucketType, bucketInfo);  // returns promise

    // get upload url
    b2.getUploadUrl(bucketId);  // returns promise

    // upload file
    b2.uploadFile({
        uploadUrl: 'uploadUrl',
        uploadAuthToken: 'uploadAuthToken',
        filename: 'filename',
        mime: '', // optional mime type, will default to 'b2/x-auto' if not provided
        data: 'data' // this is expecting a Buffer not an encoded string,
        info: {
            // optional info headers, prepended with X-Bz-Info- when sent, throws error if more than 10 keys set
            // valid characters should be a-z, A-Z and '-', all other characters will cause an error to be thrown
            key1: value
            key2: value
        },
        onUploadProgress: function(event) || null // progress monitoring
    });  // returns promise

    // list file names
    b2.listFileNames({
        bucketId: 'bucketId',
        startFileName: 'startFileName',
        maxFileCount: 100,
        delimiter: '',
        prefix: ''
    });  // returns promise

    // list file versions
    b2.listFileVersions({
        bucketId: 'bucketId',
        startFileName: 'startFileName',
        maxFileCount: 100
    });  // returns promise

    // hide file
    b2.hideFile({
        bucketId: 'bucketId',
        fileName: 'fileName'
    });  // returns promise

    // get file info
    b2.getFileInfo(fileId);  // returns promise

    // download file by name
    b2.downloadFileByName({
        bucketName: 'bucketName',
        fileName: 'fileName',
        onDownloadProgress: function(event) || null // progress monitoring
    });  // returns promise

    // download file by fileId
    b2.downloadFileById({
      fileId: 'fileId',
      onDownloadProgress: function(event) || null // progress monitoring
    });  // returns promise

    // delete file version
    b2.deleteFileVersion({
        fileId: 'fileId',
        fileName: 'fileName'
    });  // returns promise

    // start large file
    b2.startLargeFile({
      bucketId: 'bucketId',
      fileName: 'fileName'
    }) // returns promise

    // get upload part url
    b2.getUploadPartUrl({
      fileId: 'fileId'
    }) // returns promise

    // get upload part
    b2.uploadPart({
      partNumber: 'partNumber', // A number from 1 to 10000
      uploadUrl: 'uploadUrl',
      uploadAuthToken: 'uploadAuthToken', // comes from getUploadPartUrl();
      data: Buffer // this is expecting a Buffer not an encoded string,
      onUploadProgress: function(event) || null // progress monitoring
    }) // returns promise

    // finish large file
    b2.finishLargeFile({
      fileId: 'fileId',
      partSha1Array: [partSha1Array] // array of sha1 for each part
    }) // returns promise

    // cancel large file
    b2.cancelLargeFile({
      fileId: 'fileId'
    }) // returns promise


### Authors
* Yakov Khalinsky (@yakovkhalinsky)
* Ivan Kalinin (@IvanKalinin) at Isolary
* Brandon Patton (@crazyscience) at Isolary
