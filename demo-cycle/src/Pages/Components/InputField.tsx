import { AlertCircle } from "lucide-react";

const InputField = ({
  formData,
  handleInputChange,
  handleBlur,
  touched,
  errors,
  label,
  fieldKey,
}: any) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-white/90 font-medium">{label}</label>
        <input
          type="text"
          name={fieldKey}
          value={formData[fieldKey]}
          onChange={handleInputChange}
          onBlur={() => handleBlur(fieldKey)}
          className={`w-full px-4 py-3 rounded-xl bg-white/5 border 
                ${
                  touched[fieldKey] && errors[fieldKey]
                    ? "border-red-400"
                    : "border-white/10"
                }
                focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20
                text-white placeholder-white/50 transition-all duration-300`}
          placeholder={`Please enter here...`}
        />
        {touched[fieldKey] && errors[fieldKey] && (
          <div className="flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors[fieldKey]}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
