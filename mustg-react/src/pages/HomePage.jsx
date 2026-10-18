import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import BookingForm from '../components/ui/BookingForm'
import DestinationCard from '../components/ui/DestinationCard'
import Footer from '../components/layout/Footer'
import { useDestinations, useInView } from '../hooks/useDestinations'
import { useAppStore } from '../store/appStore'
import { categories } from '../data/destinations'
import toast from 'react-hot-toast'

const STATS = [
  { value: '50K+', label: 'Wisatawan Terlayani', icon: '✨' },
  { value: '80+', label: 'Destinasi Resmi', icon: '📍' },
  { value: '4.95', label: 'Rating Ulasan Tamu', icon: '⭐' },
  { value: '100%', label: 'Garansi Tiket Asli', icon: '🛡️' },
]

const HOW_STEPS = [
  { n: '01', title: 'Pilih Destinasi', desc: 'Jelajahi puluhan candi bersejarah, wisata alam, hingga hiburan keluarga terpopuler di Yogyakarta.', icon: '🗺️' },
  { n: '02', title: 'Atur Tanggal & Tiket', desc: 'Pilih tanggal kunjungan dan jumlah tiket yang Anda inginkan dengan transparansi harga.', icon: '🎫' },
  { n: '03', title: 'Pembayaran Instan', desc: 'Bayar dengan aman via QRIS, Virtual Account bank nasional, atau e-wallet favorit Anda.', icon: '💳' },
  { n: '04', title: 'Tunjukkan E-Voucher', desc: 'Dapatkan e-tiket dengan QR Code instan, langsung scan di pintu masuk tanpa perlu antre di loket.', icon: '🚀' },
]

