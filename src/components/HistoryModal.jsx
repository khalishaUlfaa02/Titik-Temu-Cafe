import { useState } from "react";
import { X, ReceiptText, RotateCcw, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useNotification } from "../context/NotificationContext";
import { formatRupiah } from "../utils/pricing";

const HistoryModal = ({ buka, onTutup, onBukaKeranjang }) => {
  const { riwayat, dispatch } = useCart();
  const { showToast } = useToast();
  const { tambahNotifikasi } = useNotification();
  const [konfirmasi, setKonfirmasi] = useState(false);

  if (!buka) return null;

  const totalBelanja = riwayat.reduce((s, r) => s + r.total, 0);

  const reset = () => {
    dispatch({ type: "RESET" });
    setKonfirmasi(false);
    showToast("Stok dan riwayat sudah direset", "info");
    tambahNotifikasi("Reset", "Stok menu dan riwayat transaksi dikembalikan");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2ddd0] sticky top-0 bg-white">
          <h3 className="font-bold flex items-center gap-2">
            <ReceiptText className="w-4 h-4" /> Riwayat Transaksi
          </h3>
          <button onClick={onTutup} className="p-1 hover:bg-[#f1eee6] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {riwayat.length === 0 ? (
            <div className="text-center py-10 text-[#6e7366] text-sm">
              <ReceiptText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              Belum ada transaksi.
              <button
                onClick={onBukaKeranjang}
                className="mt-3 flex items-center gap-1 mx-auto text-[#6c7458] underline text-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Buka keranjang
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-[#6e7366]">
                  {riwayat.length} pesanan
                </span>
                <span className="font-semibold">
                  Total {formatRupiah(totalBelanja)}
                </span>
              </div>

              <ul className="space-y-2">
                {riwayat.map((r) => (
                  <li key={r.id} className="border border-[#e2ddd0] rounded p-2 text-sm">
                    <div className="flex justify-between text-xs text-[#6e7366]">
                      <span>{r.id}</span>
                      <span>{r.waktu}</span>
                    </div>

                    <ul className="mt-1 text-xs text-[#3a3f33]">
                      {r.items.map((i) => (
                        <li key={i.id} className="flex justify-between">
                          <span>
                            {i.name} x{i.qty}
                          </span>
                          <span>{formatRupiah(i.price * i.qty)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-between text-xs mt-1 pt-1 border-t border-[#e7e2d6]">
                      <span className="text-[#6e7366]">
                        Promo: {r.promo} | Pajak 10%
                      </span>
                      <span className="font-bold">{formatRupiah(r.total)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {konfirmasi ? (
            <div className="mt-4 bg-[#f6efe2] border border-[#cfc4a4] rounded p-3 text-sm">
              <p className="mb-2">
                Yakin reset stok dan riwayat? Semua pesanan akan hilang.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="flex-1 bg-[#a91b0d] text-white py-1.5 rounded text-xs"
                >
                  Ya, reset
                </button>
                <button
                  onClick={() => setKonfirmasi(false)}
                  className="flex-1 border border-[#cbc6b6] py-1.5 rounded text-xs"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setKonfirmasi(true)}
              className="mt-4 w-full border border-[#cbc6b6] text-[#3a3f33] py-2 rounded text-sm flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Reset stok &amp; riwayat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
