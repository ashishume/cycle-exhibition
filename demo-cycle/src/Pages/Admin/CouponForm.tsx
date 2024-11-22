import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { AlertCircle, Tag } from "lucide-react";
import { useSnackbar } from "../Components/Snackbar";
import apiClient from "../../api/axios";
import {
  ICoupon,
  ICouponFormErrors,
  ITouchedFields,
} from "../../models/Coupon";
import { COUPON_TYPE } from "../../constants/admin";

const CouponForm: React.FC<{
  mode: string;
  coupon: ICoupon | null;
  onClose: () => void;
}> = ({
  mode = "add",
  coupon = null,
  onClose,
}: {
  mode: string;
  coupon: ICoupon | any;
  onClose: any;
}) => {
  const initialFormData: ICoupon = {
    code: "",
    discount: 0,
    isActive: true,
    couponType: "totalAmount",
    expirationDate: "",
  };

  const [formData, setFormData] = useState<ICoupon>(initialFormData);
  const [errors, setErrors] = useState<ICouponFormErrors>({});
  const [touched, setTouched] = useState<ITouchedFields>({
    code: false,
    discount: false,
    expirationDate: false,
    couponType: false,
  });
  const { showSnackbar } = useSnackbar();

  // Initialize form data when editing
  useEffect(() => {
    if (mode === "edit" && coupon) {
      setFormData({
        code: coupon.code,
        discount: coupon.discount,
        isActive: coupon.isActive,
        couponType: coupon.couponType,
        expirationDate: new Date(coupon.expirationDate)
          .toISOString()
          .split("T")[0],
      });
    }
  }, [coupon, mode]);

  const validate = (
    fieldName: keyof ICoupon,
    value: string | number | boolean
  ): boolean => {
    const newErrors: ICouponFormErrors = { ...errors };

    switch (fieldName) {
      case "code":
        if (!(value as string).trim()) {
          newErrors.code = "Coupon code is required";
        } else if ((value as string).length < 4) {
          newErrors.code = "Coupon code must be at least 4 characters";
        } else {
          delete newErrors.code;
        }
        break;
      case "discount":
        if (Number(value) <= 0) {
          newErrors.discount = "Discount must be greater than zero";
        } else {
          delete newErrors.discount;
        }
        break;
      case "couponType":
        if (!(value as string).trim()) {
          newErrors.couponType = "Coupon type is a required field";
        } else {
          delete newErrors.couponType;
        }
        break;
      case "expirationDate":
        const today = new Date();
        const expirationDate = new Date(value as string);

        if (!value) {
          newErrors.expirationDate = "Expiration date is required";
        } else if (expirationDate <= today) {
          newErrors.expirationDate = "Expiration date must be in the future";
        } else {
          delete newErrors.expirationDate;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof ITouchedFields): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field, (formData as any)[field]);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof ICoupon
  ): void => {
    const value =
      field === "isActive"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field as keyof ITouchedFields]) {
      validate(field, value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const touchedAll: ITouchedFields = {
      code: true,
      discount: true,
      expirationDate: true,
      couponType: true,
    };
    setTouched(touchedAll);

    const isValid = ["code", "discount", "expirationDate", "couponType"].every(
      (field) =>
        validate(
          field as keyof ICoupon,
          (formData as any)[field as keyof ICoupon]
        )
    );

    if (isValid) {
      try {
        if (mode === "add") {
          const response = await apiClient.post("/api/coupons", {
            ...formData,
            expirationDate: new Date(formData.expirationDate).toISOString(),
          });
          if (response.status === 201) {
            showSnackbar("Coupon added successfully", "success");
          }
        } else if (mode === "edit") {
          const response = await apiClient.patch(
            `/api/coupons/${coupon?._id}`,
            {
              ...formData,
              expirationDate: new Date(formData.expirationDate).toISOString(),
            }
          );
          if (response.status === 200) {
            showSnackbar("Coupon updated successfully", "success");
          }
        }

        // Reset form or handle post-submit actions
        setFormData(initialFormData);
        setErrors({});
        setTouched({
          code: false,
          discount: false,
          expirationDate: false,
          couponType: false,
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        showSnackbar("Error submitting form", "error");
      }
    }

    if (mode === "edit") {
      onClose(); // Close modal after successful submission
    }
  };

  return (
    <div className={`fixed inset-0 flex justify-center z-50`}>
      <div className={`w-screen flex justify-center`}>
        <div
          className={`h-[100vh] overflow-y-auto w-full max-w-2xl bg-[#2d2d2d] backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Tag className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">
              {mode === "edit" ? "Edit Coupon" : "Add New Coupon"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Coupon Code Field */}
            <div className="space-y-2">
              <label className="block text-white/90 font-medium">
                Coupon Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange(e, "code")}
                onBlur={() => handleBlur("code")}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.code && errors.code
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
                placeholder="Enter coupon code"
              />
              {touched.code && errors.code && (
                <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.code}
                </div>
              )}
            </div>

            {/* Discount Field */}
            <div className="space-y-2">
              <label className="block text-white/90 font-medium">
                Discount Amount (₹) *
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => handleInputChange(e, "discount")}
                onBlur={() => handleBlur("discount")}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.discount && errors.discount
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
                placeholder="Enter discount amount"
                min="0"
                step="1"
              />
              {touched.discount && errors.discount && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.discount}
                </div>
              )}
            </div>

            {/* Coupon Type Dropdown */}
            <div className="space-y-2">
              <label className="block text-white/90 font-medium">
                Coupon Type
              </label>
              <select
                value={formData.couponType}
                onChange={(e) => handleInputChange(e, "couponType")}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-black/50 transition-all duration-300"
              >
                <option value={COUPON_TYPE.PER_CYCLE} className="text-black">
                  Per Cycle
                </option>
                <option value={COUPON_TYPE.TOTAL_AMOUNT} className="text-black">
                  Total Amount
                </option>
              </select>
            </div>

            {/* Expiration Date Field */}
            <div className="space-y-2">
              <label className="block text-white/90 font-medium">
                Expiration Date *
              </label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange(e, "expirationDate")}
                onBlur={() => handleBlur("expirationDate")}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.expirationDate && errors.expirationDate
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
              />
              {touched.expirationDate && errors.expirationDate && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.expirationDate}
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="space-y-2 flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange(e, "isActive")}
                className="w-4 h-4 text-indigo-600 bg-white/5 border-white/10 focus:ring-indigo-500"
              />
              <span className="text-white/90">Is Active</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500
           hover:from-purple-600 hover:to-indigo-600 
           rounded-xl text-white font-medium shadow-lg
           transition-all duration-300 transform hover:scale-[1.02]"
            >
              {mode === "edit" ? "Update Coupon" : "Add Coupon"}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-full py-3 px-4 mt-2 border border-white/20 hover:bg-white/10 
                rounded-xl text-white font-medium shadow-lg
                transition-all duration-300 transform hover:scale-[1.02]"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;
