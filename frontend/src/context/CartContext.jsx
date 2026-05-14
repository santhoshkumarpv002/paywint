import { createContext, useState, useCallback, useContext } from 'react'
import { getCart, addToCart as apiAdd, updateCartItem as apiUpdate, removeCartItem as apiRemove, clearCart as apiClear } from '../api/cart'
import { AuthContext } from './AuthContext'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 })
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)

  const fetchCart = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getCart()
      setCart(data)
    } catch {
      // ignore if not logged in
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToCart = async (productId, quantity = 1) => {
    const data = await apiAdd(productId, quantity)
    setCart(data)
    return data
  }

  const updateItem = async (itemId, quantity) => {
    const data = await apiUpdate(itemId, quantity)
    setCart(data)
    return data
  }

  const removeItem = async (itemId) => {
    const data = await apiRemove(itemId)
    setCart(data)
    return data
  }

  const clearCartItems = async () => {
    const data = await apiClear()
    setCart(data)
    return data
  }

  const resetCart = () => {
    setCart({ items: [], total: 0, item_count: 0 })
  }

  return (
    <CartContext.Provider value={{
      cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart: clearCartItems, resetCart
    }}>
      {children}
    </CartContext.Provider>
  )
}
