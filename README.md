### Backblaze B2 Node.js Library 
[![npm version](https://badge.fury.io/js/backblaze-b2.svg)](https://badge.fury.io/js/backblaze-b2) [![Build Status](https://travis-ci.org/yakovkhalinsky/backblaze-b2.svg?branch=master)](https://travis-ci.org/yakovkhalinsky/backblaze-b2)

This library uses promises, so all actions on a `B2` instance return a promise in the following pattern
 
    b2.instanceFunction(arg1, arg2).then(
        successFn(response) { ... },
        errorFn(err) { ... } 
    );


### Status of project

At this time not all API features of Backblaze B2 are yet implemented.

Once all API features are implemented, version will be updated to 1.0.x


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
