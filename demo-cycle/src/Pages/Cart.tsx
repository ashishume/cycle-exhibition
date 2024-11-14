import React, { useState, useEffect } from "react";
import {
  User,
  Bike,
  Tag,
  ShoppingCart,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// Sample data - In real app, this would come from your backend
const existingCustomers = [
  { id: 1, name: "John Doe", leadType: "Hot Lead", image: null },
  { id: 2, name: "Jane Smith", leadType: "Warm Lead", image: null },
];

const cycles = [
  { id: 1, brand: "Cycle1", bundleSize: 5, costPerCycle: 100 },
  { id: 2, brand: "Cycle2", bundleSize: 6, costPerCycle: 150 },
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
  const [cartItems, setCartItems] = useState([
    ...cycles.map((cycle) => ({
      cycleId: cycle.id,
      bundleSize: 1,
    })),
  ]);
  const [errors, setErrors] = useState<any>({});

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const cycle: any = cycles.find((c) => c.id === item.cycleId);
      return total + cycle.costPerCycle * cycle.bundleSize * item.bundleSize;
    }, 0);

    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    return { subtotal, discountAmount, total };
  };

  const handleCustomerTypeChange = (isNew: boolean) => {
    setIsNewCustomer(isNew);
    setShowCustomerForm(isNew);
    if (!isNew) {
      setCustomerFormData({
        customerName: "",
        leadType: "",
        customerImage: null,
      });
    }
  };

  const handleCustomerSelect = (e: any) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);
    if (customerId) {
      const customer: any = existingCustomers.find(
        (c) => c.id === parseInt(customerId)
      );
      setCustomerFormData({
        customerName: customer.name,
        leadType: customer.leadType,
        customerImage: customer.image,
      });
    }
  };

  const handleCouponApply = () => {
    // Simple coupon logic - in real app, this would validate against backend
    if (couponCode.toUpperCase() === "SAVE20") {
      setDiscount(20);
    } else if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(10);
    } else {
      setErrors((prev: any) => ({
        ...prev,
        coupon: "Invalid coupon code",
      }));
      setDiscount(0);
      setTimeout(() => {
        setErrors((prev: any) => ({ ...prev, coupon: null }));
      }, 3000);
    }
  };

  const handleCheckout = () => {
    // Validate and process checkout
    const { subtotal, discountAmount, total } = calculateTotals();
    const checkoutData = {
      customer: isNewCustomer ? customerFormData : { id: selectedCustomerId },
      cycles: cartItems,
      pricing: {
        subtotal,
        discount: discountAmount,
        total,
      },
    };
    console.log("Proceeding to checkout:", checkoutData);
    // Handle checkout logic here
  };

  const { subtotal, discountAmount, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Customer Details
              </h2>

              {/* Customer Type Selection */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => handleCustomerTypeChange(false)}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                    !isNewCustomer
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Existing Customer
                </button>
                <button
                  onClick={() => handleCustomerTypeChange(true)}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                    isNewCustomer
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  New Customer
                </button>
              </div>

              {/* Existing Customer Selector */}
              {!isNewCustomer && (
                <select
                  value={selectedCustomerId}
                  onChange={handleCustomerSelect}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                           focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                           text-white transition-all duration-300"
                >
                  <option value="" className="bg-gray-800">
                    Select a customer
                  </option>
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

              {/* New Customer Form */}
              {isNewCustomer && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerFormData.customerName}
                    onChange={(e) =>
                      setCustomerFormData((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                             focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                             text-white placeholder-white/50"
                  />
                  <select
                    value={customerFormData.leadType}
                    onChange={(e) =>
                      setCustomerFormData((prev) => ({
                        ...prev,
                        leadType: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                             focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                             text-white"
                  >
                    <option value="" className="bg-gray-800">
                      Select Lead Type
                    </option>
                    <option value="Hot Lead" className="bg-gray-800">
                      Hot Lead
                    </option>
                    <option value="Warm Lead" className="bg-gray-800">
                      Warm Lead
                    </option>
                    <option value="Cold Lead" className="bg-gray-800">
                      Cold Lead
                    </option>
                  </select>
                </div>
              )}
            </div>

            {/* Cycle Selection */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Selected Cycles
              </h2>

              <div className="space-y-4">
                {cycles.map((cycle, index) => (
                  <div
                    key={cycle.id}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {cycle.brand}
                      </div>
                      <div className="text-white/70 text-sm">
                        ₹{cycle.costPerCycle}/cycle, min {cycle.bundleSize}{" "}
                        cycles
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="text-white/90">Bundle Size:</label>
                      <input
                        type="number"
                        min="1"
                        value={cartItems[index].bundleSize}
                        onChange={(e) => {
                          const newCartItems = [...cartItems];
                          newCartItems[index].bundleSize =
                            parseInt(e.target.value) || 1;
                          setCartItems(newCartItems);
                        }}
                        className="w-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10
                                 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                                 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10
                             focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                             text-white placeholder-white/50"
                  />
                  <button
                    onClick={handleCouponApply}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl
                             transition-all duration-300 text-white"
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

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-white/90">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500
                         hover:from-purple-600 hover:to-indigo-600 
                         rounded-xl text-white font-medium shadow-lg
                         transition-all duration-300 transform hover:scale-[1.02]"
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
