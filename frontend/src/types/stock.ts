import { Product } from "./product";
import { Store } from "./store";

export interface Stock {
    _id: string;
    product: Product;
    store: Store;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}
