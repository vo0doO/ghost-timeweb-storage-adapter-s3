require('dotenv').config();
const rx = require("rxjs");
const S3 = require("aws-sdk/clients/s3");
const StorageBase = require("ghost-storage-base");
const env = require('process').env;


/**
 * Author: @vo0doO <@kirsanov.bvt@gmail.com> 
 * @param {object} config
 *      - @param {string} accessKeyId 
 *      - @param {string} secretAccessKey 
 *      - @param {string} endpoint 
 *      - @param {string} s3ForcePathStyle 
 *      - @param {string} region 
 *      - @param {string} apiVersion 
 *      - @param {string} objectKey 
 * @param {module} S3
 */

class GhostTimeWebStorageAdapterS3 extends StorageBase {

    constructor( config = {} ) {
        super(config);
    
        const {
            objectKey,
            copyObjectKey,
            accessKeyId,
            secretAccessKey,
            endpoint,
            s3ForcePathStyle,
            region,
            apiVersion,
            S3
        } = config

        this.objectKey = objectKey
        this.copyObjectKey = copyObjectKey
        this.bucketParams = { Bucket: bucket }
        this.uploadParams = { Bucket: this.bucketParams.Bucket, Key: "", Body: "" }
        this.createParams = { Bucket: this.bucketParams.Bucket, Key: this.objectKey, Body: 'test_body123' }
        this.metaParams = { Bucket: this.bucketParams.Bucket, Key: this.objectKey }
        this.copyParams = { Bucket: this.bucketParams.Bucket, CopySource: `${this.bucketParams.Bucket}/${this.objectKey}`, Key: this.copyObjectKey }
        this.accessKeyId = accessKeyId,
        this.secretAccessKey = secretAccessKey,
        this.endpoint = endpoint,
        this.s3ForcePathStyle = s3ForcePathStyle,
        this.region = region,
        this.apiVersion = apiVersion
    }


    /**
     * @param {*} fileName Название искомого файла
     * @param {*} targetDir Название искомой папки
     * @returns {bool} true или false 
     */
    async exists(fileName, targetDir) {
        try {
            if (fileName == "undefined") {
                throw new Error("Нет названия искомого файла");
            }

            else {
                this.getSanitizedFileName(fileName)
            }

            var resp = await this.s3.listObjects(this.bucketParams).promise();
            resp = resp.$response
            var data = await resp.data;
            var contents = await data.Contents
            var files = new Map();

            contents.forEach((file, idx) => { // обходим в цикле полученный список
                files.set(file.Key.split("/"), idx); // составляем карту файлов и папок  
                }
            );

            

        } catch (e) {
            throw new Error(error);
        }
    }

    async save() {
        return new Promise(
            (resolve) => {
                return;
            },
            (reject) => {
                return;
            }
        );
    }

    async serve() {
        return;
    }

    async delete() {
        return;
    }

    async read() {
        return;
    }
}

async function main() {
    

        const s = new TimeWebStorageAdapter(
            env.accessKeyId,
            env.secretAccessKey,
            env.endpoint,
            env.s3ForcePathStyle,
            env.region,
            env.apiVersion,
            env.objectKey,
            env.copyObjectKey,
            env.bucket,
            env.uploadParams,
            env.metaParams
        )
    
        var ex = s.exists("config.js");
    
        console.log(ex);
    }

main()