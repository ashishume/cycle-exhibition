export interface ICouponResponse {
  message: string;
  discount: number;
  details: ICoupon;
}

export interface ICoupon {
  _id?: string;
  code: string;
  discount: number;
  isActive: boolean;
  expirationDate: string;
  couponType: "perCycle" | "totalAmount";
}


export interface ICouponFormErrors {
  code?: string;
  discount?: string;
  expirationDate?: string;
  couponType?: string;
}

export interface ITouchedFields {
  code: boolean;
  discount: boolean;
  expirationDate: boolean;
  couponType: boolean;
}