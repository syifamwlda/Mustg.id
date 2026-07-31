import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAppStore } from '../store/appStore'
import { findOrdersByEmail, rescheduleOrder, cancelOrder, getOrderLogs } from '../services/api'
import { formatIDR } from '../data/destinations'
import toast from 'react-hot-toast'

const STATUS = {
  WAITING_PAYMENT: { label:'Menunggu Bayar',  color:'#f5a623', bg:'rgba(245,166,35,0.1)',  icon:'⏳' },
  PAID:            { label:'Sudah Dibayar',    color:'#00b894', bg:'rgba(0,184,148,0.1)',   icon:'✅' },
  CONFIRMED:       { label:'Terkonfirmasi',    color:'#0066ff', bg:'rgba(0,102,255,0.1)',   icon:'🎫' },
  COMPLETED:       { label:'Selesai',          color:'#9090aa', bg:'rgba(144,144,170,0.1)', icon:'🏁' },
  CANCELLED:       { label:'Dibatalkan',       color:'#ff5a1f', bg:'rgba(255,90,31,0.1)',   icon:'❌' },
  RESCHEDULED:     { label:'Dijadwal Ulang',   color:'#764ba2', bg:'rgba(118,75,162,0.1)',  icon:'🔄' },
}

const PAY_LABEL = { BANK_TRANSFER:'Transfer Bank', EWALLET:'E-Wallet', CARD:'Kartu Kredit/Debit' }

