import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, Plus } from "lucide-react";
import Tabs from "./Tabs";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import apiClient from "../../api/axios";
import { TAB_TYPE } from "../../constants/admin";
import { IProduct } from "../../models/Product";
import { ICustomer } from "../../models/Customer";
import ProductForm from "../CycleForm";
import { IFormData } from "../../models/Form";
import ModalWrapper from "./DataTableComponents/ModalWrapper";
import CustomerForm from "../CustomerForm";
import { useAuth } from "./AdminAuthContext";
import { downloadPDF } from "../../utils/PdfGenerator";
import { useSnackbar } from "../Components/Snackbar";
import { IOrderAdmin } from "../../models/Order";
import { ICoupon } from "../../models/Coupon";
import CouponForm from "./CouponForm";
import GlassButton from "../Components/GlassButton";
import { ICategory } from "../../models/Category";
import CategoryForm from "./CategoryForm";
import { BACKGROUND_COLOR } from "../../constants/styles";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(TAB_TYPE.PRODUCT);
  const [searchTerm, setSearchTerm] = useState("");
  // const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isAddModal, setAddModal] = useState(false);
  const [expandedImageRow, setExpandedImageRow] = useState<string | null>(null);
  const itemsPerPage = 5;
  const [_, setIsEditModalOpen] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [orders, setOrders] = useState<IOrderAdmin[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [editModalProduct, setEditModalProduct] = useState<
    IProduct | IFormData | ICustomer | ICoupon | ICategory | null
  >(null);
  const { showSnackbar } = useSnackbar();
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
      case TAB_TYPE.COUPON: {
        fetchCoupons();
        break;
      }
      case TAB_TYPE.CATEGORY: {
        fetchCategories();
        break;
      }
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get<IOrderAdmin[]>("/api/orders");
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

  const fetchCoupons = async () => {
    try {
      const response = await apiClient.get<ICoupon[]>("/api/coupons");
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<ICategory[]>("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const apiCallMap = {
          [TAB_TYPE.CATEGORY]: "categories",
          [TAB_TYPE.PRODUCT]: "products",
          [TAB_TYPE.ORDER]: "orders",
          [TAB_TYPE.COUPON]: "coupons",
          [TAB_TYPE.CUSTOMER]: "customers",
        };
        const response = await apiClient.delete(
          `/api/${apiCallMap[type]}/${id}`
        );
        const stateMap: Record<
          typeof type,
          React.Dispatch<React.SetStateAction<any[]>>
        > = {
          customer: setCustomers,
          product: setProducts,
          order: setOrders,
          categories: setCategories,
          coupon: setCoupons,
        };

        if (response.status === 200) {
          stateMap[type]((prev) => prev.filter((item) => item._id !== id));
          showSnackbar("Category removed successfully", "success");
        }
      } catch (error: any) {
        showSnackbar(
          `Error deleting ${type}:${error.response?.data?.message}`,
          "error"
        );
      }
    }
  };

  const toggleExpandedImages = (id: string) => {
    setExpandedImageRow(expandedImageRow === id ? null : id);
  };

  const handleEdit = (
    id: string,
    editTab: "product" | "order" | "customer" | "coupon" | "categories"
  ) => {
    const dataMap: Record<typeof editTab, any[]> = {
      product: products,
      order: orders,
      customer: customers,
      coupon: coupons,
      categories: categories,
    };

    const itemToEdit = dataMap[editTab]?.find((item) => item._id === id);
    if (itemToEdit) {
      setEditModalProduct(itemToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditModalProduct(null);
    setAddModal(false);

    switch (activeTab) {
      case TAB_TYPE.PRODUCT: {
        fetchProducts();
        break;
      }
      case TAB_TYPE.CUSTOMER: {
        fetchCustomers();
        break;
      }
      case TAB_TYPE.COUPON: {
        fetchCoupons();
        break;
      }
      case TAB_TYPE.CATEGORY: {
        fetchCategories();
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
      case TAB_TYPE.COUPON:
        return coupons;
      default:
        return [];
    }
  };

  const handleDownloadPdf = async (
    orderDetails: IOrderAdmin,
    itemType: string
  ) => {
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

  const handleStatusChange = async (id: string, value: string) => {
    try {
      const response = await apiClient.patch<IOrderAdmin>(
        `/api/orders/status/${id}`,
        {
          orderStatus: value,
        }
      );
      if (response.status === 200) {
        const updatedStatus = response.data?.orderStatus;

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, orderStatus: updatedStatus } : order
          )
        );

        showSnackbar("Order status updated", "success");
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || "An error occurred.");
      showSnackbar("An error occurred.", "error");
    }
  };

  const handleTabChanges = (tabName: string) => {
    setActiveTab(tabName);
    setPage(1);
  };
  return (
    <div className={`min-h-screen ${BACKGROUND_COLOR} p-8`}>
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
        <Tabs setActiveTab={handleTabChanges} activeTab={activeTab} />

        {activeTab !== TAB_TYPE.ADD_PRODUCT ? (
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
          />
        ) : null}

        {activeTab === TAB_TYPE.COUPON ? (
          <GlassButton className="my-2" onClick={() => setAddModal(true)}>
            <Plus color="white" />
            <span className="text-sm font-medium uppercase tracking-wider text-white">
              Add new coupon
            </span>
          </GlassButton>
        ) : null}

        {activeTab === TAB_TYPE.CATEGORY ? (
          <GlassButton className="my-2" onClick={() => setAddModal(true)}>
            <Plus color="white" />
            <span className="text-sm font-medium uppercase tracking-wider text-white">
              Add new category
            </span>
          </GlassButton>
        ) : null}

        <DataTable
          activeTab={activeTab}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          toggleExpandedImages={toggleExpandedImages}
          getPaginatedData={getPaginatedData}
          customers={customers}
          products={products}
          categories={categories}
          coupons={coupons}
          orders={orders}
          downloadPdf={handleDownloadPdf}
          handleStatusChange={handleStatusChange}
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

        {editModalProduct && activeTab === TAB_TYPE.COUPON && (
          <ModalWrapper isOpen={!!editModalProduct} onClose={handleCloseModal}>
            <CouponForm
              mode="edit"
              coupon={editModalProduct as ICoupon}
              onClose={handleCloseModal}
            />
          </ModalWrapper>
        )}

        {editModalProduct && activeTab === TAB_TYPE.CATEGORY && (
          <ModalWrapper isOpen={!!editModalProduct} onClose={handleCloseModal}>
            <CategoryForm
              mode="edit"
              category={editModalProduct as ICategory}
              onClose={handleCloseModal}
            />
          </ModalWrapper>
        )}

        {isAddModal && activeTab === TAB_TYPE.COUPON && (
          <ModalWrapper isOpen={isAddModal} onClose={handleCloseModal}>
            <CouponForm mode="add" coupon={null} onClose={handleCloseModal} />
          </ModalWrapper>
        )}

        {isAddModal && activeTab === TAB_TYPE.CATEGORY && (
          <ModalWrapper isOpen={isAddModal} onClose={handleCloseModal}>
            <CategoryForm
              mode="add"
              category={null}
              onClose={handleCloseModal}
            />
          </ModalWrapper>
        )}

        {editModalProduct && activeTab === TAB_TYPE.CUSTOMER && (
          <ModalWrapper isOpen={!!editModalProduct} onClose={handleCloseModal}>
            <CustomerForm
              isAdminPage={true}
              isEdit={true}
              customerData={editModalProduct as any}
              onClose={handleCloseModal}
              onFormDataChange={() => {}}
              onValidationChange={() => {}}
              isCheckoutPage={false}
            />
          </ModalWrapper>
        )}

        {activeTab !== TAB_TYPE.ADD_PRODUCT ? (
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
        ) : null}
      </div>
    </div>
  );
};

export default AdminPanel;
