import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import introJs from "intro.js";
import "intro.js/minified/introjs.min.css";
import { useAuth } from "@/context/AuthContext";

const STORAGE = {
  guest: "peronline_intro_guest",
  buyer: "peronline_intro_buyer",
  seller: "peronline_intro_seller",
  admin: "peronline_intro_admin"
};

const STEPS_GUEST = {
  "/": [
    { element: "[data-intro-home-categories]", intro: "Filter komoditas pertanian di beranda buyer." },
    { element: "[data-intro-home-banner]", intro: "Banner promosi dari seller tampil di sini." },
    { element: "[data-intro-home-komoditas]", intro: "Daftar produk / komoditas yang dijual seller." },
    { element: "[data-intro-home-rooftop]", intro: "Roof Top — lihat harga komoditas per penjual & daerah." }
  ],
  "/akun": [
    {
      element: "[data-intro-account]",
      intro: "Masuk atau daftar akun untuk membeli dan mulai berjualan."
    }
  ]
};

const SELLER_NAV_STEPS = [
  { element: "[data-intro-seller-sidebar]", intro: "Menu utama seller — semua fitur penjualan ada di sini." },
  { element: "[data-intro-seller-nav-home]", intro: "Beranda buyer — lihat tampilan marketplace seperti pembeli." },
  { element: "[data-intro-seller-nav-iklan]", intro: "Dashboard Iklan Saya — ringkasan produk, banner, dan feed aktif." },
  { element: "[data-intro-seller-nav-toko]", intro: "Profil toko — logo, alamat, kontak, dan lokasi." },
  { element: "[data-intro-seller-nav-produk]", intro: "Kelola produk biasa & Roof Top (komoditas pertanian)." },
  { element: "[data-intro-seller-nav-banner]", intro: "Iklan banner — pasang banner di beranda & order paket tayang." },
  { element: "[data-intro-seller-nav-feed]", intro: "Iklan feed — promosikan produk di section Iklan Produk beranda." },
  { element: "[data-intro-seller-nav-akun]", intro: "Akun — profil, premium, dan logout." }
];

const SELLER_DASH_STEPS = [
  {
    element: "[data-intro-seller-stats]",
    intro: "Statistik: jumlah produk aktif, banner tayang, dan iklan feed yang sedang berjalan."
  },
  {
    element: "[data-intro-seller-menu]",
    intro: "Shortcut menu — kelola produk, toko, banner, feed, dan upgrade premium."
  }
];

const SELLER_MOBILE_STEPS = [
  { element: "[data-intro-mobile-seller-home]", intro: "(Mobile) Beranda buyer." },
  { element: "[data-intro-mobile-seller-iklan]", intro: "(Mobile) Dashboard iklan & ringkasan toko." },
  { element: "[data-intro-mobile-seller-toko]", intro: "(Mobile) Profil toko." },
  { element: "[data-intro-mobile-seller-banner]", intro: "(Mobile) Kelola iklan banner." },
  { element: "[data-intro-mobile-seller-akun]", intro: "(Mobile) Halaman akun." }
];

const SELLER_PAGE_STEPS = {
  "/seller/produk": [
    {
      element: "[data-intro-seller-page-produk]",
      intro: "Kelola produk biasa & Roof Top. Gunakan tab untuk beralih tipe produk."
    }
  ],
  "/seller/toko": [
    {
      element: "[data-intro-seller-page-toko]",
      intro: "Lengkapi profil toko agar pembeli percaya — logo, alamat, dan kontak WhatsApp."
    }
  ],
  "/seller/banner": [
    {
      element: "[data-intro-seller-page-banner]",
      intro: "Hub iklan banner: info paket, pricelist, dan kelola banner + order."
    }
  ],
  "/seller/feed": [
    {
      element: "[data-intro-seller-page-feed]",
      intro: "Hub iklan feed: info, harga, dan form order produk ke section Iklan Produk."
    }
  ],
  "/seller/premium": [
    {
      element: "[data-intro-seller-page-premium]",
      intro: "Upgrade premium agar produk tampil di beranda buyer & batas produk lebih besar."
    }
  ]
};

const ADMIN_NAV_STEPS = [
  { element: "[data-intro-admin-sidebar]", intro: "Menu admin — kelola seluruh platform dari sini." },
  { element: "[data-intro-admin-nav-home]", intro: "Beranda buyer — preview tampilan marketplace." },
  { element: "[data-intro-admin-nav-dashboard]", intro: "Dashboard admin — ringkasan statistik platform." },
  { element: "[data-intro-admin-nav-users]", intro: "Kelola user — buyer & seller, termasuk upgrade premium." },
  { element: "[data-intro-admin-nav-categories]", intro: "Kelola komoditas pertanian (kategori produk)." },
  { element: "[data-intro-admin-nav-banner]", intro: "Iklan banner — info, pricelist, kelola banner, order dari seller." },
  { element: "[data-intro-admin-nav-feed]", intro: "Iklan feed — kelola highlight produk & order dari seller." },
  { element: "[data-intro-admin-nav-premium]", intro: "Premium — pricelist, info, dan order upgrade akun seller." },
  { element: "[data-intro-admin-nav-announcements]", intro: "Pengumuman popup untuk buyer/seller." },
  { element: "[data-intro-admin-nav-settings]", intro: "Kontak admin, syarat ketentuan, dan pengaturan umum." },
  { element: "[data-intro-admin-nav-akun]", intro: "Profil akun admin." }
];

