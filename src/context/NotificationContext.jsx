import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useLocalStorage(
    "titiktemu-notifikasi",
    []
  );

  const tambahNotifikasi = (judul, pesan) => {
    const baru = {
      id: Date.now() + Math.random(),
      judul,
      pesan,
      waktu: new Date().toLocaleString("id-ID"),
      dibaca: false,
    };
    setNotifications((prev) => [baru, ...prev].slice(0, 30));
  };

  const jumlahBelumDibaca = notifications.filter((n) => !n.dibaca).length;

  const tandaiSemuaDibaca = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, dibaca: true })));
  };

  const hapusSemuaNotifikasi = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        jumlahBelumDibaca,
        tambahNotifikasi,
        tandaiSemuaDibaca,
        hapusSemuaNotifikasi,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
