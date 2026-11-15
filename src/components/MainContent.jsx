import { useMemo, useState } from "react";
import { Search, Star, MessageCircle, Clock, Tag, Coffee } from "lucide-react";
import menu from "../data/menu";
import { formatRupiah } from "../utils/pricing";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useNotification } from "../context/NotificationContext";
import useLocalStorage from "../hooks/useLocalStorage";
import MenuCard from "./MenuCard";
import Modal from "./Modal";
import StarRating from "./StarRating";

const MainContent = ({ kataKunci, tab, favorit, onFavorit }) => {
  const { dispatch, sisaStok, stokGudang } = useCart();
  const { showToast } = useToast();
  const { tambahNotifikasi } = useNotification();

  const [komentar, setKomentar] = useLocalStorage("titiktemu-komentar", {});
  const [urut, setUrut] = useState("nama");

  const [menuInfo, setMenuInfo] = useState(null);
  const [menuKomentar, setMenuKomentar] = useState(null);
  const [ratingBaru, setRatingBaru] = useState(5);
  const [teksBaru, setTeksBaru] = useState("");
  const [errorKomentar, setErrorKomentar] = useState("");

  const hasil = useMemo(() => {
    let data = [...menu];

    if (kataKunci.trim()) {
      data = data.filter((m) =>
        m.name.toLowerCase().includes(kataKunci.toLowerCase())
      );
    }

    if (tab === "Favorit") {
      data = data.filter((m) => favorit.some((f) => f.id === m.id));
    } else if (tab !== "Semua") {
      data = data.filter((m) => m.category === tab);
    }

    if (urut === "harga") data.sort((a, b) => a.price - b.price);
    if (urut === "rating") data.sort((a, b) => b.rating - a.rating);
    if (urut === "nama") data.sort((a, b) => a.name.localeCompare(b.name));

    if (urut === "favoritBaru" || urut === "favoritLama") {
      data.sort((a, b) => {
        const wa = favorit.find((f) => f.id === a.id)?.pada ?? 0;
        const wb = favorit.find((f) => f.id === b.id)?.pada ?? 0;
        return urut === "favoritBaru" ? wb - wa : wa - wb;
      });
    }

    return data;
  }, [kataKunci, tab, urut, favorit]);

  const tambah = (item) => {
    if (sisaStok(item.id) <= 0) {
      showToast(`Stok ${item.name} sudah habis`, "error");
      return;
    }
    dispatch({ type: "TAMBAH", menu: item });
    showToast(`${item.name} masuk keranjang`, "sukses");
    tambahNotifikasi("Keranjang", `${item.name} ditambahkan ke keranjang`);
  };

  const bukaKomentar = (item) => {
    setMenuKomentar(item);
    setRatingBaru(5);
    setTeksBaru("");
    setErrorKomentar("");
  };

  const kirimKomentar = () => {
    const teks = teksBaru.trim();
    if (teks.length < 5) {
      setErrorKomentar("Komentar minimal 5 karakter.");
      return;
    }

    const id = menuKomentar.id;
    const baru = {
      id: Date.now(),
      rating: ratingBaru,
      teks,
      waktu: new Date().toLocaleString("id-ID"),
    };

    setKomentar((prev) => ({ ...prev, [id]: [baru, ...(prev[id] || [])] }));
    setTeksBaru("");
    setRatingBaru(5);
    setErrorKomentar("");
    showToast("Komentar terkirim", "sukses");
    tambahNotifikasi("Komentar", `Kamu memberi komentar untuk ${menuKomentar.name}`);
  };

  const ulasanMenu = menuInfo ? komentar[menuInfo.id] || [] : [];
  const ulasanKomentar = menuKomentar ? komentar[menuKomentar.id] || [] : [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
      {/* sambutan di bawah header */}
      <section className="mb-6 rounded-lg overflow-hidden border border-[#cfd3c3] bg-[#dfe3d5]">
        <div className="px-5 py-6 sm:px-8 flex flex-col md:flex-row md:items-center gap-5 md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#6c7458] font-semibold">
              Kopi &amp; camilan
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              Dari Bumi Nusantara, Untuk Jeda Harianmu
              <span className="text-[#a91b0d]">.</span>
            </h2>
            <p className="text-sm text-[#5c6353] mt-2 max-w-xl">
              Mau ngopi santai atau cari camilan? Pilih menu di bawah, tambahkan ke
              keranjang, lalu bayar di sini tanpa perlu antre.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs shrink-0">
            <span className="flex items-center gap-1.5 bg-white/70 border border-[#cfd3c3] rounded-full px-3 py-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6c7458]" />
              Buka 08.00 - 22.00
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 border border-[#cfd3c3] rounded-full px-3 py-1.5">
              <Tag className="w-3.5 h-3.5 text-[#a91b0d]" />
              Diskon s.d. 25%
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 border border-[#cfd3c3] rounded-full px-3 py-1.5">
              <Coffee className="w-3.5 h-3.5 text-[#6c7458]" />
              {menu.length} menu
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Menu Kami</h2>
          <p className="text-sm text-[#6e7366]">{hasil.length} menu ditemukan</p>
        </div>

        <label className="text-sm flex items-center gap-2">
          Urutkan:
          <select
            value={urut}
            onChange={(e) => setUrut(e.target.value)}
            className="border border-[#cbc6b6] bg-white rounded px-2 py-1 flex-1 sm:flex-none"
          >
            <option value="nama">Nama A-Z</option>
            <option value="harga">Harga termurah</option>
            <option value="rating">Rating tertinggi</option>
            {tab === "Favorit" && (
              <>
                <option value="favoritBaru">Favorit terbaru</option>
                <option value="favoritLama">Favorit terlama</option>
              </>
            )}
          </select>
        </label>
      </div>

      {hasil.length === 0 ? (
        <div className="text-center py-16 text-[#6e7366]">
          <Search className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>
            {tab === "Favorit"
              ? "Belum ada menu favorit. Tekan ikon hati di kartu menu."
              : "Menu tidak ditemukan. Coba kata kunci lain."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {hasil.map((item) => (
            <MenuCard
              key={item.id}
              menu={item}
              stok={stokGudang(item.id)}
              sisa={sisaStok(item.id)}
              disukai={favorit.some((f) => f.id === item.id)}
              onFavorit={onFavorit}
              onInfo={setMenuInfo}
              onKomentar={bukaKomentar}
              onTambah={tambah}
            />
          ))}
        </div>
      )}

      {/* popup info menu */}
      <Modal
        judul="Info Menu"
        buka={menuInfo !== null}
        onTutup={() => setMenuInfo(null)}
      >
        {menuInfo && (
          <div>
            <img
              src={menuInfo.image}
              alt={menuInfo.name}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h4 className="text-lg font-bold">{menuInfo.name}</h4>

            <div className="text-sm space-y-1.5 mb-3">
              <div className="flex justify-between">
                <span className="text-[#6e7366]">Kategori</span>
                <span>{menuInfo.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6e7366]">Harga</span>
                <span className="text-[#a91b0d] font-semibold">{formatRupiah(menuInfo.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6e7366]">Stok</span>
                <span>{stokGudang(menuInfo.id)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6e7366]">Rating</span>
                <span className="flex items-center gap-2">
                  <StarRating nilai={Math.round(menuInfo.rating)} />
                  <span className="text-xs">{menuInfo.rating}</span>
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-4">{menuInfo.description}</p>

            <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Ulasan ({ulasanMenu.length})
            </h5>

            {ulasanMenu.length === 0 ? (
              <p className="text-xs text-[#6e7366]">Belum ada ulasan.</p>
            ) : (
              <ul className="space-y-2">
                {ulasanMenu.map((u) => (
                  <li key={u.id} className="bg-[#f5f2e9] rounded p-2">
                    <div className="flex items-center justify-between">
                      <StarRating nilai={u.rating} ukuran="w-3 h-3" />
                      <span className="text-[10px] text-[#8b9080]">{u.waktu}</span>
                    </div>
                    <p className="text-sm mt-1">{u.teks}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>

      {/* popup komentar */}
      <Modal
        judul={`Komentar ${menuKomentar ? "- " + menuKomentar.name : ""}`}
        buka={menuKomentar !== null}
        onTutup={() => setMenuKomentar(null)}
      >
        {menuKomentar && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img
                src={menuKomentar.image}
                alt={menuKomentar.name}
                className="w-10 h-10 rounded object-cover"
              />
              <span className="text-sm font-medium">{menuKomentar.name}</span>
            </div>

            <p className="text-sm text-[#6e7366] mt-3 mb-1">Beri rating</p>
            <StarRating nilai={ratingBaru} onUbah={setRatingBaru} ukuran="w-6 h-6" />

            <textarea
              value={teksBaru}
              onChange={(e) => {
                setTeksBaru(e.target.value);
                setErrorKomentar("");
              }}
              placeholder="Tulis komentar (minimal 5 karakter)..."
              rows="3"
              className="w-full mt-3 p-2 text-sm border border-[#cbc6b6] rounded outline-none focus:border-[#6c7458]"
            />

            {errorKomentar && (
              <p className="text-xs text-[#a91b0d] mt-1">{errorKomentar}</p>
            )}

            <button
              onClick={kirimKomentar}
              className="w-full mt-2 bg-[#6c7458] text-white text-sm py-2 rounded hover:bg-[#5a6149]"
            >
              Kirim Komentar
            </button>

            <div className="mt-4 pt-3 border-t border-[#e2ddd0]">
              <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#e0a526] text-[#e0a526]" />
                Komentar ({ulasanKomentar.length})
              </h5>

              {ulasanKomentar.length === 0 ? (
                <p className="text-xs text-[#6e7366]">
                  Belum ada komentar. Jadi yang pertama!
                </p>
              ) : (
                <ul className="space-y-2">
                  {ulasanKomentar.map((u) => (
                    <li key={u.id} className="bg-[#f5f2e9] rounded p-2">
                      <div className="flex items-center justify-between">
                        <StarRating nilai={u.rating} ukuran="w-3 h-3" />
                        <span className="text-[10px] text-[#8b9080]">
                          {u.waktu}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{u.teks}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default MainContent;