const ADMIN_DASH_STEPS = [
  {
    element: "[data-intro-admin-stats]",
    intro: "Statistik platform. Ketuk kartu pending untuk melihat order yang menunggu."
  },
  {
    element: "[data-intro-admin-menu]",
    intro: "Akses cepat ke semua modul admin."
  }
];

const ADMIN_MOBILE_STEPS = [
  { element: "[data-intro-mobile-admin-home]", intro: "(Mobile) Beranda buyer." },
  { element: "[data-intro-mobile-admin-dashboard]", intro: "(Mobile) Dashboard admin." },
  { element: "[data-intro-mobile-admin-settings]", intro: "(Mobile) Pengaturan platform." },
  { element: "[data-intro-mobile-admin-akun]", intro: "(Mobile) Akun admin." }
];

const ADMIN_PAGE_STEPS = {
  "/admin/users": [
    { element: "[data-intro-admin-page-users]", intro: "Daftar user, cari, upgrade/downgrade premium seller." }
  ],
  "/admin/categories": [
    { element: "[data-intro-admin-page-categories]", intro: "Tambah, edit, dan hapus komoditas pertanian." }
  ],
  "/admin/banner": [
    { element: "[data-intro-admin-page-banner]", intro: "Modul iklan banner — kelola konten, harga, banner aktif, dan order." }
  ],
  "/admin/feed": [
    { element: "[data-intro-admin-page-feed]", intro: "Modul iklan feed — aktivasi produk di beranda & order seller." }
  ],
  "/admin/premium": [
    { element: "[data-intro-admin-page-premium]", intro: "Modul premium seller — paket harga dan persetujuan order." }
  ],
  "/admin/announcements": [
    { element: "[data-intro-admin-page-announcements]", intro: "Buat pengumuman popup untuk pengguna aplikasi." }
  ],
  "/admin/settings": [
    { element: "[data-intro-admin-page-settings]", intro: "WhatsApp admin, instruksi bayar, dan syarat ketentuan." }
  ]
};

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function getStorageKey(user) {
  if (!user) return STORAGE.guest;
  if (user.role === "admin") return STORAGE.admin;
  if (user.role === "seller") return STORAGE.seller;
  return STORAGE.buyer;
}

function getSteps(pathname, user) {
  const path = normalizePath(pathname);

  if (!user) return STEPS_GUEST[path] || [];

  if (user.role === "buyer") {
    if (path === "/akun") return [{ element: "[data-intro-account]", intro: "Kelola profil akun buyer Anda." }];
    return STEPS_GUEST[path] || [];
  }

  if (user.role === "seller") {
    if (path === "/akun") {
      return [{ element: "[data-intro-account]", intro: "Profil seller, status premium, jadi seller, dan logout." }];
    }
    const pageSteps = SELLER_PAGE_STEPS[path] || [];
    if (path.startsWith("/seller")) {
      const dashSteps = path === "/seller/iklan" ? SELLER_DASH_STEPS : [];
      return [...SELLER_NAV_STEPS, ...dashSteps, ...SELLER_MOBILE_STEPS, ...pageSteps];
    }
    return STEPS_GUEST[path] || [];
  }

  if (user.role === "admin") {
    if (path === "/akun") {
      return [{ element: "[data-intro-account]", intro: "Profil akun administrator." }];
    }
    const pageSteps = ADMIN_PAGE_STEPS[path] || [];
    if (path.startsWith("/admin")) {
      const dashSteps = path === "/admin" ? ADMIN_DASH_STEPS : [];
      return [...ADMIN_NAV_STEPS, ...dashSteps, ...ADMIN_MOBILE_STEPS, ...pageSteps];
    }
    return STEPS_GUEST[path] || [];
  }

  return [];
}

function startIntro(steps, storageKey) {
  const available = steps.filter((s) => document.querySelector(s.element));
  if (!available.length) return;

  introJs()
    .setOptions({
      steps: available,
      showProgress: true,
      showBullets: false,
      nextLabel: "Lanjut",
      prevLabel: "Kembali",
      doneLabel: "Selesai",
      scrollToElement: true
    })
    .oncomplete(() => localStorage.setItem(storageKey, "1"))
    .onexit(() => localStorage.setItem(storageKey, "1"))
    .start();
}

export default function useAppIntro() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const storageKey = getStorageKey(user);
    if (localStorage.getItem(storageKey)) return undefined;

    const steps = getSteps(pathname, user);
    if (!steps.length) return undefined;

    const timer = setTimeout(() => startIntro(steps, storageKey), 700);

    return () => clearTimeout(timer);
  }, [pathname, user]);
}
