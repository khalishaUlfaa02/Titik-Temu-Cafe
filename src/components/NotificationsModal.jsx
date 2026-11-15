import { X, Bell, Trash2 } from "lucide-react";

const NotificationsModal = ({ buka, onTutup, notifikasi = [], onHapusSemua }) => {
  if (!buka) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2ddd0] sticky top-0 bg-white">
          <h3 className="font-bold flex items-center gap-2">
            <Bell className="w-4 h-4" /> Notifikasi
          </h3>
          <div className="flex items-center gap-1">
            {notifikasi.length > 0 && (
              <button
                onClick={onHapusSemua}
                className="p-1 text-[#8b9080] hover:text-[#a91b0d]"
                title="Hapus semua"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onTutup} className="p-1 hover:bg-[#f1eee6] rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {notifikasi.length === 0 ? (
            <p className="text-sm text-[#6e7366] text-center py-8">
              Belum ada notifikasi.
            </p>
          ) : (
            <ul className="space-y-2">
              {notifikasi.map((n) => (
                <li
                  key={n.id}
                  className="border border-[#e2ddd0] rounded p-2 text-sm"
                >
                  <div className="flex justify-between">
                    <p className="font-medium">{n.judul}</p>
                    <span className="text-[10px] text-[#8b9080]">{n.waktu}</span>
                  </div>
                  <p className="text-[#6e7366] text-xs">{n.pesan}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
