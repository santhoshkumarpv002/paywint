import client from './client'

export const getCart = async () => {
  const { data } = await client.get('/cart')
  return data
}

export const addToCart = async (product_id, quantity = 1) => {
  const { data } = await client.post('/cart', { product_id, quantity })
  return data
}

export const updateCartItem = async (itemId, quantity) => {
  const { data } = await client.patch(`/cart/${itemId}`, { quantity })
  return data
}

export const removeCartItem = async (itemId) => {
  const { data } = await client.delete(`/cart/${itemId}`)
  return data
}

export const clearCart = async () => {
  const { data } = await client.delete('/cart')
  return data
}
