import { useState } from 'react'
import ErrorMessage from '../common/ErrorMessage'

export default function CheckoutForm({ onSubmit, loading }) {
  const [shippingAddress, setShippingAddress] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [sameAddress, setSameAddress] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!shippingAddress.trim()) {
      setError('Shipping address is required')
      return
    }
    const billing = sameAddress ? shippingAddress : billingAddress
    if (!billing.trim()) {
      setError('Billing address is required')
      return
    }
    onSubmit(shippingAddress, billing)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={error} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sameAddress"
          checked={sameAddress}
          onChange={(e) => setSameAddress(e.target.checked)}
        />
        <label htmlFor="sameAddress" className="text-sm text-gray-700">
          Billing address same as shipping
        </label>
      </div>
      {!sameAddress && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Billing Address</label>
          <textarea
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          />
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded hover:bg-indigo-700 disabled:opacity-50 font-semibold"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  )
}
