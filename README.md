<div align="center">

# 🏛️ MustG.id
### Platform Wisata & E-Tiket Premium Yogyakarta

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Laravel](https://img.shields.io/badge/Backend-Laravel%2010-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*MustG.id adalah platform pemesanan tiket wisata dan paket tur premium berbasis web untuk mengeksplorasi keindahan Daerah Istimewa Yogyakarta dan sekitarnya dengan pengalaman pengguna modern, bersih, dan mewah ala Airbnb & Klook.*

---

</div>

## 📌 Daftar Isi
- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Arsitektur & Teknologi](#️-arsitektur--teknologi)
- [📂 Struktur Direktori](#-struktur-direktori)
- [🚀 Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
  - [Prasyarat Sistem](#1-prasyarat-sistem)
  - [Setup Database](#2-setup-database)
  - [Setup Backend (Laravel)](#3-setup-backend-laravel)
  - [Setup Frontend (React + Vite)](#4-setup-frontend-react--vite)
- [📡 Dokumentasi API](#-dokumentasi-api)
- [🎨 Konsep Desain & Redesign UI](#-konsep-desain--redesign-ui)
- [🔧 Troubleshooting](#-troubleshooting)
- [👥 Kontributor & Lisensi](#-kontributor--lisensi)

---

## ✨ Fitur Utama

- **🏖️ Katalog Destinasi HD 4K:**
  Kurasi foto autentik beresolusi tinggi untuk destinasi populer Yogyakarta (Candi Prambanan, Candi Borobudur, Merapi Lava Tour Jeep, Obelix Hills, Keraton Ngayogyakarta, Taman Sari Water Castle, HeHa Sky View, Tebing Breksi, dan Sindu Kusuma Edupark).
- **🔍 Filter & Pencarian Cerdas:**
  Pencarian nama tempat seketika, slider filter rentang budget harga (Rp 0 - Rp 250.000+), serta filter kategori (Budaya, Alam, Edukasi, Petualangan, dsb).
- **⚡ Form Pemesanan Interaktif:**
  Widget pemesanan di Homepage dengan pemilihan tanggal dinamis, dropdown destinasi & jenis tiket, serta kalkulasi total harga tiket secara *real-time*.
- **📦 Paket Wisata & Custom Tour Planner:**
  Tersedia pilihan paket wisata hemat *all-in-one*, rental kendaraan (Avanza, Innova, HiAce), booking pemandu wisata berlisensi, serta formulir pembuat paket tur kustom.
- **💳 Alur Checkout & Pembayaran Lengkap:**
  Simulasi alur transaksi lengkap dengan progress bar 3-langkah, ringkasan rincian pesanan, dan metode pembayaran (QRIS, Transfer Virtual Account BCA/Mandiri/BNI/BRI, E-Wallet GoPay/OVO/Dana).
- **🎫 Digital Boarding Pass & QR Code:**
  Tiket elektronik resmi berdesain kartu *boarding pass* dilengkapi kode QR unik, info gerbang akses, barcode tiket, serta tombol unduh tiket.
- **❤️ Wishlist & Tiket Saya:**
  Penyimpanan destinasi favorit dengan badge penghitung animasi pada navbar, serta halaman manajemen tiket yang sudah dipesan.
- **🤖 MustG AI Assistant:**
  Widget asisten pintar mengambang *(floating chat)* yang siap memberikan rekomendasi rencana perjalanan (*itinerary*) dan tips liburan terbaik di Jogja.
- **📱 Desain Modern Luxury & Responsif:**
  Menggunakan tipografi modern *Plus Jakarta Sans* & *Outfit*, efek kartu *glassmorphism*, micro-interaction halus, serta tata letak responsif untuk desktop, tablet, maupun smartphone.

---

## 🛠️ Arsitektur & Teknologi

### **Frontend**
- **Library:** [React.js 18](https://reactjs.org/)
- **Tooling / Bundler:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router DOM v6](https://reactrouter.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (sinkronisasi lokal & persistensi state aplikasi)
- **Styling:** Vanilla CSS murni dengan CSS Variables, Glassmorphism, dan Animasi Modern
- **Icons:** [Lucide React](https://lucide.dev/)
- **Tipografi:** Google Fonts (*Outfit* & *Plus Jakarta Sans*)

### **Backend**
- **Framework:** [Laravel 10](https://laravel.com/)
- **Bahasa:** PHP 8.1 / 8.2 / 8.3
- **Autentikasi:** Laravel Sanctum (Token-based API Authentication)
- **ORM:** Eloquent ORM
- **Database:** MySQL / MariaDB (via Laragon / XAMPP)

---

## 📂 Struktur Direktori

```plaintext
Mustg.id/
├── mustg-backend/                   # Backend REST API (Laravel 10)
│   ├── app/
│   │   ├── Http/Controllers/        # Controller API (AuthController, DestinationController, dll.)
│   │   └── Models/                  # Eloquent Models (Destination, TicketType, Order, Package, dll.)
│   ├── config/                      # Konfigurasi aplikasi
│   ├── database/
│   │   ├── migrations/              # Skema tabel database
│   │   └── seeders/                 # Data awal destinasi, tiket, tour guide, dan paket
│   ├── routes/
│   │   └── api.php                  # Endpoint RESTful API
│   ├── .env.example                 # Template konfigurasi environment backend
│   └── composer.json                # Dependensi PHP backend
│
├── mustg-react/                     # Frontend Client Web (React + Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Navbar, Footer
│   │   │   └── ui/                  # DestinationCard, BookingForm, AIChat, ReviewCard, dll.
│   │   ├── data/                    # Data fallback & katalog foto HD (destinations.js, packages.js)
│   │   ├── pages/                   # Halaman aplikasi:
│   │   │   ├── HomePage.jsx         # Hero, Stats, Booking Widget, Destinasi Unggulan, Testimoni
│   │   │   ├── DestinationsPage.jsx # Katalog filter destinasi dengan budget slider
│   │   │   ├── PackagesPage.jsx     # Paket tur, rental kendaraan, & custom tour planner
│   │   │   ├── CheckoutPage.jsx     # Form data pemesan & review tiket
│   │   │   ├── PaymentPage.jsx      # Pilihan metode pembayaran (QRIS, VA Bank, E-Wallet)
│   │   │   ├── ReceiptPage.jsx      # Digital Boarding Pass dengan QR Code
│   │   │   └── MyTicketsPage.jsx    # Riwayat tiket aktif & tersimpan
│   │   ├── services/                # Handler komunikasi API (api.js)
│   │   ├── store/                   # Zustand store (appStore.js)
│   │   └── styles/                  # CSS tokens & globals.css
│   ├── index.html                   # Entry point HTML & Google Fonts
│   ├── package.json                 # Dependensi Node.js frontend
│   └── vite.config.js               # Konfigurasi Vite & API reverse proxy ke port 8000
│
├── .gitignore                       # Rule git ignore (vendor, node_modules, .env)
└── README.md                        # Dokumentasi proyek lengkap
```

---

## 🚀 Panduan Instalasi & Menjalankan

Ikuti panduan langkah demi langkah di bawah ini untuk menjalankan proyek pada komputer lokal:

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
- **Node.js** (versi 18.x atau lebih baru) & **npm**
- **PHP** (versi 8.1, 8.2, atau 8.3)
- **Composer** (versi 2.x)
- **Laragon** atau **XAMPP** (dengan layanan Apache & MySQL aktif)
- **Git**

---

### 2. Setup Database
1. Buka **Laragon** atau **XAMPP**, lalu klik **Start All** (pastikan MySQL berjalan di port `3306`).
2. Buka phpMyAdmin atau database manager pilihan Anda (HeidiSQL/DBeaver), lalu buat database baru:
   ```sql
   CREATE DATABASE mustg_db;
   ```

---

### 3. Setup Backend (Laravel)

1. Buka terminal dan masuk ke direktori backend:
   ```bash
   cd mustg-backend
   ```
2. Buat file `.env` dari contoh template:
   ```powershell
   Copy-Item .env.example .env
   # atau jika menggunakan bash / command prompt:
   # cp .env.example .env
   ```
3. Sesuaikan konfigurasi database pada file `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=mustg_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. Install dependensi PHP menggunakan Composer:
   ```bash
   composer install
   ```
5. Generate application encryption key:
   ```bash
   php artisan key:generate
   ```
6. Jalankan migrasi tabel beserta seed data awal:
   ```bash
   php artisan migrate --seed
   ```
7. Jalankan server lokal backend:
   ```bash
   php artisan serve
   ```
   > 📍 Backend akan berjalan di: **`http://127.0.0.1:8000`**

---

### 4. Setup Frontend (React + Vite)

1. Buka terminal baru (biarkan server backend tetap berjalan), lalu masuk ke direktori frontend:
   ```bash
   cd mustg-react
   ```
2. Install dependensi Node.js:
   ```bash
   npm install
   ```
3. Jalankan server development:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses aplikasi:
   > 🌐 **`http://localhost:5173`**

*(Catatan: Permintaan `/api/*` dari React secara otomatis diteruskan ke backend `http://127.0.0.1:8000` melalui proxy yang telah dikonfigurasi pada `vite.config.js`).*

---

## 📡 Dokumentasi API

Backend Laravel menyediakan endpoint REST API untuk melayani frontend:

| Method | Endpoint | Deskripsi | Autentikasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Mendaftarkan akun pengguna baru | Publik |
| `POST` | `/api/auth/login` | Masuk dan mendapatkan Bearer token | Publik |
| `POST` | `/api/auth/logout` | Revoke token dan keluar akun | Bearer Token |
| `GET` | `/api/auth/me` | Mengambil profil user yang sedang login | Bearer Token |
| `GET` | `/api/destinations` | Mendapatkan seluruh daftar destinasi wisata | Publik |
| `GET` | `/api/destinations/{id}` | Mengambil detail destinasi spesifik | Publik |
| `GET` | `/api/destinations/{id}/tickets` | Mengambil opsi tiket pada suatu destinasi | Publik |
| `GET` | `/api/transports` | Daftar opsi sewa armada transportasi | Publik |
| `GET` | `/api/tour-guides` | Daftar pemandu wisata lokal bersertifikat | Publik |
| `GET` | `/api/packages` | Daftar paket tur wisata bundled | Publik |
| `POST` | `/api/orders` | Membuat transaksi pesanan tiket baru | Publik / Opsional |
| `GET` | `/api/orders/{code}` | Mengambil status dan detail tiket pesanan | Publik |

---

## 🎨 Konsep Desain & Redesign UI

Antarmuka web MustG.id dirancang ulang dengan standar estetika tinggi:
- **Warna & Suasana:** Mengadopsi palet modern *Ocean Blue* (`#0284c7`), *Deep Slate* (`#0f172a`), dan aksen *Emerald Green* (`#059669`) untuk memberikan kesan premium, segar, dan terpercaya.
- **Tipografi:** Google Font *Plus Jakarta Sans* untuk keterbacaan teks dan angka harga, serta *Outfit* untuk judul dan banner promo.
- **Card Design:** Rasio gambar `16:10` dengan tag chip semi-transparan, badge ulasan bintang, dan animasi hover angkat kartu (*subtle float*).
- **Fallback Data Handal:** Jika server backend sedang tidak aktif, aplikasi frontend tetap dapat beroperasi menggunakan mock data resolusi tinggi bawaan sehingga proses presentasi dan review UI tidak pernah terganggu.

---

## 🔧 Troubleshooting

### 1. Error `vendor/autoload.php: Failed to open stream`
*Penyebab:* Dependensi backend belum terunduh.  
*Solusi:* Masuk ke folder `mustg-backend` lalu jalankan perintah `composer install`.

### 2. Error `Access denied for user 'root'@'localhost'`
*Penyebab:* Password MySQL di `.env` berbeda dengan konfigurasi MySQL lokal Anda.  
*Solusi:* Periksa file `mustg-backend/.env` pada baris `DB_PASSWORD=` dan sesuaikan dengan password MySQL Anda (kosongkan jika menggunakan Laragon bawaan).

### 3. Halaman Frontend tidak menampilkan data destinasi dari backend
*Penyebab:* Server backend `php artisan serve` belum berjalan di port `8000`.  
*Solusi:* Jalankan `php artisan serve` pada terminal backend, pastikan output menampilkan `Server running on [http://127.0.0.1:8000]`.

---

## 👥 Kontributor & Lisensi

Dikembangkan dengan dedikasi untuk pariwisata Yogyakarta oleh:
- **MustG.id Development Team** ([@syifamwlda](https://github.com/syifamwlda))

Proyek ini dilisensikan di bawah lisensi **MIT License** — Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini untuk keperluan edukasi maupun komersial.

<div align="center">
  <sub>Dibuat dengan ❤️ untuk kemajuan pariwisata Daerah Istimewa Yogyakarta</sub>
</div>
