import {successResponse, errorResponse} from "@libs/apiGateway";
import {parse} from "@libs/s3Helper";
import {middyfy} from '@libs/lambda';

const importFileParser = async (event) => {
    console.log('EVENT: ', event);
    try {
        const results = [];
        for (const record of event.Records) {
            results.push(await parse(record.s3.object.key));
        }
        return successResponse('file parsed');
    } catch (e) {
        return errorResponse(e.message)
    }
}

export const main = middyfy(importFileParser);