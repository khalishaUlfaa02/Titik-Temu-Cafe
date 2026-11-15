import { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

const ToastContext = createContext(null);

const WARNA = {
  sukses: "bg-[#6c7458]",
  error: "bg-[#a91b0d]",
  info: "bg-[#4a4f42]",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (pesan, tipe = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, pesan, tipe }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed left-4 right-4 top-44 z-[60] flex flex-col gap-2 sm:top-auto sm:bottom-4 sm:right-auto sm:w-64">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`text-white text-sm px-3 py-2 rounded shadow-lg flex items-start gap-2 ${
              WARNA[t.tipe] || WARNA.info
            }`}
          >
            {t.tipe === "error" ? (
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            ) : t.tipe === "info" ? (
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <span>{t.pesan}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
