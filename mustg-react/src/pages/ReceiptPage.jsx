import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { formatIDR } from '../data/destinations'
import { getOrder } from '../services/api'
import toast from 'react-hot-toast'

const STEPS = ['Pilih Tiket','Data Pemesan','Pembayaran','Selesai']
const PAY_LABEL = { BANK_TRANSFER:'Transfer Bank', EWALLET:'E-Wallet', CARD:'Kartu Kredit/Debit' }

function StepBar({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:40 }}>
      {STEPS.map((label,i) => {
        const done = i<current, active = i===current
        return (
          <div key={label} style={{ display:'flex', alignItems:'center' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:done||active?'var(--accent)':'var(--bg-3)', border:`2px solid ${done||active?'var(--accent)':'var(--border)'}`, boxShadow:done||active?'0 4px 12px rgba(0,102,255,0.2)':'none' }}>
                {done||active?<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  :<span style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', fontFamily:'var(--font-ui)' }}>{i+1}</span>}
              </div>
              <span style={{ fontSize:11, fontWeight:active?700:400, color:done||active?'var(--accent)':'var(--text-muted)', fontFamily:'var(--font-ui)', whiteSpace:'nowrap' }}>{label}</span>
            </div>
            {i<STEPS.length-1 && <div style={{ width:'clamp(30px,7vw,80px)', height:2, background:i<current?'var(--accent)':'var(--border)', margin:'0 6px', marginBottom:22, borderRadius:1 }}/>}
          </div>
        )
      })}
    </div>
  )
}

