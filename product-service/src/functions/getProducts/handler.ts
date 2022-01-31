import {middyfy} from '@libs/lambda';
import {successResponse, errorResponse} from "@libs/apiGateway";
import {DBConnect} from "@functions/DBConnect"
import {ProductService} from "../../services/product.service";


const getProducts = async (event, context): Promise<any> => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const client = await DBConnect();
    const productService = new ProductService(client);

    try {
        const products = await productService.getProducts();
        return successResponse(products);
    } catch (e) {
        return errorResponse(e.message);
    } finally {
        client.end();
    }
}

export const main = middyfy(getProducts);
