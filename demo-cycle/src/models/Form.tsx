export interface IFormData {
  _id?: string;
  brand: string;
  category: string | { slug: string; name: string };
  subtitle?: string;
  description: string;
  imageLinks: string[];
  variants: {
    costPerProduct: number;
    size: 12 | 14 | 16 | 20 | 24 | 26;
    bundleSize: number;
  }[];
  // bundleSize: number;
  isTyreChargeable: boolean;
  // tyreLabel: "tubeless" | "branded" | "";
  tyreType: string;
  additionalCost: number;
  brandType: string;
}

export interface IFormErrors {
  brand?: string;
  imageLinks?: string;
  bundleSize?: string;
  category?: string;
}

export interface ITouchedFields {
  brand?: boolean;
  imageLinks?: boolean;
  // bundleSize?: boolean;
  category?: boolean;
}
