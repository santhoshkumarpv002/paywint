import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'

export default function CartSummary({ cart }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({cart.item_count})</span>
          <span>{formatCurrency(cart.total)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-indigo-600">{formatCurrency(cart.total)}</span>
          </div>
        </div>
      </div>
      <Link
        to="/checkout"
        className="mt-4 block text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  )
}