export default function ReceiptPage() {
  const { navigate, orderData, setOrderData } = useAppStore()
  const [refreshing, setRefreshing] = useState(false)

  // Refresh dari backend saat page dibuka
  useEffect(() => {
    const code = orderData?.order_code
    if (!code) return
    setRefreshing(true)
    getOrder(code)
      .then(fresh => setOrderData({ ...orderData, ...fresh }))
      .catch(() => {})
      .finally(() => setRefreshing(false))
  }, [])

  if (!orderData) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ textAlign:'center', background:'#fff', borderRadius:24, padding:48, boxShadow:'var(--shadow-lg)' }}>
        <div style={{ fontSize:64, marginBottom:20 }}>🎫</div>
        <h2 style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', marginBottom:16 }}>Data pesanan tidak ditemukan</h2>
        <button onClick={()=>navigate('home')} style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-ui)' }}>Kembali ke Home</button>
      </div>
    </div>
  )

  const {
    order_code, qty, total, visit_date, payment_method, confirmed_at, created_at,
    customer_name, customer_phone, customer_email,
    ticket_subtotal, transport_subtotal, guide_subtotal,
    destination, ticket_type, transport, tour_guide,
  } = orderData

  const destName  = destination?.name || '—'
  const destCity  = destination?.city || ''
  const destThumb = destination?.thumbnail_url
  const ticketName = ticket_type?.name || orderData?.ticket?.name || '—'
  const orderDate  = confirmed_at || created_at

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      {/* Topbar */}
      <div className="no-print" style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'0 24px', position:'sticky', top:0, zIndex:100, boxShadow:'var(--shadow-sm)' }}>
        <div style={{ maxWidth:720, margin:'0 auto', height:64, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={()=>navigate('home')} style={{ background:'none', border:'none', display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#0066ff,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🌴</div>
            <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:16, color:'var(--text-primary)' }}>MustG<span style={{ color:'var(--accent)' }}>.id</span></span>
          </button>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {refreshing && <span style={{ fontSize:12, color:'var(--text-muted)' }}>🔄 Memperbarui...</span>}
            <button onClick={()=>{ navigator.clipboard.writeText(order_code||''); toast.success('Kode disalin!') }}
              style={{ background:'var(--bg-3)', border:'1.5px solid var(--border)', borderRadius:9, padding:'8px 14px', fontSize:13, color:'var(--text-secondary)', cursor:'pointer', fontFamily:'var(--font-sans)', display:'flex', alignItems:'center', gap:5 }}>
              📋 Salin Kode
            </button>
            <button onClick={()=>window.print()}
              style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', border:'none', borderRadius:9, padding:'8px 16px', fontSize:13, color:'#fff', cursor:'pointer', fontFamily:'var(--font-ui)', fontWeight:700 }}>
              🖨️ Cetak
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'48px 24px 80px' }}>
        <StepBar current={3}/>

        {/* Success header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(0,184,148,0.1)', border:'2px solid var(--green)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:34, animation:'float 3s ease-in-out infinite' }}>🎉</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(24px,4vw,38px)', color:'var(--text-primary)', margin:'0 0 8px', fontWeight:700 }}>
            Pemesanan <span style={{ color:'var(--accent)', fontStyle:'italic' }}>Berhasil!</span>
          </h1>
          <p style={{ fontSize:15, color:'var(--text-secondary)', lineHeight:1.6 }}>Tunjukkan e-ticket ini saat masuk ke destinasi.</p>
        </div>

        {/* Receipt card */}
        <div style={{ background:'#fff', border:'1.5px solid rgba(0,102,255,0.12)', borderRadius:24, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.1)' }}>
          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,rgba(0,102,255,0.05),rgba(0,198,255,0.03))', borderBottom:'1px dashed rgba(0,102,255,0.12)', padding:'22px 28px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#0066ff,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🌴</div>
              <div>
                <p style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:15, color:'var(--text-primary)', margin:0 }}>MustG<span style={{ color:'var(--accent)' }}>.id</span></p>
                <p style={{ fontSize:10, color:'var(--text-muted)', margin:0 }}>E-Ticket & Booking Receipt</p>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:10, color:'var(--text-muted)', margin:'0 0 2px', fontFamily:'var(--font-ui)', letterSpacing:'1px', textTransform:'uppercase' }}>Order Code</p>
              <p style={{ fontSize:20, fontWeight:900, color:'var(--accent)', fontFamily:'var(--font-ui)', letterSpacing:'2px', margin:0 }}>{order_code}</p>
            </div>
          </div>

          {/* Status bar */}
          <div style={{ padding:'10px 28px', background:'rgba(0,184,148,0.05)', borderBottom:'1px solid rgba(0,184,148,0.1)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', animation:'pulse 2s infinite' }}/>
            <span style={{ fontSize:12, fontWeight:700, color:'var(--green)', fontFamily:'var(--font-ui)' }}>PEMBAYARAN DIKONFIRMASI</span>
            <span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:'auto' }}>
              {orderDate ? new Date(orderDate).toLocaleString('id-ID') : '—'}
            </span>
          </div>

          {/* Destination image */}
          {destThumb && (
            <div style={{ height:180, overflow:'hidden', position:'relative' }}>
              <img src={destThumb} alt={destName} onError={e=>e.target.style.display='none'}
                style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.72) saturate(1.1)' }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 55%)' }}/>
              <div style={{ position:'absolute', bottom:14, left:24 }}>
                <p style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:'var(--font-ui)', margin:0, textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>{destName}</p>
                {destCity && <p style={{ fontSize:13, color:'rgba(255,255,255,0.8)', margin:'2px 0 0' }}>📍 {destCity}</p>}
              </div>
            </div>
          )}

          {/* Detail */}
          <div style={{ padding:'22px 28px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:20 }}>
              {[
                ['NAMA PEMESAN',       customer_name],
                ['NO. HP',             customer_phone],
                ['EMAIL',              customer_email],
                ['TANGGAL KUNJUNGAN',  visit_date ? new Date(visit_date).toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) : '—'],
                ['JENIS TIKET',        ticketName],
                ['JUMLAH',             `${qty} orang`],
                ['METODE BAYAR',       PAY_LABEL[payment_method]||payment_method||'—'],
                ['STATUS',             '✅ Terkonfirmasi'],
              ].map(([label,val]) => (
                <div key={label}>
                  <p style={{ fontSize:10, color:'var(--text-muted)', fontFamily:'var(--font-ui)', letterSpacing:'1px', textTransform:'uppercase', margin:'0 0 3px' }}>{label}</p>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', margin:0, lineHeight:1.4 }}>{val||'—'}</p>
                </div>
              ))}
            </div>

            {/* Addon info */}
            {(transport || tour_guide) && (
              <div style={{ background:'var(--bg)', borderRadius:12, padding:'12px 16px', marginBottom:18, fontSize:13 }}>
                {transport && <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ color:'var(--text-secondary)' }}>🚐 {transport.name}</span><span style={{ fontWeight:600 }}>{formatIDR(transport.price_per_day)}/hari</span></div>}
                {tour_guide && <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'var(--text-secondary)' }}>👨‍🏫 {tour_guide.name}</span><span style={{ fontWeight:600 }}>{formatIDR(tour_guide.price_per_day)}/hari</span></div>}
              </div>
            )}

            {/* Perforated divider */}
            <div style={{ display:'flex', alignItems:'center', margin:'0 -28px 18px' }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--bg)', flexShrink:0 }}/>
              <div style={{ flex:1, borderTop:'2px dashed rgba(0,0,0,0.07)' }}/>
              <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--bg)', flexShrink:0 }}/>
            </div>

            {/* Total breakdown */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                {(transport_subtotal>0||guide_subtotal>0) && (
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>
                    <div>Tiket: {formatIDR(ticket_subtotal)}</div>
                    {transport_subtotal>0 && <div>Transport: {formatIDR(transport_subtotal)}</div>}
                    {guide_subtotal>0 && <div>Guide: {formatIDR(guide_subtotal)}</div>}
                  </div>
                )}
                <p style={{ fontSize:10, color:'var(--text-muted)', fontFamily:'var(--font-ui)', letterSpacing:'1px', textTransform:'uppercase', margin:'0 0 3px' }}>Total Dibayar</p>
                <p style={{ fontSize:30, fontWeight:900, color:'var(--accent)', fontFamily:'var(--font-ui)', margin:0 }}>{formatIDR(total)}</p>
              </div>
              <div style={{ width:76, height:76, background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-ui)', textAlign:'center', lineHeight:1.4, padding:8 }}>QR<br/>CODE</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background:'var(--bg)', borderTop:'1px solid var(--border)', padding:'12px 28px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>Tunjukkan receipt ini saat masuk ke destinasi</p>
            <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-ui)' }}>mustg.id</span>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop:18, background:'rgba(0,102,255,0.04)', border:'1px solid rgba(0,102,255,0.1)', borderRadius:14, padding:'14px 18px', display:'flex', gap:12 }}>
          <span style={{ fontSize:18, flexShrink:0 }}>💡</span>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', margin:'0 0 3px', fontFamily:'var(--font-ui)' }}>Tips Kunjungan</p>
            <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0, lineHeight:1.65 }}>
              Datang 15–30 menit lebih awal. Screenshot receipt ini sebagai backup. Bawa KTP sesuai nama pemesan.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="no-print" style={{ display:'flex', gap:12, marginTop:24, flexWrap:'wrap' }}>
          <button onClick={()=>navigate('home')}
            style={{ flex:1, minWidth:160, background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:14, padding:'14px', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'var(--font-ui)', boxShadow:'0 8px 24px rgba(0,102,255,0.3)', transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            🏠 Kembali ke Home
          </button>
          <button onClick={()=>navigate('destinations')}
            style={{ flex:1, minWidth:160, background:'#fff', color:'var(--text-primary)', border:'1.5px solid var(--border)', borderRadius:14, padding:'14px', fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-ui)', transition:'all 0.2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)' }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-primary)' }}>
            🗺️ Pesan Lagi
          </button>
          <button onClick={()=>navigate('my-tickets')}
            style={{ background:'#fff', color:'var(--text-secondary)', border:'1.5px solid var(--border)', borderRadius:14, padding:'14px 18px', fontSize:15, cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-hover)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
            🎫 Tiket Saya
          </button>
        </div>
      </div>
    </div>
  )
}
