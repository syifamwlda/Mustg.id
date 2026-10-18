import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'

const QUICK = ['Destinasi terpopuler?', 'Tiket Prambanan?', 'Paket Lava Tour?', 'Cara reschedule?']
const BOTS = {
  default: 'Halo! Saya asisten pintar MustG.id 🌴 Siap bantu carikan destinasi impian, info tiket resmi, atau rute wisata seru di Yogyakarta!',
  destinasi: '📍 Destinasi terfavorit saat ini: Candi Prambanan (Rp50rb), Borobudur (Rp75rb), Obelix Hills (Rp25rb), dan Merapi Lava Tour Jeep (Rp350rb/jeep)!',
  harga: '🎫 Tiket resmi Candi Prambanan Rp50.000, Borobudur mulai Rp75.000. Bebas antre di loket dan langsung aktif!',
  booking: '🚙 Paket Merapi Lava Tour sudah termasuk Jeep 4x4, driver berpengalaman, BBM, dan asuransi. Cek menu Paket Tour untuk detailnya!',
  reschedule: '🔄 Reschedule tiket bisa dilakukan gratis maksimal H-1 sebelum tanggal kunjungan melalui menu Tiket Saya.',
}

const getReply = (msg) => {
  const m = msg.toLowerCase()
  if (m.includes('destinasi') || m.includes('populer') || m.includes('tempat') || m.includes('wisata')) return BOTS.destinasi
  if (m.includes('harga') || m.includes('tiket') || m.includes('borobudur') || m.includes('prambanan')) return BOTS.harga
  if (m.includes('merapi') || m.includes('jeep') || m.includes('lava') || m.includes('paket')) return BOTS.booking
  if (m.includes('reschedule') || m.includes('ubah') || m.includes('jadwal') || m.includes('batal')) return BOTS.reschedule
  return 'Terima kasih atas pertanyaannya! Kamu bisa langsung pilih destinasi di halaman beranda atau pesan paket bundling tour terlengkap bersama MustG.id 😊'
}

export default function AIChat() {
  const { chatOpen, setChatOpen } = useAppStore()
  const [msgs, setMsgs] = useState([{ id: 1, from: 'bot', text: BOTS.default }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  const send = (text) => {
    if (!text.trim()) return
    setMsgs(p => [...p, { id: Date.now(), from: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(p => [...p, { id: Date.now() + 1, from: 'bot', text: getReply(text) }])
    }, 600 + Math.random() * 400)
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 900,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: chatOpen ? '#ffffff' : 'var(--grad-primary)',
          border: chatOpen ? '1.5px solid var(--border)' : 'none',
          color: chatOpen ? 'var(--text-primary)' : '#ffffff',
          cursor: 'pointer',
          boxShadow: chatOpen ? 'var(--shadow-md)' : 'var(--shadow-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        title="Bantuan Wisata"
      >
        {chatOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <span style={{ fontSize: 24 }}>💬</span>
        )}
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 98,
            right: 28,
            zIndex: 900,
            width: 360,
            height: 510,
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'bottom right',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'var(--font-display)' }}>
                Asisten MustG.id
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Online • Siap Membantu</span>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '16px 18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {msgs.map(m => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.from === 'user' ? 'var(--accent)' : 'var(--bg)',
                  color: m.from === 'user' ? '#ffffff' : 'var(--text-primary)',
                  borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '11px 15px',
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  boxShadow: 'var(--shadow-xs)',
                  border: m.from === 'user' ? 'none' : '1px solid var(--border)',
                }}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'var(--bg)',
                  borderRadius: 16,
                  padding: '8px 14px',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                Sedang mengetik...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          <div style={{ padding: '8px 14px', display: 'flex', gap: 6, overflowX: 'auto', background: '#fafafa', borderTop: '1px solid var(--border)' }}>
            {QUICK.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 9999,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault()
              send(input)
            }}
            style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: '#ffffff' }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ketik pertanyaan wisata..."
              style={{
                flex: 1,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 13.5,
                outline: 'none',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--grad-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </>
  )
}
