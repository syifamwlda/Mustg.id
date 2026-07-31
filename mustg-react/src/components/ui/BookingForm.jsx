import { useState, useEffect } from 'react'
import { useDestinations } from '../../hooks/useDestinations'
import { formatIDR } from '../../data/destinations'

export default function BookingForm({ onSubmit, prefillDestId }) {
  const { destinations, loading } = useDestinations()
  const [visitDate, setVisitDate] = useState('')
  const [destId,    setDestId]    = useState('')
  const [ticketId,  setTicketId]  = useState('')
  const [qty,       setQty]       = useState(1)
  const [focused,   setFocused]   = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const selectedDest   = destinations.find(d => String(d.id) === String(destId))
  const tickets        = selectedDest?.tickets || []
  const selectedTicket = tickets.find(t => String(t.id) === String(ticketId))
  const total          = selectedTicket ? selectedTicket.price * qty : 0

  useEffect(() => {
    if (!prefillDestId || !destinations.length) return
    const match = destinations.find(d =>
      String(d.id) === String(prefillDestId) ||
      d.name?.toLowerCase().includes(String(prefillDestId).toLowerCase())
    )
    if (match) setDestId(String(match.id))
  }, [prefillDestId, destinations])

  useEffect(() => { setTicketId('') }, [destId])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedDest || !selectedTicket || !visitDate || qty < 1) return
    const destIdInt   = parseInt(selectedDest.id, 10)
    const ticketIdInt = parseInt(selectedTicket.id, 10)

    if (isNaN(destIdInt) || isNaN(ticketIdInt)) {
      alert('Data destinasi tidak valid. Pastikan backend sudah berjalan dan migration sudah dijalankan.')
      return
    }

    onSubmit?.({
      destination_id:  destIdInt,
      ticket_type_id:  ticketIdInt,
      visit_date:      visitDate,
      qty:             Number(qty),
      destination:     selectedDest,
      ticket:          selectedTicket,
    })
  }

  const iStyle = (name) => ({
    width: '100%', background: '#fff',
    border: `1.5px solid ${focused === name ? 'var(--accent)' : 'rgba(0,0,0,0.12)'}`,
    borderRadius: 12, padding: '13px 16px',
    color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-sans)',
    outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
    boxShadow: focused === name ? '0 0 0 4px var(--accent-dim)' : 'none',
  })

  const lStyle = {
    display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
    letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 7, fontFamily: 'var(--font-ui)'
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 20 }}>

        {/* Tanggal */}
        <div>
          <label style={lStyle}>📅 Tanggal Kunjungan</label>
          <input type="date" min={today} value={visitDate} required
            onChange={e => setVisitDate(e.target.value)}
            onFocus={() => setFocused('date')} onBlur={() => setFocused(null)}
            style={iStyle('date')} />
        </div>

        {/* Destinasi — dari backend */}
        <div>
          <label style={lStyle}>📍 Destinasi</label>
          <select value={destId} required onChange={e => setDestId(e.target.value)}
            onFocus={() => setFocused('dest')} onBlur={() => setFocused(null)}
            style={{ ...iStyle('dest'), color: destId ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            <option value="">{loading ? 'Memuat...' : 'Pilih Destinasi'}</option>
            {destinations.map(d => (
              <option key={d.id} value={String(d.id)}>{d.name} — {d.city}</option>
            ))}
          </select>
        </div>

        {/* Tiket */}
        <div>
          <label style={lStyle}>🎫 Jenis Tiket</label>
          <select value={ticketId} required disabled={!selectedDest}
            onChange={e => setTicketId(e.target.value)}
            onFocus={() => setFocused('ticket')} onBlur={() => setFocused(null)}
            style={{ ...iStyle('ticket'), color: ticketId ? 'var(--text-primary)' : 'var(--text-muted)', opacity: selectedDest ? 1 : 0.55 }}>
            <option value="">Pilih Tiket</option>
            {tickets.map(t => (
              <option key={t.id} value={String(t.id)}>{t.name} — {formatIDR(t.price)}</option>
            ))}
          </select>
        </div>

        {/* Qty */}
        <div>
          <label style={lStyle}>👥 Jumlah Tiket</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{ width: 44, height: 46, borderRadius: 10, background: 'var(--bg-3)', border: '1.5px solid var(--border)', fontSize: 20, cursor: 'pointer', flexShrink: 0 }}>−</button>
            <input type="number" min={1} max={20} value={qty}
              onChange={e => setQty(Number(e.target.value))}
              onFocus={() => setFocused('qty')} onBlur={() => setFocused(null)}
              style={{ ...iStyle('qty'), textAlign: 'center', flex: 1 }} />
            <button type="button" onClick={() => setQty(q => Math.min(20, q + 1))}
              style={{ width: 44, height: 46, borderRadius: 10, background: 'var(--accent-dim)', border: '1.5px solid rgba(0,102,255,0.2)', color: 'var(--accent)', fontSize: 20, cursor: 'pointer', flexShrink: 0 }}>+</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div>
          {total > 0 ? (
            <>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 3px', fontFamily: 'var(--font-ui)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Total Pembayaran</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', margin: 0, fontFamily: 'var(--font-ui)' }}>{formatIDR(total)}</p>
            </>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Pilih destinasi & tiket untuk melihat harga</p>
          )}
        </div>
        <button type="submit"
          style={{ background: 'linear-gradient(135deg,#0066ff,#00c6ff)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-ui)', boxShadow: '0 8px 24px rgba(0,102,255,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,102,255,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,102,255,0.35)' }}>
          Pesan Sekarang →
        </button>
      </div>
    </form>
  )
}