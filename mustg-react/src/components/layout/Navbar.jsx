import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { useScrollY } from '../../hooks/useDestinations'
import { authLogout } from '../../services/api'
import toast from 'react-hot-toast'

const LINKS = [
  { label: 'Beranda', page: 'home' },
  { label: 'Destinasi', page: 'destinations' },
  { label: 'Paket Tour', page: 'packages' },
  { label: 'Tiket Saya', page: 'my-tickets' },
]

export default function Navbar() {
  const { currentPage, navigate, wishlist, isLoggedIn, user, logout } = useAppStore()
  const scrollY = useScrollY()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const dropRef = useRef(null)
  const scrolled = scrollY > 20

  const go = (link) => {
    setMenuOpen(false)
    navigate(link.page)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setUserDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setUserDropOpen(false)
    try { await authLogout() } catch (_) {}
    logout()
    toast.success('Berhasil keluar. Sampai jumpa! 👋')
  }

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 'var(--nav-h)',
          background: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.06)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              flexShrink: 0,
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
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              }}
            >
              🌴
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 20,
                  color: '#0f172a',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                MustG<span style={{ color: 'var(--accent)' }}>.id</span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.4px',
                  marginTop: 2,
                }}
              >
                Yogyakarta Tourism
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              gap: 6,
              flex: 1,
              justifyContent: 'center',
              padding: '4px',
              background: 'rgba(15, 23, 42, 0.03)',
              borderRadius: '9999px',
              maxWidth: 420,
            }}
            className="nav-links"
          >
            {LINKS.map(link => {
              const active = currentPage === link.page
              return (
                <li key={link.label} style={{ flex: 1 }}>
                  <button
                    onClick={() => go(link)}
                    style={{
                      width: '100%',
                      background: active ? '#ffffff' : 'transparent',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontSize: 13.5,
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--font-sans)',
                      boxShadow: active ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color = 'var(--text-primary)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color = 'var(--text-secondary)'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Right Actions */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            {/* Wishlist */}
            <button
              onClick={() => navigate('destinations')}
              title="Wishlist Destinasi"
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 12,
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: wishlist.length ? '#ff5722' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.length ? '#ff5722' : 'none'} stroke={wishlist.length ? '#ff5722' : 'currentColor'} strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: '#ff5722',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 800,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 6px rgba(255,87,34,0.4)',
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropOpen(o => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#fff',
                    border: '1px solid',
                    borderColor: userDropOpen ? 'var(--accent)' : 'var(--border)',
                    borderRadius: 9999,
                    padding: '5px 14px 5px 6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      maxWidth: 100,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" style={{ transform: userDropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {userDropOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: 230,
                      background: '#fff',
                      borderRadius: 18,
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-lg)',
                      overflow: 'hidden',
                      animation: 'fadeUp 0.2s ease',
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px' }}>{user?.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                    </div>
                    {[
                      { icon: '🎫', label: 'Tiket Saya', page: 'my-tickets' },
                      { icon: '🗺️', label: 'Jelajah Destinasi', page: 'destinations' },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={() => { setUserDropOpen(false); navigate(item.page) }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          padding: '12px 18px',
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)', padding: '6px' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          borderRadius: 10,
                          padding: '10px 12px',
                          fontSize: 14,
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <span style={{ fontSize: 16 }}>🚪</span>
                        Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('login')}
                  className="nav-login-btn"
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    borderRadius: 12,
                    padding: '9px 18px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="nav-cta"
                  style={{
                    background: 'var(--grad-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 22px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-glow)',
                    transition: 'all 0.25s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
                  }}
                >
                  Daftar Akun
                </button>
              </>
            )}

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-ham"
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 10,
                width: 42,
                height: 42,
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px 24px',
              animation: 'fadeUp 0.2s ease',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {isLoggedIn && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0 16px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>{initials}</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{user?.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{user?.email}</p>
                </div>
              </div>
            )}
            {LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => go(link)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 16,
                  color: currentPage === link.page ? 'var(--accent)' : 'var(--text-primary)',
                  fontWeight: currentPage === link.page ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </button>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {isLoggedIn ? (
                <button
                  onClick={() => { setMenuOpen(false); handleLogout() }}
                  style={{
                    flex: 1,
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 12,
                    padding: '13px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Keluar Akun
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('login') }}
                    style={{
                      flex: 1,
                      background: '#fff',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      padding: '12px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('register') }}
                    style={{
                      flex: 1,
                      background: 'var(--grad-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      padding: '12px',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Daftar Akun
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <style>{`
        @media(max-width:860px){
          .nav-links{display:none!important}
          .nav-cta{display:none!important}
          .nav-login-btn{display:none!important}
          .nav-ham{display:flex!important}
        }
      `}</style>
    </>
  )
}