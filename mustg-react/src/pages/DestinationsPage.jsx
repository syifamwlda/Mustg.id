import { useState, useMemo } from 'react'
import Navbar from '../components/layout/Navbar'
import DestinationCard from '../components/ui/DestinationCard'
import Footer from '../components/layout/Footer'
import { useDestinations } from '../hooks/useDestinations'
import { useAppStore } from '../store/appStore'
import { categories } from '../data/destinations'
import toast from 'react-hot-toast'

export default function DestinationsPage() {
  const { navigate, setBookingDraft } = useAppStore()
  const { destinations, loading } = useDestinations()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [priceMax, setPriceMax] = useState(500000)
  const [searchFocus, setSearchFocus] = useState(false)

  const filtered = useMemo(() => {
    let list = destinations
    if (activeCategory !== 'all') list = list.filter(d => d.category === activeCategory)
    if (search.trim()) list = list.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase()))
    list = list.filter(d => d.startPrice <= priceMax)
    if (sortBy === 'popular') list = [...list].sort((a, b) => b.reviewCount - a.reviewCount)
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.startPrice - b.startPrice)
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.startPrice - a.startPrice)
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    return list
  }, [destinations, activeCategory, search, priceMax, sortBy])

  const handleBook = (dest) => {
    navigate('home')
    setTimeout(() => document.getElementById('booking-anchor')?.scrollIntoView({ behavior: 'smooth' }), 200)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Banner */}
      <div style={{
        height: 340, position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://i.pinimg.com/736x/06/3e/45/063e45d79bf7f847caf3f40ac144d82d.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%',
        display: 'flex', alignItems: 'flex-end',
        paddingTop: 'var(--nav-h)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,11,18,0.4) 0%, rgba(8,11,18,0.75) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: 48 }}>
          <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>JELAJAHI</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', color: '#fff', margin: '0 0 10px', fontWeight: 400 }}>
            Semua <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Destinasi</em> Wisata
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{destinations.length} destinasi tersedia untuk dieksplorasi</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, alignItems: 'start' }} className="dest-layout">
          {/* ─── SIDEBAR FILTER ─── */}
          <aside style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 20, padding: 24, position: 'sticky', top: 96 }} className="sidebar">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Filter</h3>

            {/* Category */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Kategori</p>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: 10, marginBottom: 4,
                    background: activeCategory === cat ? 'var(--accent-dim)' : 'none',
                    border: `1px solid ${activeCategory === cat ? 'rgba(0,229,200,0.3)' : 'transparent'}`,
                    color: activeCategory === cat ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer', fontWeight: activeCategory === cat ? 600 : 400,
                    transition: 'all 0.2s',
                  }}>
                  <span>{cat === 'all' ? 'Semua Destinasi' : cat}</span>
                  {activeCategory === cat && <span style={{ fontSize: 12 }}>✓</span>}
                </button>
              ))}
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Harga Maksimal</p>
              <input type="range" min={10000} max={500000} step={10000} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 8 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Rp 10rb</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Rp {(priceMax/1000).toFixed(0)}rb</span>
              </div>
            </div>

            {/* Sort */}
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>Urutkan</p>
              {[['popular','Paling Populer'],['rating','Rating Tertinggi'],['price-asc','Harga Termurah'],['price-desc','Harga Termahal']].map(([val, label]) => (
                <button key={val} onClick={() => setSortBy(val)}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: 10, marginBottom: 4,
                    background: sortBy === val ? 'var(--accent-dim)' : 'none',
                    border: `1px solid ${sortBy === val ? 'rgba(0,229,200,0.3)' : 'transparent'}`,
                    color: sortBy === val ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer', fontWeight: sortBy === val ? 600 : 400,
                    transition: 'all 0.2s',
                  }}>
                  {label} {sortBy === val && <span>✓</span>}
                </button>
              ))}
            </div>
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <div>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--bg-3)', border: `1.5px solid ${searchFocus ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 14, padding: '12px 18px', marginBottom: 28, transition: 'border-color 0.2s',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
                placeholder="Cari destinasi atau kota..."
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }} />
              {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>×</button>}
            </div>

            {/* Result count */}
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> destinasi
              {activeCategory !== 'all' && <span> dalam kategori <strong style={{ color: 'var(--accent)' }}>{activeCategory}</strong></span>}
            </p>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 460, borderRadius: 20, background: 'linear-gradient(90deg, var(--bg-2) 25%, var(--bg-3) 50%, var(--bg-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🏝️</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', marginBottom: 8 }}>Destinasi Tidak Ditemukan</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Coba ubah filter atau kata kunci pencarian.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('all'); setPriceMax(500000) }}
                  style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 12, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
                  Reset Filter
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {filtered.map((dest, i) => (
                  <div key={dest.id} style={{ animation: `fadeUp 0.4s ${i * 0.05}s both` }}>
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
        @media (max-width: 900px) {
          .dest-layout { grid-template-columns: 1fr !important; }
          .sidebar { position: static !important; }
        }
      `}</style>
    </div>
  )
}
