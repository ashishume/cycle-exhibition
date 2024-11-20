import { X } from "lucide-react";
import { createPortal } from "react-dom";

export interface CustomerImageModalProps {
  imageUrl: string;
  customerName: string;
  onClose: () => void;
}

const CustomerImageModal: React.FC<CustomerImageModalProps> = ({
  imageUrl,
  customerName,
  onClose,
}) => {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-60 text-white hover:text-red-400"
        >
          <X size={32} />
        </button>
        <img
          src={imageUrl}
          alt={`${customerName} - Large View`}
          className="w-full h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>,
    document.body
  );
};

export default CustomerImageModal;
