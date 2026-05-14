import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loading from '../common/Loading'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !user.is_admin) return <Navigate to="/" replace />

  return children
}
