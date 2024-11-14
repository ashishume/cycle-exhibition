// Interfaces
export interface ICycle {
  brand: string;
  imageLinks: string[];
  description?: string;
  subtitle?: string;
  costPerCycle: number;
  bundleSize: number;
}

export interface IFormData {
  brand: string;
  imageLinks: string[];
  description: string;
  subtitle: string;
  costPerCycle: string;
  bundleSize: string;
}

export interface IFormErrors {
  brand?: string;
  imageLinks?: string;
  costPerCycle?: string;
  bundleSize?: string;
}

export interface ITouchedFields {
  brand?: boolean;
  imageLinks?: boolean;
  costPerCycle?: boolean;
  bundleSize?: boolean;
}


