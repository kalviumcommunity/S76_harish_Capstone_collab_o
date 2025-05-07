import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  // Handle form data input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Google signup (mocked)
  const handleGoogleSignup = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/google', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Google Signup Success:', data);
        toast.success('Signed up successfully with Google!');
      } else {
        throw new Error('Google signup failed');
      }
    } catch (error) {
      console.error(error);
      setError('Google signup failed. Please try again.');
      toast.error('Google signup failed. Please try again.');
    }
  };

  // Handle user signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Check if any fields are missing
      if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required.');
        toast.error('All fields are required!');
        return;
      }

      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup Success:', data);

        // Save the token and handle the successful signup (optional)
        localStorage.setItem('token', data.token); // Store JWT token
        toast.success('Signup successful! Redirecting...');
        
        // Redirect after a delay for the toast to finish
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message); // Display error message in UI
      toast.error(error.message); // Show error notification
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="h-[2px] w-full bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA]" />

      <div className="flex-grow flex justify-center items-center py-8">
        <div className="min-h-[620px] w-[700px] bg-[#292727] rounded-2xl flex flex-col p-8 items-center text-white relative">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-[32px] font-bold bg-gradient-to-r from-[#AB00EA] to-white bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2">Get started with your freelance journey</p>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-[450px] h-[60px] bg-white text-black rounded-lg flex items-center justify-center gap-3 mb-6 hover:bg-gray-100 transition-all border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA]"
          >
            <FcGoogle size={24} />
            <span className="font-medium">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="w-[450px] flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-grow bg-gray-600"></div>
            <span className="text-gray-400">or</span>
            <div className="h-[1px] flex-grow bg-gray-600"></div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4 w-[450px]">
            {/* Username */}
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full h-[60px] pl-12 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[60px] bg-[#AB00EA] text-white text-[16px] font-semibold rounded-lg hover:bg-[#b670cf] transition-all shadow-lg hover:shadow-xl active:transform active:scale-[0.99]"
            >
              Complete Registration here
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;