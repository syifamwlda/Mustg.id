import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAppStore } from '../store/appStore'
import { getPackages, getTransports, getTourGuides } from '../services/api'
import { packages as LOCAL_PKG, transports as LOCAL_TR, tourGuides as LOCAL_GUIDE, formatIDR } from '../data/destinations'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'paket', label: '🎒 Paket Bundling Tour', desc: 'Tiket + Transport + Pemandu all-in-one hemat' },
  { id: 'transport', label: '🚐 Rental Transport', desc: 'Armada bersih ber-AC dengan supir profesional' },
  { id: 'guide', label: '👨‍🏫 Tour Guide Berlisensi', desc: 'Storyteller bersertifikat HPI ramah & edukatif' },
  { id: 'custom', label: '⚙️ Buat Paket Custom', desc: 'Kustomisasi rute dan fasilitas sesuai keinginan' },
]

export default function PackagesPage() {
  const { navigate, setBookingDraft } = useAppStore()
  const [activeTab, setActiveTab] = useState('paket')
  const [packages, setPackages] = useState(LOCAL_PKG)
  const [transports, setTransports] = useState(LOCAL_TR)
  const [guides, setGuides] = useState(LOCAL_GUIDE)
  const [loading, setLoading] = useState(true)
  const [selectedTransport, setSelectedTransport] = useState(null)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [visitDate, setVisitDate] = useState('')
  const [pax, setPax] = useState(2)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    Promise.all([getPackages(), getTransports(), getTourGuides()])
      .then(([pkgs, trs, gds]) => {
        if (pkgs?.length) setPackages(pkgs)
        if (trs?.length) setTransports(trs)
        if (gds?.length) setGuides(gds)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const selTransport = transports.find(t => String(t.id) === String(selectedTransport))
  const selGuide = guides.find(g => String(g.id) === String(selectedGuide))

  const customTotal = (selTransport?.price_per_day || selTransport?.price || 0) + (selGuide?.price_per_day || selGuide?.price || 0)

  const handleBookPackage = (pkg) => {
    if (!visitDate) {
      toast.error('Silakan pilih tanggal kunjungan terlebih dahulu!')
      return
    }
    setBookingDraft({
      type: 'package',
      package: pkg,
      package_id: pkg.id,
      visit_date: visitDate,
      qty: pax,
      destination: { name: pkg.name, thumbnail_url: pkg.thumbnail_url || pkg.thumbnail, city: 'Yogyakarta' },
      ticket: { name: pkg.name, price: pkg.price },
      destination_id: 1,
      ticket_type_id: 101,
    })
    toast.success('Paket dipilih! Melanjutkan ke detail pesanan...')
    setTimeout(() => navigate('checkout'), 350)
  }

  const handleBookCustom = () => {
    if (!visitDate) {
      toast.error('Silakan tentukan tanggal kunjungan!')
      return
    }
    if (!selTransport && !selGuide) {
      toast.error('Pilih minimal armada transportasi atau tour guide!')
      return
    }
    toast.success('✅ Permintaan paket custom terkirim! Tim reservasi kami akan segera menghubungi Anda.')
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 50%',
          paddingTop: 'calc(var(--nav-h) + 40px)',
          paddingBottom: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.75) 60%, rgba(15, 23, 42, 0.95) 100%)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 840 }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 800,
              padding: '6px 18px',
              borderRadius: 9999,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: 18,
              display: 'inline-block',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            SOLUSI LIBURAN PRAKTIS & HEMAT
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: '#ffffff',
              margin: '12px 0 16px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Paket Wisata & <span style={{ color: '#60a5fa' }}>Layanan Tour</span> Yogyakarta
          </h1>
          <p style={{ fontSize: 16.5, color: 'rgba(255, 255, 255, 0.88)', maxWidth: 620, margin: '0 auto', lineHeight: 1.65 }}>
            Paket all-in-one lengkap dengan tiket masuk objek wisata, transportasi mobil/bus ber-AC, dan pemandu lokal berpengalaman.
          </p>
        </div>
      </div>

      {/* Modern Sticky Navigation Tabs */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 'var(--nav-h)',
          zIndex: 50,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 0' }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 22px',
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    border: 'none',
                    borderRadius: 14,
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ padding: '48px 24px 96px' }}>
        {/* ─── TAB 1: PAKET BUNDLING ─── */}
        {activeTab === 'paket' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--text-primary)', margin: '0 0 8px', fontWeight: 800 }}>
                Pilihan Paket Bundling Favorit
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
                Bebas repot, sudah termasuk tiket masuk seluruh destinasi, armada penjemputan, supir, bensin, dan pemandu berlisensi.
              </p>
            </div>

            {/* Date & Pax Selector Widget */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '24px 28px',
                marginBottom: 36,
                display: 'flex',
                gap: 20,
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
                  📅 Rencana Tanggal Kunjungan
                </label>
                <input
                  type="date"
                  min={today}
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 12,
                    padding: '12px 16px',
                    fontSize: 14,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
                  👥 Jumlah Peserta / Pax
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setPax(p => Math.max(1, p - 1))}
                    style={{ width: 44, height: 46, borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--border)', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={pax}
                    min={1}
                    max={50}
                    onChange={e => setPax(Math.max(1, Number(e.target.value)))}
                    style={{ width: 64, textAlign: 'center', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, height: 46, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setPax(p => Math.min(50, p + 1))}
                    style={{ width: 44, height: 46, borderRadius: 12, background: 'var(--accent-dim)', border: '1px solid rgba(37, 99, 235, 0.2)', color: 'var(--accent)', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
                {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 480, borderRadius: 22 }} />)}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
                {packages.map((pkg, i) => (
                  <PackageCard key={pkg.id} pkg={pkg} onBook={handleBookPackage} idx={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: SEWA TRANSPORT ─── */}
        {activeTab === 'transport' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--text-primary)', margin: '0 0 8px', fontWeight: 800 }}>
                Rental Transportasi Wisata
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
                Armada terawat, sejuk ber-AC, dan supir berpengalaman memahami rute wisata terbaik di Yogyakarta.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 32 }}>
              {transports.map(t => (
                <TransportCard
                  key={t.id}
                  t={t}
                  selected={String(selectedTransport) === String(t.id)}
                  onSelect={id => setSelectedTransport(String(selectedTransport) === String(id) ? null : id)}
                />
              ))}
            </div>

            {selectedTransport && (
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid var(--accent)',
                  borderRadius: 22,
                  padding: '24px 28px',
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                  alignItems: 'flex-end',
                  boxShadow: 'var(--shadow-glow)',
                  animation: 'fadeUp 0.3s ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
                    📅 Pilih Tanggal Sewa
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={visitDate}
                    onChange={e => setVisitDate(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 12,
                      padding: '12px 16px',
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: 2 }}>
                      Tarif Sewa / Hari
                    </span>
                    <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                      {formatIDR(selTransport?.price_per_day || selTransport?.price || 0)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!visitDate) {
                        toast.error('Silakan tentukan tanggal sewa!')
                        return
                      }
                      toast.success(`🚐 ${selTransport?.name} berhasil dipesan! Reservasi kami akan segera menghubungi WhatsApp Anda.`)
                    }}
                    style={{
                      background: 'var(--grad-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 14,
                      padding: '14px 30px',
                      fontSize: 14.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-glow)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Booking Armada Ini →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: TOUR GUIDE ─── */}
        {activeTab === 'guide' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--text-primary)', margin: '0 0 8px', fontWeight: 800 }}>
                Pemandu Wisata (Tour Guide) Berlisensi
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
                Pemandu resmi tersertifikasi HPI (Himpunan Pramuwisata Indonesia). Menguasai narasi sejarah candi, filosofi budaya keraton, dan rute hidden gem.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 32 }}>
              {guides.map(g => (
                <GuideCard
                  key={g.id}
                  g={g}
                  selected={String(selectedGuide) === String(g.id)}
                  onSelect={id => setSelectedGuide(String(selectedGuide) === String(id) ? null : id)}
                />
              ))}
            </div>

            {selectedGuide && (
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid var(--accent)',
                  borderRadius: 22,
                  padding: '24px 28px',
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                  alignItems: 'flex-end',
                  boxShadow: 'var(--shadow-glow)',
                  animation: 'fadeUp 0.3s ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
                    📅 Tanggal Kunjungan Tour
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={visitDate}
                    onChange={e => setVisitDate(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 12,
                      padding: '12px 16px',
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: 2 }}>
                      Honor Pemandu / Hari
                    </span>
                    <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                      {formatIDR(selGuide?.price_per_day || selGuide?.price || 0)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!visitDate) {
                        toast.error('Silakan tentukan tanggal tour!')
                        return
                      }
                      toast.success(`👨‍🏫 Pemandu ${selGuide?.name} berhasil dibooking!`)
                    }}
                    style={{
                      background: 'var(--grad-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 14,
                      padding: '14px 30px',
                      fontSize: 14.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-glow)',
                    }}
                  >
                    Booking Guide Ini →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: CUSTOM PACKAGE BUILDER ─── */}
        {activeTab === 'custom' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--text-primary)', margin: '0 0 8px', fontWeight: 800 }}>
                Rancang Paket Liburan Anda Sendiri
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
                Pilih kombinasi armada kendaraan dan pemandu yang sesuai dengan keinginan rombongan Anda.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 36 }} className="custom-grid">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0 0 16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🚐 1. Pilih Kendaraan</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>(opsional)</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {transports.map(t => (
                    <TransportCard
                      key={t.id}
                      t={t}
                      selected={String(selectedTransport) === String(t.id)}
                      onSelect={id => setSelectedTransport(String(selectedTransport) === String(id) ? null : id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0 0 16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>👨‍🏫 2. Pilih Tour Guide</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>(opsional)</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {guides.map(g => (
                    <GuideCard
                      key={g.id}
                      g={g}
                      selected={String(selectedGuide) === String(g.id)}
                      onSelect={id => setSelectedGuide(String(selectedGuide) === String(id) ? null : id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {(selTransport || selGuide) && (
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid var(--accent)',
                  borderRadius: 22,
                  padding: '28px 32px',
                  boxShadow: 'var(--shadow-lg)',
                  animation: 'fadeUp 0.3s ease',
                }}
              >
                <h3 style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0 0 18px', color: 'var(--text-primary)' }}>
                  📋 Rincian Paket Custom Pilihan
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {selTransport && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {selTransport.icon} {selTransport.name}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatIDR(selTransport.price_per_day || selTransport.price)}/hari
                      </span>
                    </div>
                  )}
                  {selGuide && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        👨‍🏫 {selGuide.name} ({selGuide.specialization || 'Pemandu Lisensi HPI'})
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatIDR(selGuide.price_per_day || selGuide.price)}/hari
                      </span>
                    </div>
                  )}
                  <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      Perkiraan Biaya / Hari
                    </span>
                    <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                      {formatIDR(customTotal)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
                      📅 Rencana Tanggal Kunjungan
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={visitDate}
                      onChange={e => setVisitDate(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg)',
                        border: '1.5px solid var(--border)',
                        borderRadius: 12,
                        padding: '12px 16px',
                        fontSize: 14,
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <button
                    onClick={handleBookCustom}
                    style={{
                      background: 'var(--grad-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 14,
                      padding: '14px 34px',
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-glow)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Ajukan Paket Custom →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
      <style>{`
        @media(max-width: 860px) {
          .custom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ─── Sub-components ─── */
function PackageCard({ pkg, onBook, idx }) {
  const [hov, setHov] = useState(false)
  const originalPrice = pkg.originalPrice || pkg.original_price || 0
  const disc = originalPrice > 0 ? Math.round((1 - pkg.price / originalPrice) * 100) : (pkg.discount_pct || 0)
  const includes = pkg.includes_array || (typeof pkg.includes === 'string' ? pkg.includes.split('\n').filter(Boolean) : pkg.includes || [])
  const thumb = pkg.thumbnail_url || pkg.thumbnail

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#ffffff',
        borderRadius: 22,
        border: `1px solid ${hov ? 'rgba(37, 99, 235, 0.25)' : 'var(--border)'}`,
        overflow: 'hidden',
        boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: `fadeUp 0.4s ${idx * 0.08}s both`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
        <img
          src={thumb}
          alt={pkg.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hov ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onError={e => {
            e.target.onerror = null
            e.target.src = 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=800&auto=format&fit=crop'
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>
          {pkg.badge && (
            <span style={{ background: '#ff5722', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 9999, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
              {pkg.badge}
            </span>
          )}
          {disc > 0 && (
            <span style={{ background: '#ffffff', color: '#059669', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 9999, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              HEMAT {disc}%
            </span>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px', display: 'block' }}>
            HARGA PAKET LENGKAP
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {formatIDR(pkg.price)}
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 6px', lineHeight: 1.3 }}>
          {pkg.name}
        </h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 12.5, color: 'var(--text-muted)' }}>
          <span>🕐 {pkg.duration || '1 Hari Penuh'}</span>
          <span>👥 {pkg.pax || 'Min. 2 orang'}</span>
        </div>

        {/* Inclusions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18, flex: 1 }}>
          {includes.slice(0, 5).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: 6, background: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div>
            {originalPrice > 0 && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through', display: 'block' }}>
                {formatIDR(originalPrice)}
              </span>
            )}
            <span style={{ fontSize: 19, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              {formatIDR(pkg.price)}
            </span>
          </div>
          <button
            onClick={() => onBook(pkg)}
            style={{
              background: hov ? 'var(--grad-primary)' : 'var(--bg)',
              color: hov ? '#ffffff' : 'var(--accent)',
              border: `1px solid ${hov ? 'transparent' : 'rgba(37, 99, 235, 0.25)'}`,
              borderRadius: 12,
              padding: '10px 20px',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: hov ? 'var(--shadow-glow)' : 'none',
            }}
          >
            Pilih Paket →
          </button>
        </div>
      </div>
    </div>
  )
}

function TransportCard({ t, selected, onSelect }) {
  const price = t.price_per_day || t.price || 0
  return (
    <button
      onClick={() => onSelect(t.id)}
      style={{
        display: 'block',
        width: '100%',
        background: '#ffffff',
        border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 18,
        padding: '18px 20px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 0 0 4px var(--accent-dim)' : 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
            {t.icon}
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px', fontFamily: 'var(--font-display)' }}>
              {t.name}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 4px', lineHeight: 1.4 }}>
              {t.desc || t.description}
            </p>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              👥 {t.capacity ? `Maks. ${t.capacity} orang` : 'Kapasitas fleksibel'} • Termasuk Bahan Bakar & Driver
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
          <p style={{ fontSize: 16.5, fontWeight: 800, color: selected ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>
            {formatIDR(price)}
          </p>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.unit || '/hari'}</span>
        </div>
      </div>
      {selected && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 12.5, fontWeight: 700 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Armada Terpilih
        </div>
      )}
    </button>
  )
}

function GuideCard({ g, selected, onSelect }) {
  const langs = typeof g.languages === 'string' ? g.languages : (g.languages || g.lang || []).join(', ')
  const price = g.price_per_day || g.price || 0
  const photo = g.photo_url || g.photo
  return (
    <button
      onClick={() => onSelect(g.id)}
      style={{
        display: 'block',
        width: '100%',
        background: '#ffffff',
        border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 18,
        padding: '18px 20px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 0 0 4px var(--accent-dim)' : 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <img
          src={photo}
          alt={g.name}
          style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 }}
          onError={e => {
            e.target.onerror = null
            e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px', fontFamily: 'var(--font-display)' }}>
              {g.name}
            </p>
            {g.badge && (
              <span style={{ fontSize: 10.5, background: 'var(--accent-dim)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 9999, fontWeight: 800 }}>
                {g.badge}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 6px' }}>
            {g.specialization || g.spec} • {langs}
          </p>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, alignItems: 'center' }}>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>⭐ {g.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>📋 {g.total_tours || g.tours} tour sukses</span>
            <span style={{ fontWeight: 800, color: selected ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-display)', marginLeft: 'auto' }}>
              {formatIDR(price)}/hari
            </span>
          </div>
        </div>
      </div>
      {selected && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 12.5, fontWeight: 700 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Tour Guide Terpilih
        </div>
      )}
    </button>
  )
}
