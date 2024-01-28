import { Brand } from "./brand.model";
import { Category } from "./category.model";

export interface Product {
    id: number,
    productName: string,
    description: string,
    price: number,
    quantity: number,
    categoryId: number,
    category: Category,
    brandId: number,
    brand: Brand,
    imagePath: string,
    cartCount: number
}