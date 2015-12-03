### Backblaze B2 Node.js Library 
[![npm version](https://badge.fury.io/js/backblaze-b2.svg)](https://badge.fury.io/js/backblaze-b2) [![Build Status](https://travis-ci.org/yakovkhalinsky/backblaze-b2.svg?branch=master)](https://travis-ci.org/yakovkhalinsky/backblaze-b2)

This library uses promises, so all actions on a `B2` instance return a promise in the following pattern
 
    b2.instanceFunction(arg1, arg2).then(
        successFn(response) { ... },
        errorFn(err) { ... } 
    );


### Status of project

All B2 API's have been implemented. See below for usage.


### Usage

    var B2 = require('backblaze-b2');
    
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
        data: 'data'
    });  // returns promise
        
    // list file names
    b2.listFileNames({
        bucketId: 'bucketId',
        startFileName: 'startFileName',
        maxFileCount: 100
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
        fileName: 'fileName',
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
    
