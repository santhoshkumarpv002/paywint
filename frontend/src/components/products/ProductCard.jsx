import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
    >
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        {product.category && (
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">
            {product.category}
          </span>
        )}
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-indigo-600">{formatCurrency(product.price)}</span>
          <span className="text-xs text-gray-400">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </Link>
  )
}
