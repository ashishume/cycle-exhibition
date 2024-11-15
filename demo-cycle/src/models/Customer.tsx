export interface ICustomer {
  id: string;
  customerName: string;
  selectedProduct: string;
  bundleSize: number;
  customerImage: string | null;
  leadType: string;
  totalCost: number;
}
