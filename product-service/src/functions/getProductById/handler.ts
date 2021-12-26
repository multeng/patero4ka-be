import {middyfy} from '@libs/lambda';
import {successResponse, notFoundResponse, errorResponse} from "@libs/apiGateway";
import {Client} from 'pg';
import {DBOptions} from "@functions/DBOptions";

const getProductById = async (event, context) => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const { id } = event.pathParameters;
    const client = new Client(DBOptions);
    try {
        await client.connect();
        const { rows: product } = await client.query(`
            SELECT products.id, products.title, products.description, products.img,
            products.price, stocks.count
            FROM products JOIN stocks ON products.id=stocks.product_id
            WHERE products.id='${id}' ;
        `);

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