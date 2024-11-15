import { useState } from "react";
import {
  User,
  Package,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Interfaces
interface ICustomer {
  id: string;
  customerName: string;
  selectedProduct: string;
  bundleSize: number;
  customerImage: string | null;
  leadType: string;
  totalCost: number;
}

interface ICategory {
  _id: string;
  name: string;
  slug: string;
}

interface IVariant {
  costPerProduct: number;
  size: number;
  _id: string;
}

interface IProduct {
  _id: string;
  brand: string;
  imageLinks: string[];
  description: string;
  subtitle: string;
  category: ICategory;
  variants: IVariant[];
  bundleSize: number;
  tyreTypeLabel: string;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Sample customer data
  const [customers, setCustomers] = useState<ICustomer[]>([
    {
      id: "1",
      customerName: "John Doe",
      selectedProduct: "Product1",
      bundleSize: 2,
      customerImage: "/api/placeholder/100/100",
      leadType: "Hot Lead",
      totalCost: 1000,
    },
    {
      id: "2",
      customerName: "Jane Smith",
      selectedProduct: "Product2",
      bundleSize: 3,
      customerImage: "/api/placeholder/100/100",
      leadType: "Warm Lead",
      totalCost: 1500,
    },
  ]);

  // Updated product data
  const [products, setProducts] = useState<IProduct[]>([
    {
      _id: "6736e0b7c0d26faac75e02bd",
      brand: "BSA cycles",
      imageLinks: [
        "https://drive.usercontent.google.com/download?id=1u91TWNx3ROh-lfDO11DKOIOSzmWIrJBk&export=view&authuser=0",
      ],
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout...",
      subtitle: "This is a sample subtitle",
      category: {
        _id: "6736e009c0d26faac75e02b8",
        name: "Ranger Cycles",
        slug: "ranger-cycles",
      },
      variants: [
        { costPerProduct: 199.96, size: 12, _id: "6736e0b7c0d26faac75e02be" },
        { costPerProduct: 0, size: 14, _id: "6736e0b7c0d26faac75e02bf" },
        { costPerProduct: 1999.88, size: 16, _id: "6736e0b7c0d26faac75e02c0" },
        { costPerProduct: 0, size: 20, _id: "6736e0b7c0d26faac75e02c1" },
        { costPerProduct: 333, size: 24, _id: "6736e0b7c0d26faac75e02c2" },
        { costPerProduct: 0, size: 26, _id: "6736e0b7c0d26faac75e02c3" },
      ],
      bundleSize: 5,
      tyreTypeLabel: "tubeless",
    },
  ]);

  // Filter and pagination logic
  const filterData = (data: any[], term: string) => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const getPaginatedData = (data: any[]) => {
    const filteredData = filterData(data, searchTerm);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: filteredData.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredData.length / itemsPerPage),
    };
  };

  // Delete handlers
  const handleDelete = (id: string, type: "customer" | "product") => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === "customer") {
        setCustomers((prev) => prev.filter((item) => item.id !== id));
      } else {
        setProducts((prev) => prev.filter((item) => item._id !== id));
      }
    }
  };

  // Edit handlers
  const handleEdit = (id: string) => {
    setEditingId(id);
    console.log(`Editing ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
              ${
                activeTab === "customers"
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
          >
            <User className="w-5 h-5" />
            Customers
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
              ${
                activeTab === "products"
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
          >
            <Package className="w-5 h-5" />
            Products
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 
                     focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                     text-white placeholder-white/50 transition-all duration-300"
          />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                {activeTab === "customers" ? (
                  <>
                    <th className="px-6 py-4 text-left text-white/90">Image</th>
                    <th className="px-6 py-4 text-left text-white/90">Name</th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Bundle Size
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Lead Type
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Total Cost
                    </th>
                    <th className="px-6 py-4 text-left text-white/90">
                      Actions
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-white/90">Image</th>
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
                    <th className="px-6 py-4 text-left text-white/90">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="text-white/90">
              {getPaginatedData(
                activeTab === "customers" ? customers : products
              ).data.map((item: any) => (
                <tr
                  key={item.id || item._id}
                  className="border-b border-white/10"
                >
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
                        <img
                          src={item.imageLinks[0] || "/default-product.png"}
                          alt={item.brand}
                          className="w-12 h-12 rounded"
                        />
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="text-white/70 hover:text-white/90 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white">Page {page}</span>
          <button
            disabled={
              page ===
              getPaginatedData(activeTab === "customers" ? customers : products)
                .totalPages
            }
            onClick={() => setPage(page + 1)}
            className="text-white/70 hover:text-white/90 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
