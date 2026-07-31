import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/layout/Navbar'
import BookingForm from '../components/ui/BookingForm'
import DestinationCard from '../components/ui/DestinationCard'
import Footer from '../components/layout/Footer'
import { useDestinations, useInView } from '../hooks/useDestinations'
import { useAppStore } from '../store/appStore'
import { categories } from '../data/destinations'
import toast from 'react-hot-toast'

const STATS = [
  { value: '50K+', label: 'Wisatawan Puas', icon: '😊' },
  { value: '80+', label: 'Destinasi Keren', icon: '📍' },
  { value: '4.9', label: 'Rating Bintang', icon: '⭐' },
  { value: '24/7', label: 'Layanan Support', icon: '🎧' },
]

const HOW_STEPS = [
  { n: '01', title: 'Pilih Destinasi', desc: 'Temukan ratusan destinasi terbaik Yogyakarta dengan info lengkap & akurat.', icon: '🗺️' },
  { n: '02', title: 'Pilih Tanggal & Tiket', desc: 'Cek ketersediaan tiket, pilih jenis tiket sesuai kebutuhan.', icon: '🎫' },
  { n: '03', title: 'Checkout & Bayar', desc: 'Proses pembayaran aman dengan berbagai metode pilihan.', icon: '💳' },
  { n: '04', title: 'Siap Berangkat!', desc: 'Tunjukkan receipt digital saat masuk ke destinasi wisata.', icon: '🚀' },
]

