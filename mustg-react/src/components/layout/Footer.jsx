import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import toast from 'react-hot-toast'

export default function Footer() {
  const { navigate } = useAppStore()
  const [email, setEmail] = useState('')
  const year = new Date().getFullYear()

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Terima kasih! Promo spesial akan dikirimkan ke email Anda.')
    setEmail('')
  }

  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border)', padding: '72px 24px 36px' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 48, marginBottom: 56 }}>
          {/* Brand info */}
          <div>
            <button
              onClick={() => navigate('home')}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                }}
              >
                🌴
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#0f172a' }}>
                MustG<span style={{ color: 'var(--accent)' }}>.id</span>
              </span>
            </button>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 300, margin: '0 0 24px' }}>
              Platform resmi pemesanan tiket wisata dan paket petualangan di Daerah Istimewa Yogyakarta. Transparan, aman, dan tanpa biaya tersembunyi.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { l: 'Instagram', icon: '📸' },
                { l: 'Twitter', icon: '𝕏' },
                { l: 'TikTok', icon: '🎵' },
                { l: 'YouTube', icon: '▶' },
              ].map(s => (
                <button
                  key={s.l}
                  title={s.l}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 14,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.background = 'var(--accent-dim)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'var(--bg)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1.2px', textTransform: 'uppercase', margin: '0 0 20px', fontFamily: 'var(--font-display)' }}>
              Jelajahi Jogja
            </h4>
            {[
              { label: 'Destinasi Populer', page: 'destinations' },
              { label: 'Paket Bundling Tour', page: 'packages' },
              { label: 'Cek E-Tiket Saya', page: 'my-tickets' },
              { label: 'Lava Tour Merapi', page: 'destinations' },
              { label: 'Sunrise Borobudur', page: 'packages' },
            ].map(l => (
              <button
                key={l.label}
                onClick={() => navigate(l.page)}
                style={{
                  display: 'block',
                  background: 'none',
                  border: 'none',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  margin: '0 0 12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  padding: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.transform = 'translateX(3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Customer support */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1.2px', textTransform: 'uppercase', margin: '0 0 20px', fontFamily: 'var(--font-display)' }}>
              Bantuan & Kebijakan
            </h4>
            {[
              'Pusat Bantuan & CS 24/7',
              'Ketentuan Reschedule Tiket',
              'Kebijakan Privasi Pengguna',
              'Syarat & Ketentuan Pemesanan',
              'Kerjasama Mitra Pengelola',
            ].map(l => (
              <span
                key={l}
                style={{
                  display: 'block',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  margin: '0 0 12px',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {l}
              </span>
            ))}
          </div>

          {/* Newsletter subscription */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '1.2px', textTransform: 'uppercase', margin: '0 0 20px', fontFamily: 'var(--font-display)' }}>
              Dapatkan Diskon & Promo
            </h4>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Daftarkan email Anda untuk menerima informasi promo kilat akhir pekan dan tips liburan di Yogyakarta.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="Masukkan email Anda..."
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12,
                  padding: '11px 14px',
                  fontSize: 13.5,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  minWidth: 0,
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--grad-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '11px 18px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-glow)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Kirim
              </button>
            </form>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            © {year} MustG.id — All rights reserved. Platform Resmi Wisata & Tiket Yogyakarta.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Dikelola dengan bangga di</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>Yogyakarta, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
