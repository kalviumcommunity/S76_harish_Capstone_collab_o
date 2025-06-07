import React from 'react'
import Navbar from '../components/Navbar'
import FourBox from '../components/FourBox'
import ThreeBoxes from '../components/ThreeBoxes'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate();
  const handleSignup = () => {
    navigate('/signup')
  }
  
  return (
    <div className="bg-white text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className='relative h-[600px] w-full bg-gradient-to-r from-white to-[#fff5f8] overflow-hidden'>
        <div className='absolute top-0 right-0 w-1/3 h-full bg-[#FC427B] opacity-10 rounded-bl-full'></div>
        <div className='absolute bottom-0 left-0 w-1/4 h-1/2 bg-[#FC427B] opacity-5 rounded-tr-full'></div>
        
        <div className='container mx-auto px-6 relative z-10 flex flex-col items-start justify-center h-full pt-0'>
          <h1 className='text-gray-900 font-bold text-[64px] leading-tight max-w-3xl'>
            Elevate Your <span className='text-[#FC427B]'>Freelance</span> Career With AI
          </h1>

          <p className='text-gray-700 text-[20px] max-w-2xl mt-6'>
            Grow and connect with clients using our AI-powered platform. Enhance your skills with AI learning, 
            take assessments, and easily land job opportunities tailored to your expertise.
          </p>

          <button 
            className='h-[56px] w-[220px] bg-[#FC427B] text-white text-[18px] font-medium rounded-[4px] mt-10
            shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-[#e03a6d] flex items-center justify-center'
            onClick={handleSignup}>
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Decorative separator */}
      <div className='h-[1px] w-full bg-gray-200 relative'>
        <div className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[10px] w-[10px] rotate-45 bg-[#FC427B]'></div>
      </div>

      {/* Features Heading */}
      <div className='container mx-auto px-6 mt-24'>
        <h2 className='text-gray-900 font-bold text-[48px] text-center'>
          Everything You Need to <span className='text-[#FC427B]'>Succeed</span>
        </h2>

        <p className='text-gray-600 text-[18px] text-center max-w-3xl mx-auto mt-6'>
          Our platform combines learning, assessment, guidance, and client matching 
          in one seamless experience designed for the modern freelancer.
        </p>
      </div>

      {/* Feature boxes */}
      <FourBox />
      
      <div className='bg-gradient-to-b from-white to-[#fff5f8] py-24'>
        <ThreeBoxes />
      </div>
      
      {/* User Reviews Section */}
      <div className='container mx-auto px-6 py-24'>
        <h2 className='text-gray-900 font-bold text-[48px] text-center mb-16'>
          What Our <span className='text-[#FC427B]'>Users</span> Say
        </h2>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Review 1 */}
          <div className='bg-white border border-gray-100 rounded-lg shadow-xl p-8 relative'>
            <div className='absolute -top-6 left-8 flex'>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill="#FC427B" color="#FC427B" />
              ))}
            </div>
            <p className='text-gray-600 mt-6 italic'>"This platform completely transformed my freelance career. The AI-powered learning tools helped me upskill quickly and the job matching was spot on."</p>
            <div className='mt-6 pt-6 border-t border-gray-100 flex items-center'>
              <div className='w-12 h-12 rounded-full bg-[#fff5f8] flex items-center justify-center'>
                <span className='text-[#FC427B] font-bold'>JS</span>
              </div>
              <div className='ml-4'>
                <h4 className='text-gray-900 font-semibold'>Jessica Smith</h4>
                <p className='text-gray-500 text-sm'>UI/UX Designer</p>
              </div>
            </div>
          </div>
          
          {/* Review 2 */}
          <div className='bg-white border border-gray-100 rounded-lg shadow-xl p-8 relative'>
            <div className='absolute -top-6 left-8 flex'>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill="#FC427B" color="#FC427B" />
              ))}
            </div>
            <p className='text-gray-600 mt-6 italic'>"I went from zero clients to fully booked in just two months. The assessment feature really helped me demonstrate my skills to potential clients."</p>
            <div className='mt-6 pt-6 border-t border-gray-100 flex items-center'>
              <div className='w-12 h-12 rounded-full bg-[#fff5f8] flex items-center justify-center'>
                <span className='text-[#FC427B] font-bold'>MJ</span>
              </div>
              <div className='ml-4'>
                <h4 className='text-gray-900 font-semibold'>Michael Johnson</h4>
                <p className='text-gray-500 text-sm'>Web Developer</p>
              </div>
            </div>
          </div>
          
          {/* Review 3 */}
          <div className='bg-white border border-gray-100 rounded-lg shadow-xl p-8 relative'>
            <div className='absolute -top-6 left-8 flex'>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill="#FC427B" color="#FC427B" />
              ))}
            </div>
            <p className='text-gray-600 mt-6 italic'>"As someone new to freelancing, this platform provided the structure and guidance I needed. The AI learning modules are exceptional and truly personalized."</p>
            <div className='mt-6 pt-6 border-t border-gray-100 flex items-center'>
              <div className='w-12 h-12 rounded-full bg-[#fff5f8] flex items-center justify-center'>
                <span className='text-[#FC427B] font-bold'>AP</span>
              </div>
              <div className='ml-4'>
                <h4 className='text-gray-900 font-semibold'>Aisha Patel</h4>
                <p className='text-gray-500 text-sm'>Content Strategist</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className='mt-16 text-center'>
          <button 
            className='h-[56px] px-8 bg-[#FC427B] text-white text-[18px] font-medium rounded-[4px]
            shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-[#e03a6d] flex items-center justify-center mx-auto'
            onClick={handleSignup}>
            Join Our Community
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className='mt-8'>
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage