import { createContext, useContext, useEffect, useReducer } from "react";
import menu from "../data/menu";
import { hitungTotal } from "../utils/pricing";

const CartContext = createContext(null);

function stokAwal() {
  const hasil = {};
  menu.forEach((m) => {
    hasil[m.id] = m.stock;
  });
  return hasil;
}

function bacaSimpanan(key, cadangan) {
  try {
    const isi = window.localStorage.getItem(key);
    return isi ? JSON.parse(isi) : cadangan;
  } catch {
    return cadangan;
  }
}

const stateAwal = {
  items: bacaSimpanan("titiktemu-keranjang", []),
  stok: bacaSimpanan("titiktemu-stok", stokAwal()),
  promo: bacaSimpanan("titiktemu-promo", null),
  riwayat: bacaSimpanan("titiktemu-riwayat", []),
};

function cartReducer(state, action) {
  switch (action.type) {
    case "TAMBAH": {
      const m = action.menu;
      const itemAda = state.items.find((i) => i.id === m.id);
      const qtySekarang = itemAda ? itemAda.qty : 0;

      // jangan lewat dari stok
      if (qtySekarang >= state.stok[m.id]) {
        return state;
      }

      if (itemAda) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === m.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          { id: m.id, name: m.name, price: m.price, image: m.image, qty: 1 },
        ],
      };
    }

    case "KURANGI": {
      const item = state.items.find((i) => i.id === action.id);
      if (!item) return state;
      if (item.qty <= 1) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty - 1 } : i
        ),
      };
    }

    case "HAPUS":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case "PROMO":
      return { ...state, promo: action.promo };

    case "BAYAR": {
      if (state.items.length === 0) return state;

      const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
      const rincian = hitungTotal(subtotal, state.promo);

      const pesanan = {
        id: "INV-" + Date.now(),
        waktu: new Date().toLocaleString("id-ID"),
        items: state.items,
        ...rincian,
        promo: state.promo ? state.promo.code : "-",
      };

      const stokBaru = { ...state.stok };
      state.items.forEach((i) => {
        stokBaru[i.id] = Math.max(0, stokBaru[i.id] - i.qty);
      });

      return {
        ...state,
        items: [],
        promo: null,
        stok: stokBaru,
        riwayat: [pesanan, ...state.riwayat],
      };
    }

    case "RESET":
      return {
        items: [],
        promo: null,
        stok: stokAwal(),
        riwayat: [],
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, stateAwal);

  useEffect(() => {
    localStorage.setItem("titiktemu-keranjang", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    localStorage.setItem("titiktemu-stok", JSON.stringify(state.stok));
  }, [state.stok]);

  useEffect(() => {
    localStorage.setItem("titiktemu-promo", JSON.stringify(state.promo));
  }, [state.promo]);

  useEffect(() => {
    localStorage.setItem("titiktemu-riwayat", JSON.stringify(state.riwayat));
  }, [state.riwayat]);

  const totalItem = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const rincian = hitungTotal(subtotal, state.promo);

  // stok yang masih bisa ditambah (stok gudang dikurangi yang sudah di keranjang)
  const sisaStok = (id) => {
    const item = state.items.find((i) => i.id === id);
    const diKeranjang = item ? item.qty : 0;
    return Math.max(0, (state.stok[id] ?? 0) - diKeranjang);
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        totalItem,
        subtotal,
        rincian,
        sisaStok,
        stokGudang: (id) => state.stok[id] ?? 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
