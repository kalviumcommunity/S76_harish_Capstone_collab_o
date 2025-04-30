import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Quiz = () => {
  const [selectedOption, setSelectedOption] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = () => {
    // Handle quiz submission logic
    alert(`You selected: ${selectedOption}`)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-8">
      <button 
        onClick={() => navigate('/modules')}
        className="absolute left-4 top-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Back
      </button>

      {/* Question */}
      <h1 className="text-2xl font-bold mb-8">What is react redux?</h1>

      {/* Options */}
      <div className="space-y-4 w-full max-w-md">
        {['Its a statechvghdvwhjefhjvdhwweeffdwfjdsvjdsvf e', 'Its a stajdfndte manage', 'Its a state manasdkge', 'Its a stateskjfnjf manage'].map((option, index) => (
          <label
            key={index}
            className={`block bg-[#584377] border-2 border-[#9E00D7] px-4 py-3 rounded-[5px] cursor-pointer ${
              selectedOption === option ? 'ring-4 ring-blue-500' : ''
            }`}
          >
            <input
              type="radio"
              name="quiz"
              value={option}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
              className="absolute ml-[400px] mt-[8px] h-[15px] w-[15px]"
            />
            {option}
          </label>
        ))}
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleSubmit}
        className="mt-8 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500"
      >
        Submit
      </button>
    </div>
  )
}

export default Quiz