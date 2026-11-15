import { Info, Heart, MessageCircle, Plus, Star, ShoppingCart } from "lucide-react";
import { formatRupiah } from "../utils/pricing";

const MenuCard = ({
  menu,
  stok,
  sisa,
  disukai,
  onFavorit,
  onInfo,
  onKomentar,
  onTambah,
}) => {
  const habis = sisa <= 0;

  return (
    <div className="bg-white border border-[#d8d2c3] rounded-lg overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={menu.image}
          alt={menu.name}
          className="w-full h-40 object-cover bg-[#ddd8ca]"
        />
        <span className="absolute top-2 left-2 bg-[#3a3f33] text-white text-[11px] px-2 py-0.5 rounded">
          {menu.category}
        </span>
        {habis && (
          <span className="absolute top-2 right-2 bg-[#a91b0d] text-white text-[11px] px-2 py-0.5 rounded">
            Stok habis
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex justify-between gap-2">
          <h3 className="font-semibold text-[15px] leading-tight">{menu.name}</h3>
          <span className="flex items-center gap-1 text-xs text-[#6e7366] shrink-0">
            <Star className="w-3 h-3 fill-[#e0a526] text-[#e0a526]" />
            {menu.rating}
          </span>
        </div>

        <p className="text-[#6e7366] text-xs mt-1 line-clamp-2">
          {menu.description}
        </p>

        <p className="font-bold text-[#a91b0d] mt-2">{formatRupiah(menu.price)}</p>
        <p className="text-[11px] text-[#8b9080]">
          Stok: {stok}
          {sisa === 0 && stok > 0 ? " (semua di keranjang)" : ""}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e7e2d6]">
          <div className="flex gap-1">
            <button
              onClick={() => onInfo(menu)}
              title="Info"
              className="p-1.5 rounded bg-[#f1eee6] text-[#6c7458] hover:bg-[#e3dfd2]"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={() => onFavorit(menu)}
              title="Favorit"
              className={`p-1.5 rounded ${
                disukai
                  ? "bg-[#f3ded9] text-[#a91b0d]"
                  : "bg-[#f1eee6] text-[#6c7458] hover:bg-[#e3dfd2]"
              }`}
            >
              <Heart className={`w-4 h-4 ${disukai ? "fill-[#a91b0d]" : ""}`} />
            </button>

            <button
              onClick={() => onKomentar(menu)}
              title="Komentar"
              className="p-1.5 rounded bg-[#f1eee6] text-[#6c7458] hover:bg-[#e3dfd2]"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onTambah(menu)}
            disabled={habis}
            className={`text-xs px-2.5 py-1.5 rounded flex items-center gap-1 ${
              habis
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#6c7458] text-white hover:bg-[#5a6149]"
            }`}
          >
            {habis ? (
              <Plus className="w-3.5 h-3.5" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
            {habis ? "Habis" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
