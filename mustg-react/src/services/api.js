const BASE = '/api'

async function req(method, path, body = null, isFormData = false) {
  const token = localStorage.getItem('mustg_token')
  const headers = { Accept: 'application/json' }
  if (!isFormData) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const opts = { method, headers }
  if (body && !isFormData) opts.body = JSON.stringify(body)
  if (body && isFormData)  opts.body = body

  const res  = await fetch(`${BASE}${path}`, opts)
  const json = await res.json()
  if (!res.ok) {
    const e = new Error(json?.message || `HTTP ${res.status}`)
    e.errors = json?.errors || {}
    e.status = res.status
    throw e
  }
  return json
}

// Auth
export const authRegister    = (data)  => req('POST', '/auth/register', data).then(r => r.data)
export const authLogin       = (data)  => req('POST', '/auth/login', data).then(r => r.data)
export const authLogout      = ()      => req('POST', '/auth/logout')
export const authMe          = ()      => req('GET',  '/auth/me').then(r => r.data)
export const authUpdateProfile = (data) => req('PUT', '/auth/profile', data).then(r => r.data)

// Destinations
export const getDestinations       = ()    => req('GET', '/destinations').then(r => r.data)
export const getDestination        = (id)  => req('GET', `/destinations/${id}`).then(r => r.data)
export const getDestinationTickets = (id)  => req('GET', `/destinations/${id}/tickets`).then(r => r.data)

// Transports
export const getTransports = () => req('GET', '/transports').then(r => r.data).catch(() => [])

// Tour Guides
export const getTourGuides = () => req('GET', '/tour-guides').then(r => r.data).catch(() => [])

// Packages
export const getPackages   = () => req('GET', '/packages').then(r => r.data).catch(() => [])

// Orders
export const createOrder       = (payload) => req('POST', '/orders', payload).then(r => r.data)
export const getOrder          = (code)    => req('GET',  `/orders/${code}`).then(r => r.data)
export const getOrderLogs      = (code)    => req('GET',  `/orders/${code}/logs`).then(r => r.data)
export const findOrdersByEmail = (email)   => req('GET',  `/orders?email=${encodeURIComponent(email)}`).then(r => r.data)
export const rescheduleOrder   = (code, date) => req('PATCH', `/orders/${code}/reschedule`, { visit_date: date }).then(r => r.data)
export const cancelOrder       = (code)   => req('PATCH', `/orders/${code}/cancel`).then(r => r.data)

export const confirmPayment = async (code, proofFile = null) => {
  const fd = new FormData()
  if (proofFile) fd.append('proof', proofFile)
  const res  = await fetch(`${BASE}/orders/${code}/confirm-payment`, {
    method: 'PATCH',
    headers: { Accept: 'application/json', Authorization: `Bearer ${localStorage.getItem('mustg_token') || ''}` },
    body: fd,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || 'Konfirmasi gagal')
  return json.data
}