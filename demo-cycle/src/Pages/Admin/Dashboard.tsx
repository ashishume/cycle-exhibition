import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import Tabs from "./Tabs";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import apiClient from "../../api/axios";
import { TAB_TYPE } from "../../constants/admin";
import { IProduct } from "../../models/Product";
import { ICustomer } from "../../models/Customer";
import ProductForm from "../CycleForm";
import { IFormData } from "../../models/Form";
import ModalWrapper from "./DataTableComponents/ProductFormModal";
import CustomerForm from "../CustomerForm";
import { useAuth } from "./AdminAuthContext";
import { downloadPDF } from "../../utils/PdfGenerator";

export interface IOrder {
  _id: string;
  customer: {
    _id: string;
    customerName: string;
  };
  products: Array<{
    _id: {
      _id: string;
    };
    brand: string;
    variant: number;
    bundleQuantity: number;
    tyreLabel: string;
    isTyreChargeable: boolean;
    bundleSize: number;
    total: number;
  }>;
  pricing: {
    subtotal: number;
    tyreCharge: number;
    discount: number;
    gst: number;
    total: number;
    discountApplied: boolean;
    discountCode: string;
    discountPercentage: number;
    _id: string;
  };
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(TAB_TYPE.PRODUCT);
  const [searchTerm, setSearchTerm] = useState("");
  // const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [expandedImageRow, setExpandedImageRow] = useState<string | null>(null);
  const itemsPerPage = 5;
  const [_, setIsEditModalOpen] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [editModalProduct, setEditModalProduct] = useState<
    IProduct | IFormData | ICustomer | null
  >(null);

  const { logout } = useAuth();

  useEffect(() => {
    switch (activeTab) {
      case TAB_TYPE.PRODUCT: {
        fetchProducts();
        break;
      }
      case TAB_TYPE.CUSTOMER: {
        fetchCustomers();
        break;
      }
      case TAB_TYPE.ORDER: {
        fetchOrders();
        break;
      }
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get<IOrder[]>("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<IProduct[]>("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await apiClient.get<ICustomer[]>("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
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

  const handleDelete = async (
    id: string,
    type: "customer" | "product" | "order"
  ) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await apiClient.delete(`/api/${type}s/${id}`);
        if (type === "customer") {
          setCustomers((prev) => prev.filter((item) => item._id !== id));
        } else if (type === "product") {
          setProducts((prev) => prev.filter((item) => item._id !== id));
        } else {
          setOrders((prev) => prev.filter((item) => item._id !== id));
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const toggleExpandedImages = (id: string) => {
    setExpandedImageRow(expandedImageRow === id ? null : id);
  };

  const handleEdit = (id: string, editTab: string) => {
    switch (editTab) {
      case TAB_TYPE.PRODUCT: {
        const productToEdit = products.find((p) => p._id === id);
        if (productToEdit) {
          setEditModalProduct(productToEdit);
          setIsEditModalOpen(true);
        }
        break;
      }
      case TAB_TYPE.ORDER: {
        break;
      }
      case TAB_TYPE.CUSTOMER: {
        console.log(id, editTab);

        const customerToEdit = customers.find((p) => p._id === id);
        if (customerToEdit) {
          setEditModalProduct(customerToEdit);
          setIsEditModalOpen(true);
        }
        break;
      }
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditModalProduct(null);
    switch (activeTab) {
      case TAB_TYPE.PRODUCT: {
        fetchProducts();
        break;
      }
      case TAB_TYPE.CUSTOMER: {
        fetchCustomers();
        break;
      }
    }
  };

  const getDataForCurrentTab = () => {
    switch (activeTab) {
      case TAB_TYPE.CUSTOMER:
        return customers;
      case TAB_TYPE.PRODUCT:
        return products;
      case TAB_TYPE.ORDER:
        return orders;
      default:
        return [];
    }
  };

  const handleDownloadPdf = async (orderDetails: IOrder, itemType: string) => {
    const newOrderDetails = {
      orderId: orderDetails._id,
      ...orderDetails,
    };

    try {
      await downloadPDF(newOrderDetails);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
        />

        <DataTable
          activeTab={activeTab}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          toggleExpandedImages={toggleExpandedImages}
          getPaginatedData={getPaginatedData}
          customers={customers}
          products={products}
          orders={orders}
          downloadPdf={handleDownloadPdf}
          expandedImageRow={expandedImageRow}
        />

        {editModalProduct && activeTab === TAB_TYPE.PRODUCT && (
          <ModalWrapper isOpen={!!editModalProduct} onClose={handleCloseModal}>
            <ProductForm
              mode="edit"
              product={editModalProduct as IFormData}
              onClose={handleCloseModal}
            />
          </ModalWrapper>
        )}

        {editModalProduct && activeTab === TAB_TYPE.CUSTOMER && (
          <ModalWrapper isOpen={!!editModalProduct} onClose={handleCloseModal}>
            <CustomerForm
              isEdit={true}
              customerData={editModalProduct as any}
              onClose={handleCloseModal}
              onFormDataChange={() => {}}
              onValidationChange={() => {}}
              isCheckoutPage={false}
            />
          </ModalWrapper>
        )}

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
              page === getPaginatedData(getDataForCurrentTab()).totalPages
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
