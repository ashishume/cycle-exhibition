import { ICategory } from "./Category";

export interface IVariant {
  costPerProduct: number;
  size: number;
  bundleSize: number;
  _id: string;
}

export interface IProduct {
  _id: string;
  brand: string;
  imageLinks: string[];
  description: string;
  subtitle: string;
  category: ICategory;
  variants: IVariant[];
  // bundleSize: number;
  // tyreLabel: string;
  tyreType: string;
  tyreBrand: string;
  isTyreChargeable: boolean;
  __v: number;
}
