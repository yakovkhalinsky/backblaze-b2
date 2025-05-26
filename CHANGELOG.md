### v1.7.1 (May 26, 2025)

Fixes

- Update dependencies (#132 - thanks @ps73)

### v1.7.0 (June 5, 2021) - The Maintenance release

Fixes

- Update dependencies

Features

- Add optional contentLength param to uploadPart (#92 - thanks @Klowner)

### v1.6.0 (January 1, 2020) - The List Parts release

Features

- Add support for b2_list_parts (#84 - thanks @Klowner)

### v1.5.0 (October 21, 2019) - The Key Operations release

Features

- Add support for key operations (#82 - thanks @jamiesyme)
- Add support for `startFileId` for listFileVersions (#78 - thanks @ScottChapman)

### v1.4.0 (June 3, 2019) - The Application Key / Streams release

Features

- Add `applicationKeyId` parameter for proper use of application keys. (#67 - thanks @phil-r)
- Add contentLength param to uploadFile, allowing the use of Streams when uploading. (#73 - thanks @jamiesyme)
- Allow underscores in info headers. (#70 - thanks @odensc)

### v1.3.1 (February 25, 2019) - The Axios control release

Features

- Automatic retries on request failure (customizable)
- Complete control of the axios instance at the request level (axios and axiosOverride args)

### v1.2.0 (January 30, 2019) - The getBucket release

Features

- Adds `B2.getBucket(...)` to help get bucket IDs with restricted bucket keys. In B2 v2, `B2.listBuckets()` will respond with an error, if you authorize without the `master key`.

### v1.1.0 (January 27, 2019) - The B2 v2 release

Features

- Uses [B2 v2 API](https://www.backblaze.com/b2/docs/versions.html). This allows you to use application keys with [bucket restrictions](https://www.backblaze.com/b2/docs/application_keys.html#usingRestrictedKeys).
- Updated minimum `nodejs` target to `10`
- Updated documentation
- [and more...](https://github.com/yakovkhalinsky/backblaze-b2/milestone/15?closed=1)

Thanks to the [contributors](https://github.com/yakovkhalinsky/backblaze-b2/graphs/contributors) for this release.

### v1.0.4 (November 30, 2017) - The buffed release

Features
- Hash argument for uploadFile() [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/39)

Thanks to the contributors for this release
- [Jamie Syme](https://github.com/jamiesyme)


### v1.0.3 (November 30, 2017) - The authorization release

Features
- Add get authorization function [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/37)

Thanks to the contributors for this release
- [Jared Reich](https://github.com/jaredreich)


### v1.0.2 (April 23, 2017) - The fixed buffers release

Fixes
- Replace package node-sha1 with sha1 to fix [#19](https://github.com/yakovkhalinsky/backblaze-b2/issues/19) issue with sha1 hash of buffers [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/28)

Thanks to the contributors for this release
- [Aaron](https://github.com/ablankenship10)


### v1.0.1 (April 22, 2017) - The small buffers release

Features
- Update Axios to support buffers < 8192 bytes [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/27)

Thanks to the contributors for this release
- [David Fox](https://github.com/obto)


### v1.0.0 (March 15, 2017) - The large files release

Features
- Added large file API support [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/22)

Thanks to the contributors for this HUGE release
- [Ivan Kalinin](https://github.com/IvanKalinin)
- [crazyscience](https://github.com/crazyscience)


### v0.9.12 (March 4, 2017) - The options release

Fixes
- Added prefix and delimiter support to file list API call [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/20)
- Promise Progress Notifications
[link](https://github.com/yakovkhalinsky/backblaze-b2/pull/21)

Thanks to the contributors for this release
- [crazyscience](https://github.com/crazyscience)


### v0.9.11 (March 16, 2016) - The file encoding release

Fixes
- Fix setting encoding for downloadFileById [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/16) [issue](https://github.com/yakovkhalinsky/backblaze-b2/issues/15)

Thanks to the issue reporter for this release
- [GoNode5](https://github.com/GoNode5)


### v0.9.10 (February 21, 2016) - The Mime release

Features
- Allow specifying mime type on upload [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/14)

Thanks to the contributors for this release
- [Martin Kolárik](https://github.com/MartinKolarik)


### v0.9.9 (January 5, 2016) - The Buffer release

Features
- Fix downloading of binary files [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/11)

Thanks to the contributors for this release
- [legacy3](https://github.com/legacy3)


### v0.9.8 (January 5, 2016) - The good response release

Features
- Updated all file functions to properly encode a fileName with a path [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/10)

Thanks for reporting issues for this release
- [mmccallum](https://github.com/mmccallum)


### v0.9.7 (January 5, 2016) - The good response release

Features
- Updated all instance functions to return API response in success callback [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/8)


### v0.9.6 (December 18, 2015) - The information release

Features
- Add support for adding X-Bz-Info-* headers when uploading a file [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/6)


### v0.9.5 (December 18, 2015) - The string encoding release

Features
- Ensure file names are properly encoded [link](https://github.com/yakovkhalinsky/backblaze-b2/pull/4)

Thanks for question and contributions
- [Tennyson Holloway](https://github.com/tennysonholloway) for PR 4


### v0.9.4 (December 3, 2015) - The all the things API release

Features
- Download file by fileId
- Delete file version


### v0.9.3 (December 3, 2015) - The get on the file escalator release

Features
- Upload a file
- List file names
- List file versions
- Hide file
- Get file info
- Download file by name
- Now with ESLinting


### v0.9.2 (November 23, 2015) - The bucket list release

Features
- List buckets
- Update bucket
- Get upload url for bucket


### v0.9.1 (November 21, 2015) - The moar tests release

Features
- Added tests for all existing code

Fixes
- Implementation internally of request module

### v0.9.0 (November 20, 2015) - The bucket release

Features
- Authorization
- Bucket Creation
- Bucket Deletion
- Initial mocha test setup
