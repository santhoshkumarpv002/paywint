import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">PayWint</Link>

        <div className="flex items-center gap-6">
          <Link to="/products" className="text-gray-700 hover:text-indigo-600">Products</Link>

          {user ? (
            <>
              <Link to="/cart" className="text-gray-700 hover:text-indigo-600 relative">
                Cart
                {cart.item_count > 0 && (
                  <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.item_count}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="text-gray-700 hover:text-indigo-600">Orders</Link>
              {user.is_admin && (
                <Link to="/admin" className="text-gray-700 hover:text-indigo-600">Admin</Link>
              )}
              <span className="text-gray-500 text-sm">{user.full_name}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
