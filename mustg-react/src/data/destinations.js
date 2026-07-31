export const formatIDR = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export const categories = ['all']

export const destinations = [
  {
    id: 'local-1', name: 'Prambanan', city: 'Yogyakarta', openHours: '06:00–17:00', category: 'Budaya',
    description: 'Kompleks candi Hindu terbesar di Indonesia, warisan budaya dunia UNESCO yang menakjubkan.',
    thumbnail_url: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?q=80&w=1106&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8, reviewCount: 2840, startPrice: 50000, hotels: 1, transfers: 2, activities: 4,
    tags: ['UNESCO','Sejarah','Foto'],
    tickets: [{ id: 'lt1a', name: 'Tiket Dewasa', price: 50000 }, { id: 'lt1b', name: 'Tiket Anak', price: 30000 }]
  },
  {
    id: 'local-2', name: 'Borobudur', city: 'Magelang', openHours: '06:30–17:00', category: 'Budaya',
    description: 'Candi Buddha terbesar di dunia dan ikon wisata Indonesia yang memukau.',
    thumbnail_url: 'https://images.unsplash.com/photo-1575654816049-ccce08673fd1?w=800&q=80',
    rating: 4.9, reviewCount: 5120, startPrice: 75000, hotels: 1, transfers: 3, activities: 4,
    tags: ['UNESCO','Sunrise','Ikonik'],
    tickets: [{ id: 'lt2a', name: 'Tiket Masuk', price: 75000 }, { id: 'lt2b', name: 'Tiket Pelajar', price: 50000 }]
  },
  {
    id: 'local-3', name: 'Obelix Hills', city: 'Yogyakarta', openHours: '10:00–22:00', category: 'Alam',
    description: 'Panorama perbukitan & sunset terbaik Yogyakarta dari ketinggian.',
    thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    rating: 4.7, reviewCount: 1340, startPrice: 25000, hotels: 0, transfers: 1, activities: 3,
    tags: ['Sunset','View','Premium'],
    tickets: [{ id: 'lt3a', name: 'Tiket Masuk', price: 25000 }]
  },
  {
    id: 'local-4', name: 'Merapi Park', city: 'Sleman', openHours: '09:00–17:00', category: 'Alam',
    description: 'Jelajahi keindahan sekitar Gunung Merapi dengan jeep adventure yang mendebarkan.',
    thumbnail_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    rating: 4.7, reviewCount: 4560, startPrice: 75000, hotels: 1, transfers: 2, activities: 4,
    tags: ['Adventure','Jeep','Volcano'],
    tickets: [{ id: 'lt4a', name: 'Tiket Dewasa', price: 75000 }, { id: 'lt4b', name: 'Tiket Anak', price: 55000 }]
  },
  {
    id: 'local-5', name: 'Keraton Yogyakarta', city: 'Yogyakarta', openHours: '08:00–14:00', category: 'Budaya',
    description: 'Istana Sultan Yogyakarta yang megah, pusat kebudayaan Jawa yang penuh sejarah.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    rating: 4.6, reviewCount: 2100, startPrice: 15000, hotels: 0, transfers: 1, activities: 3,
    tags: ['Sejarah','Budaya','Museum'],
    tickets: [{ id: 'lt5a', name: 'Tiket Lokal', price: 15000 }, { id: 'lt5b', name: 'Tiket Pelajar', price: 8000 }, { id: 'lt5c', name: 'Tiket Asing', price: 25000 }]
  },
  {
    id: 'local-6', name: 'Water Castle (Taman Sari)', city: 'Yogyakarta', openHours: '09:00–15:00', category: 'Budaya',
    description: 'Taman air peninggalan Keraton dengan arsitektur heritage Jawa-Eropa yang unik.',
    thumbnail_url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&q=80',
    rating: 4.6, reviewCount: 1560, startPrice: 15000, hotels: 0, transfers: 1, activities: 2,
    tags: ['Heritage','Foto','Arsitektur'],
    tickets: [{ id: 'lt6a', name: 'Tiket Masuk', price: 15000 }]
  },
  {
    id: 'local-7', name: 'Sindu Kusuma Edupark', city: 'Yogyakarta', openHours: '15:00–22:00', category: 'Hiburan',
    description: 'Taman hiburan keluarga dengan bianglala besar dan wahana seru yang menyenangkan.',
    thumbnail_url: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800&q=80',
    rating: 4.8, reviewCount: 1890, startPrice: 30000, hotels: 0, transfers: 2, activities: 4,
    tags: ['Keluarga','Wahana','Malam'],
    tickets: [{ id: 'lt7a', name: 'Tiket Masuk', price: 30000 }, { id: 'lt7b', name: 'Tiket Anak', price: 20000 }]
  },
  {
    id: 'local-8', name: 'HeHa Sky View', city: 'Gunungkidul', openHours: '10:00–21:00', category: 'Alam',
    description: 'Wisata hits dengan view kota dari ketinggian, cocok untuk sunset dan foto malam.',
    thumbnail_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    rating: 4.8, reviewCount: 2200, startPrice: 20000, hotels: 0, transfers: 2, activities: 4,
    tags: ['Sunset','City View','Foto'],
    tickets: [{ id: 'lt8a', name: 'Tiket Masuk', price: 20000 }]
  },
  {
    id: 'local-9', name: 'Tebing Breksi', city: 'Sleman', openHours: '06:00–18:00', category: 'Alam',
    description: 'Bekas tambang batu yang disulap jadi wisata alam unik dengan ukiran artistik memukau.',
    thumbnail_url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80',
    rating: 4.7, reviewCount: 980, startPrice: 10000, hotels: 0, transfers: 2, activities: 2,
    tags: ['Unik','Alam','Seni'],
    tickets: [{ id: 'lt9a', name: 'Tiket Masuk', price: 10000 }]
  },
]

