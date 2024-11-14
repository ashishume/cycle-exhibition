// Interfaces
export interface ICycle {
  brand: string;
  imageLinks: string[];
  description?: string;
  subtitle?: string;
  costPerProduct: number;
  bundleSize: number;
}

export interface IFormData {
  brand: string;
  imageLinks: string[];
  description: string;
  subtitle: string;
  costPerProduct: string;
  bundleSize: string;
}

export interface IFormErrors {
  brand?: string;
  imageLinks?: string;
  costPerProduct?: string;
  bundleSize?: string;
}

export interface ITouchedFields {
  brand?: boolean;
  imageLinks?: boolean;
  costPerProduct?: boolean;
  bundleSize?: boolean;
}


