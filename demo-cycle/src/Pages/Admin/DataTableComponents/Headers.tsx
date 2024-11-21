// Centralized header style for consistent formatting
const HEADER_STYLE = "px-6 py-4 text-left text-white/90";

// Generic header creation function
const createHeaders = (headerTitles: string[]) => {
  return headerTitles.map((title, index) => (
    <th key={index} className={HEADER_STYLE}>
      {title}
    </th>
  ));
};

export const CustomerHeaders = () => (
  <>
    {createHeaders([
      "Image",
      "Name",
      "Lead Type",
      "Description",
      "Address",
      "Transport",
      "Actions",
    ])}
  </>
);

export const ProductHeaders = () => (
  <>
    {createHeaders([
      "Images",
      "Brand",
      "Tubeless/Branded",
      "Category",
      "Variants",
      "Actions",
    ])}
  </>
);

export const OrdersHeaders = () => (
  <>
    {createHeaders([
      "Customer",
      "Products",
      "Total",
      "Discount",
      "Remarks",
      "Status",
      "Actions",
    ])}
  </>
);

export const CouponHeaders = () => (
  <>
    {createHeaders([
      "Code",
      "Discount",
      "Is Active",
      "Coupon Type",
      "Expiration Date",
      "Actions",
    ])}
  </>
);
export const CategoryHeaders = () => (
  <>{createHeaders(["name", "Actions"])}</>
);
