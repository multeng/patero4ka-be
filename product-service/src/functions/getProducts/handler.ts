import {middyfy} from '@libs/lambda';
import {successResponse, errorResponse} from "@libs/apiGateway";
import {DBConnect} from "@functions/DBConnect"


const getProducts = async (event, context): Promise<any> => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const client = await DBConnect();

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
