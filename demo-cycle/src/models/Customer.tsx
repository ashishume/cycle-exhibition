export interface ICustomer {
  _id?: string;
  customerName: string;
  customerImage: string | null;
  leadType: string;
  description: string;
  address: string;
  transport: string;
}


export interface ICustomerFormErrors {
  customerName?: string;
  leadType?: string;
  transport?: string;
  address?: string;
}