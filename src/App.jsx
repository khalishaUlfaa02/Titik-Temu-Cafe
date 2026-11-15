import { useMemo, useState } from "react";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { NotificationProvider, useNotification } from "./context/NotificationContext";
import { useToast } from "./context/ToastContext";
import useLocalStorage from "./hooks/useLocalStorage";
import menu from "./data/menu";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import CartDrawer from "./components/CartDrawer";
import HistoryModal from "./components/HistoryModal";
import NotificationsModal from "./components/NotificationsModal";

function IsiApp() {
  const [kataKunci, setKataKunci] = useState("");
  const [tab, setTab] = useState("Semua");
  const [favorit, setFavorit] = useLocalStorage("titiktemu-favorit", []);

  const [keranjangBuka, setKeranjangBuka] = useState(false);
  const [riwayatBuka, setRiwayatBuka] = useState(false);
  const [notifBuka, setNotifBuka] = useState(false);

  const { showToast } = useToast();
  const {
    notifications,
    jumlahBelumDibaca,
    tambahNotifikasi,
    tandaiSemuaDibaca,
    hapusSemuaNotifikasi,
  } = useNotification();

  const jumlahKategori = useMemo(() => {
    const hasil = { Semua: menu.length, Favorit: favorit.length };
    ["Kopi", "Non-Kopi", "Makanan", "Snack"].forEach((k) => {
      hasil[k] = menu.filter((m) => m.category === k).length;
    });
    return hasil;
  }, [favorit.length]);

  const gantiFavorit = (item) => {
    const sudah = favorit.some((f) => f.id === item.id);
    if (sudah) {
      setFavorit((prev) => prev.filter((f) => f.id !== item.id));
      showToast(`${item.name} dihapus dari favorit`, "info");
      tambahNotifikasi("Favorit", `${item.name} dihapus dari favorit`);
    } else {
      setFavorit((prev) => [{ id: item.id, pada: Date.now() }, ...prev]);
      showToast(`${item.name} masuk favorit`, "sukses");
      tambahNotifikasi("Favorit", `${item.name} ditambahkan ke favorit`);
    }
  };

  const bukaNotif = () => {
    setNotifBuka(true);
    tandaiSemuaDibaca();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        kataKunci={kataKunci}
        onCari={setKataKunci}
        tab={tab}
        onGantiTab={setTab}
        jumlahKategori={jumlahKategori}
        jumlahNotif={jumlahBelumDibaca}
        onBukaKeranjang={() => setKeranjangBuka(true)}
        onBukaRiwayat={() => setRiwayatBuka(true)}
        onBukaNotif={bukaNotif}
      />

      <MainContent
        kataKunci={kataKunci}
        tab={tab}
        favorit={favorit}
        onFavorit={gantiFavorit}
      />

      <Footer />

      <CartDrawer
        buka={keranjangBuka}
        onTutup={() => setKeranjangBuka(false)}
        onBukaRiwayat={() => {
          setKeranjangBuka(false);
          setRiwayatBuka(true);
        }}
      />

      <HistoryModal
        buka={riwayatBuka}
        onTutup={() => setRiwayatBuka(false)}
        onBukaKeranjang={() => {
          setRiwayatBuka(false);
          setKeranjangBuka(true);
        }}
      />

      <NotificationsModal
        buka={notifBuka}
        onTutup={() => setNotifBuka(false)}
        notifikasi={notifications}
        onHapusSemua={hapusSemuaNotifikasi}
      />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <NotificationProvider>
          <IsiApp />
        </NotificationProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
