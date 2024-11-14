export interface IFormData {
  brand: string;
  category: string;
  subtitle: string;
  description: string;
  imageLinks: string[];
  variants: {
    costPerProduct: number;
    size: 12 | 14 | 16 | 20 | 24 | 26;
  }[];
  bundleSize: number;
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
  bundleSize?: boolean;
  category?: boolean;
}
