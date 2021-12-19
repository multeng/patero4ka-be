import {ProductService} from "./product.service";
import {successResponse, errorResponse, notFoundResponse} from "@libs/apiGateway";

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
            if (!product) {
                return notFoundResponse(`Id: cd ${id} Not Found`);
            }
            return successResponse(product);
        } catch (error) {
            return errorResponse(error.message)
        }
    }
}