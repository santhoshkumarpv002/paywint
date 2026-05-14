import { useState } from 'react'
import { formatCurrency } from '../../utils/formatCurrency'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import ErrorMessage from '../common/ErrorMessage'

export default function ProductDetail({ product }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      await addToCart(product.id, quantity)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full rounded-lg" />
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          {product.category && (
            <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded mt-2 inline-block">
              {product.category}
            </span>
          )}
          <p className="text-3xl font-bold text-indigo-600 mt-4">{formatCurrency(product.price)}</p>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </p>

          <ErrorMessage message={error} />
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mt-4">
              Added to cart!
            </div>
          )}

          {user && product.stock_quantity > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <input
                type="number"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 border rounded px-3 py-2"
              />
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {!user && (
            <p className="mt-4 text-gray-500">Please login to add items to cart.</p>
          )}
        </div>
      </div>
    </div>
  )
}
