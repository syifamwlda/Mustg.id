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
        background: '#ffffff',
        borderRadius: 22,
        border: `1px solid ${hovered ? 'rgba(37, 99, 235, 0.25)' : 'rgba(15, 23, 42, 0.08)'}`,
        overflow: 'hidden',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => onBook?.(d)}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', height: 230, overflow: 'hidden', flexShrink: 0, background: '#f1f5f9' }}>
        <img
          src={d.thumbnail_url}
          alt={d.name}
          onError={e => {
            e.target.onerror = null
            e.target.src = `https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=800&auto=format&fit=crop`
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'block',
          }}
        />

        {/* Gradient Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0) 40%, rgba(15, 23, 42, 0.7) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Category Pill */}
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: 9999,
              padding: '5px 12px',
              fontSize: 11.5,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '0.3px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>●</span> {d.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: liked ? '#ff5722' : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: liked ? 'scale(1.08)' : 'scale(1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={liked ? '#fff' : 'none'} stroke={liked ? '#fff' : '#0f172a'} strokeWidth="2.4">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Overlay Price & Rating */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.6px', textTransform: 'uppercase', display: 'block', marginBottom: 1 }}>
              Mulai dari
            </span>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {formatIDR(d.startPrice)}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 10,
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{d.rating}</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>({d.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name & City */}
        <div style={{ marginBottom: 10 }}>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 6px',
              fontFamily: 'var(--font-display)',
              lineHeight: 1.3,
            }}
          >
            {d.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--text-secondary)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {d.city}
            </span>
            <span style={{ fontSize: 12, color: 'var(--border)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {d.openHours}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: '0 0 14px',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {d.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {d.tags?.slice(0, 3).map(t => (
            <span
              key={t}
              style={{
                fontSize: 11,
                color: 'var(--accent)',
                background: 'rgba(37, 99, 235, 0.06)',
                border: '1px solid rgba(37, 99, 235, 0.12)',
                padding: '3px 10px',
                borderRadius: 9999,
                fontWeight: 600,
              }}
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onBook?.(d)
          }}
          style={{
            width: '100%',
            borderRadius: 14,
            padding: '12px 0',
            background: hovered ? 'var(--grad-primary)' : 'var(--bg)',
            color: hovered ? '#ffffff' : 'var(--accent)',
            border: `1px solid ${hovered ? 'transparent' : 'rgba(37, 99, 235, 0.2)'}`,
            fontFamily: 'var(--font-sans)',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: hovered ? 'var(--shadow-glow)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>{hovered ? 'Pesan Tiket Sekarang' : 'Lihat Detail Tiket'}</span>
          <span style={{ transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s' }}>→</span>
        </button>
      </div>
    </div>
  )
}
