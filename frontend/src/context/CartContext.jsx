import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], totalPrice: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], totalPrice: 0 }); return }
    try {
      setLoading(true)
      const { data } = await api.get('/cart')
      setCart(data)
    } catch {
      setCart({ items: [], totalPrice: 0 })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity })
      setCart(data)
      toast.success('Added to cart')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity })
      setCart(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart')
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`)
      setCart(data)
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      await api.delete('/cart')
      setCart({ items: [], totalPrice: 0 })
    } catch {
      // silent
    }
  }

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
