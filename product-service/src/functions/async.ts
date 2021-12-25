import Product from "../types/interfaces";

const getProductsAsync = async (mockData: Product | Product[]): Promise<any> => {
    return mockData;
};

export default getProductsAsync;