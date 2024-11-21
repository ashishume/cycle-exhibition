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



export interface IOrderAdmin {
  _id: string;
  customer: {
    _id: string;
    customerName: string;
  };
  products: Array<{
    _id: {
      _id: string;
    };
    brand: string;
    variant: number;
    bundleQuantity: number;
    tyreLabel: string;
    isTyreChargeable: boolean;
    // bundleSize: number;
    total: number;
  }>;
  pricing: {
    subtotal: number;
    tyreCharge: number;
    discount: number;
    gst: number;
    total: number;
    discountApplied: boolean;
    discountCode: string;
    discountAmount: number;
    _id: string;
  };
  remarks?: string;
  orderStatus: string;
}