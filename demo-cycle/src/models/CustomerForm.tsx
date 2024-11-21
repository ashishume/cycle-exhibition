// Interfaces
export interface ICycle {
  id: number;
  brand: string;
  // bundleSize: number;
  costPerProduct: number;
}

export interface ICustomerFormData {
  customerName: string;
  selectedCycle: string;
  // bundleSize: number;
  customerImage: string | null;
  leadType: string;
}

export interface ICustomerFormErrors {
  customerName?: string;
  selectedCycle?: string;
  leadType?: string;
}

export interface ITouchedFields {
  customerName?: boolean;
  selectedCycle?: boolean;
  leadType?: boolean;
}

export interface IEstimate {
  cyclesInBundle: number;
  costPerProduct: number;
  totalCost: number;
}
