import client from './client'

export const getProducts = async (params = {}) => {
  const { data } = await client.get('/products', { params })
  return data
}

export const getProduct = async (id) => {
  const { data } = await client.get(`/products/${id}`)
  return data
}

export const createProduct = async (productData) => {
  const { data } = await client.post('/admin/products', productData)
  return data
}

export const updateProduct = async (id, productData) => {
  const { data } = await client.put(`/admin/products/${id}`, productData)
  return data
}

export const deleteProduct = async (id) => {
  const { data } = await client.delete(`/admin/products/${id}`)
  return data
}