export default function MyTicketsPage() {
  const { navigate, setOrderData, myOrders, setMyOrders } = useAppStore()
  const [email,       setEmail]      = useState('')
  const [loading,     setLoading]    = useState(false)
  const [searched,    setSearched]   = useState(false)
  const [expandedId,  setExpandedId] = useState(null)
  const [logs,        setLogs]       = useState({})
  const [reschedId,   setReschedId]  = useState(null)
  const [newDate,     setNewDate]    = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const data = await findOrdersByEmail(email)
      setMyOrders(Array.isArray(data) ? data : [])
      setSearched(true)
      if (!data.length) toast('Tidak ada pesanan ditemukan', { icon:'🔍' })
      else toast.success(`${data.length} pesanan ditemukan!`)
    } catch {
      setMyOrders([])
      setSearched(true)
      toast.error('Backend tidak tersambung. Pastikan server Laravel berjalan.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogs = async (order) => {
    if (expandedId === order.id) { setExpandedId(null); return }
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
    if (!newDate) { toast.error('Pilih tanggal baru dulu!'); return }
    try {
      await rescheduleOrder(order.order_code, newDate)
      toast.success('Tanggal berhasil diubah!')
      setReschedId(null); setNewDate('')
      const data = await findOrdersByEmail(email)
      setMyOrders(data)
    } catch (err) {
      toast.error(err.message || 'Gagal reschedule')
    }
  }

  const handleCancel = async (order) => {
    if (!window.confirm(`Yakin batalkan pesanan ${order.order_code}?`)) return
    try {
      await cancelOrder(order.order_code)
      toast.success('Pesanan dibatalkan.')
      const data = await findOrdersByEmail(email)
      setMyOrders(data)
    } catch (err) {
      toast.error(err.message || 'Gagal membatalkan')
    }
  }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      <Navbar/>
      <div style={{ paddingTop:'calc(var(--nav-h) + 48px)', paddingBottom:80 }}>
        <div className="container" style={{ maxWidth:820 }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ width:64, height:64, borderRadius:20, background:'linear-gradient(135deg,#0066ff,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 16px', boxShadow:'0 8px 28px rgba(0,102,255,0.35)' }}>🎫</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(24px,4vw,40px)', color:'var(--text-primary)', margin:'0 0 8px', fontWeight:700 }}>Tiket & Riwayat Saya</h1>
            <p style={{ fontSize:15, color:'var(--text-secondary)', margin:0 }}>Masukkan email yang dipakai saat booking untuk melihat semua tiket & riwayat transaksi.</p>
          </div>

          {/* Search */}
          <div style={{ background:'#fff', borderRadius:20, padding:28, marginBottom:32, boxShadow:'var(--shadow)', border:'1px solid var(--border)' }}>
            <form onSubmit={handleSearch} style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:240, position:'relative' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="email@kamu.com"
                  style={{ width:'100%', paddingLeft:46, paddingRight:16, paddingTop:12, paddingBottom:12, background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:12, fontSize:14, color:'var(--text-primary)', fontFamily:'var(--font-sans)', outline:'none', transition:'border-color 0.2s' }}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'}
                  onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
              <button type="submit" disabled={loading}
                style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'12px 28px', fontSize:14, fontWeight:800, cursor:loading?'not-allowed':'pointer', fontFamily:'var(--font-ui)', boxShadow:'0 4px 16px rgba(0,102,255,0.3)', opacity:loading?0.7:1, whiteSpace:'nowrap' }}>
                {loading?'⏳ Mencari...':'🔍 Cari Tiket'}
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && myOrders.length===0 && (
            <div style={{ textAlign:'center', padding:'64px 24px', background:'#fff', borderRadius:20, border:'1.5px dashed var(--border)' }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🎟️</div>
              <h3 style={{ fontSize:20, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 10px' }}>Tidak Ada Pesanan</h3>
              <p style={{ fontSize:14, color:'var(--text-secondary)', margin:'0 0 24px' }}>Belum ada pesanan untuk email <strong>{email}</strong>.</p>
              <button onClick={()=>navigate('destinations')}
                style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-ui)' }}>
                Pesan Tiket Sekarang →
              </button>
            </div>
          )}

          {myOrders.length>0 && (
            <div>
              <p style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:20 }}>
                <strong style={{ color:'var(--text-primary)' }}>{myOrders.length}</strong> pesanan untuk <strong style={{ color:'var(--accent)' }}>{email}</strong>
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {myOrders.map((order,i) => {
                  const st = STATUS[order.payment_status] || STATUS[order.order_status] || { label:order.order_status, color:'#999', bg:'#f0f0f0', icon:'📋' }
                  const isPaid = order.payment_status==='CONFIRMED'
                  const canResched = ['WAITING_PAYMENT','PAID'].includes(order.order_status)
                  const canCancel  = order.order_status==='WAITING_PAYMENT'
                  const orderLogs  = logs[order.id] || order.logs || []
                  const isExpanded = expandedId===order.id

                  return (
                    <div key={order.id||i} style={{ background:'#fff', borderRadius:20, border:`1.5px solid ${isExpanded?'rgba(0,102,255,0.2)':'var(--border)'}`, overflow:'hidden', boxShadow:isExpanded?'var(--shadow-md)':'var(--shadow-sm)', transition:'all 0.25s', animation:`fadeUp 0.4s ${i*0.06}s both` }}>

                      {/* Header */}
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
                        <div>
                          <p style={{ fontSize:10, color:'var(--text-muted)', margin:'0 0 2px', fontFamily:'var(--font-ui)', letterSpacing:'1px', textTransform:'uppercase' }}>Order Code</p>
                          <p style={{ fontSize:16, fontWeight:800, color:'var(--accent)', fontFamily:'var(--font-ui)', margin:0, letterSpacing:'1px' }}>{order.order_code}</p>
                        </div>
                        <span style={{ background:st.bg, color:st.color, fontSize:12, fontWeight:700, padding:'5px 12px', borderRadius:99, fontFamily:'var(--font-ui)' }}>
                          {st.icon} {st.label}
                        </span>
                      </div>

                      {/* Body */}
                      <div style={{ padding:'16px 20px' }}>
                        <div style={{ display:'flex', gap:14, marginBottom:14, flexWrap:'wrap' }}>
                          {order.destination?.thumbnail_url && (
                            <img src={order.destination.thumbnail_url} alt="" style={{ width:80, height:64, borderRadius:10, objectFit:'cover', flexShrink:0 }} onError={e=>e.target.style.display='none'}/>
                          )}
                          <div style={{ flex:1 }}>
                            <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 4px' }}>{order.destination?.name||'—'}</h3>
                            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:'0 0 6px' }}>{order.ticket_type?.name||order.package?.name||'—'} × {order.qty} orang</p>
                            <div style={{ display:'flex', gap:10, fontSize:12, color:'var(--text-muted)', flexWrap:'wrap' }}>
                              <span>📅 {order.visit_date ? new Date(order.visit_date).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : '—'}</span>
                              <span>💳 {PAY_LABEL[order.payment_method]||order.payment_method}</span>
                            </div>
                          </div>
                          <div style={{ textAlign:'right', flexShrink:0 }}>
                            <p style={{ fontSize:10, color:'var(--text-muted)', margin:'0 0 2px', fontFamily:'var(--font-ui)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Total</p>
                            <p style={{ fontSize:20, fontWeight:900, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:0 }}>{formatIDR(order.total)}</p>
                          </div>
                        </div>

                        {/* Rincian biaya kalau ada addon */}
                        {(order.transport_subtotal>0 || order.guide_subtotal>0) && (
                          <div style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:12 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, color:'var(--text-secondary)' }}>
                              <span>🎫 Tiket ({order.qty}x)</span><span>{formatIDR(order.ticket_subtotal)}</span>
                            </div>
                            {order.transport_subtotal>0 && (
                              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, color:'var(--text-secondary)' }}>
                                <span>🚐 Transport</span><span>{formatIDR(order.transport_subtotal)}</span>
                              </div>
                            )}
                            {order.guide_subtotal>0 && (
                              <div style={{ display:'flex', justifyContent:'space-between', color:'var(--text-secondary)' }}>
                                <span>👨‍🏫 Tour Guide</span><span>{formatIDR(order.guide_subtotal)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Reschedule form */}
                        {reschedId===order.id && (
                          <div style={{ background:'var(--accent-dim)', border:'1px solid rgba(0,102,255,0.2)', borderRadius:12, padding:'14px 16px', marginBottom:14, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', animation:'fadeUp 0.2s ease' }}>
                            <p style={{ fontSize:13, fontWeight:700, color:'var(--accent)', margin:0, fontFamily:'var(--font-ui)' }}>Tanggal baru:</p>
                            <input type="date" min={today} value={newDate} onChange={e=>setNewDate(e.target.value)}
                              style={{ background:'#fff', border:'1.5px solid var(--accent)', borderRadius:8, padding:'8px 12px', fontSize:13, fontFamily:'var(--font-sans)', outline:'none', color:'var(--text-primary)' }}/>
                            <button onClick={()=>handleReschedule(order)}
                              style={{ background:'var(--accent)', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-ui)' }}>
                              Simpan
                            </button>
                            <button onClick={()=>setReschedId(null)}
                              style={{ background:'none', color:'var(--text-muted)', border:'none', fontSize:13, cursor:'pointer', fontFamily:'var(--font-sans)' }}>
                              Batal
                            </button>
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
                          {isPaid && (
                            <button onClick={()=>{ setOrderData({...order, destination:order.destination, ticket:order.ticket_type}); navigate('receipt') }}
                              style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:9, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-ui)', boxShadow:'0 4px 12px rgba(0,102,255,0.25)' }}>
                              🎫 Lihat E-Ticket
                            </button>
                          )}
                          {!isPaid && order.order_status==='WAITING_PAYMENT' && (
                            <button onClick={()=>{ setOrderData({...order, destination:order.destination, ticket:order.ticket_type}); navigate('payment') }}
                              style={{ background:'linear-gradient(135deg,#ff5a1f,#ff8c42)', color:'#fff', border:'none', borderRadius:9, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-ui)' }}>
                              💳 Bayar Sekarang
                            </button>
                          )}
                          {canResched && reschedId!==order.id && (
                            <button onClick={()=>setReschedId(order.id)}
                              style={{ background:'var(--bg-3)', color:'var(--text-secondary)', border:'1.5px solid var(--border)', borderRadius:9, padding:'9px 14px', fontSize:13, cursor:'pointer', fontFamily:'var(--font-sans)', transition:'all 0.2s' }}
                              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'}
                              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                              🗓️ Reschedule
                            </button>
                          )}
                          {canCancel && (
                            <button onClick={()=>handleCancel(order)}
                              style={{ background:'var(--bg-3)', color:'#ff5a1f', border:'1.5px solid rgba(255,90,31,0.2)', borderRadius:9, padding:'9px 14px', fontSize:13, cursor:'pointer', fontFamily:'var(--font-sans)' }}>
                              ❌ Batalkan
                            </button>
                          )}
                          <button onClick={()=>handleLogs(order)}
                            style={{ background:'var(--bg-3)', color:'var(--text-muted)', border:'1.5px solid var(--border)', borderRadius:9, padding:'9px 14px', fontSize:13, cursor:'pointer', fontFamily:'var(--font-sans)', marginLeft:'auto', transition:'all 0.2s' }}>
                            {isExpanded?'▲ Sembunyikan':'📋 Riwayat'}
                          </button>
                        </div>

                        {/* Transaction Logs */}
                        {isExpanded && (
                          <div style={{ background:'var(--bg)', borderRadius:12, padding:'14px 16px', animation:'fadeUp 0.2s ease' }}>
                            <p style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', margin:'0 0 10px', fontFamily:'var(--font-ui)', textTransform:'uppercase', letterSpacing:'1px' }}>Riwayat Aktivitas</p>
                            {orderLogs.length===0 ? (
                              <p style={{ fontSize:13, color:'var(--text-muted)', margin:0 }}>Belum ada riwayat.</p>
                            ) : (
                              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                                {orderLogs.map((log,j) => (
                                  <div key={j} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                                    <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent)', flexShrink:0, marginTop:5 }}/>
                                    <div>
                                      <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', margin:'0 0 1px', fontFamily:'var(--font-ui)' }}>{log.event}</p>
                                      <p style={{ fontSize:12, color:'var(--text-secondary)', margin:'0 0 1px' }}>{log.description}</p>
                                      <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>{log.time ? new Date(log.time).toLocaleString('id-ID') : ''}</p>
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

          {/* Empty state - belum search */}
          {!searched && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
              {[
                { icon:'🎫', title:'Cek Status Tiket',    desc:'Lihat status pembayaran dan konfirmasi tiket kamu secara realtime' },
                { icon:'🗓️', title:'Reschedule Mudah',    desc:'Ubah tanggal kunjungan hingga H-1 tanpa ribet' },
                { icon:'📋', title:'Riwayat Transaksi',   desc:'Semua aktivitas pesanan tercatat — dari buat order sampai konfirmasi' },
                { icon:'❌', title:'Batalkan Pesanan',    desc:'Batalkan pesanan yang belum dibayar kapan saja' },
              ].map(f=>(
                <div key={f.title} style={{ background:'#fff', borderRadius:16, padding:'22px 20px', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>{f.icon}</div>
                  <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 6px' }}>{f.title}</h3>
                  <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.6, margin:0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  )
}