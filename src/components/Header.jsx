import {
  Coffee,
  Search,
  ShoppingCart,
  Bell,
  ReceiptText,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const KATEGORI = ["Semua", "Kopi", "Non-Kopi", "Makanan", "Snack", "Favorit"];

const Header = ({
  kataKunci,
  onCari,
  tab,
  onGantiTab,
  jumlahKategori,
  jumlahNotif,
  onBukaKeranjang,
  onBukaRiwayat,
  onBukaNotif,
}) => {
  const { totalItem } = useCart();

  return (
    <header className="bg-[#3a3f33] text-[#e6e2d7]">
      <div className="h-1 bg-[#a91b0d]"></div>
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Coffee className="w-7 h-7" />
          <div>
            <h1 className="text-xl font-bold leading-none">
              Titik Temu<span className="text-[#a91b0d]">.</span>
            </h1>
            <p className="text-xs text-[#c9cdbc]">kopi &amp; camilan</p>
          </div>
        </div>

        <div className="order-3 sm:order-none flex items-center bg-[#4a4f42] rounded-md px-3 py-1.5 flex-1 min-w-[180px] w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#adb39f]" />
          <input
            type="text"
            value={kataKunci}
            onChange={(e) => onCari(e.target.value)}
            placeholder="Cari menu..."
            className="bg-transparent outline-none ml-2 w-full text-sm placeholder:text-[#9aa08c]"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onBukaRiwayat}
            className="p-2 rounded bg-[#4a4f42] hover:bg-[#3a3f33]"
            title="Riwayat transaksi"
          >
            <ReceiptText className="w-5 h-5" />
          </button>

          <button
            onClick={onBukaNotif}
            className="relative p-2 rounded bg-[#4a4f42] hover:bg-[#3a3f33]"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {jumlahNotif > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#a91b0d] text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {jumlahNotif}
              </span>
            )}
          </button>

          <button
            onClick={onBukaKeranjang}
            className="relative bg-[#6c7458] hover:bg-[#5a6149] px-3 py-2 rounded-md flex items-center gap-2 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="bg-[#e6e2d7] text-[#3a3f33] text-xs font-bold px-1.5 rounded">
              {totalItem}
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-[#3a3f33]">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto text-sm">
          {KATEGORI.map((kat) => (
            <button
              key={kat}
              onClick={() => onGantiTab(kat)}
              className={`px-3 py-2 whitespace-nowrap border-b-2 ${
                tab === kat
                  ? "border-[#a91b0d] text-white"
                  : "border-transparent text-[#c9cdbc] hover:text-white"
              }`}
            >
              {kat}
              <span className="ml-1 text-[11px] opacity-70">
                ({jumlahKategori[kat] ?? 0})
              </span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
