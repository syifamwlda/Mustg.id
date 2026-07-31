import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { useScrollY } from '../../hooks/useDestinations'
import { authLogout } from '../../services/api'
import toast from 'react-hot-toast'

const LINKS = [
  { label:'Beranda',    page:'home' },
  { label:'Destinasi',  page:'destinations' },
  { label:'Paket Tour', page:'packages' },
  { label:'Tiket Saya', page:'my-tickets' },
]

export default function Navbar() {
  const { currentPage, navigate, wishlist, isLoggedIn, user, logout } = useAppStore()
  const scrollY = useScrollY()
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const dropRef = useRef(null)
  const scrolled = scrollY > 50

  const go = (link) => { setMenuOpen(false); navigate(link.page) }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setUserDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setUserDropOpen(false)
    try { await authLogout() } catch (_) {}
    logout()
    toast.success('Berhasil keluar. Sampai jumpa! 👋')
  }

  const initials = user?.name ? user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?'

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, height:'var(--nav-h)', background: scrolled?'rgba(255,255,255,0.96)':'transparent', backdropFilter: scrolled?'blur(20px)':'none', WebkitBackdropFilter: scrolled?'blur(20px)':'none', borderBottom: scrolled?'1px solid rgba(0,0,0,0.07)':'none', boxShadow: scrolled?'0 2px 16px rgba(0,0,0,0.06)':'none', transition:'all 0.35s ease' }}>
        <div style={{ maxWidth:'var(--max-w)', margin:'0 auto', padding:'0 28px', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>

          {/* Logo */}
          <button onClick={() => navigate('home')} style={{ background:'none', border:'none', display:'flex', alignItems:'center', gap:10, cursor:'pointer', flexShrink:0 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#0066ff,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, boxShadow:'0 4px 14px rgba(0,102,255,0.35)' }}>🌴</div>
            <div>
              <div style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:17, color:'#1a1a2e', lineHeight:1 }}>MustG<span style={{ color:'var(--accent)' }}>.id</span></div>
              <div style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.3px' }}>Wisata Yogyakarta</div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <ul style={{ display:'flex', listStyle:'none', gap:2, flex:1, justifyContent:'center' }} className="nav-links">
            {LINKS.map(link => {
              const active = currentPage === link.page
              return (
                <li key={link.label}>
                  <button onClick={() => go(link)} style={{ background: active?'var(--accent-dim)':'none', border:'none', padding:'8px 18px', borderRadius:99, fontSize:14, fontWeight: active?600:400, color: active?'var(--accent)':'var(--text-secondary)', cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--font-sans)' }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background='var(--bg-3)'; e.currentTarget.style.color='var(--text-primary)' }}}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-secondary)' }}}>
                    {link.label}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Right Actions */}
          <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
            {/* Wishlist */}
            <button onClick={() => navigate('destinations')} title="Wishlist"
              style={{ position:'relative', background:'none', border:'1.5px solid var(--border)', borderRadius:11, width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.background='var(--accent-dim)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='none' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill={wishlist.length?'#ff5a1f':'none'} stroke={wishlist.length?'#ff5a1f':'currentColor'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wishlist.length > 0 && <span style={{ position:'absolute', top:-5, right:-5, background:'#ff5a1f', color:'#fff', fontSize:10, fontWeight:700, width:17, height:17, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>{wishlist.length}</span>}
            </button>

            {isLoggedIn ? (
              /* User Avatar + Dropdown */
              <div ref={dropRef} style={{ position:'relative' }}>
                <button onClick={() => setUserDropOpen(o => !o)}
                  style={{ display:'flex', alignItems:'center', gap:8, background: userDropOpen ? 'var(--accent-dim)' : '#fff', border:'1.5px solid', borderColor: userDropOpen ? 'var(--accent)' : 'var(--border)', borderRadius:99, padding:'5px 14px 5px 5px', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e => { if (!userDropOpen) { e.currentTarget.style.borderColor='var(--accent)' }}}
                  onMouseLeave={e => { if (!userDropOpen) { e.currentTarget.style.borderColor='var(--border)' }}}>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#0066ff,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'var(--font-ui)', fontWeight:800, fontSize:12, flexShrink:0 }}>
                    {initials}
                  </div>
                  <span style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)', fontFamily:'var(--font-sans)', maxWidth:90, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" style={{ transform: userDropOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', flexShrink:0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {userDropOpen && (
                  <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0, width:220, background:'#fff', borderRadius:16, border:'1px solid var(--border)', boxShadow:'0 12px 40px rgba(0,0,0,0.12)', overflow:'hidden', animation:'slideDown 0.2s ease', zIndex:200 }}>
                    {/* User info */}
                    <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
                      <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:'0 0 2px', lineHeight:1.3 }}>{user?.name}</p>
                      <p style={{ fontSize:12, color:'var(--text-muted)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p>
                    </div>
                    {/* Menu items */}
                    {[
                      { icon:'🎫', label:'Tiket Saya', page:'my-tickets' },
                      { icon:'🏠', label:'Beranda',    page:'home' },
                    ].map(item => (
                      <button key={item.label} onClick={() => { setUserDropOpen(false); navigate(item.page) }}
                        style={{ display:'flex', alignItems:'center', gap:10, width:'100%', background:'none', border:'none', padding:'12px 16px', fontSize:14, color:'var(--text-primary)', cursor:'pointer', transition:'background 0.15s', fontFamily:'var(--font-sans)', textAlign:'left' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background='none'}>
                        <span style={{ fontSize:16 }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop:'1px solid var(--border)' }}>
                      <button onClick={handleLogout}
                        style={{ display:'flex', alignItems:'center', gap:10, width:'100%', background:'none', border:'none', padding:'12px 16px', fontSize:14, color:'#e53e3e', cursor:'pointer', transition:'background 0.15s', fontFamily:'var(--font-sans)', fontWeight:600, textAlign:'left' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(229,62,62,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background='none'}>
                        <span style={{ fontSize:16 }}>🚪</span>
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login / Register buttons */
              <>
                <button onClick={() => navigate('login')} className="nav-login-btn"
                  style={{ background:'none', border:'1.5px solid var(--border)', color:'var(--text-secondary)', borderRadius:12, padding:'9px 18px', fontFamily:'var(--font-sans)', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-secondary)' }}>
                  Masuk
                </button>
                <button onClick={() => navigate('register')} className="nav-cta"
                  style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'10px 22px', fontFamily:'var(--font-ui)', fontSize:14, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(0,102,255,0.3)', transition:'all 0.2s', whiteSpace:'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,102,255,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,102,255,0.3)' }}>
                  Daftar →
                </button>
              </>
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="nav-ham"
              style={{ background:'none', border:'1.5px solid var(--border)', borderRadius:10, width:40, height:40, display:'none', alignItems:'center', justifyContent:'center', color:'var(--text-primary)', cursor:'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'rgba(255,255,255,0.98)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', padding:'12px 24px 20px', animation:'slideDown 0.2s ease', boxShadow:'0 8px 32px rgba(0,0,0,0.1)' }}>
            {isLoggedIn && (
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0 14px', borderBottom:'1px solid var(--border)', marginBottom:4 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#0066ff,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'var(--font-ui)', fontWeight:800, fontSize:13 }}>{initials}</div>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', margin:0 }}>{user?.name}</p>
                  <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>{user?.email}</p>
                </div>
              </div>
            )}
            {LINKS.map(link => (
              <button key={link.label} onClick={() => go(link)}
                style={{ display:'block', width:'100%', textAlign:'left', background:'none', border:'none', padding:'13px 0', borderBottom:'1px solid var(--border)', fontSize:16, color: currentPage===link.page?'var(--accent)':'var(--text-primary)', fontWeight: currentPage===link.page?600:400, cursor:'pointer' }}>
                {link.label}
              </button>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:14 }}>
              {isLoggedIn ? (
                <button onClick={() => { setMenuOpen(false); handleLogout() }}
                  style={{ flex:1, background:'rgba(229,62,62,0.08)', color:'#e53e3e', border:'1.5px solid rgba(229,62,62,0.2)', borderRadius:12, padding:'13px', fontFamily:'var(--font-ui)', fontSize:15, fontWeight:700, cursor:'pointer' }}>
                  🚪 Keluar
                </button>
              ) : (
                <>
                  <button onClick={() => { setMenuOpen(false); navigate('login') }}
                    style={{ flex:1, background:'none', color:'var(--text-primary)', border:'1.5px solid var(--border)', borderRadius:12, padding:'13px', fontFamily:'var(--font-sans)', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                    Masuk
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('register') }}
                    style={{ flex:1, background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'13px', fontFamily:'var(--font-ui)', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                    Daftar →
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <style>{`
        @media(max-width:820px){
          .nav-links{display:none!important}
          .nav-cta{display:none!important}
          .nav-login-btn{display:none!important}
          .nav-ham{display:flex!important}
        }
      `}</style>
    </>
  )
}