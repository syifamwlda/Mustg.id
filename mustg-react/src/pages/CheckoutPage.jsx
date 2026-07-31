import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { formatIDR, TOUR_INFO, DEFAULT_TOUR } from '../data/destinations'
import { createOrder } from '../services/api'
import Footer from '../components/layout/Footer'
import toast from 'react-hot-toast'

const STEPS = ['Pilih Tiket', 'Data Pemesan', 'Pembayaran', 'Selesai']

function StepBar({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:48 }}>
      {STEPS.map((label, i) => {
        const done = i < current, active = i === current
        return (
          <div key={label} style={{ display:'flex', alignItems:'center' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{ width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: done?'var(--accent)':active?'var(--accent-dim)':'var(--bg-3)', border:`2px solid ${done||active?'var(--accent)':'var(--border)'}`, boxShadow:done||active?'0 4px 12px rgba(0,102,255,0.2)':'none' }}>
                {done ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize:13, fontWeight:700, color:active?'var(--accent)':'var(--text-muted)', fontFamily:'var(--font-ui)' }}>{i+1}</span>}
              </div>
              <span style={{ fontSize:11, fontWeight:active?700:400, color:active?'var(--accent)':done?'var(--text-secondary)':'var(--text-muted)', fontFamily:'var(--font-ui)', whiteSpace:'nowrap' }}>{label}</span>
            </div>
            {i < STEPS.length-1 && <div style={{ width:'clamp(30px,7vw,80px)', height:2, background:i<current?'var(--accent)':'var(--border)', margin:'0 6px', marginBottom:22, borderRadius:1 }}/>}
          </div>
        )
      })}
    </div>
  )
}

