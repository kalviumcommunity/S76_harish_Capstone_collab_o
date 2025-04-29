import React from 'react'
import Navbar from '../components/Navbar'
import FourBox from '../components/FourBox'
import ThreeBoxes from '../components/ThreeBoxes'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <>
        <Navbar />
         <div className='h-[2px] w-full bg-white'>
         </div>

         <div className='h-[450px] w-full bg-[#a688d6]'>
           
           <h1 className='text-black font-semibold pt-[50px] text-[70px] text-center'>Elavate Your Freelance Career With AI</h1>

           <h1 className='text-[#626262] text-[20px] text-center pt-[30px]'>Grow and connect with clients using our AI-powered platform. Enhance your skills with AI learning, <br />take assessments, and easily land job opportunities tailored to your expertise.</h1>

              <button className='h-[50px] w-[200px] bg-black text-white text-[20px] rounded-[5px] mx-auto mt-[60px] block border-2 border-[#9b25df] transition-all duration-300 ease-in-out  hover:rounded-full'>Get started  </button>
         </div>

            <h1 className='text-black font-semibold pt-[50px] text-[60px] text-center'>
            Everything You Need to Succeed 
            </h1>

            <h1 className='text-[#626262] text-[20px] text-center pt-[30px]'>
            Our platform combines learning, brassessment, guidance, and <br />client
            matching in one seamless experience..
            </h1>

        <FourBox/>
        <div>
          <ThreeBoxes/>
        </div>
          
          <div className='mt-[150px]'>

              <Footer/>
          </div>

    </>
  )
}

export default LandingPage
