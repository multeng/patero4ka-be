import {middyfy} from '@libs/lambda';
import {successResponse, notFoundResponse, errorResponse} from "@libs/apiGateway";
import {Client} from 'pg';
import {DBOptions} from "@functions/DBOptions";

const getProductById = async (event, context) => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const { id } = event.pathParameters;
    const client = new Client(DBOptions);
    await client.connect();

    try {
        const { rows: product } = await client.query(
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