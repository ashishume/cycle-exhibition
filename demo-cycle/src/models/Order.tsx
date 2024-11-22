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
  products: Array<IOrderAdminProduct>;
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

export interface IOrderAdminProduct {
  _id: {
    _id: string;
  };
  brand: string;
  variant: number;
  bundleQuantity: number;
  tyreType: string;
  brandType: string;
  isTyreChargeable: boolean;
  bundleSize: number;
  additionalCost: number;
  total: number;
  totalProducts: number;
  costPerProduct: number;
}
