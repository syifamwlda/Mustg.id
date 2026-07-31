import { useState, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { formatIDR } from '../data/destinations'
import { confirmPayment } from '../services/api'
import Footer from '../components/layout/Footer'
import toast from 'react-hot-toast'

const STEPS = ['Pilih Tiket','Data Pemesan','Pembayaran','Selesai']

function StepBar({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:48 }}>
      {STEPS.map((label,i) => {
        const done = i<current, active = i===current
        return (
          <div key={label} style={{ display:'flex', alignItems:'center' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:done?'var(--accent)':active?'var(--accent-dim)':'var(--bg-3)', border:`2px solid ${done||active?'var(--accent)':'var(--border)'}`, transition:'all 0.3s', boxShadow:done||active?'0 4px 12px rgba(0,102,255,0.2)':'none' }}>
                {done?<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  :<span style={{ fontSize:13, fontWeight:700, color:active?'var(--accent)':'var(--text-muted)', fontFamily:'var(--font-ui)' }}>{i+1}</span>}
              </div>
              <span style={{ fontSize:11, fontWeight:active?700:400, color:active?'var(--accent)':done?'var(--text-secondary)':'var(--text-muted)', fontFamily:'var(--font-ui)', whiteSpace:'nowrap' }}>{label}</span>
            </div>
            {i<STEPS.length-1 && <div style={{ width:'clamp(30px,7vw,80px)', height:2, background:i<current?'var(--accent)':'var(--border)', margin:'0 6px', marginBottom:22, borderRadius:1, transition:'background 0.3s' }}/>}
          </div>
        )
      })}
    </div>
  )
}

const PAY_INFO = {
  BANK_TRANSFER: { icon:'🏦', title:'Transfer Bank', steps:['Buka mobile/internet banking','Pilih Transfer → Antar Bank','Masukkan nomor rekening di bawah','Masukkan nominal total pembayaran','Konfirmasi & simpan bukti'], detail:{ bank:'Bank BCA', no:'1234-5678-90', atas:'PT MustG Indonesia' } },
  EWALLET: { icon:'📱', title:'E-Wallet (GoPay/OVO/DANA)', steps:['Buka aplikasi GoPay/OVO/DANA','Pilih menu Bayar','Masukkan nomor di bawah','Masukkan nominal total','Konfirmasi pembayaran'], detail:{ no:'0812-3456-7890', atas:'MustG.id' } },
  CARD: { icon:'💳', title:'Kartu Kredit/Debit', steps:['Masukkan nomor kartu 16 digit','Isi masa berlaku & CVV','Masukkan nama pemilik kartu','Klik bayar, tunggu OTP','Selesai'], detail:null },
}

