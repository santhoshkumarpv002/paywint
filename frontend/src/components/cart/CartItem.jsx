import { useState } from 'react'
import { formatCurrency } from '../../utils/formatCurrency'

export default function CartItem({ item, onUpdate, onRemove }) {
  const [updating, setUpdating] = useState(false)

  const handleQuantityChange = async (newQty) => {
    setUpdating(true)
    try {
      await onUpdate(item.id, newQty)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      {item.product.image_url ? (
        <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
      ) : (
        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
          No Image
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
        <p className="text-sm text-gray-500">{formatCurrency(item.product.price)} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={updating || item.quantity <= 1}
          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={updating}
          className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
        >
          +
        </button>
      </div>
      <p className="font-semibold text-gray-800 w-24 text-right">
        {formatCurrency(item.product.price * item.quantity)}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Remove
      </button>
    </div>
  )
}
