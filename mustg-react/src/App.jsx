import { Toaster } from 'react-hot-toast'
import { useAppStore } from './store/appStore'
import HomePage from './pages/HomePage'
import DestinationsPage from './pages/DestinationsPage'
import PackagesPage from './pages/PackagesPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentPage from './pages/PaymentPage'
import ReceiptPage from './pages/ReceiptPage'
import MyTicketsPage from './pages/MyTicketsPage'
import AIChat from './components/ui/AIChat'

export default function App() {
  const { currentPage } = useAppStore()
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#fff', color: '#1a1a2e',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '12px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
        success: { iconTheme: { primary: '#00b894', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#ff5a1f', secondary: '#fff' } },
      }}/>
      {currentPage === 'home'         && <HomePage />}
      {currentPage === 'destinations' && <DestinationsPage />}
      {currentPage === 'packages'     && <PackagesPage />}
      {currentPage === 'checkout'     && <CheckoutPage />}
      {currentPage === 'payment'      && <PaymentPage />}
      {currentPage === 'receipt'      && <ReceiptPage />}
      {currentPage === 'my-tickets'   && <MyTicketsPage />}
      <AIChat />
    </>
  )
}
