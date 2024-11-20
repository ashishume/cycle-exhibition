export interface ICouponResponse {
  message: string;
  discount: number;
  details: {
    _id: string;
    code: string;
    discount: number;
    isActive: boolean;
    expirationDate: string;
    couponType: "perCycle" | "totalAmount";
  };
}
