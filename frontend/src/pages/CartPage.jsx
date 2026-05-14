import { useEffect } from 'react'
import { useCart } from '../hooks/useCart'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import Loading from '../components/common/Loading'

export default function CartPage() {
  const { cart, loading, fetchCart, updateItem, removeItem, clearCart } = useCart()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>
          <div>
            <CartSummary cart={cart} />
          </div>
        </div>
      )}
    </div>
  )
}
