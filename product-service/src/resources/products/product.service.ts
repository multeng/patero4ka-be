import {Product} from "./product.model";

export class ProductService {
    static async getProducts() {
        return Product.getProducts();
    }

    static async getProductById(id: string) {
        return Product.getProductById(id)
    }
}