import React, { useState, useEffect } from "react";
import { Camera, User, Calculator, AlertCircle } from "lucide-react";

// Interfaces
interface ICycle {
  id: number;
  brand: string;
  bundleSize: number;
  costPerCycle: number;
}

interface ICustomerFormData {
  customerName: string;
  selectedCycle: string;
  bundleSize: number;
  customerImage: string | null;
  leadType: string;
  description: string;
}

interface ICustomerFormErrors {
  customerName?: string;
  selectedCycle?: string;
  leadType?: string;
}

interface ITouchedFields {
  customerName?: boolean;
  selectedCycle?: boolean;
  leadType?: boolean;
}

interface IEstimate {
  cyclesInBundle: number;
  costPerCycle: number;
  totalCost: number;
}

const CustomerForm = () => {
  // Sample cycles data - in real app, this would come from your backend
  const cycles: ICycle[] = [
    { id: 1, brand: "Cycle1", bundleSize: 5, costPerCycle: 100 },
    { id: 2, brand: "Cycle2", bundleSize: 6, costPerCycle: 150 },
    { id: 3, brand: "Cycle3", bundleSize: 7, costPerCycle: 200 },
  ];

  const leadTypes: string[] = ["Hot Lead", "Warm Lead", "Cold Lead"];

  const [formData, setFormData] = useState<ICustomerFormData>({
    customerName: "",
    selectedCycle: "",
    bundleSize: 1,
    customerImage: null,
    leadType: "",
    description: "",
  });

  const [errors, setErrors] = useState<ICustomerFormErrors>({});
  const [touched, setTouched] = useState<ITouchedFields>({});
  const [estimate, setEstimate] = useState<IEstimate>({
    cyclesInBundle: 0,
    costPerCycle: 0,
    totalCost: 0,
  });

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

  // Calculate estimate when cycle or bundle size changes
  useEffect(() => {
    if (formData.selectedCycle) {
      const selectedCycleData = cycles.find(
        (c) => c.id === parseInt(formData.selectedCycle)
      );
      if (selectedCycleData) {
        const cyclesInBundle =
          selectedCycleData.bundleSize * formData.bundleSize;
        const totalCost = cyclesInBundle * selectedCycleData.costPerCycle;
        setEstimate({
          cyclesInBundle,
          costPerCycle: selectedCycleData.costPerCycle,
          totalCost,
        });
      }
    }
  }, [formData.selectedCycle, formData.bundleSize]);

  // Validation
  const validate = (
    fieldName: keyof ICustomerFormData,
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
      case "selectedCycle":
        if (!value) {
          newErrors.selectedCycle = "Please select a cycle";
        } else {
          delete newErrors.selectedCycle;
        }
        break;
      case "leadType":
        if (!value) {
          newErrors.leadType = "Please select lead type";
        } else {
          delete newErrors.leadType;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof ITouchedFields): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(
      field as keyof ICustomerFormData,
      (formData as any)[field as keyof ICustomerFormData]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof ITouchedFields]) {
      validate(name as keyof ICustomerFormData, value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const touchedAll: ITouchedFields = {
      customerName: true,
      selectedCycle: true,
      leadType: true,
    };
    setTouched(touchedAll);

    const isValid = Object.keys(touchedAll).every((field) =>
      validate(
        field as keyof ICustomerFormData,
        (formData as any)[field as keyof ICustomerFormData]
      )
    );

    if (isValid) {
      console.log("Form submitted:", { ...formData, estimate });
      // Handle form submission here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#2d2d2d] backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Add New Customer</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Customer Name *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              onBlur={() => handleBlur("customerName")}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.customerName && errors.customerName
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
              placeholder="Enter customer name"
            />
            {touched.customerName && errors.customerName && (
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.customerName}
              </div>
            )}
          </div>

          {/* Cycle Selection */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Select Cycle *
            </label>
            <select
              name="selectedCycle"
              value={formData.selectedCycle}
              onChange={handleInputChange}
              onBlur={() => handleBlur("selectedCycle")}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched.selectedCycle && errors.selectedCycle
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white transition-all duration-300`}
            >
              <option value="" className="bg-gray-800">
                Select a cycle
              </option>
              {cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id} className="bg-gray-800">
                  {cycle.brand} ({cycle.bundleSize} cycles/bundle)
                </option>
              ))}
            </select>
            {touched.selectedCycle && errors.selectedCycle && (
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.selectedCycle}
              </div>
            )}
          </div>

          {/* Bundle Size */}
          <div className="space-y-2">
            <label className="block text-white/90 font-medium">
              Bundle Size
            </label>
            <input
              type="number"
              name="bundleSize"
              value={formData.bundleSize}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                       focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                       text-white placeholder-white/50 transition-all duration-300"
            />
          </div>

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
              value={formData.description}
              onChange={(e) => handleInputChange(e)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                       focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                       text-white placeholder-white/50 transition-all duration-300
                       min-h-[100px] resize-y"
              placeholder="Enter cycle description"
            />
          </div>

          {/* Estimate Display */}
          {formData.selectedCycle && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Calculator className="w-5 h-5" />
                Estimate
              </div>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div>Cycles in Bundle: {estimate.cyclesInBundle}</div>
                <div>Cost per Cycle: ₹{estimate.costPerCycle}</div>
                <div className="col-span-2 text-lg font-bold">
                  Total Cost: ₹{estimate.totalCost}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500
                     hover:from-purple-600 hover:to-indigo-600 
                     rounded-xl text-white font-medium shadow-lg
                     transition-all duration-300 transform hover:scale-[1.02]"
          >
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
