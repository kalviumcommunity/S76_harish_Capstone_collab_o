import React from 'react'
import Cimg from '../assets/Rectangle 14.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, Briefcase, ClipboardCheck, Users } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLearningClick = () => {
    navigate('/learning')
  }
  const handleFreeLanceClick = () => {
    navigate('/freelance')
  }
  const handleLoginClick = () => {
    navigate('/login')
  }
  const handleSignupClick = () => {
    navigate('/signup')
  }

  const getUnderlineStyle = (path) => {
    return location.pathname === path ? 'underline decoration-[#9E00D7] underline-offset-4' : '';
  }

  return (
    <>
      <div className='bg-black h-[15px] w-full' />
      <div className='h-[90px] w-full bg-[#252323] flex items-center'>
        {/* Logo Section */}
        <div className=' pl-[8px] relative' onClick={() => navigate('/')}>
          <h1 className='text-black absolute ml-[12px] pt-[2px] font-semibold cursor-pointer'>collab-o</h1>
          <img src={Cimg} alt="" className='h-[40px] w-[99px] cursor-pointer'/>
        </div>

        {/* Navigation Links Section */}
        <div className='flex items-center ml-[400px]'>
          {/* Learning Link */}
          <div className="group relative mx-10 flex items-center">
            <h1 
              className={`text-[#d6cdcd] text-[20px] cursor-pointer transition-all duration-300 hover:text-white flex items-center ${getUnderlineStyle('/learning')}`} 
              onClick={handleLearningClick}
            >
              <BookOpen size={18} className="mr-2" /> Learning
            </h1>
          
            {/* shadow effect on hover */}
            <span 
              className="absolute inset-0 flex items-center cursor-pointer justify-center text-[20px] text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ 
                textShadow: '0 0 15px rgba(158, 0, 215, 0.9), 0 0 25px rgba(158, 0, 215, 0.8), 0 0 35px rgba(158, 0, 215, 0.7)'
              }}
              onClick={handleLearningClick}
            >
              <BookOpen size={18} className="mr-2" /> Learning
            </span>
          </div>

          {/* Freelance Link */}
          <div className="group relative mx-10 flex items-center">
            <h1 
              className={`text-[#d6cdcd] text-[20px] cursor-pointer transition-all duration-300 hover:text-white flex items-center ${getUnderlineStyle('/freelance')}`} 
              onClick={handleFreeLanceClick}
            >
              <Briefcase size={18} className="mr-2" /> Freelance
            </h1>
          
            {/* shadow effect on hover */}
            <span 
              className="absolute inset-0 flex items-center justify-center text-[20px] text-transparent cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ 
                textShadow: '0 0 15px rgba(158, 0, 215, 0.9), 0 0 25px rgba(158, 0, 215, 0.8), 0 0 35px rgba(158, 0, 215, 0.7)'
              }}
              onClick={handleFreeLanceClick}
            >
              <Briefcase size={18} className="mr-2" /> Freelance
            </span>
          </div>
           
          {/* Take quiz link */}
          <div className="group relative mx-10 flex items-center">
            <h1 
              className={`text-[#d6cdcd] text-[20px] cursor-pointer transition-all duration-300 hover:text-white flex items-center ${getUnderlineStyle('/quiz')}`}
            >
              <ClipboardCheck size={18} className="mr-2" /> Take quiz
            </h1>
          
            {/* shadow effect on hover */}
            <span 
              className="absolute inset-0 flex items-center justify-center text-[20px] text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ 
                textShadow: '0 0 15px rgba(158, 0, 215, 0.9), 0 0 25px rgba(158, 0, 215, 0.8), 0 0 35px rgba(158, 0, 215, 0.7)'
              }}
            >
              <ClipboardCheck size={18} className="mr-2" /> Take quiz
            </span>
          </div>     

          {/* Hire Link */}
          <div className="group relative mx-10 flex items-center">
            <h1 
              className={`text-[#d6cdcd] text-[20px] cursor-pointer transition-all duration-300 hover:text-white flex items-center ${getUnderlineStyle('/hire')}`}
            >
              <Users size={18} className="mr-2" /> Hire
            </h1>
          
            {/* shadow effect on hover */}
            <span 
              className="absolute inset-0 flex items-center justify-center text-[20px] text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ 
                textShadow: '0 0 15px rgba(158, 0, 215, 0.9), 0 0 25px rgba(158, 0, 215, 0.8), 0 0 35px rgba(158, 0, 215, 0.7)'
              }}
            >
              <Users size={18} className="mr-2" /> Hire
            </span>
          </div>    

          <div 
            className="group relative h-[40px] w-[80px] items-center border-2 border-[#9E00D7] bg-white rounded-[5px] ml-[400px] transition-all duration-300 ease-in-out hover:rounded-full cursor-pointer" 
            onClick={handleLoginClick}
          >
            <h1 className='font-semibold ml-[17px] mt-[6px]' >Login</h1>
          </div>   
           
          <div className='group relative mx-10 cursor-pointer' onClick={handleSignupClick}>
            <h1 className={`text-[#d6cdcd] text-[20px] cursor-pointer transition-all duration-300 hover:text-white ${getUnderlineStyle('/signup')}`}>
              Signup
            </h1>
            {/* shadow effect on hover */}
            <span 
              className="absolute inset-0 flex items-center justify-center text-[20px] text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ 
                textShadow: '0 0 15px rgba(158, 0, 215, 0.9), 0 0 25px rgba(158, 0, 215, 0.8), 0 0 35px rgba(158, 0, 215, 0.7)'
              }}
            >
              Signup
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar