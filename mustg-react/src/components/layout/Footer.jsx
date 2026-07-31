import { useAppStore } from '../../store/appStore'

export default function Footer() {
  const { navigate } = useAppStore()
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '64px 24px 32px' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, marginBottom: 56 }}>
          <div>
            <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, cursor: 'pointer' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #0066ff, #00c6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 14px rgba(0,102,255,0.3)' }}>🌴</div>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 17, color: '#1a1a2e' }}>MustG<span style={{ color: 'var(--accent)' }}>.id</span></span>
            </button>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 260, margin: '0 0 20px' }}>Platform wisata premium untuk menjelajahi keindahan Yogyakarta. Booking mudah, pengalaman tak terlupakan.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{l:'Instagram',i:'📸'},{l:'Twitter',i:'𝕏'},{l:'TikTok',i:'🎵'},{l:'YouTube',i:'▶'}].map(s=>(
                <button key={s.l} title={s.l} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.background='var(--accent-dim)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg)' }}>
                  {s.i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px', fontFamily: 'var(--font-ui)' }}>Jelajahi</h4>
            {['Destinasi Populer','Paket Wisata','Cara Kerja','Promo & Diskon','Blog Wisata'].map(l=>(
              <button key={l} style={{ display: 'block', background: 'none', border: 'none', fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}>{l}</button>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px', fontFamily: 'var(--font-ui)' }}>Bantuan</h4>
            {['Pusat Bantuan','Kebijakan Privasi','Syarat & Ketentuan','Hubungi Kami','FAQ'].map(l=>(
              <button key={l} style={{ display: 'block', background: 'none', border: 'none', fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 11px', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left', transition: 'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}>{l}</button>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 16px', fontFamily: 'var(--font-ui)' }}>Newsletter</h4>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 16px' }}>Dapatkan promo eksklusif langsung di inbox kamu.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="Email kamu..."
                style={{ flex: 1, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none', minWidth: 0, transition: 'border-color 0.2s' }}
                onFocus={e=>e.target.style.borderColor='var(--accent)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              <button style={{ background: 'linear-gradient(135deg,#0066ff,#00c6ff)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,102,255,0.25)' }}>→</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© {year} MustG.id — Platform Wisata Yogyakarta</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Dibuat dengan</span>
            <span style={{ color: '#e05252', fontSize: 14 }}>♥</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>di Yogyakarta</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
