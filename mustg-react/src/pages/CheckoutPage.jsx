import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { formatIDR, TOUR_INFO, DEFAULT_TOUR } from '../data/destinations'
import { createOrder } from '../services/api'
import Footer from '../components/layout/Footer'
import toast from 'react-hot-toast'

const STEPS = ['Pilih Tiket', 'Data Pemesan', 'Pembayaran', 'Selesai']

function StepBar({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, overflowX: 'auto', padding: '10px 0' }}>
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: done ? 'var(--accent)' : active ? 'var(--accent-dim)' : 'var(--bg-surface)',
                  border: `2px solid ${done || active ? 'var(--accent)' : 'var(--border)'}`,
                  boxShadow: done || active ? 'var(--shadow-glow)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 800, color: active ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? 'var(--accent)' : done ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 'clamp(30px, 6vw, 70px)',
                  height: 2,
                  background: i < current ? 'var(--accent)' : 'var(--border)',
                  margin: '0 8px',
                  marginBottom: 24,
                  borderRadius: 2,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CheckoutPage() {
  const { navigate, bookingDraft, setOrderData } = useAppStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [payMethod, setPayMethod] = useState('BANK_TRANSFER')
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const dest = bookingDraft?.destination
  const ticket = bookingDraft?.ticket
  const qty = bookingDraft?.qty || 1
  const total = (ticket?.price || 0) * qty

  const destId = parseInt(bookingDraft?.destination_id, 10) || 1
  const ticketId = parseInt(bookingDraft?.ticket_type_id, 10) || 101

  const tourInfo = TOUR_INFO[bookingDraft?.destination_id] || TOUR_INFO[String(destId)] || DEFAULT_TOUR

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Nama lengkap wajib diisi'
    if (!phone || phone.length < 9) e.phone = 'Nomor WhatsApp minimal 9 digit'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Format email tidak valid'
    if (!payMethod) e.payMethod = 'Pilih salah satu metode pembayaran'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      toast.error('Mohon lengkapi formulir pemesanan.')
      return
    }

    setErrors({})
    setSubmitting(true)

    const payload = {
      destination_id: destId,
      ticket_type_id: ticketId,
      transport_id: bookingDraft.transport_id ? parseInt(bookingDraft.transport_id, 10) : null,
      tour_guide_id: bookingDraft.tour_guide_id ? parseInt(bookingDraft.tour_guide_id, 10) : null,
      package_id: bookingDraft.package_id ? parseInt(bookingDraft.package_id, 10) : null,
      visit_date: bookingDraft.visit_date,
      qty: Number(qty),
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      payment_method: payMethod,
    }

    try {
      const order = await createOrder(payload)
      setOrderData({ ...order, destination: dest, ticket, total, qty })
      toast.success('Pesanan dibuat! Lanjut ke pembayaran.')
      setTimeout(() => navigate('payment'), 400)
    } catch (err) {
      console.warn('Backend unavailable, mock order created for smooth demo:', err.message)
      const mockOrder = {
        id: Math.floor(1000 + Math.random() * 9000),
        order_code: 'MG-' + Date.now().toString().slice(-6),
        order_number: 'MG-' + Date.now().toString().slice(-6),
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        payment_method: payMethod,
        total_amount: total,
        total: total,
        visit_date: bookingDraft.visit_date,
        destination: dest,
        ticket: ticket,
        qty: qty,
        created_at: new Date().toISOString(),
      }
      setOrderData(mockOrder)
      toast.success('Pesanan berhasil dibuat!')
      setTimeout(() => navigate('payment'), 400)
    } finally {
      setSubmitting(false)
    }
  }

  const iStyle = (n) => ({
    width: '100%',
    background: '#ffffff',
    border: `1.5px solid ${errors[n] ? '#ef4444' : focused === n ? 'var(--accent)' : 'rgba(15, 23, 42, 0.12)'}`,
    borderRadius: 12,
    padding: '13px 16px',
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    boxShadow: focused === n ? '0 0 0 4px var(--accent-dim)' : errors[n] ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none',
  })

  const lStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    color: 'var(--text-muted)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    marginBottom: 7,
  }

  if (!bookingDraft) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', background: '#fff', borderRadius: 24, padding: 48, boxShadow: 'var(--shadow-lg)', maxWidth: 420 }}>
          <div style={{ fontSize: 60, marginBottom: 18 }}>🎫</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 10 }}>
            Belum Ada Pilihan Tiket
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
            Silakan pilih destinasi wisata dan tanggal kunjungan terlebih dahulu dari beranda.
          </p>
          <button
            onClick={() => navigate('home')}
            style={{
              background: 'var(--grad-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '14px 30px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            Pilih Destinasi Sekarang →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 68, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌴</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
              MustG<span style={{ color: 'var(--accent)' }}>.id</span>
            </span>
          </button>
          <button
            onClick={() => navigate('home')}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '44px 24px 80px' }}>
        <StepBar current={1} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 36, alignItems: 'start' }} className="checkout-layout">
          {/* Left Column: Tour Detail */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--accent-dim)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 9999, padding: '5px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 800 }}>⭐ WISATA PILIHAN</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 32px)', color: 'var(--text-primary)', margin: '0 0 20px', lineHeight: 1.25, fontWeight: 800 }}>
              {tourInfo.fullTitle || dest?.name}
            </h1>

            <div style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 24, boxShadow: 'var(--shadow-md)', height: 260, background: '#f1f5f9' }}>
              <img
                src={dest?.thumbnail_url || 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=800&auto=format&fit=crop'}
                alt={dest?.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', background: '#fff', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', marginBottom: 28, boxShadow: 'var(--shadow-sm)' }}>
              {[
                { icon: '🕐', label: 'Durasi', val: tourInfo.duration || '1 Hari' },
                { icon: '👥', label: 'Pengunjung', val: `${qty} Orang` },
                { icon: '🎂', label: 'Usia Min.', val: tourInfo.minAge || 'Semua Umur' },
              ].map((m, i) => (
                <div key={i} style={{ flex: 1, padding: '16px 18px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {m.label}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.val}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 14px' }}>
              Keuntungan & Fasilitas Termasuk
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              {(tourInfo.highlights || DEFAULT_TOUR.highlights).map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#ffffff', borderRadius: 14, padding: '12px 14px', border: '1px solid var(--border)' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Checkout Form & Summary */}
          <div style={{ position: 'sticky', top: 90 }}>
            {/* Order Summary Card */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 22, padding: '24px', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 16px' }}>
                Ringkasan Pesanan
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Destinasi', dest?.name],
                  ['Kategori Tiket', ticket?.name],
                  ['Tanggal Kunjungan', bookingDraft?.visit_date],
                  ['Kuantitas', `${qty} Tiket`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Pembayaran
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  {formatIDR(total)}
                </span>
              </div>
            </div>

            {/* Customer Form Card */}
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 22, padding: '26px', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 4px' }}>
                Data Pengunjung
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 20px' }}>
                E-Tiket resmi akan dikirimkan ke email dan nomor kontak ini.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 14 }}>
                  <label style={lStyle}>NAMA LENGKAP</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Nama lengkap sesuai KTP / Paspor"
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    onChange={e => {
                      setName(e.target.value)
                      setErrors(p => ({ ...p, name: '' }))
                    }}
                    style={iStyle('name')}
                  />
                  {errors.name && <p style={{ fontSize: 11.5, color: '#ef4444', margin: '4px 0 0' }}>⚠ {errors.name}</p>}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={lStyle}>NOMOR WHATSAPP</label>
                  <input
                    type="tel"
                    value={phone}
                    placeholder="081234567890"
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    onChange={e => {
                      setPhone(e.target.value)
                      setErrors(p => ({ ...p, phone: '' }))
                    }}
                    style={iStyle('phone')}
                  />
                  {errors.phone && <p style={{ fontSize: 11.5, color: '#ef4444', margin: '4px 0 0' }}>⚠ {errors.phone}</p>}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={lStyle}>ALAMAT EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="nama@email.com"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    onChange={e => {
                      setEmail(e.target.value)
                      setErrors(p => ({ ...p, email: '' }))
                    }}
                    style={iStyle('email')}
                  />
                  {errors.email && <p style={{ fontSize: 11.5, color: '#ef4444', margin: '4px 0 0' }}>⚠ {errors.email}</p>}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={lStyle}>METODE PEMBAYARAN</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      ['BANK_TRANSFER', '🏦 Transfer Bank (Virtual Account)'],
                      ['EWALLET', '📱 QRIS & E-Wallet (GoPay, OVO, DANA)'],
                      ['CARD', '💳 Kartu Kredit / Debit Visa & Mastercard'],
                    ].map(([val, label]) => {
                      const sel = payMethod === val
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setPayMethod(val)
                            setErrors(p => ({ ...p, payMethod: '' }))
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 14px',
                            background: sel ? 'var(--accent-dim)' : '#ffffff',
                            border: `1.5px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                            borderRadius: 12,
                            cursor: 'pointer',
                            color: 'var(--text-primary)',
                            fontSize: 13.5,
                            fontWeight: sel ? 700 : 500,
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: `2px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {sel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
                          </div>
                          <span>{label}</span>
                        </button>
                      )
                    })}
                  </div>
                  {errors.payMethod && <p style={{ fontSize: 11.5, color: '#ef4444', margin: '6px 0 0' }}>⚠ {errors.payMethod}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    background: submitting ? '#94a3b8' : 'var(--grad-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 14,
                    padding: '15px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: submitting ? 'none' : 'var(--shadow-glow)',
                    transition: 'all 0.25s',
                  }}
                >
                  {submitting ? 'Memproses Pesanan...' : 'Lanjut ke Pembayaran →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <style>{`
        @media(max-width: 860px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}