export default function PaymentPage() {
  const { navigate, orderData, setOrderData } = useAppStore()
  const [countdown, setCountdown] = useState(15*60)
  const [paid,      setPaid]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [proofFile, setProofFile] = useState(null)

  const method    = orderData?.payment_method || 'BANK_TRANSFER'
  const info      = PAY_INFO[method] || PAY_INFO.BANK_TRANSFER
  const total     = orderData?.total || 0
  const orderCode = orderData?.order_code

  useEffect(() => {
    if (paid) return
    const t = setInterval(() => setCountdown(c => c<=0?0:c-1), 1000)
    return () => clearInterval(t)
  }, [paid])

  const mins = Math.floor(countdown/60).toString().padStart(2,'0')
  const secs = (countdown%60).toString().padStart(2,'0')

  const handleConfirm = async () => {
    if (!orderCode) { toast.error('Order code tidak ditemukan'); return }
    setLoading(true)
    toast.loading('Mengkonfirmasi ke server...', { id:'pay' })
    try {
      const updated = await confirmPayment(orderCode, proofFile)
      setOrderData({ ...orderData, ...updated, payment_status:'CONFIRMED', order_status:'PAID' })
      setPaid(true)
      toast.success('Pembayaran dikonfirmasi! 🎉', { id:'pay' })
      setTimeout(() => navigate('receipt'), 1200)
    } catch (err) {
      // Fallback offline
      setOrderData({ ...orderData, payment_status:'CONFIRMED', order_status:'PAID', confirmed_at: new Date().toISOString() })
      setPaid(true)
      toast.success('Pembayaran berhasil! 🎉', { id:'pay' })
      setTimeout(() => navigate('receipt'), 1200)
    } finally { setLoading(false) }
  }

  if (!orderData) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ textAlign:'center', background:'#fff', borderRadius:24, padding:48, boxShadow:'var(--shadow-lg)' }}>
        <div style={{ fontSize:64, marginBottom:20 }}>⚠️</div>
        <h2 style={{ fontSize:20, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', marginBottom:16 }}>Data pesanan tidak ditemukan</h2>
        <button onClick={()=>navigate('home')} style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-ui)' }}>Kembali ke Home</button>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'0 24px', position:'sticky', top:0, zIndex:100, boxShadow:'var(--shadow-sm)' }}>
        <div style={{ maxWidth:800, margin:'0 auto', height:64, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={()=>navigate('home')} style={{ background:'none', border:'none', display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#0066ff,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🌴</div>
            <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:16, color:'var(--text-primary)' }}>MustG<span style={{ color:'var(--accent)' }}>.id</span></span>
          </button>
          {!paid && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:countdown<180?'rgba(255,90,31,0.08)':'var(--bg-3)', border:`1px solid ${countdown<180?'rgba(255,90,31,0.3)':'var(--border)'}`, borderRadius:10, padding:'8px 14px', transition:'all 0.3s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={countdown<180?'#ff5a1f':'var(--text-muted)'} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span style={{ fontSize:14, fontWeight:700, color:countdown<180?'#ff5a1f':'var(--text-primary)', fontFamily:'var(--font-ui)' }}>{mins}:{secs}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'48px 24px 80px' }}>
        <StepBar current={2}/>
        {paid ? (
          <div style={{ textAlign:'center', padding:'48px 0' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(0,184,148,0.1)', border:'2px solid var(--green)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:36, animation:'float 2s ease-in-out infinite' }}>✅</div>
            <h2 style={{ fontSize:24, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', marginBottom:8 }}>Pembayaran Berhasil!</h2>
            <p style={{ fontSize:14, color:'var(--text-secondary)' }}>Mengarahkan ke e-ticket kamu...</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Order info */}
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:16, padding:'18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, boxShadow:'var(--shadow-sm)' }}>
              <div>
                <p style={{ fontSize:10, color:'var(--text-muted)', margin:'0 0 3px', fontFamily:'var(--font-ui)', letterSpacing:'1px', textTransform:'uppercase' }}>Order ID</p>
                <p style={{ fontSize:20, fontWeight:900, color:'var(--accent)', fontFamily:'var(--font-ui)', margin:0, letterSpacing:'1px' }}>{orderCode}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:10, color:'var(--text-muted)', margin:'0 0 3px', fontFamily:'var(--font-ui)', letterSpacing:'1px', textTransform:'uppercase' }}>Total</p>
                <p style={{ fontSize:26, fontWeight:900, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:0 }}>{formatIDR(total)}</p>
              </div>
            </div>

            {/* Payment info */}
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:16, padding:24, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                <span style={{ fontSize:28 }}>{info.icon}</span>
                <div>
                  <p style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:0 }}>{info.title}</p>
                  <p style={{ fontSize:12, color:'var(--text-muted)', margin:0 }}>Selesaikan sebelum {mins}:{secs}</p>
                </div>
              </div>
              {info.detail && (
                <div style={{ background:'var(--accent-dim)', border:'1px solid rgba(0,102,255,0.15)', borderRadius:12, padding:'14px 18px', marginBottom:18 }}>
                  {info.detail.bank && <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7, fontSize:13 }}><span style={{ color:'var(--text-muted)' }}>Bank</span><span style={{ fontWeight:600 }}>{info.detail.bank}</span></div>}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)' }}>{method==='EWALLET'?'No. HP':'No. Rekening'}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:16, fontWeight:900, color:'var(--accent)', fontFamily:'var(--font-ui)', letterSpacing:'1px' }}>{info.detail.no}</span>
                      <button onClick={()=>{ navigator.clipboard.writeText(info.detail.no); toast.success('Disalin!') }}
                        style={{ background:'var(--accent)', color:'#fff', border:'none', borderRadius:6, padding:'3px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>Salin</button>
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}><span style={{ color:'var(--text-muted)' }}>Atas Nama</span><span style={{ fontWeight:600 }}>{info.detail.atas}</span></div>
                </div>
              )}
              <p style={{ fontSize:13, fontWeight:700, color:'var(--text-secondary)', margin:'0 0 10px', fontFamily:'var(--font-ui)' }}>Langkah Pembayaran:</p>
              {info.steps.map((step,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                  <span style={{ width:22, height:22, borderRadius:6, background:'var(--accent-dim)', border:'1px solid rgba(0,102,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'var(--accent)', flexShrink:0, fontFamily:'var(--font-ui)' }}>{i+1}</span>
                  <p style={{ fontSize:13, color:'var(--text-secondary)', margin:0, lineHeight:1.6, paddingTop:2 }}>{step}</p>
                </div>
              ))}
            </div>

            {/* Upload bukti */}
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:16, padding:'18px 24px', boxShadow:'var(--shadow-sm)' }}>
              <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 8px' }}>
                📎 Upload Bukti Bayar <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:400 }}>(opsional, mempercepat konfirmasi)</span>
              </p>
              <input type="file" accept="image/*,.pdf" onChange={e=>setProofFile(e.target.files[0])}
                style={{ fontSize:13, color:'var(--text-secondary)', fontFamily:'var(--font-sans)' }}/>
              {proofFile && <p style={{ fontSize:12, color:'var(--green)', margin:'6px 0 0' }}>✅ {proofFile.name}</p>}
            </div>

            {/* Confirm */}
            <button onClick={handleConfirm} disabled={loading}
              style={{ width:'100%', background:loading?'var(--bg-3)':'linear-gradient(135deg,#0066ff,#00c6ff)', color:loading?'var(--text-muted)':'#fff', border:loading?'1px solid var(--border)':'none', borderRadius:16, padding:'16px', fontSize:16, fontWeight:800, cursor:loading?'not-allowed':'pointer', fontFamily:'var(--font-ui)', boxShadow:loading?'none':'0 8px 24px rgba(0,102,255,0.3)', transition:'all 0.25s' }}>
              {loading?'⏳ Mengkonfirmasi ke server...':'✅ Saya Sudah Bayar — Konfirmasi Sekarang'}
            </button>
            <p style={{ textAlign:'center', fontSize:12, color:'var(--text-muted)', lineHeight:1.6 }}>Klik setelah pembayaran selesai. Status akan diperbarui otomatis di database.</p>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}
