import { Mail, Instagram, Github } from "lucide-react";

// ==== GANTI LINK DI BAWAH DENGAN PUNYAMU SENDIRI ====
const KONTAK = [
  { nama: "Email", href: "mailto:khalishaulfaa@gmail.com", ikon: Mail },
  { nama: "Instagram", href: "https://instagram.com/khalishaulfaa", ikon: Instagram },
  { nama: "GitHub", href: "https://github.com/khalishaUlfaa02", ikon: Github },
];

const Footer = () => {
  return (
    <footer className="bg-[#3a3f33] text-[#d5d1c3] mt-8 border-t-4 border-[#a91b0d]">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-[#e6e2d7]">
            Titik Temu<span className="text-[#a91b0d]">.</span>
          </p>
          <p className="text-xs text-[#8b9080]">kopi &amp; camilan</p>
        </div>

        <div className="flex items-center gap-4">
          {KONTAK.map(({ nama, href, ikon: Ikon }) => (
            <a
              key={nama}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              title={nama}
              className="flex items-center gap-1.5 hover:text-[#a91b0d]"
            >
              <Ikon className="w-4 h-4" />
              <span className="hidden sm:inline">{nama}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-[#8b9080] pb-4">
        &copy; 2026 Titik Temu &middot; Dibuat untuk UTS React Fundamental
      </div>
    </footer>
  );
};

export default Footer;
