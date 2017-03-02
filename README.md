### Backblaze B2 Node.js Library 
[![npm version](https://badge.fury.io/js/backblaze-b2.svg)](https://badge.fury.io/js/backblaze-b2) [![Build Status](https://travis-ci.org/yakovkhalinsky/backblaze-b2.svg?branch=master)](https://travis-ci.org/yakovkhalinsky/backblaze-b2)

This library uses promises, so all actions on a `B2` instance return a promise in the following pattern
 
    b2.instanceFunction(arg1, arg2).then(
        successFn(response) { ... },
        errorFn(err) { ... } 
    );


### Status of project

All B2 API's have been implemented with the exception of the large file API. See below for usage.

Also see the [CHANGELOG](https://github.com/yakovkhalinsky/backblaze-b2/blob/master/CHANGELOG.md) for a history of updates.


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
    b2.createBucket(bucketName, bucketType);  // returns promise
    
    // delete bucket
    b2.deleteBucket(bucketId);  // returns promise
    
    // list buckets
    b2.listBuckets();  // returns promise
    
    // update bucket2
    b2.updateBucket(bucketId, bucketType);  // returns promise
    
    // get upload url
    b2.getUploadUrl(bucketId);  // returns promise
    
    // upload file
    b2.uploadFile({
        uploadUrl: 'uploadUrl',
        uploadAuthToken: 'uploadAuthToken',
        filename: 'filename',
        mime: '', // optonal mime type, will default to 'b2/x-auto' if not provided
        data: 'data' // this is expecting a Buffer not an encoded string,
        info: { 
            // optional info headers, prepended with X-Bz-Info- when sent, throws error if more than 10 keys set
            // valid characters should be a-z, A-Z and '-', all other characters will cause an error to be thrown
            key1: value
            key2: value
        }
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
        fileName: 'fileName'
    });  // returns promise
                
    // download file by fileId
    b2.downloadFileById(fileId);  // returns promise
    
    // delete file version
    b2.deleteFileVersion({
        fileId: 'fileId',
        fileName: 'fileName'
    });  // returns promise
    
