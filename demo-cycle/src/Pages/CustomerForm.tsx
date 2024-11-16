import React, { useState, useEffect } from "react";
import { Camera, User, Calculator, AlertCircle } from "lucide-react";
import { ICustomer, ICustomerFormErrors } from "../models/Customer";
import InputField from "./Components/InputField";

interface CustomerFormProps {
  onFormDataChange: (data: ICustomer) => void;
  onValidationChange: (isValid: boolean) => void;
}
const CustomerForm: React.FC<CustomerFormProps> = ({
  onFormDataChange,
  onValidationChange,
}) => {
  const leadTypes: string[] = ["Hot Lead", "Warm Lead", "Cold Lead"];

  const [formData, setFormData] = useState<ICustomer>({
    customerName: "",
    customerImage: null,
    leadType: "",
    description: "",
    address: "",
    transport: "",
  });

  const [errors, setErrors] = useState<ICustomerFormErrors>({});
  const [touched, setTouched] = useState<ICustomer>({} as any);

  // Handle image capture
  const handleImageCapture = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);
      const blob = await imageCapture.takePhoto();
      const imageUrl = URL.createObjectURL(blob);
      setFormData((prev) => ({ ...prev, customerImage: imageUrl }));
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Handle file upload
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, customerImage: imageUrl }));
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
      case "leadType":
        if (!String(value).trim()) {
          newErrors.leadType = "Please select lead type";
        } else {
          delete newErrors.leadType;
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
    onFormDataChange(newFormData);

    if (touched[name as keyof ICustomer]) {
      validate(name as keyof ICustomer, value);
    }
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  //   e.preventDefault();
  //   const touchedAll: ITouchedFields = {
  //     customerName: true,
  //     leadType: true,
  //   };
  //   setTouched(touchedAll);

  //   const isValid = Object.keys(touchedAll).every((field) =>
  //     validate(
  //       field as keyof ICustomer,
  //       (formData as any)[field as keyof ICustomer]
  //     )
  //   );

  //   if (isValid) {
  //     console.log("Form submitted:", { ...formData });
  //     // Handle form submission here
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#2d2d2d] backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Add New Customer</h1>
        </div>

        {/* <form onSubmit={handleSubmit} className="space-y-6"> */}
        <div className="space-y-6">
          {/* Customer Name */}
          <InputField
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            label={"Customer Name*"}
            fieldKey={"customerName"}
          />

          {/* Address */}
          <InputField
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            label={"Address"}
            fieldKey={"address"}
          />

          {/* Transport */}
          <InputField
            formData={formData}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            label={"Transport"}
            fieldKey={"transport"}
          />

          {/* Customer Image */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Customer Image
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleImageCapture}
                className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 
                         hover:bg-white/20 transition-all duration-300 text-white
                         flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
              <label
                className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 
                             hover:bg-white/20 transition-all duration-300 text-white
                             flex items-center justify-center gap-2 cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Upload Image
              </label>
            </div>
            {formData.customerImage && (
              <div className="mt-4">
                <img
                  src={formData.customerImage}
                  alt="Customer"
                  className="w-32 h-32 rounded-xl object-cover"
                />
              </div>
            )}
          </div>

          {/* Lead Type */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Lead Type *
            </label>
            <select
              name="leadType"
              value={formData.leadType}
              onChange={handleInputChange}
              onBlur={() => handleBlur("leadType")}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.leadType && errors.leadType
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white transition-all duration-300`}
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
            {touched.leadType && errors.leadType && (
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.leadType}
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                       focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                       text-white placeholder-white/50 transition-all duration-300
                       min-h-[100px] resize-y"
              placeholder="Enter cycle description"
            />
          </div>

          {/* Submit Button */}
          {/* <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500
                     hover:from-purple-600 hover:to-indigo-600 
                     rounded-xl text-white font-medium shadow-lg
                     transition-all duration-300 transform hover:scale-[1.02]"
          >
            Add Customer
          </button> */}
          {/* </form> */}
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
