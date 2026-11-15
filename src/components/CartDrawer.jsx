import { useState } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Ticket,
  ReceiptText,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useNotification } from "../context/NotificationContext";
import { cariPromo, formatRupiah } from "../utils/pricing";

const CartDrawer = ({ buka, onTutup, onBukaRiwayat }) => {
  const { items, stok, promo, dispatch, subtotal, rincian } = useCart();
  const { showToast } = useToast();
  const { tambahNotifikasi } = useNotification();

  const [kode, setKode] = useState("");
  const [struk, setStruk] = useState(null);

  const tutup = () => {
    setKode("");
    setStruk(null);
    onTutup();
  };

  const tambah = (item) => {
    if (stok[item.id] <= item.qty) {
      showToast(`Stok ${item.name} tinggal ${stok[item.id]}`, "error");
      return;
    }
    dispatch({ type: "TAMBAH", menu: item });
  };

  const pakaiPromo = () => {
    if (!kode.trim()) {
      showToast("Isi kode promo dulu", "error");
      return;
    }
    const ketemu = cariPromo(kode);
    if (!ketemu) {
      showToast("Kode promo tidak dikenal", "error");
      return;
    }
    dispatch({ type: "PROMO", promo: ketemu });
    showToast(`Promo ${ketemu.code} dipakai (${ketemu.percent}%)`, "sukses");
    tambahNotifikasi("Promo", `Kode ${ketemu.code} berhasil dipakai`);
    setKode("");
  };

  const bayar = () => {
    if (items.length === 0) {
      showToast("Keranjang masih kosong", "error");
      return;
    }

    const salinan = {
      waktu: new Date().toLocaleString("id-ID"),
      items: items.map((i) => ({ ...i })),
      rincian,
      promo: promo ? promo.code : "-",
    };

    dispatch({ type: "BAYAR" });
    setStruk(salinan);
    showToast("Pembayaran berhasil", "sukses");
    tambahNotifikasi("Pesanan", `Pesanan dibayar ${formatRupiah(rincian.total)}`);
  };

  return (
    <div className={`fixed inset-0 z-50 ${buka ? "" : "pointer-events-none"}`}>
      <div
        onClick={tutup}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          buka ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform ${
          buka ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2ddd0]">
          <h3 className="font-bold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {struk ? "Struk Pembayaran" : "Keranjang"}
          </h3>
          <button onClick={tutup} className="p-1 hover:bg-[#f1eee6] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {struk ? (
          <div className="flex-1 overflow-y-auto p-4 text-sm">
            <div className="text-center mb-3">
              <CheckCircle2 className="w-10 h-10 text-[#6c7458] mx-auto mb-1" />
              <p className="font-semibold">Pembayaran berhasil</p>
              <p className="text-xs text-[#6e7366]">{struk.waktu}</p>
            </div>

            <div className="border-t border-dashed border-[#cbc6b6] pt-2 space-y-1 font-mono text-xs">
              {struk.items.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span>
                    {i.name} x{i.qty}
                  </span>
                  <span>{formatRupiah(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="border-t border-dashed border-[#cbc6b6] pt-2 mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(struk.rincian.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diskon ({struk.promo})</span>
                  <span className="text-[#a91b0d]">-{formatRupiah(struk.rincian.diskon)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak 10%</span>
                  <span>{formatRupiah(struk.rincian.pajak)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-[#cbc6b6]">
                  <span>TOTAL</span>
                  <span className="text-[#a91b0d]">{formatRupiah(struk.rincian.total)}</span>
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] text-[#8b9080] mt-4">
              Terima kasih sudah mampir ke Titik Temu
            </p>

            <button
              onClick={() => {
                setStruk(null);
                onTutup();
              }}
              className="w-full mt-3 bg-[#6c7458] text-white py-2 rounded hover:bg-[#5a6149]"
            >
              Selesai
            </button>

            <button
              onClick={() => {
                setStruk(null);
                onBukaRiwayat();
              }}
              className="w-full mt-2 border border-[#cbc6b6] py-2 rounded text-[#3a3f33]"
            >
              Lihat Riwayat
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {items.length === 0 ? (
                <div className="text-center py-16 text-[#6e7366] text-sm">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  Keranjang masih kosong.
                  <br />
                  Pilih menu dulu ya.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-2 border border-[#e2ddd0] rounded p-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded object-cover bg-[#ddd8ca]"
                    />
                    <div className="flex-1 text-sm">
                      <div className="flex justify-between gap-1">
                        <p className="font-medium leading-tight">{item.name}</p>
                        <button
                          onClick={() => dispatch({ type: "HAPUS", id: item.id })}
                          className="text-[#8b9080] hover:text-[#a91b0d]"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#6e7366]">
                        {formatRupiah(item.price)}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              dispatch({ type: "KURANGI", id: item.id })
                            }
                            className="p-0.5 rounded bg-[#f1eee6] hover:bg-[#e3dfd2]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => tambah(item)}
                            className="p-0.5 rounded bg-[#f1eee6] hover:bg-[#e3dfd2]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-semibold">
                          {formatRupiah(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#e2ddd0] p-3 text-sm">
              {promo ? (
                <div className="flex items-center justify-between bg-[#f3ded9] text-[#a91b0d] px-2 py-1.5 rounded mb-2 text-xs">
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    {promo.code} ({promo.percent}%)
                  </span>
                  <button
                    onClick={() => {
                      dispatch({ type: "PROMO", promo: null });
                      showToast("Promo dilepas", "info");
                    }}
                    className="underline"
                  >
                    lepas
                  </button>
                </div>
              ) : (
                <div className="flex gap-1 mb-2">
                  <input
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    placeholder="Kode promo"
                    className="flex-1 border border-[#cbc6b6] rounded px-2 py-1.5 text-xs outline-none focus:border-[#6c7458]"
                  />
                  <button
                    onClick={pakaiPromo}
                    className="bg-[#4a4f42] text-white px-3 rounded text-xs"
                  >
                    Pakai
                  </button>
                </div>
              )}

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6e7366]">Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7366]">Diskon</span>
                  <span className="text-[#a91b0d]">-{formatRupiah(rincian.diskon)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7366]">Pajak 10%</span>
                  <span>{formatRupiah(rincian.pajak)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1 border-t border-[#e2ddd0]">
                  <span>Total</span>
                  <span className="text-[#a91b0d]">{formatRupiah(rincian.total)}</span>
                </div>
              </div>

              <button
                onClick={bayar}
                disabled={items.length === 0}
                className={`w-full mt-2 py-2 rounded text-white text-sm ${
                  items.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#6c7458] hover:bg-[#5a6149]"
                }`}
              >
                Bayar
              </button>

              <button
                onClick={onBukaRiwayat}
                className="w-full mt-1 text-xs text-[#6c7458] underline flex items-center justify-center gap-1"
              >
                <ReceiptText className="w-3.5 h-3.5" /> Riwayat transaksi
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
