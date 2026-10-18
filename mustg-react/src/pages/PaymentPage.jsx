import { useState, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { formatIDR } from '../data/destinations'
import { confirmPayment } from '../services/api'
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

const PAY_INFO = {
  BANK_TRANSFER: {
    icon: '🏦',
    title: 'Transfer Bank (Virtual Account)',
    steps: [
      'Buka aplikasi m-Banking atau ATM bank Anda',
      'Pilih menu Transfer Virtual Account / Antar Bank',
      'Salin dan masukkan nomor rekening Virtual Account di bawah',
      'Pastikan nominal transfer sesuai tepat dengan total pembayaran',
      'Konfirmasi pembayaran dan simpan bukti transfer',
    ],
    detail: { bank: 'BCA Virtual Account', no: '8271-0895-4421-9901', atas: 'MustG.id Yogyakarta' },
  },
  EWALLET: {
    icon: '📱',
    title: 'QRIS & E-Wallet (GoPay, OVO, DANA, ShopeePay)',
    steps: [
      'Buka aplikasi e-wallet pilihan Anda',
      'Scan QR Code atau masukkan nomor merchant berikut',
      'Periksa nama penerima MustG.id Yogyakarta',
      'Selesaikan pembayaran dengan memasukkan PIN e-wallet',
    ],
    detail: { bank: 'QRIS Terpadu', no: '0812-3456-7890', atas: 'MustG Official Store' },
  },
  CARD: {
    icon: '💳',
    title: 'Kartu Kredit / Debit Online',
    steps: [
      'Masukkan 16 digit nomor kartu Anda',
      'Periksa masa berlaku (MM/YY) dan 3 digit CVV di belakang kartu',
      'Klik konfirmasi dan masukkan kode OTP dari bank',
    ],
    detail: null,
  },
}

export default function PaymentPage() {
  const { navigate, orderData, setOrderData } = useAppStore()
  const [countdown, setCountdown] = useState(15 * 60)
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(false)

  const method = orderData?.payment_method || 'BANK_TRANSFER'
  const info = PAY_INFO[method] || PAY_INFO.BANK_TRANSFER
  const total = orderData?.total || orderData?.total_amount || 0
  const orderCode = orderData?.order_code || orderData?.order_number || 'MG-88129'

  useEffect(() => {
    if (paid) return
    const t = setInterval(() => setCountdown(c => (c <= 0 ? 0 : c - 1)), 1000)
    return () => clearInterval(t)
  }, [paid])

  const mins = Math.floor(countdown / 60).toString().padStart(2, '0')
  const secs = (countdown % 60).toString().padStart(2, '0')

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)
    toast.success('Nomor berhasil disalin!')
  }

  const handleConfirm = async () => {
    setLoading(true)
    toast.loading('Memverifikasi pembayaran...', { id: 'pay' })

    try {
      const updated = await confirmPayment(orderCode, null)
      setOrderData({ ...orderData, ...updated, payment_status: 'CONFIRMED', order_status: 'PAID' })
      setPaid(true)
      toast.success('Pembayaran terverifikasi! 🎉', { id: 'pay' })
      setTimeout(() => navigate('receipt'), 1000)
    } catch (_) {
      // Offline fallback
      setOrderData({
        ...orderData,
        payment_status: 'CONFIRMED',
        order_status: 'PAID',
        confirmed_at: new Date().toISOString(),
      })
      setPaid(true)
      toast.success('Pembayaran berhasil dikonfirmasi! 🎉', { id: 'pay' })
      setTimeout(() => navigate('receipt'), 1000)
    } finally {
      setLoading(false)
    }
  }

  if (!orderData) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', background: '#fff', borderRadius: 24, padding: 48, boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 16 }}>
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

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', height: 68, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌴</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
              MustG<span style={{ color: 'var(--accent)' }}>.id</span>
            </span>
          </button>

          {!paid && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: countdown < 180 ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg)', border: `1px solid ${countdown < 180 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`, borderRadius: 12, padding: '8px 16px' }}>
              <span style={{ fontSize: 13, color: countdown < 180 ? '#ef4444' : 'var(--text-muted)' }}>⏱ Batas Waktu:</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: countdown < 180 ? '#ef4444' : 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                {mins}:{secs}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ maxWidth: 840, margin: '0 auto', padding: '44px 24px 80px' }}>
        <StepBar current={2} />

        {/* Payment Main Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: '36px 32px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>
              {info.icon}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 4 }}>
              KODE PESANAN: {orderCode}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              {info.title}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
              Selesaikan transaksi sebelum waktu habis agar tiket Anda dapat diterbitkan otomatis.
            </p>
          </div>

          {/* Amount Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(2, 132, 199, 0.08) 100%)',
              border: '1.5px dashed rgba(37, 99, 235, 0.3)',
              borderRadius: 18,
              padding: '24px',
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
              Total Jumlah yang Harus Dibayar
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                {formatIDR(total)}
              </span>
              <button
                onClick={() => copyToClipboard(String(total))}
                title="Salin Nominal"
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                Salin
              </button>
            </div>
          </div>

          {/* Account Detail Box */}
          {info.detail && (
            <div style={{ background: 'var(--bg)', borderRadius: 16, padding: '20px 24px', marginBottom: 32, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                    {info.detail.bank || 'Penerima'}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                    {info.detail.no}
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'block', marginTop: 2 }}>
                    a.n. {info.detail.atas}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(info.detail.no)}
                  style={{
                    background: 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 20px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-glow)',
                  }}
                >
                  Salin Nomor
                </button>
              </div>
            </div>
          )}

          {/* Steps Instructions */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 14px' }}>
              Petunjuk Pembayaran:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {info.steps.map((st, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ lineHeight: 1.5 }}>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#94a3b8' : 'var(--grad-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 14,
              padding: '16px',
              fontSize: 16,
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : 'var(--shadow-glow)',
              transition: 'all 0.25s',
            }}
          >
            {loading ? 'Memverifikasi...' : 'Saya Sudah Bayar →'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
