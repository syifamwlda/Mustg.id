import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { formatIDR } from '../../data/destinations'
import toast from 'react-hot-toast'

export default function DestinationCard({ destination: d, onBook }) {
  const { toggleWishlist, isWishlisted } = useAppStore()
  const [hovered, setHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const liked = isWishlisted(d.id)

  const handleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(d.id)
    toast(liked ? 'Dihapus dari wishlist' : '❤️ Disimpan ke wishlist!', { duration: 1800 })
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 20,
        border: `1.5px solid ${hovered ? 'rgba(0,102,255,0.18)' : 'rgba(0,0,0,0.07)'}`,
        overflow: 'hidden',
        boxShadow: hovered ? '0 20px 56px rgba(0,0,0,0.13)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', flexShrink: 0 }}>
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        <img src={d.thumbnail_url} alt={d.name}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${d.id}/600/400`; setImgLoaded(true) }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.5s ease', opacity: imgLoaded ? 1 : 0 }}
        />
        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)' }} />

        {/* Category chip */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderRadius: 99, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#1a1a2e', fontFamily: 'var(--font-ui)', letterSpacing: '0.3px' }}>
            {d.category}
          </span>
        </div>

        {/* Wishlist */}
        <button onClick={handleWishlist} style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 10, background: liked ? '#ff5a1f' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s', transform: liked ? 'scale(1.1)' : 'scale(1)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#fff' : 'none'} stroke={liked ? '#fff' : '#444'} strokeWidth="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Price bottom-left */}
        <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', margin: '0 0 1px', fontFamily: 'var(--font-ui)', letterSpacing: '0.5px' }}>MULAI DARI</p>
          <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-ui)', margin: 0, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>{formatIDR(d.startPrice)}</p>
        </div>

        {/* Rating bottom-right */}
        <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#f5a623" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{d.rating}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name + City */}
        <div style={{ marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', fontFamily: 'var(--font-ui)', lineHeight: 1.3 }}>{d.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.city}</span>
            <span style={{ fontSize: 12, color: 'var(--border-hover)', margin: '0 2px' }}>·</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.openHours}</span>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {d.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {d.tags?.slice(0,3).map(t => (
            <span key={t} style={{ fontSize: 11, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '3px 9px', borderRadius: 99, fontWeight: 600, fontFamily: 'var(--font-ui)' }}>{t}</span>
          ))}
        </div>

        {/* Reviews row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex' }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < Math.floor(d.rating) ? '#f5a623' : '#e5e5e5'} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({d.reviewCount?.toLocaleString()})</span>
          </div>
          <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>🏨 {d.hotels}</span>
            <span>⚡ {d.activities}</span>
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => onBook?.(d)}
          style={{
            width: '100%', borderRadius: 12, padding: '11px 0',
            background: hovered ? 'linear-gradient(135deg, #0066ff, #00c6ff)' : '#fff',
            color: hovered ? '#fff' : 'var(--accent)',
            border: `1.5px solid ${hovered ? 'transparent' : 'rgba(0,102,255,0.3)'}`,
            fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.25s',
            boxShadow: hovered ? '0 6px 20px rgba(0,102,255,0.3)' : 'none',
          }}>
          {hovered ? 'Booking Sekarang →' : 'Lihat Detail'}
        </button>
      </div>
    </div>
  )
}
