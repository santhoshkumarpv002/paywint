import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to PayWint</h1>
      <p className="text-xl text-gray-600 mb-8">Your one-stop e-commerce platform</p>
      <Link
        to="/products"
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-indigo-700 inline-block"
      >
        Browse Products
      </Link>
    </div>
  )
}
