import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { formatIDR } from '../data/destinations'
import { getOrder } from '../services/api'
import toast from 'react-hot-toast'

const STEPS = ['Pilih Tiket', 'Data Pemesan', 'Pembayaran', 'Selesai']
const PAY_LABEL = { BANK_TRANSFER: 'Transfer Bank (VA)', EWALLET: 'QRIS & E-Wallet', CARD: 'Kartu Kredit/Debit' }

function StepBar({ current }) {
  return (
    <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, overflowX: 'auto', padding: '10px 0' }}>
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
                  background: done || active ? 'var(--accent)' : 'var(--bg-surface)',
                  border: `2px solid ${done || active ? 'var(--accent)' : 'var(--border)'}`,
                  boxShadow: done || active ? 'var(--shadow-glow)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {done || active ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)' }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: done || active ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
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

export default function ReceiptPage() {
  const { navigate, orderData, setOrderData } = useAppStore()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const code = orderData?.order_code
    if (!code) return
    setRefreshing(true)
    getOrder(code)
      .then(fresh => setOrderData({ ...orderData, ...fresh }))
      .catch(() => {})
      .finally(() => setRefreshing(false))
  }, [])

  if (!orderData) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', background: '#fff', borderRadius: 24, padding: 48, boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎫</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            Data Pesanan Tidak Ditemukan
          </h2>
          <button
            onClick={() => navigate('home')}
            style={{
              background: 'var(--grad-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '12px 28px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  const {
    order_code,
    order_number,
    qty,
    total,
    total_amount,
    visit_date,
    payment_method,
    confirmed_at,
    created_at,
    customer_name,
    customer_phone,
    customer_email,
    ticket_subtotal,
    transport_subtotal,
    guide_subtotal,
    destination,
    ticket_type,
    transport,
    tour_guide,
  } = orderData

  const code = order_code || order_number || 'MG-00821'
  const destName = destination?.name || orderData?.ticket?.name || 'Wisata Yogyakarta'
  const destCity = destination?.city || 'Yogyakarta'
  const destThumb = destination?.thumbnail_url || 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=1200&auto=format&fit=crop'
  const ticketName = ticket_type?.name || orderData?.ticket?.name || 'Tiket Kunjungan Reguler'
  const finalTotal = total || total_amount || 0

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Topbar */}
      <div className="no-print" style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', height: 68, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌴</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
              MustG<span style={{ color: 'var(--accent)' }}>.id</span>
            </span>
          </button>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(code)
                toast.success('Kode tiket disalin!')
              }}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              📋 Salin Kode
            </button>
            <button
              onClick={() => window.print()}
              style={{
                background: 'var(--grad-primary)',
                border: 'none',
                borderRadius: 10,
                padding: '8px 18px',
                fontSize: 13,
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              🖨️ Cetak E-Tiket
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 760, margin: '0 auto', padding: '44px 24px 80px' }}>
        <StepBar current={3} />

        {/* Celebration Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              background: 'rgba(5, 150, 105, 0.1)',
              border: '2px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 36,
            }}
          >
            🎉
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--text-primary)', margin: '0 0 8px', fontWeight: 800 }}>
            Pemesanan Tiket <span style={{ color: 'var(--accent)' }}>Berhasil!</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
            E-Tiket resmi telah diterbitkan. Tunjukkan barcode/QR Code ini langsung ke petugas gerbang masuk.
          </p>
        </div>

        {/* Luxury Boarding Pass / Ticket Voucher Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 26,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Card Top Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(2, 132, 199, 0.05) 100%)',
              borderBottom: '1px dashed rgba(37, 99, 235, 0.2)',
              padding: '24px 30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌴</div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', margin: 0 }}>
                  MustG<span style={{ color: 'var(--accent)' }}>.id</span>
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Tiket Digital Resmi Wisata Yogyakarta</p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                KODE E-TIKET
              </span>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '2px' }}>
                {code}
              </span>
            </div>
          </div>

          {/* Verification Bar */}
          <div style={{ padding: '12px 30px', background: 'rgba(5, 150, 105, 0.06)', borderBottom: '1px solid rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#059669' }}>
              STATUS: LUNAS & AKTIF
            </span>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {confirmed_at ? new Date(confirmed_at).toLocaleString('id-ID') : new Date().toLocaleString('id-ID')}
            </span>
          </div>

          {/* Destination HD Image */}
          <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
            <img
              src={destThumb}
              alt={destName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.65) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 26 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                {destName}
              </h2>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                📍 {destCity}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div style={{ padding: '26px 30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
              {[
                ['NAMA PENGUNJUNG', customer_name || 'Wisatawan'],
                ['NOMOR WHATSAPP', customer_phone || '—'],
                ['ALAMAT EMAIL', customer_email || '—'],
                ['TANGGAL KUNJUNGAN', visit_date ? new Date(visit_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'],
                ['KATEGORI TIKET', ticketName],
                ['JUMLAH PESERTA', `${qty || 1} Orang`],
                ['METODE BAYAR', PAY_LABEL[payment_method] || payment_method || 'Transfer Bank'],
                ['AKSES GERBANG', 'Pintu Masuk Utama Loket'],
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.8px', display: 'block', marginBottom: 4 }}>
                    {lbl}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/* Perforated Line */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 -30px 24px' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg)', flexShrink: 0 }} />
              <div style={{ flex: 1, borderTop: '2px dashed var(--border)' }} />
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg)', flexShrink: 0 }} />
            </div>

            {/* Total & Barcode / QR Mockup */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  TOTAL PEMBAYARAN LUNAS
                </span>
                <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  {formatIDR(finalTotal)}
                </span>
              </div>

              {/* QR Code Graphic Mockup */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--border)',
                  borderRadius: 14,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    background: '#0f172a',
                    borderRadius: 8,
                    padding: 4,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 2,
                  }}
                >
                  {[1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1].map((dot, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: dot ? '#ffffff' : 'transparent',
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </div>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                    SCAN DI LOKET
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Resmi MustG.id
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '14px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Tunjukkan voucher digital ini di pintu masuk tanpa perlu dicetak.
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>MUSTG.ID</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('home')}
            style={{
              flex: 1,
              minWidth: 170,
              background: 'var(--grad-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '15px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            🏠 Kembali ke Beranda
          </button>
          <button
            onClick={() => navigate('destinations')}
            style={{
              flex: 1,
              minWidth: 170,
              background: '#ffffff',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border)',
              borderRadius: 14,
              padding: '15px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🗺️ Jelajah Destinasi Lain
          </button>
          <button
            onClick={() => navigate('my-tickets')}
            style={{
              background: '#ffffff',
              color: 'var(--text-secondary)',
              border: '1.5px solid var(--border)',
              borderRadius: 14,
              padding: '15px 22px',
              fontSize: 14.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🎫 Lihat Semua Tiket Saya
          </button>
        </div>
      </div>
    </div>
  )
}
