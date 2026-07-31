import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // Navigation
  currentPage: 'home',
  pageParams: null,
  navigate: (page, params = null) => {
    set({ currentPage: page, pageParams: params })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },

  // Booking flow
  bookingDraft: null,
  orderData: null,
  setBookingDraft: (draft) => set({ bookingDraft: draft }),
  setOrderData: (data) => set({ orderData: data }),

  // Wishlist
  wishlist: [],
  toggleWishlist: (id) => set(s => ({
    wishlist: s.wishlist.includes(id) ? s.wishlist.filter(x => x !== id) : [...s.wishlist, id]
  })),
  isWishlisted: (id) => get().wishlist.includes(id),

  // UI
  chatOpen: false,
  setChatOpen: (v) => set({ chatOpen: v }),

  // Filter
  activeCategory: 'all',
  setActiveCategory: (c) => set({ activeCategory: c }),

  // My orders (cek tiket)
  myOrders: [],
  setMyOrders: (orders) => set({ myOrders: orders }),
}))
