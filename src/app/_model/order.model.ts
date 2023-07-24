import { Product } from "./product.model";

export interface MyOrderDetails {
    orderId: number;
    orderFullName: string;
    orderFullOrder: string;
    orderContactNumber: string;
    orderAlternateContactNumber: string;
    orderStatus: string;
    orderAmount: number;
    orderValue: number;
    product: Product;
    user: any;
}