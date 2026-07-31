import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'

const QUICK = ['Destinasi populer?','Tiket Borobudur?','Cara booking?','Ada promo?']
const BOTS = {
  default: 'Halo! Saya asisten wisata MustG.id 🌴 Tanya soal destinasi, harga tiket, atau cara booking ya!',
  destinasi: '📍 Destinasi terpopuler: Prambanan (Rp50rb), Borobudur (Rp75rb), Obelix Hills (Rp50rb), Parangtritis (Rp15rb), Merapi Jeep Tour (Rp350rb)!',
  harga: '🎫 Tiket Borobudur mulai Rp75.000/orang. Cek halaman Destinasi untuk info lengkap dan booking langsung!',
  booking: '📲 Cara booking: 1️⃣ Pilih destinasi 2️⃣ Pilih tanggal & tiket 3️⃣ Isi data diri 4️⃣ Bayar 5️⃣ Terima e-ticket!',
  promo: '🎉 Promo aktif: diskon 15% untuk booking >2 tiket! Gunakan kode MUSTG15 saat checkout.',
}

const getReply = (msg) => {
  const m = msg.toLowerCase()
  if (m.includes('destinasi')||m.includes('populer')||m.includes('tempat')) return BOTS.destinasi
  if (m.includes('harga')||m.includes('tiket')||m.includes('borobudur')) return BOTS.harga
  if (m.includes('booking')||m.includes('pesan')||m.includes('cara')) return BOTS.booking
  if (m.includes('promo')||m.includes('diskon')||m.includes('murah')) return BOTS.promo
  return 'Terima kasih! Untuk info lebih lengkap cek halaman Destinasi atau hubungi kami via WhatsApp 😊'
}

export default function AIChat() {
  const { chatOpen, setChatOpen } = useAppStore()
  const [msgs, setMsgs] = useState([{ id: 1, from: 'bot', text: BOTS.default }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = (text) => {
    if (!text.trim()) return
    setMsgs(p => [...p, { id: Date.now(), from: 'user', text }])
    setInput(''); setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(p => [...p, { id: Date.now()+1, from: 'bot', text: getReply(text) }])
    }, 800 + Math.random() * 500)
  }

  return (
    <>
      {/* FAB */}
      <button onClick={() => setChatOpen(!chatOpen)}
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 900, width: 56, height: 56, borderRadius: '50%', background: chatOpen ? '#fff' : 'linear-gradient(135deg, #0066ff, #00c6ff)', border: chatOpen ? '1.5px solid var(--border)' : 'none', color: chatOpen ? 'var(--text-secondary)' : '#fff', cursor: 'pointer', boxShadow: chatOpen ? 'var(--shadow-md)' : '0 8px 28px rgba(0,102,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
        title="Chat Asisten">
        {chatOpen
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div style={{ position: 'fixed', bottom: 96, right: 28, zIndex: 900, width: 340, height: 480, background: '#fff', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.15)', animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)', transformOrigin: 'bottom right', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, #0066ff, #00c6ff)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'var(--font-ui)' }}>Travel Assistant</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }}/>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Online sekarang</span>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 30, height: 30, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg)' }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.from === 'user' ? 'linear-gradient(135deg, #0066ff, #00c6ff)' : '#fff', color: m.from === 'user' ? '#fff' : 'var(--text-primary)', fontSize: 13, lineHeight: 1.55, boxShadow: 'var(--shadow-sm)', border: m.from === 'bot' ? '1px solid var(--border)' : 'none' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: 5, padding: '10px 14px', background: '#fff', borderRadius: '14px 14px 14px 4px', width: 62, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-muted)', display: 'block', animation: `pulse 1.2s ${i*0.2}s infinite` }}/>)}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick Replies */}
          <div style={{ padding: '8px 12px', display: 'flex', gap: 6, overflowX: 'auto', borderTop: '1px solid var(--border)', background: '#fff' }}>
            {QUICK.map(r => (
              <button key={r} onClick={() => send(r)} style={{ fontSize: 11, color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid rgba(0,102,255,0.15)', borderRadius: 99, padding: '5px 11px', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)', flexShrink: 0, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent)' }}>
                {r}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: '#fff' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ketik pertanyaan..."
              style={{ flex: 1, background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '9px 13px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}/>
            <button onClick={() => send(input)} style={{ background: 'linear-gradient(135deg, #0066ff, #00c6ff)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,102,255,0.3)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
