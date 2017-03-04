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