// Paket Bundling (Tiket + Transport + Guide)
export const packages = [
  { id: 'pkg-1', name: 'Paket Jogja Heritage 1 Hari', category: 'Budaya', price: 350000, originalPrice: 450000, thumbnail: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80', includes: ['Tiket Prambanan', 'Tiket Keraton', 'Tiket Taman Sari', 'Transport PP', 'Tour Guide'], duration: '1 Hari', pax: 'Min. 2 orang', badge: 'TERLARIS' },
  { id: 'pkg-2', name: 'Paket Borobudur Sunrise', category: 'Budaya', price: 450000, originalPrice: 580000, thumbnail: 'https://images.unsplash.com/photo-1575654816049-ccce08673fd1?w=800&q=80', includes: ['Tiket Borobudur', 'Transport PP', 'Sarapan Lokal', 'Tour Guide', 'Fotografer'], duration: '1 Hari', pax: 'Min. 2 orang', badge: 'POPULER' },
  { id: 'pkg-3', name: 'Paket Merapi Adventure', category: 'Alam', price: 550000, originalPrice: 700000, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', includes: ['Jeep Lava Tour', 'Tiket Museum Merapi', 'Transport PP', 'Makan Siang', 'Tour Guide'], duration: '1 Hari', pax: 'Min. 2 orang', badge: 'SERU' },
  { id: 'pkg-4', name: 'Paket Jogja 2 Hari 1 Malam', category: 'Budaya', price: 1200000, originalPrice: 1600000, thumbnail: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&q=80', includes: ['Tiket 5 Destinasi', 'Hotel Bintang 3', 'Transport selama tour', '2x Makan', 'Tour Guide'], duration: '2H1M', pax: 'Min. 2 orang', badge: 'LENGKAP' },
]

// Transport Options
export const transports = [
  { id: 'tr-1', name: 'Motor Sewa Harian', icon: '🛵', price: 75000, unit: '/hari', desc: 'Honda Beat/Vario, termasuk helm & jas hujan', available: true },
  { id: 'tr-2', name: 'Mobil Avanza / Xenia', icon: '🚗', price: 350000, unit: '/hari', desc: 'Kapasitas 7 orang, termasuk bensin & supir', available: true },
  { id: 'tr-3', name: 'Minibus Hiace', icon: '🚐', price: 600000, unit: '/hari', desc: 'Kapasitas 12 orang, cocok untuk rombongan', available: true },
  { id: 'tr-4', name: 'Bus Pariwisata', icon: '🚌', price: 1500000, unit: '/hari', desc: 'Kapasitas 30-40 orang, AC & sound system', available: true },
]

// Tour Guides
export const tourGuides = [
  { id: 'tg-1', name: 'Pak Agus Santoso', photo: 'https://randomuser.me/api/portraits/men/42.jpg', lang: ['Indonesia','English'], rating: 4.9, tours: 312, price: 250000, spec: 'Candi & Heritage', badge: '⭐ Top Guide' },
  { id: 'tg-2', name: 'Bu Dewi Rahayu', photo: 'https://randomuser.me/api/portraits/women/35.jpg', lang: ['Indonesia','English','Mandarin'], rating: 4.8, tours: 198, price: 300000, spec: 'Multi Language', badge: '🌟 Multilingual' },
  { id: 'tg-3', name: 'Mas Rizky', photo: 'https://randomuser.me/api/portraits/men/28.jpg', lang: ['Indonesia'], rating: 4.7, tours: 145, price: 150000, spec: 'Adventure & Alam', badge: '🏔️ Adventure' },
]

export const TOUR_INFO = {
  'local-1': { fullTitle: 'Wisata Budaya Candi Prambanan', duration: '1 Hari', visitors: 'orang', minAge: '+12 Tahun', summary: 'Kompleks candi Hindu terbesar di Indonesia, warisan budaya dunia UNESCO. Jelajahi relief-relief indah dan arsitektur megah Mataram Kuno.\n\nTermasuk pemandu wisata, tiket masuk, dan asuransi perjalanan.', highlights: ['3 candi utama: Siwa, Brahma, Wisnu', 'Relief Ramayana yang memukau', 'Museum situs bersejarah', 'Spot foto terbaik', 'Guide lokal berpengalaman', 'Pertunjukan seni opsional'] },
  'local-2': { fullTitle: 'Wisata Budaya Candi Borobudur', duration: '1 Hari', visitors: 'orang', minAge: '+12 Tahun', summary: 'Candi Buddha terbesar di dunia. Nikmati sunrise yang memukau, jelajahi relief dan arsitektur candi, serta sarapan khas lokal.\n\nPengalaman eksklusif dengan kapasitas terbatas.', highlights: ['Sunrise spektakuler', 'Relief & arsitektur ikonik', 'Museum Borobudur', 'Sarapan khas lokal', 'Foto eksklusif', 'Guide profesional'] },
}

export const DEFAULT_TOUR = {
  fullTitle: 'Paket Wisata Premium Yogyakarta', duration: '1 Hari', visitors: 'orang', minAge: '+12 Tahun',
  summary: 'Nikmati pengalaman wisata terbaik bersama MustG.id.\n\nSetiap destinasi menawarkan keindahan dan keunikan tersendiri di Yogyakarta.',
  highlights: ['Pemandu wisata profesional', 'Transportasi nyaman', 'Tiket sudah termasuk', 'Asuransi perjalanan', 'Dokumentasi foto', 'Penjemputan hotel'],
}