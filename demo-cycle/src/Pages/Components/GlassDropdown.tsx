import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const GlassDropdown = ({
  options = [] as any,
  placeholder = "Select an option",
  onChange = (value: any) => {},
  value = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null as any);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value === null) {
      setSelectedOption(null);
    } else {
      const option = options.find((opt: any) => opt.value === value);
      setSelectedOption(option || null);
    }
  }, [value, options]);

  const handleSelect = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option.value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !(dropdownRef?.current as any)?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-72" ref={dropdownRef}>
      {/* Dropdown Menu - Positioned Above */}
      {isOpen && (
        <div
          className="absolute w-full bottom-full mb-2 py-2
                      bg-white/10 backdrop-blur-md
                      border border-white/20
                      rounded-xl shadow-lg
                      animate-in fade-in slide-in-from-bottom-2
                      z-50"
        >
          {options.map((option: any, index: number) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-2 text-left text-white
                         transition-colors duration-200
                         hover:bg-white/20
                         ${
                           selectedOption?.value === option?.value
                             ? "bg-white/20"
                             : ""
                         }
                         ${index === 0 ? "rounded-t-lg" : ""}
                         ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            >
              {option?.label}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between
                 bg-white/10 backdrop-blur-md
                 border border-white/20
                 rounded-xl shadow-lg
                 text-white
                 transition-all duration-300
                 hover:bg-white/20
                 focus:outline-none focus:ring-2 focus:ring-white/20
                 ${isOpen ? "bg-white/20" : ""}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default GlassDropdown;
