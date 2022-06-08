// @ts-ignore

const { arch } = require('os');
var {Store} = require("./timeweb-vo0doo");

const config = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || 'cf33522',
    secretAccessKey: process.env.S3_ACCESS_SECRET_KEY || 'sycd-6svgvvqewudsnlsuxysaywyyaf1',
    endpoint: process.env.S3_ASSET_HOST_URL || 'https://s3.timeweb.com/',
    s3ForcePathStyle: true,
    region: 'ru-1',
    apiVersion: 'latest',
    s3BackedName: 'cf33522-805b4cab-f7bc-4a33-87fe-7d81eca50810'

}

var s = new Store(config);

s.exist("hello.txt")