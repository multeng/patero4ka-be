import {middyfy} from '@libs/lambda';
import {successResponse, notFoundResponse, errorResponse} from "@libs/apiGateway";
import {ProductService} from "../../services/product.service";
import {DBConnect} from "@functions/DBConnect";

const getProductById = async (event, context) => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const {id} = event.pathParameters;
    const client = await DBConnect();
    const productService = new ProductService(client);

    try {
        const product = await productService.getProductById(id);
        if (!product) {
            return notFoundResponse('product not found');
        }
        return successResponse(product);
    } catch (e) {
        return errorResponse(e.message);
    }
}

export const main = middyfy(getProductById);