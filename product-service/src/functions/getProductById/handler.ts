import {middyfy} from '@libs/lambda';
import {successResponse, notFoundResponse, errorResponse} from "@libs/apiGateway";
import {DBConnect} from "@functions/DBConnect"

const getProductById = async (event, context) => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const {id} = event.pathParameters;
    const client = await DBConnect();

    try {
        const {rows: product} = await client.query(
            `SELECT p.id, title, description, price, img, s.count FROM products p, stocks s WHERE p.id = s.product_id and p.id = $1;`
            , [id]);

        if (!product.length) {
            return notFoundResponse('product not found');
        }

        return successResponse(product[0]);
    } catch (e) {
        return errorResponse(e.message);
    } finally {
        client.end();
    }
}

export const main = middyfy(getProductById);