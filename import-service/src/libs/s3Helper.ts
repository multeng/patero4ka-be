import {S3, config} from 'aws-sdk';

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