import ReactDOM from "react-dom";

const ModalWrapper: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // Close modal on outside click
    >
      <div
        className="bg-white p-6 rounded shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default ModalWrapper;
