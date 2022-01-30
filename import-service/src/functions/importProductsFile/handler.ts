import {successResponse, errorResponse} from "@libs/apiGateway";
import {getImportSignedUrl} from "@libs/s3Helper";
import {middyfy} from '@libs/lambda';


const importProductsFile = async (event) => {
    console.log('EVENT: ', event);

    const fileName = event.queryStringParameters.name;

    try {
        const url =  await getImportSignedUrl(fileName);
        return successResponse(url);
    } catch (e) {
        return errorResponse(e.message)
    }


}

export const main = middyfy(importProductsFile);
