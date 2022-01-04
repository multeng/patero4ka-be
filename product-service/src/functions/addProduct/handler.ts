import {middyfy} from '@libs/lambda';
import {successResponse, errorResponse, badRequestResponse} from "@libs/apiGateway";
import {Client} from 'pg';
import {DBOptions} from "@functions/DBOptions";

const addProduct = async (event, context) => {
    console.log("Event: ", event);
    console.log("Context: ", context);

    const product = event.body;
    const client = new Client(DBOptions);

    if (!product || !product.title || !product.price || !product.count) {
        return badRequestResponse();
    }
    await client.connect();
    await client.query('begin');

    try {
        const { rows: dataFromProductTable } = await client.query(
            'INSERT INTO products(title, description, img, price) values ($1, $2, $3, $4) RETURNING *',
            [product.title, product.description, product.img, product.price]
        );
        console.log('Data from product table: ', dataFromProductTable);

        const { rows: dataFromStockTable } = await client.query(
            'INSERT INTO stocks(product_id, count) values ($1, $2) RETURNING *',
            [dataFromProductTable[0].id, product.count]
        );

        console.log('Data from stock table: ',dataFromStockTable);

        await client.query('commit');
        return successResponse({...dataFromProductTable[0], count: dataFromStockTable[0].count});

    } catch (e) {
        await client.query('rollback');
        return errorResponse(e.message );
    } finally {
        client.end();
    }
}


export const main = middyfy(addProduct);