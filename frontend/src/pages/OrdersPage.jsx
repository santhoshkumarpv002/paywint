import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/orders'
import { formatCurrency } from '../utils/formatCurrency'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <ErrorMessage message={error} />

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600">{formatCurrency(order.total_amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
