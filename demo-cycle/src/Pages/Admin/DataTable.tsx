import React, { Fragment } from "react";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { IVariant } from "../../models/Product";
import { TAB_TYPE } from "../../constants/admin";

const DataTable: React.FC<any> = ({
  activeTab,
  handleDelete,
  handleEdit,
  toggleExpandedImages,
  getPaginatedData,
  customers,
  products,
  expandedImageRow,
  orders,
}) => {
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {activeTab === TAB_TYPE.CUSTOMER ? (
                <>
                  <th className="px-6 py-4 text-left text-white/90">Image</th>
                  <th className="px-6 py-4 text-left text-white/90">Name</th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Lead Type
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">Address</th>
                  <th className="px-6 py-4 text-left text-white/90">Actions</th>
                </>
              ) : activeTab === TAB_TYPE.PRODUCT ? (
                <>
                  <th className="px-6 py-4 text-left text-white/90">Images</th>
                  <th className="px-6 py-4 text-left text-white/90">Brand</th>
                  <th className="px-6 py-4 text-left text-white/90">
                    tubeless/branded
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Variants
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">Actions</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody className="text-white/90">
            {getPaginatedData(
              activeTab === TAB_TYPE.CUSTOMER
                ? customers
                : activeTab === TAB_TYPE.PRODUCT
                ? products
                : orders
            )?.data?.map((item: any) => (
              <Fragment key={item.id || item._id}>
                <tr className="border-b border-white/10">
                  {activeTab === TAB_TYPE.CUSTOMER ? (
                    <>
                      <td className="px-6 py-4">
                        <img
                          src={item.customerImage || "/default-avatar.png"}
                          alt={item.customerName}
                          className="w-12 h-12 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4">{item.customerName}</td>
                      <td className="px-6 py-4">{item.leadType}</td>
                      <td className="px-6 py-4">₹{item.description}</td>
                      <td className="px-6 py-4">₹{item.address}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-yellow-400 hover:text-yellow-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(item.id, TAB_TYPE.CUSTOMER)
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
                          onClick={() => handleEdit(item._id)}
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
                      <td className="px-6 py-4">
                        {item._id.slice(-6).toUpperCase()}
                      </td>
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
                      <td className="px-6 py-4">{item.pricing.total}</td>
                      <td className="px-6 py-4">
                        {item.pricing.discountApplied ? (
                          <div>
                            <div className="text-green-400">
                              {item.pricing.discountPercentage}% OFF
                            </div>
                            <div className="text-sm text-white/70">
                              Code: {item.pricing.discountCode}
                            </div>
                            <div className="text-sm text-white/70">
                              -{item.pricing.discount}
                            </div>
                          </div>
                        ) : (
                          <span className="text-white/50">No discount</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="text-yellow-400 hover:text-yellow-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, "order")}
                          className="ml-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  ) : null}
                </tr>
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
                                  <span>{item.pricing.subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>GST:</span>
                                  <span>{item.pricing.gst}</span>
                                </div>
                                {item.pricing.tyreCharge > 0 && (
                                  <div className="flex justify-between">
                                    <span>Tyre Charge:</span>
                                    <span>{item.pricing.tyreCharge}</span>
                                  </div>
                                )}
                                {item.pricing.discountApplied && (
                                  <div className="flex justify-between text-green-400">
                                    <span>Discount:</span>
                                    <span>-{item.pricing.discount}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-medium pt-2 border-t border-white/10">
                                  <span>Total:</span>
                                  <span>{item.pricing.total}</span>
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
                                        <div>Total: {product.total}</div>
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
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DataTable;
