import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FiUser, FiLock } from 'react-icons/fi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }


  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login Success:', data)

        // Save the token to local storage or cookies
        localStorage.setItem('token', data.token)

        // Show success toast
        toast.success('Login successful! Redirecting...')
        
        // Redirect to another page (e.g., dashboard)
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
    } catch (error) {
      console.error(error)
      setError(error.message) // Display error message
      toast.error(error.message) // Show error notification
    }
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="h-[2px] w-full bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA]" />

      <div className="flex-grow flex justify-center items-center py-8">
        <div className="h-auto w-[700px] bg-[#292727] rounded-2xl flex flex-col items-center text-white p-8 shadow-2xl">
          {/* Logo or Brand Section */}
          <div className="text-center mb-8">
            <h1 className='text-[32px] font-bold bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA] bg-clip-text text-transparent'>
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">Please enter your details to continue</p>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Google Login Button */}
          <button 
            
            className="w-[450px] h-[60px] bg-white text-black rounded-lg flex items-center justify-center gap-3 mb-6 hover:bg-gray-100 transition-all border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA]"
          >
            <FcGoogle size={24} />
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="w-[450px] flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-grow bg-gray-600"></div>
            <span className="text-gray-400">or</span>
            <div className="h-[1px] flex-grow bg-gray-600"></div>
          </div>

          {/* Input Fields */}
          <form onSubmit={handleLogin} className="space-y-4 w-[450px]">
            {/* Email */}
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-[60px] pl-12 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-[60px] pl-12 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="w-[450px] text-right mb-6">
              <button className="text-[#AB00EA] hover:text-[#d6a3e9] text-sm font-medium transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button className='w-full h-[60px] bg-[#AB00EA] text-white text-[18px] font-semibold rounded-lg hover:bg-[#b670cf] transition-all shadow-lg hover:shadow-xl active:transform active:scale-[0.99]'>
              Login
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-400 mt-4">
            Don't have an account?{' '}
            <button className="text-[#AB00EA] hover:text-[#d6a3e9] font-medium transition-colors">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login