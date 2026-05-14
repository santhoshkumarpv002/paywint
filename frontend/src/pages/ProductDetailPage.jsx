import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../api/products'
import ProductDetail from '../components/products/ProductDetail'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id)
        setProduct(data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Product not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!product) return null

  return <ProductDetail product={product} />
}
