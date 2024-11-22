import React, { useState, useEffect } from "react";
import { Camera, User, AlertCircle, Loader2 } from "lucide-react";
import { ICustomer, ICustomerFormErrors } from "../models/Customer";
import InputField from "./Components/InputField";
import apiClient from "../api/axios";
import { useSnackbar } from "./Components/Snackbar";

interface CustomerFormProps {
  onFormDataChange: (data: ICustomer, formData: FormData | null) => void;
  onValidationChange: (isValid: boolean) => void;
  isCheckoutPage: boolean;
  customerData: ICustomer | null;
  isEdit: boolean;
  onClose: any;
  isAdminPage: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  onFormDataChange,
  onValidationChange,
  isCheckoutPage = false,
  customerData = null,
  isEdit = false,
  onClose,
  isAdminPage = false,
}) => {
  const initialState = {
    customerName: "",
    customerImage: null,
    leadType: "",
    description: "",
    gstNumber: "",
    transport: "",
  };
  const leadTypes: string[] = ["Hot Lead", "Warm Lead", "Cold Lead"];
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<ICustomer>(initialState);
  const [errors, setErrors] = useState<ICustomerFormErrors>({});
  const [touched, setTouched] = useState<ICustomer>({} as any);
  const [_, setCustomerAdditionError] = useState(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && customerData) {
      setFormData(customerData);
    }
  }, [isEdit, customerData]);

  const prepareFormData = (): FormData | null => {
    if (!imageFile && !formData.customerName) return null;

    const formDataToSend = new FormData();
    formDataToSend.append("customerName", formData.customerName);
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("gstNumber", formData.gstNumber || "");
    formDataToSend.append("transport", formData.transport || "");

    if (imageFile) {
      formDataToSend.append("customerImage", imageFile);
    }

    return formDataToSend;
  };

  const handleImageCapture = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);
      const blob = await imageCapture.takePhoto();
      const imageUrl = URL.createObjectURL(blob);

      const newFile = new File([blob], "captured-image.jpg", {
        type: "image/jpeg",
      });
      setImageFile(newFile);

      const newFormData = { ...formData, customerImage: imageUrl };
      setFormData(newFormData);

      // Pass both the form data and prepared FormData
      const preparedFormData = prepareFormData();
      onFormDataChange(newFormData, preparedFormData);

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
      showSnackbar("Error accessing camera", "error");
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);

      const newFormData = { ...formData, customerImage: imageUrl };
      setFormData(newFormData);

      // Pass both the form data and prepared FormData
      const preparedFormData = prepareFormData();
      onFormDataChange(newFormData, preparedFormData);
    }
  };

  const validate = (
    fieldName: keyof ICustomer,
    value: string | number
  ): boolean => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "customerName":
        if (!String(value).trim()) {
          newErrors.customerName = "Customer name is required";
        } else {
          delete newErrors.customerName;
        }
        break;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange(isValid);
    return isValid;
  };

  const handleBlur = (field: keyof ICustomer): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(
      field as keyof ICustomer,
      (formData as any)[field as keyof ICustomer]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    const preparedFormData = prepareFormData();
    onFormDataChange(newFormData, preparedFormData);

    if (touched[name as keyof ICustomer]) {
      validate(name as keyof ICustomer, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isLoading) return; // Prevent multiple submissions

    const touchedAll: any = {
      customerName: true,
    };
    setTouched(touchedAll);

    const isValid = Object.keys(touchedAll).every((field) =>
      validate(
        field as keyof ICustomer,
        (formData as any)[field as keyof ICustomer]
      )
    );

    if (isValid) {
      setIsLoading(true);
      try {
        const formDataToSend = new FormData();

        formDataToSend.append("customerName", formData.customerName);
        formDataToSend.append("description", formData.description || "");
        formDataToSend.append("gstNumber", formData.gstNumber || "");
        formDataToSend.append("transport", formData.transport || "");

        if (imageFile) {
          formDataToSend.append("customerImage", imageFile);
        }

        if (isEdit && customerData?._id) {
          const response = await apiClient.patch(
            `/api/customers/${customerData._id}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          onClose();

          if (response.status === 200) {
            showSnackbar("Customer updated successfully", "success");
          }
        } else {
          const customerResponse = await apiClient.post(
            "/api/customers",
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (customerResponse.status === 201) {
            setFormData(initialState);
            setImageFile(null);
            showSnackbar("customer added successfully", "success");
          }
        }
      } catch (error: any) {
        setCustomerAdditionError(
          error.response?.data?.message ||
            "Something went wrong with customer addition"
        );
        showSnackbar("Something went wrong with customer addition", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={`${
        isEdit
          ? "fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto p-4 md:p-0"
          : "min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-4 md:p-8 flex items-center justify-center"
      }`}
    >
      <div
        className={`w-full overflow-y-auto max-w-2xl bg-[#2d2d2d] backdrop-blur-md rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-4 md:p-8 ${
          isEdit ? "max-h-[95vh] md:h-auto" : null
        }`}
      >
        <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
          <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
          <h1 className="text-xl md:text-3xl font-bold text-white">
            Add New Customer
          </h1>
        </div>

        <div className="space-y-4 md:space-y-6">
          <InputField
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            label={"Customer Name*"}
            fieldKey={"customerName"}
          />

          <InputField
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            label={"GST Number"}
            fieldKey={"gstNumber"}
          />

          <InputField
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            label={"Transport"}
            fieldKey={"transport"}
          />

          <div className="space-y-2">
            <label className="block text-white/90 font-medium text-sm md:text-base">
              Customer Image
            </label>
            <div className="flex gap-2 md:gap-4">
              <label
                className={`flex-1 p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 border border-white/10 
                         hover:bg-white/20 transition-all duration-300 text-white text-sm md:text-base
                         flex items-center justify-center gap-2 cursor-pointer
                         ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                Upload Image
              </label>
            </div>
            {formData.customerImage && (
              <div className="mt-2 md:mt-4">
                <img
                  src={formData.customerImage}
                  alt="Customer"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-lg md:rounded-xl object-cover"
                />
              </div>
            )}
          </div>

          {isAdminPage && (
            <div className="space-y-2">
              <label className="block text-white/90 font-medium text-sm md:text-base">
                Lead Type *
              </label>
              <select
                name="leadType"
                value={formData.leadType}
                onChange={handleInputChange}
                onBlur={() => handleBlur("leadType")}
                disabled={isLoading}
                className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/5 border text-sm md:text-base
              ${
                touched.leadType && errors.leadType
                  ? "border-red-400"
                  : "border-white/10"
              }
              focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
              text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="" className="bg-gray-800">
                  Select lead type
                </option>
                {leadTypes.map((type) => (
                  <option key={type} value={type} className="bg-gray-800">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-white/90 font-medium text-sm md:text-base">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/5 border border-white/10 
                     focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                     text-white placeholder-white/50 transition-all duration-300 text-sm md:text-base
                     min-h-[80px] md:min-h-[100px] resize-y disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter customer description"
            />
          </div>

          {!isCheckoutPage && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-2 md:py-3 px-3 md:px-4 bg-gradient-to-r from-purple-500 to-indigo-500
                   hover:from-purple-600 hover:to-indigo-600 text-sm md:text-base
                   rounded-lg md:rounded-xl text-white font-medium shadow-lg
                   transition-all duration-300 transform hover:scale-[1.02]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              )}
              {isEdit ? "Update Customer" : "Add Customer"}
            </button>
          )}

          {isEdit && (
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-2 md:py-3 px-3 md:px-4 text-sm md:text-base
            rounded-lg md:rounded-xl text-white font-medium shadow-lg
            transition-all duration-300 transform hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
