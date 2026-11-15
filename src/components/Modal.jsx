import { X } from "lucide-react";

const Modal = ({ judul, buka, onTutup, children }) => {
  if (!buka) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2ddd0] sticky top-0 bg-white">
          <h3 className="font-bold">{judul}</h3>
          <button onClick={onTutup} className="p-1 hover:bg-[#f1eee6] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
