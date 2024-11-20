import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

// Types of snackbar messages
export type SnackbarType = "success" | "error" | "warning";

// Snackbar props interface
interface SnackbarProps {
  message: string;
  type?: SnackbarType;
  duration?: number;
  onClose?: () => void;
}

// Snackbar configuration for different types
const snackbarConfig = {
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-500",
    textColor: "text-green-50",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-500",
    textColor: "text-red-50",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-50",
  },
};

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { icon: Icon, bgColor, textColor } = snackbarConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed 
        bottom-4 
        right-4 
        z-50 
        flex 
        items-center 
        ${bgColor} 
        ${textColor} 
        px-4 
        py-2 
        rounded-lg 
        shadow-lg 
        transition-all 
        duration-300 
        animate-slide-in
      `}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

// Context for managing snackbars
export const SnackbarContext = React.createContext<{
  showSnackbar: (message: string, type?: SnackbarType) => void;
}>({
  showSnackbar: () => {},
});

// Snackbar Provider Component
export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [snackbars, setSnackbars] = useState<
    {
      message: string;
      type: SnackbarType;
      id: number;
    }[]
  >([]);

  const showSnackbar = (message: string, type: SnackbarType = "success") => {
    const id = Date.now();
    setSnackbars((prev) => [...prev, { message, type, id }]);
  };

  const removeSnackbar = (id: number) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {snackbars.map(({ message, type, id }) => (
          <Snackbar
            key={id}
            message={message}
            type={type}
            onClose={() => removeSnackbar(id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

// Custom hook for using Snackbar
export const useSnackbar = () => {
  const context = React.useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