const TESTIMONIALS = [
  { id: 1, stars: 5, text: 'Informasi jam buka dan harga tiket sangat akurat. Proses booking cuma 2 menit dan e-tiket langsung bisa di-scan di loket Prambanan.', name: 'Sarah Putri Rahardjo', city: 'Jakarta Selatan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', trip: 'Candi Prambanan' },
  { id: 2, stars: 5, text: 'Harganya resmi tanpa mark-up tersembunyi. Layanan CS-nya juga cepat membantu saat kami butuh reschedule jam kunjungan.', name: 'Nazerio Bagas', city: 'Surabaya', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', trip: 'Candi Borobudur' },
  { id: 3, stars: 5, text: 'UI website-nya super bersih dan elegan. Pesan Jeep Lava Tour Merapi lewat sini nyaman banget, supirnya ramah dan fotonya keren!', name: 'Dinda Ayuningtyas', city: 'Bandung', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop', trip: 'Merapi Lava Tour' },
  { id: 4, stars: 5, text: 'Pilihan paket wisatanya lengkap banget. Sangat rekomendasi buat keluarga yang mau liburan hemat dan bebas pusing di Jogja.', name: 'Reza Firmansyah', city: 'Semarang', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', trip: 'Obelix Hills' },
]

const FAQS = [
  { q: 'Apakah tiket yang dibeli di MustG.id dijamin resmi?', a: 'Ya, 100% resmi. MustG.id terhubung langsung dengan pengelola destinasi wisata di Yogyakarta seperti TWC Borobudur Prambanan, Kraton, dan pengelola wisata alam.' },
  { q: 'Apakah tiket bisa di-reschedule jika jadwal berubah?', a: 'Bisa! Reschedule dapat dilakukan maksimal H-1 sebelum tanggal kunjungan yang tertera pada tiket Anda melalui menu Tiket Saya atau hubungi CS kami.' },
  { q: 'Metode pembayaran apa saja yang didukung?', a: 'Kami menerima pembayaran melalui QRIS (GoPay, OVO, DANA, ShopeePay), Virtual Account Bank (BCA, Mandiri, BNI, BRI), serta Kartu Kredit/Debit.' },
  { q: 'Bagaimana cara menggunakan e-tiket di lokasi wisata?', a: 'Cukup buka menu Tiket Saya di smartphone Anda dan tunjukkan QR Code pada e-voucher kepada petugas gerbang tiket untuk dipindai secara langsung.' },
  { q: 'Apakah ada biaya tambahan admin tersembunyi?', a: 'Tidak ada biaya tersembunyi. Total harga yang tampil saat checkout sudah termasuk pajak dan asuransi wisata terpadu.' },
]

const PARTNERS = [
  'Mitra Resmi TWC Prambanan & Borobudur',
  'Garansi Tiket Resmi',
  'QRIS & Bank Transfer',
  'E-Voucher Instan',
  'Bebas Antre Loket',
  'Customer Care 24/7',
]

const ARTICLES = [
  {
    id: 1,
    tag: 'Trending Sunset',
    tagColor: '#ff5722',
    tagBg: 'rgba(255, 87, 34, 0.1)',
    emoji: '🔥',
    title: 'Obelix Hills: Spot Sunset Yogyakarta Paling Estetik di Atas Bukit Batu Purba',
    excerpt: 'Menawarkan lebih dari 30 spot foto unik dengan latar belakang hamparan kota Jogja dan semburat senja keemasan. Lengkap dengan live music dan cafe kuliner.',
    readTime: '4 menit baca',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    date: 'Hari ini',
  },
  {
    id: 2,
    tag: 'Tips Wisata',
    tagColor: '#059669',
    tagBg: 'rgba(5, 150, 105, 0.1)',
    emoji: '💡',
    title: 'Panduan Wisata Sunrise Candi Borobudur: Jam Terbaik & Perlengkapan',
    excerpt: 'Ketahui waktu ideal tiba di pelataran sebelum fajar menyingsing untuk mendapatkan pemandangan siluet stupa berlatar kabut magis Menoreh.',
    readTime: '3 menit baca',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=800&auto=format&fit=crop',
    date: '2 hari lalu',
  },
  {
    id: 3,
    tag: 'Petualangan',
    tagColor: '#2563eb',
    tagBg: 'rgba(37, 99, 235, 0.1)',
    emoji: '🚙',
    title: 'Rute Seru Jeep Lava Tour Merapi: Dari Bunker Kaliadem Hingga Manuver Air',
    excerpt: 'Pilihan durasi short, medium, dan long trip serta tips mengenakan pakaian yang tepat agar petualangan offroad Anda tetap nyaman dan aman.',
    readTime: '5 menit baca',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop',
    date: '5 hari lalu',
  },
  {
    id: 4,
    tag: 'Heritage Budaya',
    tagColor: '#7c3aed',
    tagBg: 'rgba(124, 58, 237, 0.1)',
    emoji: '🏛️',
    title: 'Menyusuri Keagungan Arsitektur Taman Sari: Lorong Bawah Tanah & Sumur Gumuling',
    excerpt: 'Kisah peninggalan Sultan Hamengkubuwono I yang memadukan arsitektur Portugis dan Jawa klasik dengan pesona sejarah yang memikat.',
    readTime: '4 menit baca',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800&auto=format&fit=crop',
    date: '1 minggu lalu',
  },
]

function AnimatedNumber({ target }) {
  const [val, setVal] = useState(0)
  const [ref, inView] = useInView()
  const numTarget = parseFloat(target.replace(/[^0-9.]/g, ''))

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1200
    const step = numTarget / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= numTarget) {
        setVal(numTarget)
        clearInterval(timer)
      } else {
        setVal(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, numTarget])

  const display = numTarget % 1 === 0 ? Math.round(val).toLocaleString() : val.toFixed(1)
  const prefix = target.replace(/[0-9.]+.*/, '')
  const suf = target.replace(/.*[0-9.]/, '')

  return <span ref={ref}>{prefix}{display}{suf}</span>
}

export default function HomePage() {
  const { navigate, setBookingDraft, activeCategory, setActiveCategory } = useAppStore()
  const { destinations, loading } = useDestinations()
  const [showAll, setShowAll] = useState(false)
  const [prefillDestId, setPrefillDestId] = useState(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState(0)
  const [heroRef] = useInView(0.1)
  const [statsRef, statsInView] = useInView()
  const [howRef, howInView] = useInView()
  const [ctaRef, ctaInView] = useInView()
  const [articlesRef, articlesInView] = useInView()
  const [hoveredArticle, setHoveredArticle] = useState(null)

  const filtered = activeCategory === 'all'
    ? destinations
    : destinations.filter(d => d.category?.toLowerCase() === activeCategory?.toLowerCase())
  const displayed = showAll ? filtered : filtered.slice(0, 6)

  const handleBook = (dest) => {
    setPrefillDestId(dest.id)
    document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBookingSubmit = (draft) => {
    setBookingDraft(draft)
    toast.success('Melanjutkan ke halaman checkout...')
    setTimeout(() => navigate('checkout'), 400)
  }

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(a => (a + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: 'calc(var(--nav-h) + 30px)',
          paddingBottom: 60,
        }}
      >
        {/* Crisp HD Panoramic Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 45%',
            filter: 'brightness(0.55) contrast(1.05)',
            transform: 'scale(1.03)',
          }}
        />

        {/* Refined Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.6) 60%, rgba(15, 23, 42, 0.95) 100%)',
          }}
        />

        {/* Hero Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: 900,
            padding: '0 24px',
            marginBottom: 36,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 9999,
              padding: '7px 18px',
              marginBottom: 24,
              animation: 'fadeUp 0.6s ease both',
            }}
          >
            <span style={{ fontSize: 13 }}>✨</span>
            <span style={{ fontSize: 13, color: '#ffffff', fontWeight: 600, letterSpacing: '0.3px' }}>
              Platform Resmi Pemesanan Tiket Wisata Yogyakarta
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(38px, 6vw, 76px)',
              fontWeight: 800,
              lineHeight: 1.12,
              color: '#ffffff',
              margin: '0 0 20px',
              letterSpacing: '-0.025em',
              animation: 'fadeUp 0.6s 0.1s ease both',
              textShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            Jelajahi Pesona Megah<br />
            <span style={{ color: '#60a5fa' }}>Yogyakarta</span> Bersama Kami
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.65,
              margin: '0 0 32px',
              maxWidth: 680,
              marginInline: 'auto',
              fontWeight: 400,
              animation: 'fadeUp 0.6s 0.2s ease both',
            }}
          >
            Nikmati kemudahan pesan tiket Candi Prambanan, Borobudur, Lava Tour Merapi, dan puluhan destinasi favorit tanpa ribet antre.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
              animation: 'fadeUp 0.6s 0.3s ease both',
            }}
          >
            <button
              onClick={() => document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'var(--grad-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 14,
                padding: '14px 34px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(37, 99, 235, 0.45)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Pesan Tiket Sekarang →
            </button>
            <button
              onClick={() => navigate('packages')}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: 14,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)'
                e.currentTarget.style.borderColor = '#ffffff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)'
              }}
            >
              Lihat Paket Bundling Tour
            </button>
          </div>
        </div>

        {/* Floating Search Widget */}
        <div
          id="booking-anchor"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 1060,
            padding: '0 24px',
            animation: 'fadeUp 0.6s 0.4s ease both',
          }}
        >
          <BookingForm onSubmit={handleBookingSubmit} prefillDestId={prefillDestId} />
        </div>
      </section>

      {/* ─── TICKER / MITRA ─── */}
      <section
        style={{
          padding: '24px 0',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', animation: 'marquee 25s linear infinite', width: 'max-content' }}>
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13.5,
                fontWeight: 700,
                color: 'var(--text-secondary)',
                letterSpacing: '0.6px',
                padding: '0 36px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: 'var(--accent)', fontSize: 16 }}>✦</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section ref={statsRef} className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '34px 24px',
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 22,
                  boxShadow: 'var(--shadow-sm)',
                  opacity: statsInView ? 1 : 0,
                  transform: statsInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ${i * 0.1}s ease`,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                <p
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    margin: '0 0 6px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {statsInView ? <AnimatedNumber target={s.value} /> : '0'}
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESTINASI PILIHAN ─── */}
      <section id="destinations" className="section-pad" style={{ background: '#ffffff', paddingTop: 60 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span
              style={{
                fontSize: 12,
                color: 'var(--accent)',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 10,
              }}
            >
              Destinasi Unggulan
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: 'var(--text-primary)',
                margin: '0 0 14px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              Wisata Terbaik di <span style={{ color: 'var(--accent)' }}>Yogyakarta</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
              Pilihan destinasi dengan informasi lengkap, ulasan terverifikasi, dan jaminan tiket resmi langsung aktif.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 38, justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat)
                    setShowAll(false)
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 9999,
                    background: active ? 'var(--accent)' : 'var(--bg-surface)',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: active ? 'var(--shadow-glow)' : 'none',
                  }}
                >
                  {cat === 'all' ? '✦ Semua Kategori' : cat}
                </button>
              )
            })}
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28 }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ height: 440, borderRadius: 22 }} className="skeleton" />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28 }}>
              {displayed.map((dest, i) => (
                <div key={dest.id} style={{ opacity: 1, animation: `fadeUp 0.4s ${i * 0.06}s both` }}>
                  <DestinationCard destination={dest} onBook={handleBook} />
                </div>
              ))}
            </div>
          )}

          {filtered.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: 44 }}>
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--accent)',
                  color: 'var(--accent)',
                  borderRadius: 14,
                  padding: '13px 36px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--accent-dim)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#ffffff'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {showAll ? 'Tampilkan Lebih Sedikit ↑' : `Lihat Semua ${filtered.length} Destinasi →`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── CARA KERJA (HOW IT WORKS) ─── */}
      <section id="how" ref={howRef} className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <span
              style={{
                fontSize: 12,
                color: 'var(--accent)',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 10,
              }}
            >
              Mudah & Cepat
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: 'var(--text-primary)',
                margin: '0 0 14px',
                fontWeight: 800,
              }}
            >
              Pesan Tiket dalam <span style={{ color: 'var(--accent)' }}>4 Langkah Mudah</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              Alur pemesanan tanpa antre, siap berangkat kapan saja dalam hitungan menit.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            {HOW_STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  padding: '36px 28px',
                  background: '#ffffff',
                  borderRadius: 22,
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: howInView ? 1 : 0,
                  transform: howInView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `all 0.5s ${i * 0.12}s ease`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'var(--bg-accent-soft)',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    marginBottom: 20,
                  }}
                >
                  {step.icon}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--accent)',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  LANGKAH {step.n}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px', fontFamily: 'var(--font-display)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="section-pad" style={{ background: '#ffffff', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span
              style={{
                fontSize: 12,
                color: 'var(--accent)',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 10,
              }}
            >
              Ulasan Nyata
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                color: 'var(--text-primary)',
                margin: 0,
                fontWeight: 800,
              }}
            >
              Apa Kata <span style={{ color: 'var(--accent)' }}>Wisatawan?</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.id}
                style={{
                  background: i === activeTestimonial ? 'var(--bg-accent-soft)' : '#ffffff',
                  border: `1.5px solid ${i === activeTestimonial ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 22,
                  padding: '30px 26px',
                  cursor: 'pointer',
                  transform: i === activeTestimonial ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: i === activeTestimonial ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'all 0.35s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onClick={() => setActiveTestimonial(i)}
              >
                <div>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {Array(t.stars).fill(0).map((_, j) => (
                      <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 20px' }}>
                    "{t.text}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{t.city} • {t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: i === activeTestimonial ? 28 : 8,
                  height: 8,
                  borderRadius: 9999,
                  background: i === activeTestimonial ? 'var(--accent)' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARTIKEL & INSPIRASI WISATA ─── */}
      <section ref={articlesRef} className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Inspirasi & Tips Perjalanan
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
                Kabar Wisata <span style={{ color: 'var(--accent)' }}>Terkini</span>
              </h2>
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
              Panduan lokal, rute petualangan, dan tempat yang lagi viral 🔥
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {ARTICLES.map((article, i) => (
              <div
                key={article.id}
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
                style={{
                  borderRadius: 22,
                  overflow: 'hidden',
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: hoveredArticle === article.id ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: hoveredArticle === article.id ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  transition: 'all 0.3s ease',
                  opacity: articlesInView ? 1 : 0,
                  animation: articlesInView ? `fadeUp 0.5s ${i * 0.1}s both` : 'none',
                }}
              >
                <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                  <img
                    src={article.image}
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: hoveredArticle === article.id ? 'scale(1.06)' : 'scale(1)',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      background: 'rgba(255, 255, 255, 0.94)',
                      backdropFilter: 'blur(8px)',
                      color: article.tagColor,
                      fontSize: 11.5,
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: 9999,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {article.emoji} {article.tag}
                  </span>
                </div>

                <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3
                      style={{
                        fontSize: 16.5,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-display)',
                        margin: '0 0 8px',
                        lineHeight: 1.4,
                      }}
                    >
                      {article.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13.5,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {article.excerpt}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>🕒 {article.readTime}</span>
                      <span>📅 {article.date}</span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>Baca Selengkapnya →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section-pad" style={{ background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Tanya Jawab
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>
              Pertanyaan yang <span style={{ color: 'var(--accent)' }}>Sering Diajukan</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg)',
                  border: `1.5px solid ${expandedFaq === i ? 'rgba(37, 99, 235, 0.3)' : 'var(--border)'}`,
                  borderRadius: 18,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 15.5,
                    fontWeight: 700,
                    textAlign: 'left',
                    gap: 16,
                  }}
                >
                  {faq.q}
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: expandedFaq === i ? 'var(--accent)' : 'var(--bg-surface)',
                      color: expandedFaq === i ? '#fff' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                      transform: expandedFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    +
                  </span>
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: '0 24px 22px', fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.7, animation: 'fadeUp 0.2s ease' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION BANNER ─── */}
      <section ref={ctaRef} className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%)',
              borderRadius: 30,
              padding: 'clamp(44px, 6vw, 76px) 32px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              opacity: ctaInView ? 1 : 0,
              transform: ctaInView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 0.6s ease',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 660, margin: '0 auto' }}>
              <span
                style={{
                  fontSize: 12,
                  color: '#93c5fd',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: 16,
                }}
              >
                MULAI PERJALANAN ANDA
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(30px, 4.5vw, 52px)',
                  color: '#ffffff',
                  margin: '0 0 18px',
                  fontWeight: 800,
                  lineHeight: 1.18,
                  letterSpacing: '-0.02em',
                }}
              >
                Siap Menjelajahi Keindahan Yogyakarta?
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 36px', lineHeight: 1.65 }}>
                Dapatkan tiket resmi dengan konfirmasi instan. Ribuan wisatawan mempercayakan liburan mereka kepada MustG.id.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: '#ffffff',
                    color: 'var(--accent)',
                    border: 'none',
                    borderRadius: 14,
                    padding: '15px 36px',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Booking Tiket Sekarang →
                </button>
                <button
                  onClick={() => navigate('destinations')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: 14,
                    padding: '15px 32px',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                >
                  Lihat Semua Destinasi
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}