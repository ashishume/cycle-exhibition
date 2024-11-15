import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Tabs from "./Tabs";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import apiClient from "../../api/axios";
import { TAB_TYPE } from "../../constants/admin";
import { IProduct } from "../../models/Product";
import { ICustomer } from "../../models/Customer";
import ProductForm from "../CycleForm";
import { IFormData } from "../../models/Form";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(TAB_TYPE.PRODUCT);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [expandedImageRow, setExpandedImageRow] = useState<string | null>(null);
  const itemsPerPage = 5;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const [products, setProducts] = useState<IProduct[]>([]);
  const [editModalProduct, setEditModalProduct] = useState<
    IProduct | IFormData | null
  >(null);

  useEffect(() => {
    switch (activeTab) {
      case TAB_TYPE.PRODUCT: {
        fetchProducts();
        break;
      }
      case TAB_TYPE.CUSTOMER: {
        break; //TODO:
      }
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<IProduct[]>("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

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

  // Toggle expanded images row
  const toggleExpandedImages = (id: string) => {
    setExpandedImageRow(expandedImageRow === id ? null : id);
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find((p) => p._id === id);
    if (productToEdit) {
      setEditModalProduct(productToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditModalProduct(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* tabs  */}
        <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />

        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
        />

        {/* Data Table */}
        <DataTable
          data={[]}
          activeTab={activeTab}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          toggleExpandedImages={toggleExpandedImages}
          getPaginatedData={getPaginatedData}
          customers={customers}
          products={products}
          expandedImageRow={expandedImageRow}
        />

        {editModalProduct && (
          <ProductForm
            mode="edit"
            product={editModalProduct as IFormData}
            onClose={handleCloseModal}
          />
        )}

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
              getPaginatedData(
                activeTab === TAB_TYPE.CUSTOMER ? customers : products
              ).totalPages
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
