import {S3, config} from 'aws-sdk';
import csvParser from 'csv-parser';

config.update({region: 'eu-west-1', signatureVersion: 'v4'});
const s3 = new S3();

export const getSignedUrl = async (filename: string) => {
    try {
        return await s3.getSignedUrlPromise('putObject', {
            Bucket: process.env.UPLOAD_BUCKET,
            Key: `uploaded/${filename}`,
            ContentType: 'text/csv',
            Expires: 60
        });
    } catch (e) {
        console.log(e);
    }
}

const copyObject = async (key: string) => {
    console.log('COPYOBJ: ', key);
    try {
        return await s3.copyObject({
            Bucket: process.env.UPLOAD_BUCKET,
            CopySource: `${process.env.UPLOAD_BUCKET}/${key}`,
            Key: key.replace('uploaded', 'parsed')
        }).promise();
    } catch (e) {
        console.log(e)
    }
}

const deleteObject = async (key: string) => {
    console.log('DELETEOBJ: ', key);
    try {
        return await s3.deleteObject({
            Bucket: process.env.UPLOAD_BUCKET,
            Key: key
        }).promise();
    } catch (e) {
        console.log(e)
    }
}

export const parse = async (key: string) => {
    try {
        s3.getObject({Bucket: process.env.UPLOAD_BUCKET, Key: key})
            .createReadStream()
            .pipe(csvParser())
            .on('data', (row) => console.log('Row: ', row))
            .on('end', async () => console.log('Parse end'))
            .on('error', (error) => console.log('ERROR: ', error))

        await copyObject(key);
        await deleteObject(key);
    } catch (e) {
        console.log(e);
    }
}