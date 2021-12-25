import {middyfy} from '@libs/lambda';
import {successResponse, errorResponse} from "@libs/apiGateway";
import fakeData from '../data.json';
import getProductsAsync from "@functions/async";

const getProducts = async (): Promise<any> => {
    try {
        const products = await getProductsAsync(fakeData);
        return successResponse(products);
    } catch (e) {
        return errorResponse(e.message);
    }
}

export const main = middyfy(getProducts);
