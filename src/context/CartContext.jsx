import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartApi } from '../api/orderApi'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart,    setCart]    = useState({ items: [], total: 0, totalItems: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { setCart({ items: [], total: 0, totalItems: 0 }); return }
    try {
      setLoading(true)
      const { data } = await cartApi.getCart()
      setCart(normalizeCart(data))
    } catch (e) {
      console.error('Cart fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = useCallback(async (book, quantity = 1) => {
    try {
      const { data } = await cartApi.addItem({
        bookId:       book.id,
        title:        book.title,
        author:       book.author,
        coverImageUrl:book.coverImageUrl,
        quantity,
        unitPrice:    book.price,
        sellerId:     book.sellerId,
      })
      setCart(normalizeCart(data))
      toast.success('Added to cart!')
    } catch (e) {
      toast.error('Failed to add to cart')
    }
  }, [])

  const updateQuantity = useCallback(async (bookId, qty) => {
    try {
      const { data } = await cartApi.updateQuantity(bookId, qty)
      setCart(normalizeCart(data))
    } catch (e) {
      toast.error('Update failed')
    }
  }, [])

  const removeFromCart = useCallback(async (bookId) => {
    try {
      const { data } = await cartApi.removeItem(bookId)
      setCart(normalizeCart(data))
      toast.success('Removed from cart')
    } catch (e) {
      toast.error('Remove failed')
    }
  }, [])

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clearCart()
      setCart({ items: [], total: 0, totalItems: 0 })
    } catch (e) {
      console.error('Clear cart failed', e)
    }
  }, [])

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart,
                                   updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

function normalizeCart(data) {
  const items = data.items || []
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  return { items, total, totalItems }
}
