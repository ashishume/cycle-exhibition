export const CustomerHeaders = () => {
  return (
    <>
      <th className="px-6 py-4 text-left text-white/90">Image</th>
      <th className="px-6 py-4 text-left text-white/90">Name</th>
      <th className="px-6 py-4 text-left text-white/90">Lead Type</th>
      <th className="px-6 py-4 text-left text-white/90">Description</th>
      <th className="px-6 py-4 text-left text-white/90">Address</th>
      <th className="px-6 py-4 text-left text-white/90">Transport</th>
      <th className="px-6 py-4 text-left text-white/90">Actions</th>
    </>
  );
};

export const ProductHeaders = () => {
  return (
    <>
      <th className="px-6 py-4 text-left text-white/90">Images</th>
      <th className="px-6 py-4 text-left text-white/90">Brand</th>
      <th className="px-6 py-4 text-left text-white/90">tubeless/branded</th>
      <th className="px-6 py-4 text-left text-white/90">Category</th>
      <th className="px-6 py-4 text-left text-white/90">Variants</th>
      <th className="px-6 py-4 text-left text-white/90">Actions</th>
    </>
  );
};
export const OrdersHeaders = () => {
  return (
    <>
      {/* <th className="px-6 py-4 text-left text-white/90">
                    Order ID
                  </th> */}
      <th className="px-6 py-4 text-left text-white/90">Customer</th>
      <th className="px-6 py-4 text-left text-white/90">Products</th>
      <th className="px-6 py-4 text-left text-white/90">Total</th>
      <th className="px-6 py-4 text-left text-white/90">Discount</th>
      <th className="px-6 py-4 text-left text-white/90">Actions</th>
    </>
  );
};
