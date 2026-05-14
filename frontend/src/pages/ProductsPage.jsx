import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../components/products/ProductGrid'
import Pagination from '../components/common/Pagination'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { data, loading, error, params, setParams } = useProducts({ page: 1, page_size: 12 })

  const handleSearch = (e) => {
    e.preventDefault()
    setParams({ ...params, search: search || undefined, category: category || undefined, page: 1 })
  }

  const handlePageChange = (page) => {
    setParams({ ...params, page })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-40 border rounded px-4 py-2"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      <ErrorMessage message={error} />
      {loading ? <Loading /> : (
        <>
          <ProductGrid products={data.items} />
          <Pagination page={data.page} pages={data.pages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}
