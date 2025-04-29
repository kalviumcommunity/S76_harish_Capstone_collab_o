import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FiUser, FiMail, FiLock, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { BsBriefcase, BsTools } from 'react-icons/bs'
import { MdWorkHistory } from 'react-icons/md'

const Signup = () => {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleGoogleSignup = () => {
    // Implement Google Authentication logic here
    console.log("Google signup clicked")
  }

  const renderStep1 = () => (
    <>
      <div className="text-center mb-6">
        <h1 className='text-[32px] font-bold bg-gradient-to-r from-[#AB00EA] to-white bg-clip-text text-transparent'>
          Create Account
        </h1>
        <p className="text-gray-400 mt-2">Get started with your freelance journey</p>
      </div>

      <button 
        onClick={handleGoogleSignup}
        className="w-[450px] h-[60px] bg-white text-black rounded-lg flex items-center justify-center gap-3 mb-6 hover:bg-gray-100 transition-all border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA]"
      >
        <FcGoogle size={24} />
        <span className="font-medium">Sign up with Google</span>
      </button>

      <div className="w-[450px] flex items-center gap-4 mb-6">
        <div className="h-[1px] flex-grow bg-gray-600"></div>
        <span className="text-gray-400">or</span>
        <div className="h-[1px] flex-grow bg-gray-600"></div>
      </div>

      <div className="space-y-4 w-[450px]">
        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Username"
            className="w-full h-[60px] pl-12 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all"
          />
        </div>

        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            className="w-full h-[60px] pl-12 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all"
          />
        </div>

        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-[60px] pl-12 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all"
          />
        </div>
      </div>
    </>
  )

  const renderStep2 = () => (
    <>
      <div className="text-center mb-6">
        <h1 className='text-[32px] font-bold bg-gradient-to-r from-[#AB00EA] to-white bg-clip-text text-transparent'>
          Professional Details
        </h1>
        <p className="text-gray-400 mt-2">Tell us about your expertise</p>
      </div>

      <div className="space-y-4 w-[450px]">
        <div className="relative">
          <BsBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Professional Title"
            className="w-full h-[60px] pl-12 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all"
          />
        </div>

        <div className="relative">
          <BsTools className="absolute left-4 top-6 text-gray-400" size={20} />
          <textarea
            placeholder="Skills (separated by commas)"
            className="w-full h-[100px] pl-12 pr-4 pt-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all resize-none"
          />
        </div>

        <div className="relative">
          <MdWorkHistory className="absolute left-4 top-6 text-gray-400" size={20} />
          <textarea
            placeholder="Brief description of your experience"
            className="w-full h-[100px] pl-12 pr-4 pt-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all resize-none"
          />
        </div>
      </div>
    </>
  )

  const renderStep3 = () => (
    <>
      <div className="text-center mb-6">
        <h1 className='text-[32px] font-bold bg-gradient-to-r from-[#AB00EA] to-white bg-clip-text text-transparent'>
          Additional Information
        </h1>
        <p className="text-gray-400 mt-2">Final steps to complete your profile</p>
      </div>

      <div className="space-y-4 w-[450px]">
        <div className="relative">
          <select className="w-full h-[60px] pl-4 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all appearance-none">
            <option value="">Select Experience Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="relative">
          <select className="w-full h-[60px] pl-4 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all appearance-none">
            <option value="">Preferred Work Type</option>
            <option value="fullTime">Full Time</option>
            <option value="partTime">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Hourly Rate (USD)"
            className="w-full h-[60px] pl-4 pr-4 bg-white text-black rounded-lg outline-none border-2 border-[#AB00EA] shadow-[4px_4px_0px_0px_#AB00EA] focus:border-[#d6a3e9] transition-all"
          />
        </div>
      </div>
    </>
  )

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="h-[2px] w-full bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA]" />

      <div className="flex-grow flex justify-center items-center py-8">
        <div className="min-h-[600px] w-[700px] bg-[#292727] rounded-2xl flex flex-col p-8 items-center text-white relative">
          {/* Step Content */}
          <div className="w-full flex-grow flex flex-col items-center">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          {/* Navigation Buttons */}
          <div className="w-[450px] flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-[#AB00EA] hover:text-[#d6a3e9] transition-colors"
              >
                <FiArrowLeft /> Back
              </button>
            )}
            
            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 ml-auto text-white bg-[#AB00EA] px-6 py-3 rounded-lg hover:bg-[#b670cf] transition-all"
              >
                Next <FiArrowRight />
              </button>
            ) : (
              <button
                className="flex items-center gap-2 ml-auto text-white bg-[#AB00EA] px-6 py-3 rounded-lg hover:bg-[#b670cf] transition-all"
              >
                Complete Registration
              </button>
            )}
          </div>

          {/* Steps Indicator */}
          <div className="flex gap-2 mt-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === step ? 'bg-[#AB00EA]' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup