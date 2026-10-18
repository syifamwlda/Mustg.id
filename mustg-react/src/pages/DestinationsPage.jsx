import { useState, useMemo } from 'react'
import Navbar from '../components/layout/Navbar'
import DestinationCard from '../components/ui/DestinationCard'
import Footer from '../components/layout/Footer'
import { useDestinations } from '../hooks/useDestinations'
import { useAppStore } from '../store/appStore'
import { categories } from '../data/destinations'

export default function DestinationsPage() {
  const { navigate } = useAppStore()
  const { destinations, loading } = useDestinations()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [priceMax, setPriceMax] = useState(500000)
  const [searchFocus, setSearchFocus] = useState(false)

  const filtered = useMemo(() => {
    let list = destinations
    if (activeCategory !== 'all') {
      list = list.filter(d => d.category?.toLowerCase() === activeCategory?.toLowerCase())
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q) ||
        d.tags?.some(t => t.toLowerCase().includes(q))
      )
    }
    list = list.filter(d => d.startPrice <= priceMax)
    if (sortBy === 'popular') list = [...list].sort((a, b) => b.reviewCount - a.reviewCount)
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.startPrice - b.startPrice)
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.startPrice - a.startPrice)
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [destinations, activeCategory, search, priceMax, sortBy])

  const handleBook = (dest) => {
    navigate('home')
    setTimeout(() => {
      document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' })
    }, 200)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Banner with HD Photography */}
      <div
        style={{
          height: 380,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url('https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          display: 'flex',
          alignItems: 'flex-end',
          paddingTop: 'var(--nav-h)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.75) 60%, rgba(15, 23, 42, 0.95) 100%)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: 48, width: '100%' }}>
          <span
            style={{
              fontSize: 12,
              color: '#93c5fd',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 10,
            }}
          >
            KATALOG WISATA YOGYAKARTA
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 54px)',
              color: '#ffffff',
              margin: '0 0 10px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Eksplorasi <span style={{ color: '#60a5fa' }}>Destinasi</span> Terbaik
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
            Temukan {destinations.length} destinasi budaya, alam, dan petualangan dengan harga tiket resmi.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="container" style={{ padding: '48px 24px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 36, alignItems: 'start' }} className="dest-layout">
          {/* ─── SIDEBAR FILTER ─── */}
          <aside
            style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 22,
              padding: 26,
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: 100,
            }}
            className="sidebar"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>
                Filter Destinasi
              </h3>
              <button
                onClick={() => {
                  setSearch('')
                  setActiveCategory('all')
                  setPriceMax(500000)
                  setSortBy('popular')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  color: 'var(--accent)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
                Kategori
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {categories.map(cat => {
                  const active = activeCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: active ? 'var(--accent-dim)' : 'transparent',
                        border: `1px solid ${active ? 'rgba(37, 99, 235, 0.25)' : 'transparent'}`,
                        color: active ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => {
                        if (!active) e.currentTarget.style.background = 'var(--bg)'
                      }}
                      onMouseLeave={e => {
                        if (!active) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <span>{cat === 'all' ? '✦ Semua Destinasi' : cat}</span>
                      {active && <span style={{ fontSize: 13, fontWeight: 800 }}>✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Budget Maksimal
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>
                  Rp {(priceMax / 1000).toLocaleString('id-ID')}rb
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={10000}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', marginBottom: 6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Rp 10.000</span>
                <span>Rp 500.000+</span>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
                Urutkan Berdasarkan
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['popular', '🔥 Paling Populer'],
                  ['rating', '⭐ Rating Tertinggi'],
                  ['price-asc', '💰 Harga Termurah'],
                  ['price-desc', '💎 Harga Tertinggi'],
                ].map(([val, label]) => {
                  const active = sortBy === val
                  return (
                    <button
                      key={val}
                      onClick={() => setSortBy(val)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: active ? 'var(--bg)' : 'transparent',
                        border: `1px solid ${active ? 'var(--border)' : 'transparent'}`,
                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: 13.5,
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => {
                        if (!active) e.currentTarget.style.background = 'var(--bg)'
                      }}
                      onMouseLeave={e => {
                        if (!active) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <span>{label}</span>
                      {active && <span style={{ color: 'var(--accent)', fontWeight: 800 }}>●</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* ─── MAIN CONTENT AREA ─── */}
          <div>
            {/* Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#ffffff',
                border: `1.5px solid ${searchFocus ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 16,
                padding: '14px 20px',
                marginBottom: 24,
                boxShadow: searchFocus ? '0 0 0 4px var(--accent-dim)' : 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                placeholder="Cari nama candi, gunung, bukit, atau kata kunci (contoh: Merapi, Sunset, Keraton)..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    background: 'var(--bg-surface)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Results count & status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
                Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> destinasi wisata
                {activeCategory !== 'all' && <span> dalam kategori <strong style={{ color: 'var(--accent)' }}>{activeCategory}</strong></span>}
              </p>
              {search && (
                <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
                  Hasil untuk "{search}"
                </span>
              )}
            </div>

            {/* Destinations Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ height: 440, borderRadius: 22 }} className="skeleton" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 24px',
                  background: '#ffffff',
                  borderRadius: 22,
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ fontSize: 56, marginBottom: 16 }}>🏝️</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 8px' }}>
                  Tidak Ada Destinasi yang Cocok
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
                  Coba sesuaikan kata kunci pencarian atau naikkan batas budget filter harga Anda.
                </p>
                <button
                  onClick={() => {
                    setSearch('')
                    setActiveCategory('all')
                    setPriceMax(500000)
                  }}
                  style={{
                    background: 'var(--grad-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 14,
                    padding: '12px 28px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-glow)',
                  }}
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
                {filtered.map((dest, i) => (
                  <div key={dest.id} style={{ animation: `fadeUp 0.35s ${i * 0.04}s both` }}>
                    <DestinationCard destination={dest} onBook={handleBook} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 960px) {
          .dest-layout {
            grid-template-columns: 1fr !important;
          }
          .sidebar {
            position: static !important;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  )
}
