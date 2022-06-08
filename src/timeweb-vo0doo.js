// @ts-ignore

const StorageBase = require('ghost-storage-base'); 
const S3 = require('aws-sdk/clients/s3')

const file = 'sample.txt'
const objectKey = 'objectkey'
const copyObjectKey = 'objectkeycopy'
const bucketParams = { Bucket: 'cf33522-805b4cab-f7bc-4a33-87fe-7d81eca50810' } // <--- заменить
const uploadParams = { Bucket: bucketParams.Bucket, Key: '', Body: '' }
const createParams = { Bucket: bucketParams.Bucket, Key: objectKey, Body: 'test_body123' }
const metaParams = { Bucket: bucketParams.Bucket, Key: objectKey }
const copyParams = { Bucket: bucketParams.Bucket, CopySource: `${bucketParams.Bucket}/${objectKey}`, Key: copyObjectKey }

console.log('Создание клиента')
const s3 = new S3({
  accessKeyId: 'cf33522',
  secretAccessKey: 'sycd-6svgvvqewudsnlsuxysaywyyaf1',
  endpoint: 'https://s3.timeweb.com/',
  s3ForcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
})


class Store extends StorageBase {
    constructor(s3) {
        super()
        this.s3 = s3
    }

    async exist(fileName) {
        if (fileName == 'undefined') {
            console.log("Нет названия искомого файла");
            return
        }

        try {

            var req = await this.s3.listObjects(bucketParams).promise();
            var res = await objList.$response
            var data = await resp.data
            var files = new Map();

            data.forEach((file, index) => {
                try {
                    data.Contents.forEach((file, idx)=>{
                        files.set(file.Key.split('/'), idx)
                        })
                    }
                    catch(e) {
                        throw new Error(`Error in ${file}`)
                    }})
                }

        catch (e) {
            throw new Error(error) 
        }
    }
    
    save() {
        return new Promise(
            (resolve)=>{
                return
            },
            (reject)=> {
                return
            },
        )
    }

    serve() {
        return
    }

    delete() {
        return
    }

    read() {
        return
    }
}

var s = new Store(s3);

var ex = s.exist("config.js");

console.log(ex)
