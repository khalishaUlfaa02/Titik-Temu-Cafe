export const PROMO = [
  { code: "UTS25", percent: 25, note: "Potongan 25%" },
  { code: "HEMAT10", percent: 10, note: "Potongan 10%" },
  { code: "KOPI15", percent: 15, note: "Potongan 15%" },
];

export const TAX_PERCENT = 10;

export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

export function cariPromo(code) {
  const cari = PROMO.find((p) => p.code === String(code).trim().toUpperCase());
  return cari || null;
}

export function hitungTotal(subtotal, promo) {
  const diskon = promo ? (subtotal * promo.percent) / 100 : 0;
  const kenaPajak = subtotal - diskon;
  const pajak = (kenaPajak * TAX_PERCENT) / 100;
  return {
    subtotal,
    diskon,
    pajak,
    total: kenaPajak + pajak,
  };
}
