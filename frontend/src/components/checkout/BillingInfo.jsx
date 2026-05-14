import { formatCurrency } from '../../utils/formatCurrency'

export default function BillingInfo({ cart }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Your Cart</h3>
      <div className="space-y-2">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.product.name} x {item.quantity}</span>
            <span>{formatCurrency(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t mt-3 pt-3 flex justify-between font-bold">
        <span>Total</span>
        <span>{formatCurrency(cart.total)}</span>
      </div>
    </div>
  )
}
