import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOrder } from '../api/orders'
import { formatCurrency } from '../utils/formatCurrency'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id)
        setOrder(data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Order not found')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!order) return null

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Status</span>
          <span className={`px-2 py-1 rounded text-sm ${
            order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {order.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date</span>
          <span>{new Date(order.created_at).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping Address</span>
          <span className="text-right">{order.shipping_address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Billing Address</span>
          <span className="text-right">{order.billing_address}</span>
        </div>

        <hr />

        <h2 className="font-semibold">Items</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product_name} x {item.quantity}</span>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-indigo-600">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>
    </div>
  )
}
