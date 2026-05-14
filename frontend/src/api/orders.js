import client from './client'

export const checkout = async (shipping_address, billing_address) => {
  const { data } = await client.post('/orders/checkout', { shipping_address, billing_address })
  return data
}

export const getOrders = async () => {
  const { data } = await client.get('/orders')
  return data
}

export const getOrder = async (id) => {
  const { data } = await client.get(`/orders/${id}`)
  return data
}
