import {middyfy} from '@libs/lambda';
import {successResponse, notFoundResponse, errorResponse} from "@libs/apiGateway";
import fakeData from '../data.json';
import getProductsAsync from "@functions/async";

const getProductById = async (event) => {
    try {
        const {id} = event.pathParameters;
        const products = await getProductsAsync(fakeData);
        const product = products.find((product) => id === product.id);

        if (!product) {
            return notFoundResponse('product not found');
        }

        return successResponse(product);
    } catch (e) {
        return errorResponse(e.message);
    }
}

export const main = middyfy(getProductById);