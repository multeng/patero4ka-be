import {middyfy} from '@libs/lambda';
import {successResponse, errorResponse, badRequestResponse} from "@libs/apiGateway";
import {ProductService} from "../../services/product.service";
import {DBConnect} from "@functions/DBConnect";

const addProduct = async (event, context) => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const product = event.body;
    const client = await DBConnect();
    const productService = new ProductService(client);

    if (!product || !product.title || !product.price || !product.count) {
        return badRequestResponse();
    }

    try {
        const addedProduct = await productService.addProduct(product);
        return successResponse(addedProduct);
    } catch (e) {
        return errorResponse(e.message);
    }
}


export const main = middyfy(addProduct);