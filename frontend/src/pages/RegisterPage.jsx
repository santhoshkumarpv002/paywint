import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (email, password, fullName) => {
    await register(email, password, fullName)
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <RegisterForm onSubmit={handleRegister} />
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
