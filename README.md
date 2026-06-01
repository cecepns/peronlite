# Peronlite — Frontend Website

Versi web dari aplikasi mobile `frontend/` (React Native / Expo), mengikuti UI mobile dan aturan di `AGENTS.md`.

## Stack

- React 18 + Vite (JSX)
- Tailwind CSS 4
- React Router
- Axios + `src/utils/endpoints.js`
- Lucide React icons
- react-hot-toast
- PWA (vite-plugin-pwa)

## Setup

```bash
nvm use v22.0.0
cd frontend-website
npm install
cp .env.example .env
npm run dev
```

## Environment

| Variable | Default |
|----------|---------|
| `VITE_API_URL` | `https://api.lokaljasa.com` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 5173) |
| `npm run build` | Production build ke `dist/` |
| `npm run preview` | Preview build |

## Fitur

- **Buyer (publik):** Home, banner carousel, filter kategori & kota, detail jasa, etalase toko, profil tamuan
- **Auth:** Login, register, syarat & ketentuan, session localStorage
- **Seller:** Dashboard iklan, kelola toko, produk (CRUD), banner hub, premium pricelist
- **Admin:** Dashboard stats, kelola user (search debounce + pagination), kategori, settings kontak
- **Responsive:** Bottom nav (mobile), sidebar (desktop seller/admin)

## Catatan Node

Project memakai **Vite 5** agar kompatibel dengan Node `v22.0.0` (Vite 8 membutuhkan Node ≥22.12).
# peronlite
