// DataTable.tsx
import React, { Fragment } from "react";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { IVariant } from "../../models/Product";

// interface DataTableProps {
//   data: any[] | IProduct[];
//   activeTab: string;
//   handleDelete: (id: string, type: "customer" | "product" | "order") => void;
//   handleEdit: (id: string) => void;
//   toggleExpandedImages: (id: string) => void;
// }

const DataTable: React.FC<any> = ({
  data,
  activeTab,
  handleDelete,
  handleEdit,
  toggleExpandedImages,
  getPaginatedData,
  customers,
  products,
  expandedImageRow,
}) => {
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {activeTab === "customers" ? (
                <>
                  <th className="px-6 py-4 text-left text-white/90">Image</th>
                  <th className="px-6 py-4 text-left text-white/90">Name</th>
                  <th className="px-6 py-4 text-left text-white/90">Product</th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Bundle Size
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Lead Type
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Total Cost
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">Actions</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-4 text-left text-white/90">Images</th>
                  <th className="px-6 py-4 text-left text-white/90">Brand</th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Subtitle
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">
                    Variants
                  </th>
                  <th className="px-6 py-4 text-left text-white/90">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="text-white/90">
            {getPaginatedData(
              activeTab === "customers" ? customers : products
            )?.data?.map((item: any) => (
              <Fragment key={item.id || item._id}>
                <tr className="border-b border-white/10">
                  {activeTab === "customers" ? (
                    <>
                      <td className="px-6 py-4">
                        <img
                          src={item.customerImage || "/default-avatar.png"}
                          alt={item.customerName}
                          className="w-12 h-12 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4">{item.customerName}</td>
                      <td className="px-6 py-4">{item.selectedProduct}</td>
                      <td className="px-6 py-4">{item.bundleSize}</td>
                      <td className="px-6 py-4">{item.leadType}</td>
                      <td className="px-6 py-4">${item.totalCost}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-yellow-400 hover:text-yellow-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, "customer")}
                          className="ml-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </>
                  ) : (
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
                      <td className="px-6 py-4">{item.subtitle}</td>
                      <td className="px-6 py-4">{item.category.name}</td>
                      <td className="px-6 py-4">
                        <div className="max-h-24 overflow-y-auto">
                          {item.variants.map((variant: IVariant) => (
                            <div key={variant._id} className="mb-1">
                              Size: {variant.size}", Cost: $
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
                  )}
                </tr>
                {activeTab === "products" && expandedImageRow === item._id && (
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
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DataTable;
