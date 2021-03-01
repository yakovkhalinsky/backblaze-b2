# Backblaze B2 Node.js Library

[![npm version](https://badge.fury.io/js/backblaze-b2.svg)](https://badge.fury.io/js/backblaze-b2) [![Build Status](https://travis-ci.org/yakovkhalinsky/backblaze-b2.svg?branch=master)](https://travis-ci.org/yakovkhalinsky/backblaze-b2)

A customizable B2 client for Node.js:

* Uses [axios](https://github.com/axios/axios). You can control the axios instance at the request level (see `axios` and `axiosOverride` config arguments) and at the global level (see `axios` config argument at instantiation) so you can use any axios feature.
* Automatically retries on request failure. You can control retry behaviour using the `retries` argument at instantiation.

## Usage

This library uses promises, so all actions on a `B2` instance return a promise in the following pattern:

``` javascript
b2.instanceFunction(arg1, arg2).then(
    successFn(response) { ... },
    errorFn(err) { ... }
);
```

### Basic Example

```javascript
const B2 = require('backblaze-b2');

const b2 = new B2({
  applicationKeyId: 'applicationKeyId', // or accountId: 'accountId'
  applicationKey: 'applicationKey' // or masterApplicationKey
});

async function GetBucket() {
  try {
    await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
    let response = await b2.getBucket({ bucketName: 'my-bucket' });
    console.log(response.data);
  } catch (err) {
    console.log('Error getting bucket:', err);
  }
}
```

### Response Object

Each request returns an object with:

* `status` - int, html error Status
* `statusText`
* `headers`
* `config`
* `request`
* `data` - actual returned data from backblaze, https://www.backblaze.com/b2/docs/calling.html

### How it works

Each action (see reference below) takes arguments and constructs an axios request. You can add additional axios options at the request level using:

* The `axios` argument (object): each property in this object is added to the axios request object *only if it does not conflict* with an existing property.
* The `axiosOverride` argument (object): each property in this object is added to the axios request object by *overriding* conflicting properties, if any. Don't use this unless you know what you're doing!
* Both `axios` and `axiosOverride` work by recursively merging properties, so if you pass ```axios: { headers: { 'your-custom-header': 'header-value' } }```, the entire headers object will not be overridden - each header property (`your-custom-header`) will be compared.

### Reference

```javascript
const B2 = require('backblaze-b2');

// All functions on the b2 instance return the response from the B2 API in the success callback
// i.e. b2.foo(...).then((b2JsonResponse) => {})

// create B2 object instance
const b2 = new B2({
    applicationKeyId: 'applicationKeyId', // or accountId: 'accountId'
    applicationKey: 'applicationKey', // or masterApplicationKey
    // optional:
    axios: {
        // overrides the axios instance default config, see https://github.com/axios/axios
    },
    retry: {
        retries: 3 // this is the default
        // for additional options, see https://github.com/softonic/axios-retry
    }
});

// common arguments - you can use these in any of the functions below
const common_args = {
    // axios request level config, see https://github.com/axios/axios#request-config
    axios: {
        timeout: 30000 // (example)
    },
    axiosOverride: {
        /* Don't use me unless you know what you're doing! */
    }
}

// authorize with provided credentials (authorization expires after 24 hours)
b2.authorize({
    // ...common arguments (optional)
});  // returns promise

// create bucket
b2.createBucket({
    bucketName: 'bucketName',
    bucketType: 'bucketType' // one of `allPublic`, `allPrivate`
    // ...common arguments (optional)
});  // returns promise

// delete bucket
b2.deleteBucket({
    bucketId: 'bucketId'
    // ...common arguments (optional)
});  // returns promise

// list buckets
b2.listBuckets({
    // ...common arguments (optional)
});  // returns promise

// get the bucket
b2.getBucket({
    bucketName: 'bucketName',
    bucketId: 'bucketId' // optional
    // ...common arguments (optional)
});  // returns promise

// update bucket
b2.updateBucket({
    bucketId: 'bucketId',
    bucketType: 'bucketType'
    // ...common arguments (optional)
});  // returns promise

// get upload url
b2.getUploadUrl({
    bucketId: 'bucketId'
    // ...common arguments (optional)
});  // returns promise

// upload file
b2.uploadFile({
    uploadUrl: 'uploadUrl',
    uploadAuthToken: 'uploadAuthToken',
    fileName: 'fileName',
    contentLength: 0, // optional data length, will default to data.byteLength or data.length if not provided
    mime: '', // optional mime type, will default to 'b2/x-auto' if not provided
    data: 'data', // this is expecting a Buffer, not an encoded string
    hash: 'sha1-hash', // optional data hash, will use sha1(data) if not provided
    info: {
        // optional info headers, prepended with X-Bz-Info- when sent, throws error if more than 10 keys set
        // valid characters should be a-z, A-Z and '-', all other characters will cause an error to be thrown
        key1: 'value',
        key2: 'value'
    },
    onUploadProgress: (event) => {} || null // progress monitoring
    // ...common arguments (optional)
});  // returns promise

// list file names
b2.listFileNames({
    bucketId: 'bucketId',
    startFileName: 'startFileName',
    maxFileCount: 100,
    delimiter: '',
    prefix: ''
    // ...common arguments (optional)
});  // returns promise

// list file versions
b2.listFileVersions({
    bucketId: 'bucketId',
    startFileName: 'startFileName',
    startFileId: 'startFileId',
    maxFileCount: 100
    // ...common arguments (optional)
});  // returns promise

// list uploaded parts for a large file
b2.listParts({
    fileId: 'fileId',
    startPartNumber: 0, // optional
    maxPartCount: 100, // optional (max: 1000)
    // ...common arguments (optional)
});  // returns promise

// hide file
b2.hideFile({
    bucketId: 'bucketId',
    fileName: 'fileName'
    // ...common arguments (optional)
});  // returns promise

// get file info
b2.getFileInfo({
    fileId: 'fileId'
    // ...common arguments (optional)
});  // returns promise

// get download authorization
b2.getDownloadAuthorization({
    bucketId: 'bucketId',
    fileNamePrefix: 'fileNamePrefix',
    validDurationInSeconds: 'validDurationInSeconds', // a number from 0 to 604800
    b2ContentDisposition: 'b2ContentDisposition'
    // ...common arguments (optional)
});  // returns promise

// download file by name
b2.downloadFileByName({
    bucketName: 'bucketName',
    fileName: 'fileName',
    responseType: 'arraybuffer', // options are as in axios: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    onDownloadProgress: (event) => {} || null // progress monitoring
    // ...common arguments (optional)
});  // returns promise

// download file by fileId
b2.downloadFileById({
    fileId: 'fileId',
    responseType: 'arraybuffer', // options are as in axios: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    onDownloadProgress: (event) => {} || null // progress monitoring
    // ...common arguments (optional)
});  // returns promise

// delete file version
b2.deleteFileVersion({
    fileId: 'fileId',
    fileName: 'fileName'
    // ...common arguments (optional)
});  // returns promise

// start large file
b2.startLargeFile({
    bucketId: 'bucketId',
    fileName: 'fileName'
    // ...common arguments (optional)
}); // returns promise

// get upload part url
b2.getUploadPartUrl({
    fileId: 'fileId'
    // ...common arguments (optional)
}); // returns promise

// get upload part
b2.uploadPart({
    partNumber: 'partNumber', // A number from 1 to 10000
    uploadUrl: 'uploadUrl',
    uploadAuthToken: 'uploadAuthToken', // comes from getUploadPartUrl();
    data: Buffer // this is expecting a Buffer not an encoded string,
    hash: 'sha1-hash', // optional data hash, will use sha1(data) if not provided
    onUploadProgress: (event) => {} || null, // progress monitoring
    contentLength: 0, // optional data length, will default to data.byteLength or data.length if not provided
    // ...common arguments (optional)
}); // returns promise

// finish large file
b2.finishLargeFile({
    fileId: 'fileId',
    partSha1Array: [partSha1Array] // array of sha1 for each part
    // ...common arguments (optional)
}); // returns promise

// cancel large file
b2.cancelLargeFile({
    fileId: 'fileId'
    // ...common arguments (optional)
}); // returns promise

// create key
b2.createKey({
    capabilities: [
        'readFiles',                    // option 1
        b2.KEY_CAPABILITIES.READ_FILES, // option 2
        // see https://www.backblaze.com/b2/docs/b2_create_key.html for full list
    ],
    keyName: 'my-key-1', // letters, numbers, and '-' only, <=100 chars
    validDurationInSeconds: 3600, // expire after duration (optional)
    bucketId: 'bucketId', // restrict access to bucket (optional)
    namePrefix: 'prefix_', // restrict access to file prefix (optional)
    // ...common arguments (optional)
});  // returns promise

// delete key
b2.deleteKey({
    applicationKeyId: 'applicationKeyId',
    // ...common arguments (optional)
});  // returns promise

// list keys
b2.listKeys({
    maxKeyCount: 10, // limit number of keys returned (optional)
    startApplicationKeyId: '...', // use `nextApplicationKeyId` from previous response when `maxKeyCount` is set (optional)
    // ...common arguments (optional)
});  // returns promise
```

### Uploading Large Files Example

To upload large files, you should split the file into parts (between 5MB and 5GB) and upload each part seperately.

First, you initiate the large file upload to get the fileId:

```javascript
let response = await b2.startLargeFile({ bucketId, fileName });
let fileId = response.data.fileId;
```

Then, to upload parts, you request at least one `uploadUrl` and use the response to
upload the part with `uploadPart`. The url and token returned by `getUploadPartUrl()`
are valid for 24 hours or until `uploadPart()` fails, in which case you should request
another `uploadUrl` to continue. You may utilize multiple `uploadUrl`s in parallel to
achieve greater upload throughput.

If you are unsure whether you should use multipart upload, refer to the `recommendedPartSize`
value returned by a call to `authorize()`.

```javascript
let response = await b2.getUploadPartUrl({ fileId });

let uploadURL = response.data.uploadUrl;
let authToken = response.data.authorizationToken;

response = await b2.uploadPart({
    partNumber: parNum,
    uploadUrl: uploadURL,
    uploadAuthToken: authToken,
    data: buf
});
// status checks etc.
```

Then finish the uploadUrl:

```javascript
let response = await b2.finishLargeFile({
    fileId,
    partSha1Array: parts.map(buf => sha1(buf))
})
```

If an upload is interrupted, the fileId can be used to get a list of parts
which have already been transmitted. You can then send the remaining
parts before finally calling `b2.finishLargeFile()`.

```javascript
let response = await b2.listParts({
    fileId,
    startPartNumber: 0,
    maxPartCount: 1000
})
```

## Changes

See the [CHANGELOG](https://github.com/yakovkhalinsky/backblaze-b2/blob/master/CHANGELOG.md) for a history of updates.

### Upgrading from 0.9.x to 1.0.x

For this update, we've switched the back end HTTP request library from `request` to `axios` as it has better Promise and progress support built in. However, there are a couple changes that will break your code and ruin your day. Here are the changes:

* The Promise resolution has a different data structure. Where previously, the request response data was the root object in the promise resolution (`res`), this data now resides in `res.data`.
* In v0.9.12, we added request progress reporting via the third parameter to `then()`. Because we are no longer using the same promise library, this functionality has been removed. However, progress reporting is still available by passing a callback function into the `b2.method()` that you're calling. See the documentation below for details.
* In v0.9.x, `b2.downloadFileById()` accepted a `fileId` parameter as a String or Number. As of 1.0.0, the first parameter is now expected to be a plain Object of arguments.

## Contributing

Contributions, suggestions, and questions are welcome. Please review the [contributing guidelines](CONTRIBUTING.md) for details.

### Authors and Contributors

* Yakov Khalinsky (@yakovkhalinsky)
* Ivan Kalinin (@IvanKalinin) at Isolary
* Brandon Patton (@crazyscience) at Isolary
* C. Bess (@cbess)
* Amit (@Amit-A)
* Zsombor Paróczi (@realhidden)
* Oden (@odensc)
