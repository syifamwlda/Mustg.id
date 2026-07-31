# MustG.id — Frontend (React + Vite)

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # Production build
```

## Struktur

```
src/
├── App.jsx                        # Router utama (5 halaman)
├── main.jsx                       # Entry point
├── services/
│   └── api.js                     # ← Semua fetch ke Laravel di sini
├── hooks/
│   └── useDestinations.js         # ← Fetch destinations + fallback lokal
├── data/
│   └── destinations.js            # Data fallback (saat Laravel belum jalan)
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx             # Navbar (Home & Destinations)
│   │   └── Footer.jsx             # Footer + CTA
│   └── ui/
│       ├── DestinationCard.jsx    # Card destinasi (rating, harga, book)
│       └── BookingForm.jsx        # Form booking pill di hero
└── pages/
    ├── HomePage.jsx               # Hero + booking form + destinasi + cara kerja + testimoni
    ├── DestinationsPage.jsx       # Grid semua destinasi + Temukan Favoritmu
    ├── CheckoutPage.jsx           # "Wisata Pilihan" badge, tour detail, form pemesan
    ├── PaymentPage.jsx            # Step indicator, identitas, registered cards, card form
    └── ReceiptPage.jsx            # E-Ticket: foto, field info, QR, Print/Save PDF
```

## Integrasi API

Semua endpoint ada di `src/services/api.js`. Saat Laravel berjalan di port 8000,
Vite proxy otomatis meneruskan `/api/*` ke `http://localhost:8000/api/*`.

Jika Laravel belum jalan, `useDestinations` hook fallback ke data lokal di `data/destinations.js`.
