import client from './client'

export const login = async (email, password) => {
  const { data } = await client.post('/auth/login', { email, password })
  return data
}

export const register = async (email, password, full_name) => {
  const { data } = await client.post('/auth/register', { email, password, full_name })
  return data
}

export const getMe = async () => {
  const { data } = await client.get('/auth/me')
  return data
}
