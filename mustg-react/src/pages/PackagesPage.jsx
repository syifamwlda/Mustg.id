import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAppStore } from '../store/appStore'
import { getPackages, getTransports, getTourGuides } from '../services/api'
import { packages as LOCAL_PKG, transports as LOCAL_TR, tourGuides as LOCAL_GUIDE, formatIDR } from '../data/destinations'
import toast from 'react-hot-toast'

const TABS = [
  { id:'paket',     label:'🎒 Paket Bundling',      desc:'Tiket + Transport + Guide all-in-one, lebih hemat' },
  { id:'transport', label:'🚐 Sewa Transport',       desc:'Pilih kendaraan sesuai jumlah rombongan' },
  { id:'guide',     label:'👨‍🏫 Tour Guide',           desc:'Pemandu wisata bersertifikat HPI' },
  { id:'custom',    label:'⚙️ Paket Custom',          desc:'Kombinasi bebas sesuai kebutuhan' },
]

export default function PackagesPage() {
  const { navigate, setBookingDraft } = useAppStore()
  const [activeTab,        setActiveTab]        = useState('paket')
  const [packages,         setPackages]         = useState(LOCAL_PKG)
  const [transports,       setTransports]       = useState(LOCAL_TR)
  const [guides,           setGuides]           = useState(LOCAL_GUIDE)
  const [loading,          setLoading]          = useState(true)
  const [selectedTransport,setSelectedTransport]= useState(null)
  const [selectedGuide,    setSelectedGuide]    = useState(null)
  const [visitDate,        setVisitDate]        = useState('')
  const [pax,              setPax]              = useState(2)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    Promise.all([getPackages(), getTransports(), getTourGuides()])
      .then(([pkgs, trs, gds]) => {
        if (pkgs?.length) setPackages(pkgs)
        if (trs?.length)  setTransports(trs)
        if (gds?.length)  setGuides(gds)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const selTransport = transports.find(t => String(t.id) === String(selectedTransport))
  const selGuide     = guides.find(g => String(g.id) === String(selectedGuide))

  const customTotal = (selTransport?.price_per_day || 0) + (selGuide?.price_per_day || 0)

  const handleBookPackage = (pkg) => {
    if (!visitDate) { toast.error('Pilih tanggal kunjungan dulu!'); return }
    setBookingDraft({
      type:        'package',
      package:     pkg,
      package_id:  pkg.id,
      visit_date:  visitDate,
      qty:         pax,
      destination: { name: pkg.name, thumbnail_url: pkg.thumbnail_url || pkg.thumbnail },
      ticket:      { name: pkg.name, price: pkg.price },
      // Data untuk OrderResource
      destination_id: null,
      ticket_type_id: null,
    })
    toast.success('Paket dipilih! Lanjut ke detail...')
    setTimeout(() => navigate('checkout'), 400)
  }

  const handleBookCustom = () => {
    if (!visitDate) { toast.error('Pilih tanggal dulu!'); return }
    if (!selTransport && !selGuide) { toast.error('Pilih minimal transport atau tour guide!'); return }
    toast.success('✅ Paket custom berhasil dibuat! Tim kami akan menghubungi kamu.')
    // Di production: kirim ke endpoint khusus custom order
  }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      <Navbar/>

      {/* Hero */}
      <div style={{ backgroundImage: `url('https://i.pinimg.com/1200x/a4/9f/61/a49f616e403e5ffa5326c2c7ba4b5d49.jpg')`, paddingTop:'calc(var(--nav-h) + 48px)', paddingBottom:56, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }}/>
        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <span style={{ background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:11, fontWeight:800, padding:'5px 14px', borderRadius:99, fontFamily:'var(--font-ui)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:16, display:'inline-block' }}>LAYANAN LENGKAP</span>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(26px,4vw,48px)', color:'#fff', margin:'12px 0', fontWeight:700, lineHeight:1.2 }}>
            Bukan Cuma <span style={{ color:'#7dd3fc' }}>Tiket Masuk</span>
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.8)', maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
            Transport, tour guide, paket bundling — pesan semua dari satu tempat, lebih hemat & praktis.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', position:'sticky', top:'var(--nav-h)', zIndex:50, boxShadow:'var(--shadow-sm)' }}>
        <div className="container">
          <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding:'18px 24px', background:'none', border:'none', borderBottom:`3px solid ${activeTab===tab.id?'var(--accent)':'transparent'}`, color:activeTab===tab.id?'var(--accent)':'var(--text-secondary)', fontFamily:'var(--font-ui)', fontSize:14, fontWeight:activeTab===tab.id?700:400, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s' }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'40px 24px 80px' }}>

        {/* ─── PAKET BUNDLING ─── */}
        {activeTab==='paket' && (
          <div>
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,3vw,34px)', color:'var(--text-primary)', margin:'0 0 8px', fontWeight:700 }}>Paket Wisata Bundling</h2>
              <p style={{ fontSize:14, color:'var(--text-secondary)', margin:0 }}>Sudah termasuk tiket masuk, transport, & tour guide. Harga lebih hemat dari beli satuan.</p>
            </div>

            {/* Date + Pax picker */}
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:16, padding:'20px 24px', marginBottom:32, display:'flex', gap:16, flexWrap:'wrap', alignItems:'flex-end', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ flex:1, minWidth:200 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:7, fontFamily:'var(--font-ui)' }}>📅 Tanggal Kunjungan</label>
                <input type="date" min={today} value={visitDate} onChange={e=>setVisitDate(e.target.value)}
                  style={{ width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:10, padding:'11px 14px', fontSize:14, color:'var(--text-primary)', fontFamily:'var(--font-sans)', outline:'none' }}
                  onFocus={e=>e.target.style.borderColor='var(--accent)'}
                  onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:7, fontFamily:'var(--font-ui)' }}>👥 Jumlah Orang</label>
                <div style={{ display:'flex', gap:8 }}>
                  <button type="button" onClick={()=>setPax(p=>Math.max(1,p-1))} style={{ width:40, height:42, borderRadius:9, background:'var(--bg-3)', border:'1.5px solid var(--border)', fontSize:18, cursor:'pointer' }}>−</button>
                  <input type="number" value={pax} min={1} max={50} onChange={e=>setPax(Number(e.target.value))}
                    style={{ width:56, textAlign:'center', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:9, padding:'10px 8px', fontSize:14, color:'var(--text-primary)', outline:'none' }}/>
                  <button type="button" onClick={()=>setPax(p=>Math.min(50,p+1))} style={{ width:40, height:42, borderRadius:9, background:'var(--accent-dim)', border:'1.5px solid rgba(0,102,255,0.2)', color:'var(--accent)', fontSize:18, cursor:'pointer' }}>+</button>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
                {[1,2,3,4].map(i=><div key={i} className="skeleton" style={{ height:440, borderRadius:20 }}/>)}
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
                {packages.map((pkg,i)=>(
                  <PackageCard key={pkg.id} pkg={pkg} onBook={handleBookPackage} idx={i}/>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TRANSPORT ─── */}
        {activeTab==='transport' && (
          <div>
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,3vw,34px)', color:'var(--text-primary)', margin:'0 0 8px', fontWeight:700 }}>Sewa Kendaraan</h2>
              <p style={{ fontSize:14, color:'var(--text-secondary)', margin:0 }}>Semua kendaraan sudah termasuk supir & bahan bakar. Pilih sesuai jumlah rombongan.</p>
            </div>

            {/* Group by type */}
            {['MOTOR','MOBIL','MINIBUS','BUS'].map(type => {
              const items = transports.filter(t=>t.type===type)
              if (!items.length) return null
              const labels = { MOTOR:'🛵 Motor', MOBIL:'🚗 Mobil', MINIBUS:'🚐 Minibus', BUS:'🚌 Bus' }
              return (
                <div key={type} style={{ marginBottom:32 }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 14px', display:'flex', alignItems:'center', gap:8 }}>
                    {labels[type]}
                    <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:400 }}>({items.length} pilihan)</span>
                  </h3>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:12 }}>
                    {items.map(t=>(
                      <TransportCard key={t.id} t={t} selected={String(selectedTransport)===String(t.id)}
                        onSelect={id=>setSelectedTransport(String(selectedTransport)===String(id)?null:id)}/>
                    ))}
                  </div>
                </div>
              )
            })}

            {selectedTransport && (
              <div style={{ background:'#fff', border:'2px solid var(--accent)', borderRadius:16, padding:'20px 24px', display:'flex', gap:16, flexWrap:'wrap', alignItems:'flex-end', boxShadow:'0 0 0 6px var(--accent-dim)', animation:'fadeUp 0.3s ease' }}>
                <div style={{ flex:1, minWidth:180 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:7, fontFamily:'var(--font-ui)' }}>📅 Tanggal Sewa</label>
                  <input type="date" min={today} value={visitDate} onChange={e=>setVisitDate(e.target.value)}
                    style={{ width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:10, padding:'11px 14px', fontSize:14, color:'var(--text-primary)', fontFamily:'var(--font-sans)', outline:'none' }}
                    onFocus={e=>e.target.style.borderColor='var(--accent)'}
                    onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div>
                    <p style={{ fontSize:11, color:'var(--text-muted)', margin:'0 0 3px', textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:'var(--font-ui)' }}>Biaya Sewa/Hari</p>
                    <p style={{ fontSize:26, fontWeight:900, color:'var(--accent)', fontFamily:'var(--font-ui)', margin:0 }}>{formatIDR(selTransport?.price_per_day||0)}</p>
                  </div>
                  <button onClick={()=>{ if(!visitDate){toast.error('Pilih tanggal dulu!');return}; toast.success('🚐 Transport dipesan! Tim kami akan menghubungi kamu.') }}
                    style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'12px 24px', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'var(--font-ui)', boxShadow:'0 4px 14px rgba(0,102,255,0.3)', whiteSpace:'nowrap' }}>
                    Pesan Sekarang →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TOUR GUIDE ─── */}
        {activeTab==='guide' && (
          <div>
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,3vw,34px)', color:'var(--text-primary)', margin:'0 0 8px', fontWeight:700 }}>Tour Guide Lokal</h2>
              <p style={{ fontSize:14, color:'var(--text-secondary)', margin:0 }}>Semua guide sudah bersertifikat HPI (Himpunan Pramuwisata Indonesia). Berpengalaman & ramah.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16, marginBottom:28 }}>
              {guides.map(g=>(
                <GuideCard key={g.id} g={g} selected={String(selectedGuide)===String(g.id)}
                  onSelect={id=>setSelectedGuide(String(selectedGuide)===String(id)?null:id)}/>
              ))}
            </div>

            {selectedGuide && (
              <div style={{ background:'#fff', border:'2px solid var(--accent)', borderRadius:16, padding:'20px 24px', display:'flex', gap:16, flexWrap:'wrap', alignItems:'flex-end', boxShadow:'0 0 0 6px var(--accent-dim)', animation:'fadeUp 0.3s ease' }}>
                <div style={{ flex:1, minWidth:180 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:7, fontFamily:'var(--font-ui)' }}>📅 Tanggal Tour</label>
                  <input type="date" min={today} value={visitDate} onChange={e=>setVisitDate(e.target.value)}
                    style={{ width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:10, padding:'11px 14px', fontSize:14, color:'var(--text-primary)', fontFamily:'var(--font-sans)', outline:'none' }}
                    onFocus={e=>e.target.style.borderColor='var(--accent)'}
                    onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div>
                    <p style={{ fontSize:11, color:'var(--text-muted)', margin:'0 0 3px', textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:'var(--font-ui)' }}>Biaya Guide/Hari</p>
                    <p style={{ fontSize:26, fontWeight:900, color:'var(--accent)', fontFamily:'var(--font-ui)', margin:0 }}>{formatIDR(selGuide?.price_per_day||0)}</p>
                  </div>
                  <button onClick={()=>{ if(!visitDate){toast.error('Pilih tanggal dulu!');return}; toast.success('👨‍🏫 Tour guide dipesan! Kami akan segera menghubungi kamu.') }}
                    style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'12px 24px', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'var(--font-ui)', boxShadow:'0 4px 14px rgba(0,102,255,0.3)', whiteSpace:'nowrap' }}>
                    Pesan Guide →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── CUSTOM ─── */}
        {activeTab==='custom' && (
          <div>
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,3vw,34px)', color:'var(--text-primary)', margin:'0 0 8px', fontWeight:700 }}>Buat Paket Custom</h2>
              <p style={{ fontSize:14, color:'var(--text-secondary)', margin:0 }}>Pilih transport & tour guide sesuai kebutuhan. Total dihitung otomatis.</p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, marginBottom:32 }} className="custom-grid">
              <div>
                <h3 style={{ fontSize:15, fontWeight:700, fontFamily:'var(--font-ui)', margin:'0 0 14px', color:'var(--text-primary)', borderBottom:'2px solid var(--border)', paddingBottom:10 }}>🚐 Pilih Transport <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:400 }}>(opsional)</span></h3>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {transports.map(t=>(
                    <TransportCard key={t.id} t={t} selected={String(selectedTransport)===String(t.id)}
                      onSelect={id=>setSelectedTransport(String(selectedTransport)===String(id)?null:id)}/>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize:15, fontWeight:700, fontFamily:'var(--font-ui)', margin:'0 0 14px', color:'var(--text-primary)', borderBottom:'2px solid var(--border)', paddingBottom:10 }}>👨‍🏫 Pilih Tour Guide <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:400 }}>(opsional)</span></h3>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {guides.map(g=>(
                    <GuideCard key={g.id} g={g} selected={String(selectedGuide)===String(g.id)}
                      onSelect={id=>setSelectedGuide(String(selectedGuide)===String(id)?null:id)}/>
                  ))}
                </div>
              </div>
            </div>

            {(selTransport||selGuide) && (
              <div style={{ background:'#fff', border:'2px solid var(--accent)', borderRadius:20, padding:'24px 28px', boxShadow:'0 0 0 6px var(--accent-dim)', animation:'fadeUp 0.3s ease' }}>
                <h3 style={{ fontSize:15, fontWeight:700, fontFamily:'var(--font-ui)', margin:'0 0 16px', color:'var(--text-primary)' }}>📋 Ringkasan Paket Custom</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
                  {selTransport && (
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                      <span style={{ color:'var(--text-secondary)' }}>{selTransport.icon} {selTransport.name} (maks. {selTransport.capacity} orang)</span>
                      <span style={{ fontWeight:700 }}>{formatIDR(selTransport.price_per_day)}/hari</span>
                    </div>
                  )}
                  {selGuide && (
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                      <span style={{ color:'var(--text-secondary)' }}>👨‍🏫 {selGuide.name}</span>
                      <span style={{ fontWeight:700 }}>{formatIDR(selGuide.price_per_day)}/hari</span>
                    </div>
                  )}
                  <div style={{ height:1, background:'var(--border)', margin:'6px 0' }}/>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:'var(--font-ui)' }}>Total/hari</span>
                    <span style={{ fontSize:26, fontWeight:900, color:'var(--accent)', fontFamily:'var(--font-ui)' }}>{formatIDR(customTotal)}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'flex-end' }}>
                  <div style={{ flex:1, minWidth:180 }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:7, fontFamily:'var(--font-ui)' }}>📅 Tanggal</label>
                    <input type="date" min={today} value={visitDate} onChange={e=>setVisitDate(e.target.value)}
                      style={{ width:'100%', background:'var(--bg)', border:'1.5px solid var(--border)', borderRadius:10, padding:'11px 14px', fontSize:14, color:'var(--text-primary)', fontFamily:'var(--font-sans)', outline:'none' }}
                      onFocus={e=>e.target.style.borderColor='var(--accent)'}
                      onBlur={e=>e.target.style.borderColor='var(--border)'}/>
                  </div>
                  <button onClick={handleBookCustom}
                    style={{ background:'linear-gradient(135deg,#0066ff,#00c6ff)', color:'#fff', border:'none', borderRadius:12, padding:'13px 28px', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'var(--font-ui)', boxShadow:'0 4px 14px rgba(0,102,255,0.3)', whiteSpace:'nowrap' }}>
                    Pesan Paket Custom →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer/>
      <style>{`@media(max-width:768px){.custom-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

/* ─── Sub-components ─── */
function PackageCard({ pkg, onBook, idx }) {
  const [hov, setHov] = useState(false)
  const disc = pkg.original_price > 0 ? Math.round((1-pkg.price/pkg.original_price)*100) : (pkg.discount_pct||0)
  const includes = pkg.includes_array || (typeof pkg.includes==='string' ? pkg.includes.split('\n').filter(Boolean) : pkg.includes || [])
  const thumb = pkg.thumbnail_url || pkg.thumbnail

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:'#fff', borderRadius:20, border:`1.5px solid ${hov?'rgba(0,102,255,0.2)':'var(--border)'}`, overflow:'hidden', boxShadow:hov?'0 20px 56px rgba(0,0,0,0.13)':'var(--shadow-sm)', transform:hov?'translateY(-5px)':'translateY(0)', transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)', animation:`fadeUp 0.4s ${idx*0.08}s both` }}>
      <div style={{ position:'relative', height:190, overflow:'hidden' }}>
        <img src={thumb} alt={pkg.name} style={{ width:'100%', height:'100%', objectFit:'cover', transform:hov?'scale(1.06)':'scale(1)', transition:'transform 0.5s' }} onError={e=>e.target.src='https://images.unsplash.com/photo-1519563290628-a2feaf32ceee?w=600'}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%)' }}/>
        <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:6 }}>
          {pkg.badge && <span style={{ background:'#ff5a1f', color:'#fff', fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:99, fontFamily:'var(--font-ui)' }}>{pkg.badge}</span>}
          {disc>0 && <span style={{ background:'rgba(255,255,255,0.92)', color:'#00b894', fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:99, fontFamily:'var(--font-ui)' }}>HEMAT {disc}%</span>}
        </div>
        <div style={{ position:'absolute', bottom:12, left:14 }}>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.75)', margin:'0 0 1px', fontFamily:'var(--font-ui)' }}>MULAI DARI</p>
          <p style={{ fontSize:18, fontWeight:800, color:'#fff', margin:0, fontFamily:'var(--font-ui)' }}>{formatIDR(pkg.price)}</p>
        </div>
      </div>
      <div style={{ padding:'18px 20px 20px' }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 4px' }}>{pkg.name}</h3>
        <div style={{ display:'flex', gap:12, marginBottom:12, fontSize:12, color:'var(--text-muted)' }}>
          <span>🕐 {pkg.duration}</span><span>👥 {pkg.min_pax}</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:16 }}>
          {includes.slice(0,5).map((item,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:16, height:16, borderRadius:4, background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize:11, color:'var(--text-muted)', margin:'0 0 1px', textDecoration:'line-through' }}>{formatIDR(pkg.original_price)}</p>
            <p style={{ fontSize:20, fontWeight:800, color:'var(--accent)', margin:0, fontFamily:'var(--font-ui)' }}>{formatIDR(pkg.price)}</p>
          </div>
          <button onClick={()=>onBook(pkg)} style={{ background:hov?'linear-gradient(135deg,#0066ff,#00c6ff)':'#fff', color:hov?'#fff':'var(--accent)', border:`1.5px solid ${hov?'transparent':'rgba(0,102,255,0.3)'}`, borderRadius:11, padding:'10px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-ui)', transition:'all 0.2s', boxShadow:hov?'0 4px 14px rgba(0,102,255,0.3)':'none' }}>
            Pesan →
          </button>
        </div>
      </div>
    </div>
  )
}

function TransportCard({ t, selected, onSelect }) {
  return (
    <button onClick={()=>onSelect(t.id)} style={{ display:'block', width:'100%', background:'#fff', border:`2px solid ${selected?'var(--accent)':'var(--border)'}`, borderRadius:14, padding:'16px 18px', cursor:'pointer', textAlign:'left', transition:'all 0.2s', boxShadow:selected?'0 0 0 4px var(--accent-dim)':'var(--shadow-sm)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ fontSize:28 }}>{t.icon}</span>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 2px' }}>{t.name}</p>
            <p style={{ fontSize:12, color:'var(--text-secondary)', margin:'0 0 3px' }}>{t.description}</p>
            <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>👥 Maks. {t.capacity} orang {t.plate_number && `· ${t.plate_number}`}</p>
          </div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0, marginLeft:8 }}>
          <p style={{ fontSize:16, fontWeight:800, color:selected?'var(--accent)':'var(--text-primary)', fontFamily:'var(--font-ui)', margin:0 }}>{formatIDR(t.price_per_day)}</p>
          <p style={{ fontSize:11, color:'var(--text-muted)', margin:'2px 0 0' }}>/hari</p>
        </div>
      </div>
      {selected && <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:5, color:'var(--accent)', fontSize:12, fontWeight:600 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Dipilih
      </div>}
    </button>
  )
}

function GuideCard({ g, selected, onSelect }) {
  const langs = typeof g.languages==='string' ? g.languages : g.languages?.join(', ')
  return (
    <button onClick={()=>onSelect(g.id)} style={{ display:'block', width:'100%', background:'#fff', border:`2px solid ${selected?'var(--accent)':'var(--border)'}`, borderRadius:14, padding:'16px 18px', cursor:'pointer', textAlign:'left', transition:'all 0.2s', boxShadow:selected?'0 0 0 4px var(--accent-dim)':'var(--shadow-sm)' }}>
      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <img src={g.photo_url||g.photo} alt={g.name} style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', border:'2px solid var(--border)', flexShrink:0 }} onError={e=>e.target.style.display='none'}/>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', fontFamily:'var(--font-ui)', margin:'0 0 2px' }}>{g.name}</p>
            {g.badge && <span style={{ fontSize:10, background:'var(--accent-dim)', color:'var(--accent)', padding:'2px 8px', borderRadius:6, fontWeight:700, fontFamily:'var(--font-ui)', flexShrink:0, marginLeft:6 }}>{g.badge}</span>}
          </div>
          <p style={{ fontSize:12, color:'var(--text-secondary)', margin:'0 0 4px' }}>{g.specialization} · {langs}</p>
          <div style={{ display:'flex', gap:10, fontSize:12, alignItems:'center' }}>
            <span style={{ color:'#f5a623' }}>⭐ {g.rating}</span>
            <span style={{ color:'var(--text-muted)' }}>📋 {g.total_tours} tour</span>
            <span style={{ fontWeight:800, color:selected?'var(--accent)':'var(--text-primary)', fontFamily:'var(--font-ui)' }}>{formatIDR(g.price_per_day)}/hari</span>
          </div>
        </div>
      </div>
      {selected && <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:5, color:'var(--accent)', fontSize:12, fontWeight:600 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Dipilih
      </div>}
    </button>
  )
}
