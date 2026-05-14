import { useState, useEffect } from 'react'
import { useCart } from '../hooks/useCart'
import { checkout } from '../api/orders'
import CheckoutForm from '../components/checkout/CheckoutForm'
import BillingInfo from '../components/checkout/BillingInfo'
import OrderConfirmation from '../components/checkout/OrderConfirmation'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'

export default function CheckoutPage() {
  const { cart, fetchCart, resetCart } = useCart()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cartLoading, setCartLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await fetchCart()
      setCartLoading(false)
    }
    load()
  }, [fetchCart])

  const handleCheckout = async (shippingAddress, billingAddress) => {
    setError('')
    setLoading(true)
    try {
      const data = await checkout(shippingAddress, billingAddress)
      setOrder(data)
      resetCart()
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (cartLoading) return <Loading />
  if (order) return <OrderConfirmation order={order} />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <ErrorMessage message={error} />

      {cart.items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping & Billing</h2>
            <CheckoutForm onSubmit={handleCheckout} loading={loading} />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <BillingInfo cart={cart} />
          </div>
        </div>
      )}
    </div>
  )
}
