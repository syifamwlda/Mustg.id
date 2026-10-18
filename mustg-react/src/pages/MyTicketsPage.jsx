import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAppStore } from '../store/appStore'
import { findOrdersByEmail, rescheduleOrder, cancelOrder, getOrderLogs } from '../services/api'
import { formatIDR } from '../data/destinations'
import toast from 'react-hot-toast'

const STATUS = {
  WAITING_PAYMENT: { label: 'Menunggu Bayar', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '⏳' },
  PAID: { label: 'Sudah Dibayar', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', icon: '✅' },
  CONFIRMED: { label: 'Terkonfirmasi', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)', icon: '🎫' },
  COMPLETED: { label: 'Selesai', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', icon: '🏁' },
  CANCELLED: { label: 'Dibatalkan', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: '❌' },
  RESCHEDULED: { label: 'Dijadwal Ulang', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)', icon: '🔄' },
}

const PAY_LABEL = { BANK_TRANSFER: 'Transfer Bank', EWALLET: 'QRIS & E-Wallet', CARD: 'Kartu Kredit/Debit' }

export default function MyTicketsPage() {
  const { navigate, setOrderData, myOrders, setMyOrders } = useAppStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [logs, setLogs] = useState({})
  const [reschedId, setReschedId] = useState(null)
  const [newDate, setNewDate] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const data = await findOrdersByEmail(email)
      setMyOrders(Array.isArray(data) ? data : [])
      setSearched(true)
      if (!data.length) toast('Tidak ada tiket yang ditemukan untuk email ini', { icon: '🔍' })
      else toast.success(`${data.length} pesanan ditemukan!`)
    } catch {
      setMyOrders([])
      setSearched(true)
      toast.error('Gagal mengambil data dari server.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogs = async (order) => {
    if (expandedId === order.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(order.id)
    if (logs[order.id]) return
    try {
      const data = await getOrderLogs(order.order_code)
      setLogs(prev => ({ ...prev, [order.id]: data }))
    } catch {
      setLogs(prev => ({ ...prev, [order.id]: order.logs || [] }))
    }
  }

  const handleReschedule = async (order) => {
    if (!newDate) {
      toast.error('Pilih tanggal baru terlebih dahulu!')
      return
    }
    try {
      await rescheduleOrder(order.order_code, newDate)
      toast.success('Jadwal kunjungan berhasil diperbarui!')
      setReschedId(null)
      setNewDate('')
      const data = await findOrdersByEmail(email)
      setMyOrders(data)
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah jadwal')
    }
  }

  const handleCancel = async (order) => {
    if (!window.confirm(`Yakin ingin membatalkan pesanan ${order.order_code}?`)) return
    try {
      await cancelOrder(order.order_code)
      toast.success('Pesanan berhasil dibatalkan.')
      const data = await findOrdersByEmail(email)
      setMyOrders(data)
    } catch (err) {
      toast.error(err.message || 'Gagal membatalkan pesanan')
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: 'calc(var(--nav-h) + 40px)', paddingBottom: 88 }}>
        <div className="container" style={{ maxWidth: 840 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #2563eb, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                margin: '0 auto 16px',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              🎫
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--text-primary)', margin: '0 0 10px', fontWeight: 800 }}>
              Cek E-Tiket & Riwayat Pesanan
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
              Masukkan alamat email yang Anda gunakan saat pemesanan untuk menampilkan tiket aktif, bukti pembayaran, atau jadwal kunjungan.
            </p>
          </div>

          {/* Search Box */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 22,
              padding: '28px',
              marginBottom: 36,
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)',
            }}
          >
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="2"
                  style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="Masukkan email Anda (contoh: wisata@gmail.com)..."
                  style={{
                    width: '100%',
                    paddingLeft: 48,
                    paddingRight: 16,
                    paddingTop: 14,
                    paddingBottom: 14,
                    background: 'var(--bg)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 14,
                    fontSize: 14.5,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'var(--grad-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 30px',
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: 'var(--shadow-glow)',
                  opacity: loading ? 0.7 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? 'Mencari...' : 'Cari Tiket Saya →'}
              </button>
            </form>
          </div>

          {/* Results: Empty state after searched */}
          {searched && myOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: '#ffffff', borderRadius: 22, border: '1.5px dashed var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎟️</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 10px' }}>
                Tidak Ada Pesanan Ditemukan
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.6 }}>
                Belum ada transaksi tiket yang tercatat untuk email <strong>{email}</strong>. Pastikan penulisan email sudah benar.
              </p>
              <button
                onClick={() => navigate('destinations')}
                style={{
                  background: 'var(--grad-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 14,
                  padding: '13px 30px',
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                Pesan Tiket Wisata Sekarang →
              </button>
            </div>
          )}

          {/* Results: Order Cards */}
          {myOrders.length > 0 && (
            <div>
              <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Menampilkan <strong style={{ color: 'var(--text-primary)' }}>{myOrders.length}</strong> pesanan tiket untuk <strong>{email}</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {myOrders.map((order, i) => {
                  const st = STATUS[order.payment_status] || STATUS[order.order_status] || { label: order.order_status || 'Aktif', color: '#64748b', bg: '#f1f5f9', icon: '📋' }
                  const isPaid = order.payment_status === 'CONFIRMED' || order.order_status === 'PAID'
                  const canResched = ['WAITING_PAYMENT', 'PAID', 'CONFIRMED'].includes(order.order_status)
                  const canCancel = order.order_status === 'WAITING_PAYMENT'
                  const orderLogs = logs[order.id] || order.logs || []
                  const isExpanded = expandedId === order.id

                  return (
                    <div
                      key={order.id || i}
                      style={{
                        background: '#ffffff',
                        borderRadius: 22,
                        border: `1.5px solid ${isExpanded ? 'rgba(37, 99, 235, 0.3)' : 'var(--border)'}`,
                        overflow: 'hidden',
                        boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                        transition: 'all 0.25s',
                        animation: `fadeUp 0.4s ${i * 0.06}s both`,
                      }}
                    >
                      {/* Order Code & Status Banner */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                        <div>
                          <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>
                            KODE PESANAN
                          </span>
                          <span style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>
                            {order.order_code || order.order_number}
                          </span>
                        </div>
                        <span style={{ background: st.bg, color: st.color, fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 9999 }}>
                          {st.icon} {st.label}
                        </span>
                      </div>

                      {/* Order Details Body */}
                      <div style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                          {order.destination?.thumbnail_url && (
                            <img
                              src={order.destination.thumbnail_url}
                              alt=""
                              style={{ width: 90, height: 72, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }}
                              onError={e => e.target.style.display = 'none'}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 4px' }}>
                              {order.destination?.name || 'Paket Wisata Yogyakarta'}
                            </h3>
                            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 6px' }}>
                              {order.ticket_type?.name || order.ticket?.name || 'Tiket Masuk'} • {order.qty} Tiket
                            </p>
                            <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                              <span>📅 {order.visit_date ? new Date(order.visit_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span>
                              <span>💳 {PAY_LABEL[order.payment_method] || order.payment_method}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.5px', display: 'block', marginBottom: 2 }}>
                              Total Biaya
                            </span>
                            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                              {formatIDR(order.total || order.total_amount || 0)}
                            </span>
                          </div>
                        </div>

                        {/* Reschedule Form Box */}
                        {reschedId === order.id && (
                          <div style={{ background: 'var(--accent-dim)', border: '1px solid rgba(37, 99, 235, 0.25)', borderRadius: 14, padding: '16px 20px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.2s ease' }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--accent)' }}>Pilih tanggal baru:</span>
                            <input
                              type="date"
                              min={today}
                              value={newDate}
                              onChange={e => setNewDate(e.target.value)}
                              style={{ background: '#ffffff', border: '1.5px solid var(--accent)', borderRadius: 10, padding: '8px 14px', fontSize: 13.5, outline: 'none' }}
                            />
                            <button
                              onClick={() => handleReschedule(order)}
                              style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                            >
                              Simpan Jadwal Baru
                            </button>
                            <button
                              onClick={() => setReschedId(null)}
                              style={{ background: 'none', color: 'var(--text-secondary)', border: 'none', fontSize: 13, cursor: 'pointer' }}
                            >
                              Batal
                            </button>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                          <button
                            onClick={() => {
                              setOrderData({ ...order, destination: order.destination, ticket: order.ticket_type || order.ticket })
                              navigate('receipt')
                            }}
                            style={{
                              background: 'var(--grad-primary)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 10,
                              padding: '10px 20px',
                              fontSize: 13.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: 'var(--shadow-glow)',
                            }}
                          >
                            🎫 Buka E-Tiket
                          </button>

                          {canResched && reschedId !== order.id && (
                            <button
                              onClick={() => setReschedId(order.id)}
                              style={{
                                background: '#ffffff',
                                color: 'var(--text-secondary)',
                                border: '1.5px solid var(--border)',
                                borderRadius: 10,
                                padding: '9px 16px',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              🗓️ Reschedule
                            </button>
                          )}

                          {canCancel && (
                            <button
                              onClick={() => handleCancel(order)}
                              style={{
                                background: '#ffffff',
                                color: '#ef4444',
                                border: '1.5px solid rgba(239, 68, 68, 0.25)',
                                borderRadius: 10,
                                padding: '9px 16px',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              ❌ Batalkan
                            </button>
                          )}

                          <button
                            onClick={() => handleLogs(order)}
                            style={{
                              background: 'var(--bg)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border)',
                              borderRadius: 10,
                              padding: '9px 16px',
                              fontSize: 13,
                              cursor: 'pointer',
                              marginLeft: 'auto',
                            }}
                          >
                            {isExpanded ? '▲ Tutup Log' : '📋 Riwayat Status'}
                          </button>
                        </div>

                        {/* Transaction Activity Logs */}
                        {isExpanded && (
                          <div style={{ background: 'var(--bg)', borderRadius: 14, padding: '16px 20px', marginTop: 16, animation: 'fadeUp 0.2s ease' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 12 }}>
                              Riwayat Aktivitas Pemesanan
                            </span>
                            {orderLogs.length === 0 ? (
                              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Belum ada log aktivitas lanjutan.</p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {orderLogs.map((log, j) => (
                                  <div key={j} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 5 }} />
                                    <div>
                                      <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{log.event}</p>
                                      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 2px' }}>{log.description}</p>
                                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{log.time ? new Date(log.time).toLocaleString('id-ID') : ''}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Before Search Feature Highlights */}
          {!searched && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {[
                { icon: '🎫', title: 'Akses E-Tiket Instan', desc: 'Buka voucher kapan saja langsung dari smartphone tanpa perlu cetak tiket fisik.' },
                { icon: '🗓️', title: 'Reschedule Fleksibel', desc: 'Jadwal mendadak berubah? Ajukan perubahan tanggal kunjungan hingga H-1 dengan mudah.' },
                { icon: '🛡️', title: 'Garansi Tiket Resmi', desc: 'Semua tiket terhubung langsung dengan sistem loket destinasi wisata Yogyakarta.' },
                { icon: '🎧', title: 'Bantuan Customer Support', desc: 'Tim kami siap mendampingi perjalanan wisata Anda setiap hari 24/7.' },
              ].map(f => (
                <div
                  key={f.title}
                  style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    padding: '28px 24px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 8px' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}