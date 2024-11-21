import React, { Fragment, useState } from "react";
import { ChevronDown, ChevronUp, Download, Edit, Trash2 } from "lucide-react";
import { IVariant } from "../../models/Product";
import { TAB_TYPE } from "../../constants/admin";
import {
  CategoryHeaders,
  CouponHeaders,
  CustomerHeaders,
  OrdersHeaders,
  ProductHeaders,
} from "./DataTableComponents/Headers";
import CustomerImageModal from "./DataTableComponents/ImageModal";

const DataTable: React.FC<any> = ({
  activeTab,
  handleDelete,
  downloadPdf,
  handleEdit,
  toggleExpandedImages,
  getPaginatedData,
  customers,
  products,
  categories,
  expandedImageRow,
  orders,
  coupons,
  handleStatusChange,
}) => {
  const [selectedCustomerImage, setSelectedCustomerImage] = useState<
    string | null
  >(null);

  const handleCustomerImageClick = (imageUrl: string) => {
    setSelectedCustomerImage(imageUrl);
  };

  function formatToIndianCurrency(amount: number) {
    let amountStr = amount.toString();
    let [integer, decimal] = amountStr.split(".");
    let formattedInteger = integer.replace(
      /\B(?=(\d{3})+(?!\d))/g, // Regular expression for Indian numbering system
      ","
    );
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
  }

  const orderStatusColors: any = {
    processing: "text-yellow-400",
    dispatched: "text-blue-400",
    completed: "text-green-400",
    canceled: "text-red-400",
  };
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {activeTab === TAB_TYPE.CUSTOMER ? (
                <CustomerHeaders />
              ) : activeTab === TAB_TYPE.PRODUCT ? (
                <ProductHeaders />
              ) : activeTab === TAB_TYPE.ORDER ? (
                <OrdersHeaders />
              ) : activeTab === TAB_TYPE.COUPON ? (
                <CouponHeaders />
              ) : activeTab === TAB_TYPE.CATEGORY ? (
                <CategoryHeaders />
              ) : null}
            </tr>
          </thead>
          <tbody className="text-white/90">
            {getPaginatedData(
              activeTab === TAB_TYPE.CUSTOMER
                ? customers
                : activeTab === TAB_TYPE.PRODUCT
                ? products
                : activeTab === TAB_TYPE.ORDER
                ? orders
                : activeTab === TAB_TYPE.COUPON
                ? coupons
                : activeTab === TAB_TYPE.CATEGORY
                ? categories
                : null
            )?.data?.map((item: any) => (
              <Fragment key={item._id}>
                <tr className="border-b border-white/10">
                  {activeTab === TAB_TYPE.CUSTOMER ? (
                    <>
                      <td className="px-6 py-4">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${
                            item.customerImage
                          }`}
                          onClick={() =>
                            handleCustomerImageClick(
                              `${import.meta.env.VITE_API_URL}/${
                                item.customerImage
                              }`
                            )
                          }
                          alt={item.customerName}
                          className="w-12 h-12 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4">{item.customerName}</td>
                      <td className="px-6 py-4">{item.leadType}</td>
                      <td className="px-6 py-4">{item.description}</td>
                      <td className="px-6 py-4">{item.address}</td>
                      <td className="px-6 py-4">{item.transport}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleEdit(item._id, TAB_TYPE.CUSTOMER)
                          }
                          className="text-yellow-400 hover:text-yellow-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item._id, TAB_TYPE.CUSTOMER)
                          }
                          className="ml-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  ) : activeTab === TAB_TYPE.PRODUCT ? (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.imageLinks[0] || "/default-product.png"}
                            alt={item.brand}
                            className="w-12 h-12 rounded"
                          />
                          {item.imageLinks.length > 1 && (
                            <button
                              onClick={() => toggleExpandedImages(item._id)}
                              className="text-white/70 hover:text-white"
                            >
                              {expandedImageRow === item._id ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{item.brand}</td>
                      <td className="px-6 py-4">{item.tyreLabel}</td>
                      <td className="px-6 py-4">{item.category.name}</td>
                      <td className="px-6 py-4">
                        <div className="max-h-24 overflow-y-auto">
                          {item.variants.map((variant: IVariant) => (
                            <div key={variant._id} className="mb-1">
                              Size: {variant.size}", Cost: ₹
                              {variant.costPerProduct}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(item._id, TAB_TYPE.PRODUCT)}
                          className="text-yellow-400 hover:text-yellow-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, "product")}
                          className="ml-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  ) : activeTab === TAB_TYPE.ORDER ? (
                    <>
                      {/* <td className="px-6 py-4">
                        {item._id.slice(-6).toUpperCase()}
                      </td> */}
                      <td className="px-6 py-4">
                        {item.customer.customerName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-h-24 overflow-y-auto">
                          {item.products.map((product: any, index: number) => (
                            <div key={index} className="mb-1 text-sm">
                              <div>{product.brand}</div>
                              <div className="text-white/70">
                                Qty: {product.bundleQuantity} x Size:{" "}
                                {product.variant}"
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => toggleExpandedImages(item._id)}
                          className="text-white/70 hover:text-white mt-1"
                        >
                          {expandedImageRow === item._id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        ₹{formatToIndianCurrency(item.pricing.total)}
                      </td>
                      <td className="px-6 py-4">
                        {item.pricing.discountApplied ? (
                          <div>
                            <div className="text-green-400">
                              ₹ {item.pricing.discount} OFF
                            </div>
                            <div className="text-sm text-white/70">
                              Code: {item.pricing.discountCode.toUpperCase()}
                            </div>
                            <div className="text-sm text-white/70">
                              - ₹{formatToIndianCurrency(item.pricing.discount)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-white/50">No discount</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{item?.remarks || "N/A"}</td>
                      <td className="px-6 py-4">
                        <select
                          value={item.orderStatus || "processing"}
                          onChange={(e) =>
                            handleStatusChange(item._id, e.target.value as any)
                          }
                          className={`
                          w-full 
                          bg-white/10 
                          rounded 
                          py-1 
                          px-2 
                          ${orderStatusColors[item.status || "processing"]}
                        `}
                        >
                          <option value="processing">Processing</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {/* <button
                          onClick={() => handleEdit(item._id, TAB_TYPE.ORDER)}
                          className="text-yellow-400 hover:text-yellow-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button> */}
                        <button
                          onClick={() => downloadPdf(item, "order")}
                          className="ml-2 text-red-400 hover:text-red-600"
                        >
                          <Download className="w-5 h-5" color="white" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, "order")}
                          className="ml-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" color="orange" />
                        </button>
                      </td>
                    </>
                  ) : null}
                </tr>

                {/* expanded content for products */}
                {activeTab === TAB_TYPE.PRODUCT &&
                  expandedImageRow === item._id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-white/5">
                        <div className="grid grid-cols-4 gap-4">
                          {item.imageLinks.map(
                            (imageUrl: string, index: number) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`${item.brand} - ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                {/* expanded content for orders */}
                {activeTab === TAB_TYPE.ORDER &&
                  expandedImageRow === item._id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-white/5">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">
                                Order Details
                              </h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>
                                    ₹
                                    {formatToIndianCurrency(
                                      item.pricing.subtotal
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>GST:</span>
                                  <span>
                                    ₹{formatToIndianCurrency(item.pricing.gst)}
                                  </span>
                                </div>
                                {item.pricing.tyreCharge > 0 && (
                                  <div className="flex justify-between">
                                    <span>Tyre Charge:</span>
                                    <span>
                                      ₹
                                      {formatToIndianCurrency(
                                        item.pricing.tyreCharge
                                      )}
                                    </span>
                                  </div>
                                )}
                                {item.pricing.discountApplied && (
                                  <div className="flex justify-between text-green-400">
                                    <span>Discount:</span>
                                    <span>
                                      -
                                      {formatToIndianCurrency(
                                        item.pricing.discount
                                      )}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between font-medium pt-2 border-t border-white/10">
                                  <span>Total:</span>
                                  <span>
                                    ₹
                                    {formatToIndianCurrency(item.pricing.total)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Products</h4>
                              <div className="space-y-2">
                                {item.products.map(
                                  (product: any, index: number) => (
                                    <div
                                      key={index}
                                      className="text-sm bg-white/5 p-2 rounded"
                                    >
                                      <div className="font-medium">
                                        {product.brand}
                                      </div>
                                      <div className="text-white/70">
                                        <div>Size: {product.variant}"</div>
                                        <div>
                                          Bundle Quantity:{" "}
                                          {product.bundleQuantity}
                                        </div>
                                        <div>
                                          Bundle Size: {product.bundleSize}
                                        </div>
                                        <div>Type: {product.tyreLabel}</div>
                                        <div>
                                          Total: ₹
                                          {formatToIndianCurrency(
                                            product.total
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                {activeTab === TAB_TYPE.COUPON ? (
                  <tr>
                    <td className="px-6 py-4">{item.code}</td>
                    <td className="px-6 py-4">₹{item.discount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                              px-2 py-1 rounded text-sm 
                              ${
                                item.isActive
                                  ? "bg-green-400/20 text-green-400"
                                  : "bg-red-400/20 text-red-400"
                              }
                            `}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.couponType}</td>
                    <td className="px-6 py-4">
                      {new Date(item.expirationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(item._id, TAB_TYPE.COUPON)}
                        className="text-yellow-400 hover:text-yellow-600"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, TAB_TYPE.COUPON)}
                        className="ml-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ) : null}

                {activeTab === TAB_TYPE.CATEGORY ? (
                  <tr>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(item._id, TAB_TYPE.CATEGORY)}
                        className="text-yellow-400 hover:text-yellow-600"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, TAB_TYPE.CATEGORY)}
                        className="ml-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for Customer Image */}
      {selectedCustomerImage && (
        <CustomerImageModal
          imageUrl={selectedCustomerImage}
          customerName={
            customers?.find(
              (customer: any) =>
                `${import.meta.env.VITE_API_URL}/${customer.customerImage}` ===
                selectedCustomerImage
            )?.customerName || "Customer"
          }
          onClose={() => setSelectedCustomerImage(null)}
        />
      )}
    </>
  );
};

export default DataTable;
