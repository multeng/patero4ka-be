import IProduct from "./product.interface";
import fakeProducts from "./data.json"

export class Product {
    id: string;
    title: string;
    price: number;
    description: string;
    count: number

    constructor(product: IProduct) {
        this.id = product.id;
        this.title = product.title;
        this.price = product.price;
        this.description = product.description;
        this.count = product.count;
    }

    static getProducts() {
        return fakeProducts;
    }

    static getProductById(id: string) {
        const products = fakeProducts;
        return products.find((product) => id === product.id);
    }
}