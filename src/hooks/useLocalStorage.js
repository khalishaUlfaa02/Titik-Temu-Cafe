import { useEffect, useState } from "react";

// custom hook: state yang otomatis disimpan ke localStorage
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const simpanan = window.localStorage.getItem(key);
      return simpanan ? JSON.parse(simpanan) : initialValue;
    } catch (error) {
      console.log("gagal baca localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("gagal simpan localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}
