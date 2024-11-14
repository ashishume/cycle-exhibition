import React, { useState, ChangeEvent, FormEvent } from "react";
import { Plus, Minus, Bike, AlertCircle } from "lucide-react";
import { IFormData, IFormErrors, ITouchedFields } from "../models/Form";

const CycleForm: React.FC = () => {
  const VALID_CATEGORIES = ["accessories", "ranger-cycles", "kids-cycles"];

  const initialFormData: IFormData = {
    brand: "",
    imageLinks: [""],
    description: "",
    subtitle: "",
    category: "",
    variants: [
      {
        costPerProduct: 0,
        size: 12,
      },
      {
        costPerProduct: 0,
        size: 14,
      },
      {
        costPerProduct: 0,
        size: 16,
      },
      {
        costPerProduct: 0,
        size: 20,
      },
      {
        costPerProduct: 0,
        size: 24,
      },
      {
        costPerProduct: 0,
        size: 26,
      },
    ],
    bundleSize: 1,
  };
  const [formData, setFormData] = useState<IFormData>(initialFormData);
  const [errors, setErrors] = useState<IFormErrors>({});
  const [touched, setTouched] = useState<ITouchedFields>({} as any);

  const validate = (
    fieldName: keyof IFormData,
    value: string | string[]
  ): boolean => {
    const newErrors: IFormErrors = { ...errors };

    switch (fieldName) {
      case "brand":
        if (!(value as string).trim()) {
          newErrors.brand = "Brand name is required";
        } else {
          delete newErrors.brand;
        }
        break;
      case "imageLinks":
        if (!(value as string[]).some((link) => link.trim())) {
          newErrors.imageLinks = "At least one image link is required";
        } else {
          delete newErrors.imageLinks;
        }
        break;
      case "category":
        if (!(value as string).trim()) {
          newErrors.category = "Please select a category";
        } else {
          delete newErrors.category;
        }
        break;
      case "bundleSize":
        if (
          !value ||
          isNaN(Number(value)) ||
          Number(value) < 1 ||
          !Number.isInteger(Number(value))
        ) {
          newErrors.bundleSize = "Please enter a valid bundle size";
        } else {
          delete newErrors.bundleSize;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof ITouchedFields): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field, formData[field]);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: keyof IFormData
  ): void => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field as keyof ITouchedFields]) {
      validate(field, value);
    }
  };

  const handleImageLinkChange = (index: number, value: string): void => {
    const newLinks = [...formData.imageLinks];
    newLinks[index] = value;
    setFormData((prev) => ({ ...prev, imageLinks: newLinks }));
    if (touched.imageLinks) {
      validate("imageLinks", newLinks);
    }
  };

  const addImageLink = (): void => {
    setFormData((prev) => ({
      ...prev,
      imageLinks: [...prev.imageLinks, ""],
    }));
  };

  const removeImageLink = (index: number): void => {
    if (formData.imageLinks.length > 1) {
      const newLinks = formData.imageLinks.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        imageLinks: newLinks,
      }));
      validate("imageLinks", newLinks);
    }
  };

  const transformFormData = (): IFormData => {
    return {
      brand: formData.brand,
      imageLinks: formData.imageLinks,
      description: formData.description || "",
      subtitle: formData.subtitle || "",
      category: formData.category,
      variants: formData.variants,
      bundleSize: Number(formData.bundleSize),
    };
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const touchedAll: ITouchedFields = {
      brand: true,
      imageLinks: true,
      bundleSize: true,
      category: true,
    };
    setTouched(touchedAll);

    const isValid = ["brand", "imageLinks", "bundleSize", "category"].every(
      (field) =>
        validate(field as keyof IFormData, formData[field as keyof IFormData])
    );

    if (isValid) {
      const cycleData = transformFormData();
      console.log("Form submitted:", cycleData);
      // Handle form submission here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Bike className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Name Field */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Brand Name *
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleInputChange(e, "brand")}
              onBlur={() => handleBlur("brand")}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.brand && errors.brand
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
              placeholder="Enter product brand name"
            />
            {touched.brand && errors.brand && (
              <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.brand}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange(e, "category")}
              onBlur={() => handleBlur("category")}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.category && errors.category
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
            >
              <option value="">Select a category</option>
              {VALID_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
            {touched.category && errors.category && (
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.category}
              </div>
            )}
          </div>

          {/* Dynamic Image Links */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Image Links *
            </label>
            <div className="space-y-3">
              {formData.imageLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) =>
                      handleImageLinkChange(index, e.target.value)
                    }
                    onBlur={() => handleBlur("imageLinks")}
                    className={`flex-1 px-4 py-3 rounded-xl bg-white/5 border 
                      ${
                        touched.imageLinks && errors.imageLinks
                          ? "border-red-400"
                          : "border-white/10"
                      }
                      focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                      text-white placeholder-white/50 transition-all duration-300`}
                    placeholder="Enter image URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageLink(index)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/20 
                             transition-all duration-300 text-white disabled:opacity-50"
                    disabled={formData.imageLinks.length === 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageLink}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 
                         hover:bg-white/20 transition-all duration-300 text-white
                         flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Image Link
              </button>
              {touched.imageLinks && errors.imageLinks && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.imageLinks}
                </div>
              )}
            </div>
          </div>

          {/* Subtitle Field */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleInputChange(e, "subtitle")}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                         focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                         text-white placeholder-white/50 transition-all duration-300"
              placeholder="Enter subtitle"
            />
          </div>

          {/* Bundle Size Field */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Minimum Bundle Size *
            </label>
            <input
              type="number"
              value={formData.bundleSize}
              onChange={(e) => handleInputChange(e, "bundleSize")}
              onBlur={() => handleBlur("bundleSize")}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.bundleSize && errors.bundleSize
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
              placeholder="Enter minimum bundle size"
              min="1"
              step="1"
            />
            {touched.bundleSize && errors.bundleSize && (
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.bundleSize}
              </div>
            )}
          </div>

          {/* Price based on size */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Price based on size (₹) *
            </label>
            {formData.variants.map((size, index) => (
              <div key={size.size} className="flex items-center gap-3">
                <span className="text-white/90">{size.size} inch:</span>
                <input
                  type="number"
                  value={size.costPerProduct}
                  onChange={(e) => {
                    const newPricingPerSize = [...formData.variants];
                    newPricingPerSize[index].costPerProduct = parseFloat(
                      e.target.value
                    );
                    setFormData((prev) => ({
                      ...prev,
                      variants: newPricingPerSize,
                    }));
                  }}
                  onBlur={() => handleBlur(`variants.${index}.costPerProduct`)}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  (touched as any)[`variants.${index}.costPerProduct`] &&
                  (errors as any)[`variants.${index}.costPerProduct`]
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
                  placeholder={`Enter price for ${size.size}`}
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange(e, "description")}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                       focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                       text-white placeholder-white/50 transition-all duration-300
                       min-h-[100px] resize-y"
              placeholder="Enter product description"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500
                     hover:from-purple-600 hover:to-indigo-600 
                     rounded-xl text-white font-medium shadow-lg
                     transition-all duration-300 transform hover:scale-[1.02]"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CycleForm;
