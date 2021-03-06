import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {SQSClient, SendMessageCommand} from "@aws-sdk/client-sqs";
import {GetObjectCommand, CopyObjectCommand, PutObjectCommand, DeleteObjectCommand, S3Client} from "@aws-sdk/client-s3";
import csvParser from 'csv-parser';

const s3Client = new S3Client({region: 'eu-west-1'});
const sqsClient = new SQSClient({region: 'eu-west-1'});


export const getImportSignedUrl = async (filename: string) => {

    const command = new PutObjectCommand({
        Bucket: process.env.UPLOAD_BUCKET,
        Key: `uploaded/${filename}`,
        ContentType: 'text/csv',
    });

    try {
        return await getSignedUrl(s3Client, command, {expiresIn: 60});
    } catch (e) {
        console.log(e);
    }
}

const sendSqsMessage = async (message) => {
    const command = new SendMessageCommand({QueueUrl: process.env.SQS_URL, MessageBody: JSON.stringify(message)});
    await sqsClient.send(command);
}

export const parse = async (key: string) => {
    const params = {Bucket: process.env.UPLOAD_BUCKET, Key: key};
    const copyParams = {
        Bucket: process.env.UPLOAD_BUCKET,
        CopySource: `${process.env.UPLOAD_BUCKET}/${key}`,
        Key: key.replace('uploaded', 'parsed')
    }

    const getCommand = new GetObjectCommand(params);
    const deleteCommand = new DeleteObjectCommand(params);
    const copyCommand = new CopyObjectCommand(copyParams);

    try {
        (await s3Client.send(getCommand)).Body
            .pipe(csvParser())
            .on('data', (row) => console.log('Row: ', row))
            .on('data', async (message) => await sendSqsMessage(message))
            .on('end', () => {
                console.log('END STREAM')
            })
            .on('error', (error) => console.log('ERROR: ', error))

        await s3Client.send(copyCommand);
        await s3Client.send(deleteCommand);
    } catch (e) {
        console.log(e);
    }
}