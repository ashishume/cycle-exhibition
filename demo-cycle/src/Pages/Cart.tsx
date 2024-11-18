import { useEffect, useState } from "react";
import { Tag, ShoppingCart, AlertCircle } from "lucide-react";
import CustomerForm from "./CustomerForm";
import { ICustomer } from "../models/Customer";
import { loadCartFromStorage } from "../utils/Localstorage";
import { ICart } from "../models/Cart";
import apiClient from "../api/axios";
import { CART_STORAGE_KEY } from "../constants/Cart";
import { useNavigate } from "react-router-dom";
import { ICouponResponse } from "../models/Coupon";

const CartPage = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [newCustomerData, setNewCustomerData] = useState<ICustomer | null>(
    null
  );
  const [isCustomerFormValid, setIsCustomerFormValid] = useState(false);
  const [cartItems, setCartItems] = useState<ICart[]>(loadCartFromStorage());
  const [errors, setErrors] = useState<any>({});
  const [, setIsLoading] = useState(false);
  const [, setCheckoutError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await apiClient.get<ICustomer[]>("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.total, 0);
    const tyreCharge = cartItems.reduce(
      (total, item) => (item.isTyreChargeable ? total + 300 : total),
      0
    );
    const discountedSubtotal = subtotal + tyreCharge;
    const discountAmount = (discountedSubtotal * discount) / 100;
    const gst = (discountedSubtotal - discountAmount) * 0.12;
    const total = discountedSubtotal - discountAmount + gst;
    return { subtotal, tyreCharge, discountAmount, gst, total };
  };

  const handleCouponApply = async () => {
    try {
      const response = await apiClient.post<ICouponResponse>(
        "/api/coupons/validate",
        {
          code: couponCode.toUpperCase(),
        }
      );
      if (response.status === 200) {
        setDiscount(response.data.discount);
      }
    } catch (e: any) {
      setErrors((prev: any) => ({ ...prev, coupon: "Invalid coupon code" }));
      setDiscount(0);
      setTimeout(() => {
        setErrors((prev: any) => ({ ...prev, coupon: null }));
      }, 3000);
    }
  };

  const handleCustomerFormDataChange = (data: ICustomer) => {
    setNewCustomerData(data);
  };

  const handleCustomerFormValidationChange = (isValid: boolean) => {
    setIsCustomerFormValid(isValid);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setCheckoutError("");

    const { subtotal, tyreCharge, discountAmount, gst, total } =
      calculateTotals();
    let customerDetails;

    try {
      // Handle customer creation/selection
      if (isNewCustomer) {
        if (!isCustomerFormValid || !newCustomerData) {
          setCheckoutError("Please fill in all required customer information");
          setIsLoading(false);
          return;
        }

        // Create new customer
        const customerResponse = await apiClient.post(
          "/api/customers",
          newCustomerData
        );
        const { customerName, customerImage, leadType, _id } =
          customerResponse?.data;

        customerDetails = {
          id: _id,
          name: customerName,
          leadType: leadType,
          image: customerImage,
        };
      } else {
        if (!selectedCustomerId) {
          setCheckoutError("Please select a customer");
          setIsLoading(false);
          return;
        }
        customerDetails = { id: selectedCustomerId };
      }

      // Prepare order data
      const orderData = {
        customer: customerDetails.id,
        products: cartItems.map((item) => ({
          _id: item._id,
          brand: item.brand,
          variant: item.variant,
          bundleQuantity: item.bundleQuantity,
          totalProducts: item.totalProducts,
          isTyreChargeable: item.isTyreChargeable,
          tyreLabel: item.tyreLabel,
          costPerCycle: item.costPerCycle,
          bundleSize: item.bundleSize,
          total: item.total,
        })),
        pricing: {
          subtotal,
          tyreCharge,
          discount: discountAmount,
          gst,
          total,
          discountApplied: discount > 0,
          discountCode: discount > 0 ? couponCode : null,
          discountPercentage: discount,
        },
      };

      // Create order
      const orderResponse = await apiClient.post("/api/orders", orderData);

      // Clear cart and reset state after successful order
      localStorage.removeItem(CART_STORAGE_KEY);
      setCartItems([]);
      setCouponCode("");
      setDiscount(0);
      setSelectedCustomerId("");
      setNewCustomerData(null);

      // Redirect to success page with order details
      navigate("/order-success", {
        state: {
          orderDetails: {
            orderId: orderResponse.data._id,
            customer: {
              name: isNewCustomer
                ? customerDetails?.name
                : customers.find((c) => c._id === selectedCustomerId)
                    ?.customerName,
              leadType: isNewCustomer
                ? customerDetails?.leadType
                : customers.find((c) => c._id === selectedCustomerId)?.leadType,
            },
            products: cartItems,
            pricing: {
              subtotal,
              tyreCharge,
              discount: discountAmount,
              gst,
              total,
              discountApplied: discount > 0,
              discountPercentage: discount,
            },
          },
        },
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      setCheckoutError(
        error.response?.data?.message ||
          "An error occurred during checkout. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { subtotal, tyreCharge, discountAmount, gst, total } =
    calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Customer Details
              </h2>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setIsNewCustomer(false)}
                  className={`flex-1 py-3 px-4 rounded-xl ${
                    !isNewCustomer
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Existing Customer
                </button>
                <button
                  onClick={() => setIsNewCustomer(true)}
                  className={`flex-1 py-3 px-4 rounded-xl ${
                    isNewCustomer
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  New Customer
                </button>
              </div>

              {!isNewCustomer && (
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer: ICustomer) => (
                    <option
                      key={customer._id}
                      value={customer._id}
                      className="bg-gray-800"
                    >
                      {customer.customerName} ({customer.leadType})
                    </option>
                  ))}
                </select>
              )}

              {isNewCustomer && (
                <CustomerForm
                  isCheckoutPage={true}
                  onFormDataChange={handleCustomerFormDataChange}
                  onValidationChange={handleCustomerFormValidationChange}
                  customerData={null}
                  isEdit={false}
                  onClose={null}
                />
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Selected Products
              </h2>
              <div className="space-y-4">
                {cartItems?.length ? (
                  cartItems.map((item, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {item.brand} ({item.variant} inch)
                        </div>
                        <div className="text-white/70 text-sm">
                          ₹{item.costPerCycle}/cycle, {item.totalProducts} cycles
                        </div>
                      </div>
                      <div className="text-white/90">
                        Quantity: {item.bundleSize}
                      </div>
                      <div className="text-white font-medium">
                        ₹{item.total}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-white">No products added</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                  <button
                    onClick={handleCouponApply}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white"
                  >
                    Apply
                  </button>
                </div>
                {errors.coupon && (
                  <div className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.coupon}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Tag className="w-4 h-4" />
                    <span>{discount}% discount applied!</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-white/90">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Tyre Charge</span>
                  <span>₹{tyreCharge.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/90">
                  <span>GST (12%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={
                  isNewCustomer ? !isCustomerFormValid : !selectedCustomerId
                }
                className={`w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 
        ${
          (isNewCustomer ? !isCustomerFormValid : !selectedCustomerId)
            ? "opacity-50 cursor-not-allowed"
            : "hover:from-purple-600 hover:to-indigo-600 transform hover:scale-[1.02]"
        }
        rounded-xl text-white font-medium shadow-lg transition-all duration-300`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
