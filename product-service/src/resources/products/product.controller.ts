import {ProductService} from "./product.service";
import {successResponse, errorResponse} from "@libs/apiGateway";

export class ProductController {
    async getProducts() {
        try {
            const products = await ProductService.getProducts();
            return successResponse(products);
        } catch (error) {
            return errorResponse(error.message);
        }
    }

    async getProductById(id: string) {
        try {
            const product = await ProductService.getProductById(id);
            return successResponse(product);
        } catch (error) {
            return errorResponse(error.message)
        }
    }
}