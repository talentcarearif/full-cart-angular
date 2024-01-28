import { Product } from "./product.model";
import { UserMaster } from "./userMaster.model";

export interface ShoppingCart {
    id : number,
    productId : number,
    count: number,
    userMasterId: number,
    price: number,
    product: Product,
    userMaster: UserMaster
};