const TESTIMONIALS = [
  { id: 1, stars: 5, text: 'Info jam buka dan harga tiket sangat jelas. Booking jadi cepat banget, anti ribet!', name: 'Sarah Putri', city: 'Jakarta', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', trip: 'Prambanan' },
  { id: 2, stars: 5, text: 'Harganya transparan, banyak promo, dan fitur reschedule-nya sangat membantu saat jadwal berubah.', name: 'Nazerio Putra', city: 'Malang', avatar: 'https://randomuser.me/api/portraits/men/35.jpg', trip: 'Borobudur' },
  { id: 3, stars: 5, text: 'UI-nya keren banget, terasa premium. Booking Jeep Merapi dari sini, super recommended!', name: 'Dinda Ayu', city: 'Surabaya', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', trip: 'Gunung Merapi' },
  { id: 4, stars: 5, text: 'Prosesnya mudah banget! Dari pilih destinasi sampai dapat receipt cuma butuh 3 menit.', name: 'Reza Firmansyah', city: 'Bandung', avatar: 'https://randomuser.me/api/portraits/men/52.jpg', trip: 'Obelix Hills' },
]

const FAQS = [
  { q: 'Apakah tiket bisa di-reschedule?', a: 'Ya! Kamu bisa reschedule tiket maksimal H-1 sebelum jadwal kunjungan melalui halaman pesanan.' },
  { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami menerima pembayaran via Transfer Bank, Kartu Kredit/Debit, dan E-Wallet (GoPay, OVO, DANA).' },
  { q: 'Apakah receipt digital diterima di semua destinasi?', a: 'Ya, semua destinasi yang terdaftar di MustG.id menerima receipt digital yang ditampilkan di smartphone.' },
  { q: 'Berapa lama proses konfirmasi pembayaran?', a: 'Konfirmasi otomatis dalam hitungan detik. Kamu akan langsung menerima receipt setelah pembayaran berhasil.' },
  { q: 'Apakah ada biaya tambahan selain harga tiket?', a: 'Tidak ada biaya tersembunyi. Harga yang tertera sudah termasuk semua biaya.' },
]

const PARTNERS = ['Praktis', 'Terpercaya', 'Cepat', 'Mudah', 'Aman', 'Fleksibel']

// ─── ARTIKEL DATA ───
const ARTICLES = [
  {
    id: 1,
    tag: 'Viral',
    tagColor: '#ff5a1f',
    tagBg: 'rgba(255,90,31,0.12)',
    emoji: '🔥',
    title: 'Obelix Hills: Spot Sunset Yogya yang Lagi Viral di TikTok',
    excerpt: 'Bukit dengan deretan batu andesit raksasa ini jadi primadona baru wisatawan. Golden hour-nya? Chef\'s kiss. Buka mulai jam 5 pagi, harga tiket mulai Rp15.000.',
    readTime: '3 menit',
    image: 'https://i.pinimg.com/1200x/cd/49/4a/cd494ad0aaf64dda9a9027d232e32603.jpg',
    date: '2 hari lalu',
  },
  {
    id: 2,
    tag: 'Tips',
    tagColor: '#00b894',
    tagBg: 'rgba(0,184,148,0.12)',
    emoji: '💡',
    title: '7 Tips Wisata ke Borobudur Biar Nggak Nyesel',
    excerpt: 'Datang sebelum jam 6 pagi untuk hindari keramaian dan dapat cahaya terbaik. Bawa topi, sunscreen, dan air minum. Tiket sunrise bisa dipesan lewat MustG.id!',
    readTime: '4 menit',
    image: 'https://i.pinimg.com/1200x/e5/76/42/e576420a1764d1defc51da5abae15be3.jpg',
    date: '5 hari lalu',
  },
  {
    id: 3,
    tag: 'Guide',
    tagColor: '#0066ff',
    tagBg: 'rgba(0,102,255,0.12)',
    emoji: '🗺️',
    title: 'Panduan Lengkap Naik Jeep Merapi: Rute, Harga & Waktu Terbaik',
    excerpt: 'Ada 3 rute populer: Lava Tour Pendek (1.5 jam), Menengah (2 jam), dan Panjang (3 jam). Waktu terbaik? Pagi hari saat Merapi masih terlihat jelas sebelum awan naik.',
    readTime: '5 menit',
    image: 'https://i.pinimg.com/736x/7d/ab/ca/7dabca967def04ae67e71776b3d678f4.jpg',
    date: '1 minggu lalu',
  },
  {
    id: 4,
    tag: 'Hidden Gem',
    tagColor: '#764ba2',
    tagBg: 'rgba(118,75,162,0.12)',
    emoji: '💎',
    title: 'Kalibiru: Hutan Pinus dengan View Waduk yang Bikin Takjub',
    excerpt: 'Terletak di Kulonprogo, Kalibiru menawarkan spot foto di atas pohon dengan latar Waduk Sermo. Masih sepi dibanding destinasi mainstream, cocok buat yang mau konten berbeda.',
    readTime: '3 menit',
    image: 'https://i.pinimg.com/1200x/ce/1e/b4/ce1eb482826f4fca4199e76970a96fb8.jpg',
    date: '1 minggu lalu',
  },
]

function AnimatedNumber({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const [ref, inView] = useInView()
  const numTarget = parseFloat(target.replace(/[^0-9.]/g, ''))

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = numTarget / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= numTarget) { setVal(numTarget); clearInterval(timer) }
      else setVal(start)
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
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [heroRef, heroInView] = useInView(0.1)
  const [statsRef, statsInView] = useInView()
  const [howRef, howInView] = useInView()
  const [ctaRef, ctaInView] = useInView()
  const [articlesRef, articlesInView] = useInView()
  const [hoveredArticle, setHoveredArticle] = useState(null)

  const filtered = activeCategory === 'all' ? destinations : destinations.filter(d => d.category === activeCategory)
  const displayed = showAll ? filtered : filtered.slice(0, 6)

  const handleBook = (dest) => {
    setPrefillDestId(dest.id)
    document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBookingSubmit = (draft) => {
    setBookingDraft(draft)
    toast.success('Melanjutkan ke checkout...')
    setTimeout(() => navigate('checkout'), 500)
  }

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(a => (a + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* ─── HERO ─── */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', paddingTop: 'var(--nav-h)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url('https://i.pinimg.com/736x/8e/54/9f/8e549f2bf10b8587d3d77bbfe0128f98.jpg')`,
          backgroundSize: 'cover', backgroundPosition: 'center 70%',
          filter: 'brightness(0.40) saturate(1.2)',
          transform: 'scale(1.05)',
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(8,11,18,0.3) 0%, rgba(8,11,18,0.1) 40%, rgba(8,11,18,0.7) 80%, rgba(8,11,18,1) 100%)' }} />
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,200,0.08) 0%, transparent 70%)', zIndex: 1, animation: 'blob 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)', zIndex: 1, animation: 'blob 16s ease-in-out infinite reverse' }} />

        <div ref={heroRef} style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 860, padding: '0 24px', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.3)',
            borderRadius: 99, padding: '6px 16px', marginBottom: 28,
            animation: 'fadeUp 0.6s 0.1s both',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>Platform Wisata #1 Yogyakarta</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 76px)',
            fontWeight: 400, lineHeight: 1.15, color: '#fff',
            margin: '0 0 20px', letterSpacing: '-0.02em',
            animation: 'fadeUp 0.6s 0.2s both',
          }}>
            Jelajahi Pesona<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Yogyakarta</em> Bersama Kami
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.7, margin: '0 0 36px',
            animation: 'fadeUp 0.6s 0.3s both',
          }}>
            Temukan destinasi terbaik, booking tiket instan, dan nikmati<br className="desktop-only" /> pengalaman wisata yang tak terlupakan tanpa ribet.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.6s 0.4s both' }}>
            <button
              onClick={() => document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'linear-gradient(135deg, var(--accent), #00b4d8)', color: '#000', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-ui)', boxShadow: '0 8px 32px rgba(0,229,200,0.4)', transition: 'all 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Pesan Sekarang →
            </button>
            <button
              onClick={() => navigate('destinations')}
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', backdropFilter: 'blur(10px)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}>
              Lihat Destinasi
            </button>
          </div>
        </div>

        <div id="booking-anchor" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 960, padding: '0 24px', animation: 'fadeUp 0.6s 0.5s both' }}>
          <BookingForm onSubmit={handleBookingSubmit} prefillDestId={prefillDestId} />
        </div>

        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-ui)', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</p>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)', animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section style={{ padding: '28px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
        <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0 32px', whiteSpace: 'nowrap' }}>
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '32px 20px',
                background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 20,
                opacity: statsInView ? 1 : 0, transform: statsInView ? 'translateY(0)' : 'translateY(24px)',
                transition: `all 0.5s ${i * 0.1}s ease`,
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-ui)', margin: '0 0 6px' }}>
                  {statsInView ? <AnimatedNumber target={s.value} /> : '0'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS ─── */}
      <section id="destinations" className="section-pad" style={{ background: 'var(--bg-2)', paddingTop: 48 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>DESTINASI PILIHAN</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--text-primary)', margin: '0 0 14px', fontWeight: 400 }}>
              Wisata Terbaik <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Yogyakarta</em>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>Pilih dari ratusan destinasi wisata premium dengan info lengkap dan booking instan.</p>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 36, justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setShowAll(false) }}
                style={{
                  padding: '8px 20px', borderRadius: 99,
                  background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-3)',
                  color: activeCategory === cat ? '#000' : 'var(--text-secondary)',
                  border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                  fontSize: 13, fontWeight: activeCategory === cat ? 700 : 400,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.2s',
                }}>
                {cat === 'all' ? '✦ Semua' : cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ height: 480, borderRadius: 20, background: 'linear-gradient(90deg, var(--bg-2) 25%, var(--bg-3) 50%, var(--bg-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {displayed.map((dest, i) => (
                <div key={dest.id} style={{ opacity: 1, animation: `fadeUp 0.4s ${i * 0.06}s both` }}>
                  <DestinationCard destination={dest} onBook={handleBook} />
                </div>
              ))}
            </div>
          )}

          {filtered.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button onClick={() => setShowAll(!showAll)}
                style={{ background: 'none', border: '1.5px solid var(--accent)', color: 'var(--accent)', borderRadius: 12, padding: '12px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none' }}>
                {showAll ? 'Tampilkan Lebih Sedikit ↑' : `Lihat Semua ${filtered.length} Destinasi →`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" ref={howRef} className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>CARA KERJA</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--text-primary)', margin: '0 0 14px', fontWeight: 400 }}>Booking Tiket dalam<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>4 Langkah Mudah</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2, position: 'relative' }}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} style={{
                padding: '36px 28px', background: i % 2 === 0 ? 'var(--bg-3)' : 'var(--bg-2)',
                borderRadius: i === 0 ? '20px 0 0 20px' : i === HOW_STEPS.length - 1 ? '0 20px 20px 0' : 0,
                border: '1px solid var(--border)',
                opacity: howInView ? 1 : 0, transform: howInView ? 'translateY(0)' : 'translateY(24px)',
                transition: `all 0.5s ${i * 0.12}s ease`,
                position: 'relative',
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{step.icon}</div>
                <p style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '2px', margin: '0 0 8px' }}>{step.n}</p>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', margin: '0 0 10px' }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                {i < HOW_STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: '50%', right: -16, transform: 'translateY(-50%)', zIndex: 2, fontSize: 20, color: 'var(--accent)' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="section-pad" style={{ background: 'var(--bg-2)', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>TESTIMONI</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--text-primary)', margin: 0, fontWeight: 400 }}>
              Apa Kata <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Mereka?</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} style={{
                background: 'var(--bg-3)', border: `1px solid ${i === activeTestimonial ? 'rgba(0,229,200,0.3)' : 'var(--border)'}`,
                borderRadius: 20, padding: '28px', cursor: 'pointer',
                transform: i === activeTestimonial ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: i === activeTestimonial ? '0 16px 40px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.35s ease',
              }} onClick={() => setActiveTestimonial(i)}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {Array(t.stars).fill(0).map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 20px' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-ui)' }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{t.city} • {t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 28 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                style={{ width: i === activeTestimonial ? 24 : 7, height: 7, borderRadius: 99, background: i === activeTestimonial ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--text-primary)', margin: 0, fontWeight: 400 }}>Pertanyaan yang <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Sering Ditanya</em></h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: 'var(--bg-3)', border: `1px solid ${expandedFaq === i ? 'rgba(0,229,200,0.25)' : 'var(--border)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, textAlign: 'left', gap: 12 }}>
                  {faq.q}
                  <span style={{ fontSize: 20, color: 'var(--accent)', flexShrink: 0, transform: expandedFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.25s' }}>+</span>
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: '0 22px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, animation: 'fadeUp 0.2s ease' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARTIKEL WISATA ─── */}
      <section ref={articlesRef} className="section-pad" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10, margin: '0 0 10px' }}>INFO & ARTIKEL</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 44px)', color: 'var(--text-primary)', margin: 0, fontWeight: 400, lineHeight: 1.2 }}>
                Wisata Yogya <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Terkini</em>
              </h2>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>Tips, panduan, dan destinasi yang lagi hits 🔥</p>
          </div>

          {/* Featured article (besar) + 3 kecil di samping */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'auto', gap: 20 }}>

            {/* Card Featured — span 1 row, taller */}
            {ARTICLES.slice(0, 1).map((article, i) => (
              <div key={article.id}
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
                style={{
                  gridRow: 'span 2',
                  borderRadius: 20, overflow: 'hidden',
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  cursor: 'pointer', position: 'relative',
                  transform: hoveredArticle === article.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredArticle === article.id ? '0 20px 48px rgba(0,0,0,0.25)' : 'var(--shadow-sm)',
                  transition: 'all 0.3s ease',
                  opacity: articlesInView ? 1 : 0,
                  animation: articlesInView ? `fadeUp 0.5s 0s both` : 'none',
                  display: 'flex', flexDirection: 'column',
                }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 280, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={article.image} alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hoveredArticle === article.id ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                  <span style={{ position: 'absolute', top: 16, left: 16, background: article.tagBg, color: article.tagColor, border: `1px solid ${article.tagColor}40`, fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 99, fontFamily: 'var(--font-ui)', backdropFilter: 'blur(8px)', letterSpacing: '0.5px' }}>
                    {article.emoji} {article.tag}
                  </span>
                </div>
                {/* Content */}
                <div style={{ padding: '24px 24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', margin: '0 0 12px', lineHeight: 1.35 }}>{article.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 20px', flex: 1 }}>{article.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>🕒 {article.readTime}</span>
                      <span>📅 {article.date}</span>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-ui)' }}>Baca →</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 3 artikel kecil di kanan */}
            {ARTICLES.slice(1).map((article, i) => (
              <div key={article.id}
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
                style={{
                  borderRadius: 16, overflow: 'hidden',
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  cursor: 'pointer', display: 'flex', gap: 0, flexDirection: 'row',
                  transform: hoveredArticle === article.id ? 'translateY(-3px)' : 'translateY(0)',
                  boxShadow: hoveredArticle === article.id ? '0 12px 32px rgba(0,0,0,0.2)' : 'var(--shadow-sm)',
                  transition: 'all 0.3s ease',
                  opacity: articlesInView ? 1 : 0,
                  animation: articlesInView ? `fadeUp 0.5s ${(i + 1) * 0.1}s both` : 'none',
                }}>
                {/* Thumbnail */}
                <div style={{ width: 120, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  <img src={article.image} alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hoveredArticle === article.id ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
                  <span style={{ position: 'absolute', top: 8, left: 8, background: article.tagBg, color: article.tagColor, fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 99, fontFamily: 'var(--font-ui)', backdropFilter: 'blur(6px)', border: `1px solid ${article.tagColor}40`, letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                    {article.emoji} {article.tag}
                  </span>
                </div>
                {/* Text */}
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', margin: '0 0 6px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🕒 {article.readTime}</span>
                    <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-ui)' }}>Baca →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA lihat semua artikel */}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button style={{ background: 'none', border: '1.5px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 12, padding: '11px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
              Lihat Semua Artikel →
            </button>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section ref={ctaRef} className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,229,200,0.12) 0%, rgba(0,180,216,0.08) 50%, rgba(255,107,53,0.08) 100%)',
            border: '1px solid rgba(0,229,200,0.2)', borderRadius: 28,
            padding: 'clamp(40px, 5vw, 72px)', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            opacity: ctaInView ? 1 : 0, transform: ctaInView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 0.6s ease',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,200,0.08), transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.06), transparent 70%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>MULAI SEKARANG</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', color: 'var(--text-primary)', margin: '0 0 16px', fontWeight: 400, lineHeight: 1.2 }}>
                Siap Menjelajahi<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Yogyakarta?</em>
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '0 0 36px', maxWidth: 480, marginInline: 'auto', lineHeight: 1.7 }}>
                Ribuan wisatawan sudah booking lewat MustG.id. Giliran kamu!
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('destinations')}
                  style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 14, padding: '14px 36px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-ui)', boxShadow: '0 8px 32px rgba(0,229,200,0.35)', transition: 'all 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Jelajahi Destinasi →
                </button>
                <button onClick={() => document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ background: 'none', border: '1.5px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}>
                  Langsung Booking
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