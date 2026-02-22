"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { IoArrowBack } from 'react-icons/io5'

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useUser()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!formData.agreeTerms) {
      setError('Please agree to terms and conditions')
      return
    }

    setIsLoading(true)

    // Simulate signup
    setTimeout(() => {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        addresses: [],
        orderHistory: [],
      }

      login(userData)
      setIsLoading(false)
      router.push('/profile')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="flex items-center gap-2 text-[#004b61] hover:text-[#ff4c60] transition mb-12">
          <IoArrowBack size={20} />
          <span className="font-semibold">Back to Home</span>
        </Link>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-[#004b61] mb-2 text-center">Create Account</h1>
            <p className="text-gray-600 text-center mb-8">Join us and start shopping</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#004b61] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60] focus:ring-2 focus:ring-pink-200"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#004b61] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60] focus:ring-2 focus:ring-pink-200"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#004b61] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60] focus:ring-2 focus:ring-pink-200"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#004b61] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60] focus:ring-2 focus:ring-pink-200"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#004b61] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60] focus:ring-2 focus:ring-pink-200"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#004b61] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4c60] focus:ring-2 focus:ring-pink-200"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1"
                />
                <label className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="#" className="text-[#ff4c60] hover:text-[#e63f52] font-semibold">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="#" className="text-[#ff4c60] hover:text-[#e63f52] font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ff4c60] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#e63f52] transition-all disabled:bg-gray-400"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-[#ff4c60] font-bold hover:text-[#e63f52]">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
