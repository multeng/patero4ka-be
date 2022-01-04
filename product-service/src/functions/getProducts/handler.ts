import {middyfy} from '@libs/lambda';
import {successResponse, errorResponse} from "@libs/apiGateway";
import {Client} from 'pg';
import {DBOptions} from "@functions/DBOptions";


const getProducts = async (event, context): Promise<any> => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const client = new Client(DBOptions);
    await client.connect();

    try {
        const { rows: products } = await client.query(
            `SELECT p.id, title, description, price, img, count FROM products p JOIN stocks s ON p.id = s.product_id;`);
        return successResponse(products);
    } catch (e) {
        return errorResponse(e.message);
    } finally {
        client.end();
    }
}

export const main = middyfy(getProducts);
