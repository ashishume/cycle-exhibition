import React, { useState } from "react";
import {
  User,
  Bike,
  Tag,
  ShoppingCart,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import CustomerForm from "./CustomerForm";

const existingCustomers = [
  { id: 1, name: "John Doe", leadType: "Hot Lead", image: null },
  { id: 2, name: "Jane Smith", leadType: "Warm Lead", image: null },
];

const cartItems = [
  {
    _id: "6736e0b7c0d26faac75e02bd",
    brand: "BSA cycles",
    variant: 12,
    bundleQuantity: 1,
    totalCycles: 10,
    isTyreChargeable: true,
    tyreTypeLabel: "branded",
    costPerCycle: 2000,
    bundleSize: 5,
    total: 20300,
  },
  {
    _id: "6736e0b7c0d26faac75e02bd",
    brand: "BSA cycles",
    variant: 16,
    bundleQuantity: 1,
    totalCycles: 5,
    isTyreChargeable: true,
    tyreTypeLabel: "branded",
    costPerCycle: 100,
    bundleSize: 5,
    total: 800,
  },
  {
    _id: "6736e0b7c0d26faac75e02bd",
    brand: "BSA cycles",
    variant: 16,
    bundleQuantity: 1,
    totalCycles: 5,
    isTyreChargeable: true,
    tyreTypeLabel: "branded",
    costPerCycle: 100,
    bundleSize: 5,
    total: 800,
  },
];

const CartPage = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [customerFormData, setCustomerFormData] = useState({
    customerName: "",
    leadType: "",
    customerImage: null,
  });
  const [errors, setErrors] = useState<any>({});

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

  const handleCouponApply = () => {
    if (couponCode.toUpperCase() === "SAVE20") {
      setDiscount(20);
    } else if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(10);
    } else {
      setErrors((prev: any) => ({ ...prev, coupon: "Invalid coupon code" }));
      setDiscount(0);
      setTimeout(() => {
        setErrors((prev: any) => ({ ...prev, coupon: null }));
      }, 3000);
    }
  };

  const handleCheckout = () => {
    const { subtotal, tyreCharge, discountAmount, gst, total } =
      calculateTotals();
    const checkoutData = {
      customer: isNewCustomer ? customerFormData : { id: selectedCustomerId },
      cycles: cartItems,
      pricing: {
        subtotal,
        tyreCharge,
        discount: discountAmount,
        gst,
        total,
      },
    };
    console.log("Proceeding to checkout:", checkoutData);
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
                  {existingCustomers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                      className="bg-gray-800"
                    >
                      {customer.name} ({customer.leadType})
                    </option>
                  ))}
                </select>
              )}

              {isNewCustomer && <CustomerForm />}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Selected Cycles
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {item.brand} ({item.variant} inch)
                      </div>
                      <div className="text-white/70 text-sm">
                        ₹{item.costPerCycle}/cycle, {item.totalCycles} cycles
                      </div>
                    </div>
                    <div className="text-white/90">
                      Quantity: {item.bundleSize}
                    </div>
                    <div className="text-white font-medium">₹{item.total}</div>
                  </div>
                ))}
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
                className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
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
