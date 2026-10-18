import { useState, useEffect } from 'react'
import { useDestinations } from '../../hooks/useDestinations'
import { formatIDR } from '../../data/destinations'

export default function BookingForm({ onSubmit, prefillDestId }) {
  const { destinations, loading } = useDestinations()
  const [visitDate, setVisitDate] = useState('')
  const [destId, setDestId] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [qty, setQty] = useState(1)
  const [focused, setFocused] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const selectedDest = destinations.find(d => String(d.id) === String(destId))
  const tickets = selectedDest?.tickets || []
  const selectedTicket = tickets.find(t => String(t.id) === String(ticketId))
  const total = selectedTicket ? selectedTicket.price * qty : 0

  useEffect(() => {
    if (!prefillDestId || !destinations.length) return
    const match = destinations.find(d =>
      String(d.id) === String(prefillDestId) ||
      d.name?.toLowerCase().includes(String(prefillDestId).toLowerCase())
    )
    if (match) {
      setDestId(String(match.id))
      if (match.tickets?.length > 0) {
        setTicketId(String(match.tickets[0].id))
      }
    }
  }, [prefillDestId, destinations])

  useEffect(() => {
    if (selectedDest && tickets.length > 0 && !ticketId) {
      setTicketId(String(tickets[0].id))
    }
  }, [destId, selectedDest, tickets, ticketId])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedDest || !selectedTicket || !visitDate || qty < 1) return

    const destIdInt = parseInt(selectedDest.id, 10) || 1
    const ticketIdInt = parseInt(selectedTicket.id, 10) || 101

    onSubmit?.({
      destination_id: destIdInt,
      ticket_type_id: ticketIdInt,
      visit_date: visitDate,
      qty: Number(qty),
      destination: selectedDest,
      ticket: selectedTicket,
    })
  }

  const inputStyle = (name) => ({
    width: '100%',
    background: '#ffffff',
    border: `1.5px solid ${focused === name ? 'var(--accent)' : 'rgba(15, 23, 42, 0.12)'}`,
    borderRadius: 14,
    padding: '13px 16px',
    color: 'var(--text-primary)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    boxShadow: focused === name ? '0 0 0 4px var(--accent-dim)' : 'none',
  })

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--text-secondary)',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    marginBottom: 8,
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 26,
        padding: '30px 32px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        position: 'relative',
      }}
    >
      {/* Top Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎫</span>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>
            Pesan Tiket Wisata Online
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(5, 150, 105, 0.08)', padding: '5px 12px', borderRadius: 9999 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>Konfirmasi Instan</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 18,
            marginBottom: 24,
          }}
        >
          {/* Tanggal */}
          <div>
            <label style={labelStyle}>
              <span>📅</span>
              <span>Tanggal Kunjungan</span>
            </label>
            <input
              type="date"
              min={today}
              value={visitDate}
              required
              onChange={e => setVisitDate(e.target.value)}
              onFocus={() => setFocused('date')}
              onBlur={() => setFocused(null)}
              style={inputStyle('date')}
            />
          </div>

          {/* Destinasi */}
          <div>
            <label style={labelStyle}>
              <span>📍</span>
              <span>Pilih Destinasi</span>
            </label>
            <select
              value={destId}
              required
              onChange={e => setDestId(e.target.value)}
              onFocus={() => setFocused('dest')}
              onBlur={() => setFocused(null)}
              style={{
                ...inputStyle('dest'),
                color: destId ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <option value="">{loading ? 'Memuat destinasi...' : '— Pilih Destinasi Wisata —'}</option>
              {destinations.map(d => (
                <option key={d.id} value={String(d.id)}>
                  {d.name} ({d.city})
                </option>
              ))}
            </select>
          </div>

          {/* Tiket */}
          <div>
            <label style={labelStyle}>
              <span>🎟️</span>
              <span>Kategori Tiket</span>
            </label>
            <select
              value={ticketId}
              required
              disabled={!selectedDest}
              onChange={e => setTicketId(e.target.value)}
              onFocus={() => setFocused('ticket')}
              onBlur={() => setFocused(null)}
              style={{
                ...inputStyle('ticket'),
                color: ticketId ? 'var(--text-primary)' : 'var(--text-muted)',
                opacity: selectedDest ? 1 : 0.6,
                cursor: selectedDest ? 'pointer' : 'not-allowed',
              }}
            >
              <option value="">{selectedDest ? '— Pilih Jenis Tiket —' : 'Pilih destinasi dulu'}</option>
              {tickets.map(t => (
                <option key={t.id} value={String(t.id)}>
                  {t.name} — {formatIDR(t.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Qty */}
          <div>
            <label style={labelStyle}>
              <span>👥</span>
              <span>Jumlah Tiket</span>
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={50}
                value={qty}
                onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                onFocus={() => setFocused('qty')}
                onBlur={() => setFocused(null)}
                style={{
                  ...inputStyle('qty'),
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  height: 48,
                }}
              />
              <button
                type="button"
                onClick={() => setQty(q => Math.min(50, q + 1))}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--accent-dim)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  color: 'var(--accent)',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-dim)'}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer Summary & Action */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            paddingTop: 20,
            borderTop: '1px solid var(--border)',
          }}
        >
          <div>
            {total > 0 ? (
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 2 }}>
                  Perkiraan Total Bayar ({qty} Tiket)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                    {formatIDR(total)}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--emerald)', fontWeight: 600 }}>
                    • Termasuk Asuransi
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0 }}>
                💡 Pilih destinasi, tanggal & jenis tiket untuk melihat total biaya
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              background: 'var(--grad-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 14,
              padding: '14px 34px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'var(--shadow-glow)',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 14px 32px rgba(37, 99, 235, 0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
            }}
          >
            <span>Lanjut Pesan Tiket</span>
            <span style={{ fontSize: 16 }}>→</span>
          </button>
        </div>
      </form>
    </div>
  )
}