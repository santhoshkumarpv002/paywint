import { useState, useEffect, useCallback } from 'react'
import { getProducts } from '../api/products'

export function useProducts(initialParams = {}) {
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 20, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [params, setParams] = useState(initialParams)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getProducts(params)
      setData(result)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { data, loading, error, params, setParams, refetch: fetchProducts }
}
