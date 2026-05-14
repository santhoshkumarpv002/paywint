import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'

export default function OrderConfirmation({ order }) {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <div className="text-green-500 text-5xl mb-4">&#10003;</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 mb-4">Order #{order.id}</p>
      <p className="text-xl font-semibold text-indigo-600 mb-6">
        Total: {formatCurrency(order.total_amount)}
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to={`/orders/${order.id}`}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          View Order
        </Link>
        <Link
          to="/products"
          className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
