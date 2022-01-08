import {successResponse, errorResponse} from "@libs/apiGateway";
import {getSignedUrl} from "@libs/s3Helper";
import {middyfy} from '@libs/lambda';


const importProductsFile = async (event) => {
    console.log('EVENT: ', event);

    const fileName = event.queryStringParameters.name;
    let url;

    try {
        url = await getSignedUrl(fileName);
    } catch (e) {
        return errorResponse(e.message)
    }

    return successResponse(url);
}

export const main = middyfy(importProductsFile);
