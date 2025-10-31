import React, { useState, useContext, useEffect } from 'react'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import { buildApiUrl } from '../config/api'
import { authUtils } from '../utils/auth'

const Login = () => {
  const navigate = useNavigate()
  const { setIsAuthenticated, setUserProfile } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      navigate('/freelance');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch(buildApiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login Success:', data)

        // Extract username from the response data
        const username = data.username || data.name || formData.email.split('@')[0]
        const email = data.email || formData.email

        // Save all user data in localStorage
        authUtils.setUserData({
          token: data.token,
          userId: data.userId,
          username: username,
          email: email
        });
        
        // Set remember me for persistent session
        authUtils.setRememberMe(true);

        // Update Auth Context
        setIsAuthenticated(true)
        setUserProfile({
          name: username,
          email: email,
          id: data.userId
        })

        toast.success('Login successful! Welcome back!')
        
        setTimeout(() => {
          navigate('/freelance')
        }, 1500)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Invalid credentials')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterClick = () => {
    navigate('/signup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#FC427B] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center animate-fadeIn">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FC427B] to-[#e03a6d] rounded-2xl flex items-center justify-center mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Sign in to continue to <span className="font-semibold text-[#FC427B]">Collab-O</span>
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 border border-gray-100 animate-scaleIn backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-[#FC427B] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC427B] focus:border-transparent
                    transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-fadeIn" style={{animationDelay: '0.2s'}}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-[#FC427B] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC427B] focus:border-transparent
                    transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-[#FC427B] focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <div className="text-sm">
                <button
                  type="button"
                  className="font-semibold text-[#FC427B] hover:text-[#e03a6d] transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-fadeIn" style={{animationDelay: '0.4s'}}>
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full flex justify-center items-center py-4 px-6 text-base font-semibold rounded-xl
                  text-white bg-gradient-to-r from-[#FC427B] to-[#e03a6d]
                  shadow-lg hover:shadow-xl transform transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC427B]
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign in to your account</span>
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 animate-fadeIn" style={{animationDelay: '0.5s'}}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">New to Collab-O?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleRegisterClick}
                className="w-full flex justify-center items-center py-3.5 px-6 border-2 border-[#FC427B]
                  text-base font-semibold rounded-xl text-[#FC427B] bg-white
                  hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC427B]
                  transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                Create an account
              </button>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-sm text-gray-600 animate-fadeIn" style={{animationDelay: '0.6s'}}>
          By continuing, you agree to our{' '}
          <a href="#" className="font-medium text-[#FC427B] hover:text-[#e03a6d]">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="font-medium text-[#FC427B] hover:text-[#e03a6d]">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

export default Login