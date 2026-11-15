import { Star } from "lucide-react";

// Kalau dikasih onUbah, bintangnya bisa diklik (dipakai di form komentar)
const StarRating = ({ nilai = 0, onUbah, ukuran = "w-4 h-4" }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((bintang) => (
        <button
          key={bintang}
          type="button"
          disabled={!onUbah}
          onClick={() => onUbah && onUbah(bintang)}
          className={onUbah ? "cursor-pointer" : "cursor-default"}
          title={onUbah ? `${bintang} bintang` : undefined}
        >
          <Star
            className={`${ukuran} ${
              bintang <= nilai
                ? "fill-[#e0a526] text-[#e0a526]"
                : "text-[#cbc6b6]"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
