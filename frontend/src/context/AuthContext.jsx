import { createContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, register as apiRegister, getMe } from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const userData = await getMe()
      setUser(userData)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (email, password) => {
    const data = await apiLogin(email, password)
    localStorage.setItem('token', data.access_token)
    const userData = await getMe()
    setUser(userData)
    return userData
  }

  const registerUser = async (email, password, fullName) => {
    await apiRegister(email, password, fullName)
    return login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register: registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
