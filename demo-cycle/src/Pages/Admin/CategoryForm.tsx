import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { AlertCircle, Folder } from "lucide-react";
import { useSnackbar } from "../Components/Snackbar";
import apiClient from "../../api/axios";
import { ICategory } from "../../models/Category";


interface ICategoryFormErrors {
  name?: string;
  slug?: string;
}

interface ITouchedFields {
  name: boolean;
  slug: boolean;
}

const CategoryForm: React.FC<{
  mode: string;
  category: ICategory | null;
  onClose: () => void;
}> = ({ mode = "add", category = null, onClose }) => {
  const initialFormData: ICategory = {
    name: "",
    slug: "",
  };

  const [formData, setFormData] = useState<ICategory>(initialFormData);
  const [errors, setErrors] = useState<ICategoryFormErrors>({});
  const [touched, setTouched] = useState<ITouchedFields>({
    name: false,
    slug: false,
  });
  const { showSnackbar } = useSnackbar();

  // Initialize form data when editing
  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        _id: category._id,
        name: category.name,
        slug: category.slug,
      });
    }
  }, [category, mode]);

  const validate = (fieldName: keyof ICategory, value: string): boolean => {
    const newErrors: ICategoryFormErrors = { ...errors };

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Category name is required";
        } else if (value.length < 2) {
          newErrors.name = "Category name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;
      case "slug":
        if (!value.trim()) {
          newErrors.slug = "Slug is required";
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          newErrors.slug =
            "Slug must contain only lowercase letters, numbers, and hyphens";
        } else {
          delete newErrors.slug;
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
    e: ChangeEvent<HTMLInputElement>,
    field: keyof ICategory
  ): void => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug if name is changed and in add mode
    if (field === "name" && mode === "add") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }

    if (touched[field as keyof ITouchedFields]) {
      validate(field, value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const touchedAll: ITouchedFields = {
      name: true,
      slug: true,
    };
    setTouched(touchedAll);

    const isValid = ["name", "slug"].every((field) =>
      validate(
        field as keyof ICategory,
        (formData as any)[field as keyof ICategory]
      )
    );

    if (isValid) {
      try {
        if (mode === "add") {
          const response = await apiClient.post("/api/categories", formData);
          if (response.status === 201) {
            showSnackbar("Category added successfully", "success");
          }
        } else if (mode === "edit") {
          const response = await apiClient.patch(
            `/api/categories/${formData._id}`,
            formData
          );
          if (response.status === 200) {
            showSnackbar("Category updated successfully", "success");
          }
        }

        // Reset form or handle post-submit actions
        setFormData(initialFormData);
        setErrors({});
        setTouched({
          name: false,
          slug: false,
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
            <Folder className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">
              {mode === "edit" ? "Edit Category" : "Add New Category"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name Field */}
            <div className="space-y-2">
              <label className="block text-white/90 font-medium">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange(e, "name")}
                onBlur={() => handleBlur("name")}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.name && errors.name
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
                placeholder="Enter category name"
              />
              {touched.name && errors.name && (
                <div className="flex items-center gap-1 text-red-400 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Slug Field */}
            <div className="space-y-2">
              <label className="block text-white/90 font-medium">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                readOnly
                onChange={(e) => handleInputChange(e, "slug")}
                onBlur={() => handleBlur("slug")}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.slug && errors.slug
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
                placeholder="Enter category slug"
              />
              {touched.slug && errors.slug && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.slug}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500
           hover:from-purple-600 hover:to-indigo-600 
           rounded-xl text-white font-medium shadow-lg
           transition-all duration-300 transform hover:scale-[1.02]"
            >
              {mode === "edit" ? "Update Category" : "Add Category"}
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

export default CategoryForm;
