import { IProduct } from "./Product";

export interface IOrderCustomer {
  _id: string;
  customerName: string;
}

export interface Pricing {
  subtotal: number;
  tyreCharge: number;
  discount: number;
  gst: number;
  total: number;
  discountApplied: boolean;
  discountCode: string | null;
  discountAmount: number;
  _id: string;
}

export interface IOrder {
  _id: string;
  customer: IOrderCustomer;
  products: IProduct[];
  pricing: Pricing;
  __v: number;
}
