import {middyfy} from '@libs/lambda';
import {ProductController} from "../../resources/products/product.controller";

const productController = new ProductController();

const getProducts = async () => {
    return await productController.getProducts();
}

export const main = middyfy(getProducts);
