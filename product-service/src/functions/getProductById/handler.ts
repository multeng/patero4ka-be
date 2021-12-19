import {middyfy} from '@libs/lambda';
import {ProductController} from "../../resources/products/product.controller";

const productController = new ProductController();

const getProductById = async (event) => {
    const {id} = event.pathParameters
    return await productController.getProductById(id);
}

export const main = middyfy(getProductById);