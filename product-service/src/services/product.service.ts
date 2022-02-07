import {Client} from 'pg';


export class ProductService {

    DBclient: Client;

    constructor(DBclient) {
        this.DBclient = DBclient;
    }

    async getProducts() {
        try {
            const {rows: products} = await this.DBclient.query(
                `SELECT p.id, title, description, price, img, count FROM products p JOIN stocks s ON p.id = s.product_id;`);
            return products;
        } catch (error) {
            console.log('ERROR: ', error);
        }
    }

    async addProduct(product) {
        await this.DBclient.query('begin');
        try {
            const {rows: dataFromProductTable} = await this.DBclient.query(
                'INSERT INTO products(title, description, img, price) values ($1, $2, $3, $4) RETURNING *',
                [product.title, product.description, product.img, product.price]
            );
            console.log('Data from product table: ', dataFromProductTable);

            const {rows: dataFromStockTable} = await this.DBclient.query(
                'INSERT INTO stocks(product_id, count) values ($1, $2) RETURNING *',
                [dataFromProductTable[0].id, product.count]
            );

            console.log('Data from stock table: ', dataFromStockTable);

            await this.DBclient.query('commit');
            return {...dataFromProductTable[0], count: dataFromStockTable[0].count};

        } catch (error) {
            await this.DBclient.query('rollback');
            console.log('ERROR: ', error);
        }
    }

    async getProductById(id) {
        try {
            const {rows: product} = await this.DBclient.query(
                `SELECT p.id, title, description, price, img, s.count FROM products p, stocks s WHERE p.id = s.product_id and p.id = $1;`
                , [id]);

            return product[0];
        } catch (error) {
            console.log('ERROR: ', error);
        }
    }
}