export default function CheckoutPage() {
  const { navigate, bookingDraft, setOrderData } = useAppStore()
  const [name,       setName]       = useState('')
  const [phone,      setPhone]      = useState('')
  const [email,      setEmail]      = useState('')
  const [payMethod,  setPayMethod]  = useState('')
  const [errors,     setErrors]     = useState({})
  const [focused,    setFocused]    = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const dest      = bookingDraft?.destination
  const ticket    = bookingDraft?.ticket
  const qty       = bookingDraft?.qty || 1
  const total     = (ticket?.price || 0) * qty

  // Ambil destination_id & ticket_type_id — paksa integer
  const destId   = parseInt(bookingDraft?.destination_id, 10)
  const ticketId = parseInt(bookingDraft?.ticket_type_id, 10)

  const tourInfo = TOUR_INFO[bookingDraft?.destination_id] || DEFAULT_TOUR

  const validate = () => {
    const e = {}
    if (!name.trim())                               e.name      = 'Nama wajib diisi'
    if (!phone || phone.length < 10)                e.phone     = 'Min. 10 digit'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email     = 'Format email tidak valid'
    if (!payMethod)                                 e.payMethod = 'Pilih metode pembayaran'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Lengkapi semua field'); return }

    // Validasi ID integer sebelum kirim
    if (!destId || isNaN(destId)) {
      toast.error('Destinasi tidak valid. Pilih ulang dari halaman utama.')
      return
    }
    if (!ticketId || isNaN(ticketId)) {
      toast.error('Tiket tidak valid. Pilih ulang dari halaman utama.')
      return
    }

    setErrors({})
    setSubmitting(true)

    const payload = {
      destination_id:  destId,      // integer ✅
      ticket_type_id:  ticketId,    // integer ✅
      transport_id:    bookingDraft.transport_id  ? parseInt(bookingDraft.transport_id, 10)  : null,
      tour_guide_id:   bookingDraft.tour_guide_id ? parseInt(bookingDraft.tour_guide_id, 10) : null,
      package_id:      bookingDraft.package_id    ? parseInt(bookingDraft.package_id, 10)    : null,
      visit_date:      bookingDraft.visit_date,
      qty:             Number(qty),
      customer_name:   name,
      customer_phone:  phone,
      customer_email:  email,
      payment_method:  payMethod,
    }

    // Debug — hapus setelah sukses
    console.log('📦 Payload ke backend:', payload)

    try {
      const order = await createOrder(payload)
      setOrderData({ ...order, destination: dest, ticket })
      toast.success('Pesanan tersimpan ke database!')
      setTimeout(() => navigate('payment'), 500)
    } catch (err) {
      console.error('❌ Error dari backend:', err.message, err.errors)
      toast.error('Gagal menyimpan pesanan: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const iStyle = (n) => ({
    width:'100%', background:'#fff',
    border:`1.5px solid ${errors[n]?'#e53e3e':focused===n?'var(--accent)':'var(--border)'}`,
    borderRadius:12, padding:'13px 16px', color:'var(--text-primary)', fontSize:14,
    fontFamily:'var(--font-sans)', outline:'none', boxSizing:'border-box', transition:'all 0.2s',
    boxShadow: focused===n?'0 0 0 4px var(--accent-dim)':errors[n]?'0 0 0 3px rgba(229,62,62,0.1)':'none',
  })
  const lStyle = { display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:7, fontFamily:'var(--font-ui)' }

  if (!bookingDraft) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ textAlign:'center', background:'#fff', borderRadius:24, padding:48, boxShadow:'var(--shadow-lg)', maxWidth:380 }}>
        <div style={{ fontSize:64, marginBottom:20 }}>🎫</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-ui)', marginBottom:10 }}>Belum Ada Pilihan Tiket</h2>
        <p style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:28, lineHeight:1.6 }}>Silakan pilih destinasi dan tiket terlebih dahulu.</p>
        <button onClick={() => navigate('home')} style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'13px 28px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-ui)' }}>
          Pilih Destinasi →
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      {/* Topbar */}
      <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'0 24px', position:'sticky', top:0, zIndex:100, boxShadow:'var(--shadow-sm)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', height:64, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => navigate('home')} style={{ background:'none', border:'none', display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#0066ff,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🌴</div>
            <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:16, color:'var(--text-primary)' }}>MustG<span style={{ color:'var(--accent)' }}>.id</span></span>
          </button>
          <button onClick={() => navigate('home')} style={{ background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:9, padding:'7px 16px', fontSize:13, color:'var(--text-secondary)', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
            ← Kembali
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'48px 24px 80px' }}>
        <StepBar current={1}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:40, alignItems:'start' }} className="checkout-layout">

          {/* Left */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--accent-dim)', border:'1px solid rgba(0,102,255,0.2)', borderRadius:9, padding:'5px 14px', marginBottom:18 }}>
              <span style={{ fontSize:12, color:'var(--accent)', fontWeight:700, fontFamily:'var(--font-ui)' }}>WISATA PILIHAN</span>
            </div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(20px,3vw,30px)', color:'var(--text-primary)', margin:'0 0 24px', lineHeight:1.3, fontWeight:700 }}>{tourInfo.fullTitle}</h1>
            <div style={{ borderRadius:18, overflow:'hidden', marginBottom:24, boxShadow:'var(--shadow-md)' }}>
              <img src={dest?.thumbnail_url} alt={dest?.name}
                onError={e => e.target.src='https://images.unsplash.com/photo-1519563290628-a2feaf32ceee?w=800&q=80'}
                style={{ width:'100%', height:240, objectFit:'cover' }}/>
            </div>
            <div style={{ display:'flex', background:'#fff', border:'1.5px solid var(--border)', borderRadius:16, overflow:'hidden', marginBottom:28, boxShadow:'var(--shadow-sm)' }}>
              {[{icon:'🕐',label:'Durasi',val:tourInfo.duration},{icon:'👥',label:'Pengunjung',val:`${qty} ${tourInfo.visitors}`},{icon:'🎂',label:'Usia Min.',val:tourInfo.minAge}].map((m,i) => (
                <div key={i} style={{ flex:1, padding:'16px', borderRight:i<2?'1px solid var(--border)':'none', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:20 }}>{m.icon}</span>
                  <div>
                    <p style={{ fontSize:10, color:'var(--text-muted)', margin:'0 0 2px', fontFamily:'var(--font-ui)', letterSpacing:'0.5px', textTransform:'uppercase' }}>{m.label}</p>
                    <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', margin:0, fontFamily:'var(--font-ui)' }}>{m.val}</p>
                  </div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 12px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>Highlight Tur</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {tourInfo.highlights.map((h,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, background:'var(--bg)', borderRadius:10, padding:'10px 12px', border:'1px solid var(--border)' }}>
                  <div style={{ width:18, height:18, borderRadius:5, background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p style={{ fontSize:12, color:'var(--text-secondary)', margin:0, lineHeight:1.5 }}>{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right sticky */}
          <div style={{ position:'sticky', top:80 }}>
            {/* Summary */}
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:20, padding:22, marginBottom:14, boxShadow:'var(--shadow)' }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 14px' }}>Ringkasan Pesanan</h3>
              {[
                ['Destinasi', dest?.name],
                ['Tiket', ticket?.name],
                ['Tanggal', bookingDraft?.visit_date],
                ['Jumlah × Harga', `${qty} × ${formatIDR(ticket?.price||0)}`],
              ].filter(([,v]) => v).map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
                  <span style={{ color:'var(--text-muted)' }}>{k}</span>
                  <span style={{ color:'var(--text-primary)', fontWeight:500, textAlign:'right', maxWidth:'55%' }}>{v}</span>
                </div>
              ))}
              <div style={{ height:1, background:'var(--border)', margin:'12px 0' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font-ui)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>Total</span>
                <span style={{ fontSize:22, fontWeight:900, color:'var(--accent)', fontFamily:'var(--font-ui)' }}>{formatIDR(total)}</span>
              </div>
            </div>

            {/* Form */}
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:20, padding:22, boxShadow:'var(--shadow)' }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 4px' }}>Data Pemesan</h3>
              <p style={{ fontSize:12, color:'var(--text-muted)', margin:'0 0 18px' }}>Data ini disimpan ke database.</p>
              <form onSubmit={handleSubmit} noValidate>
                {[
                  { label:'NAMA LENGKAP', type:'text',  val:name,  set:setName,  ph:'Nama sesuai KTP',  key:'name' },
                  { label:'NO. HP',       type:'tel',   val:phone, set:setPhone, ph:'08xxxxxxxxxx',     key:'phone' },
                  { label:'EMAIL',        type:'email', val:email, set:setEmail, ph:'email@contoh.com', key:'email' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom:14 }}>
                    <label style={lStyle}>{f.label}</label>
                    <input type={f.type} value={f.val} placeholder={f.ph}
                      onFocus={() => setFocused(f.key)} onBlur={() => setFocused(null)}
                      onChange={e => { f.set(e.target.value); setErrors(p => ({...p, [f.key]:''})) }}
                      style={iStyle(f.key)}/>
                    {errors[f.key] && <p style={{ fontSize:11, color:'#e53e3e', margin:'4px 0 0' }}>⚠ {errors[f.key]}</p>}
                  </div>
                ))}

                <div style={{ marginBottom:18 }}>
                  <label style={lStyle}>METODE PEMBAYARAN</label>
                  <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                    {[['BANK_TRANSFER','🏦 Transfer Bank'],['EWALLET','📱 E-Wallet (GoPay/OVO/DANA)'],['CARD','💳 Kartu Kredit/Debit']].map(([val,label]) => (
                      <button key={val} type="button"
                        onClick={() => { setPayMethod(val); setErrors(p => ({...p,payMethod:''})) }}
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', background:payMethod===val?'var(--accent-dim)':'#fff', border:`1.5px solid ${payMethod===val?'rgba(0,102,255,0.3)':'var(--border)'}`, borderRadius:11, cursor:'pointer', color:'var(--text-primary)', fontSize:13, fontFamily:'var(--font-sans)', fontWeight:payMethod===val?600:400, transition:'all 0.15s', textAlign:'left' }}>
                        <div style={{ width:17, height:17, borderRadius:'50%', border:`2px solid ${payMethod===val?'var(--accent)':'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {payMethod===val && <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--accent)' }}/>}
                        </div>
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.payMethod && <p style={{ fontSize:11, color:'#e53e3e', margin:'6px 0 0' }}>⚠ {errors.payMethod}</p>}
                </div>

                <button type="submit" disabled={submitting}
                  style={{ width:'100%', background:submitting?'var(--bg-3)':'linear-gradient(135deg,#0066ff,#00c6ff)', color:submitting?'var(--text-muted)':'#fff', border:submitting?'1px solid var(--border)':'none', borderRadius:14, padding:'14px', fontSize:15, fontWeight:800, cursor:submitting?'not-allowed':'pointer', fontFamily:'var(--font-ui)', boxShadow:submitting?'none':'0 8px 24px rgba(0,102,255,0.3)', transition:'all 0.2s' }}>
                  {submitting ? '⏳ Menyimpan ke database...' : 'Lanjut ke Pembayaran →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      <style>{`@media(max-width:860px){.checkout-layout{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}