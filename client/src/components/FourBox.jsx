import React from 'react'
import { FaBookOpen, FaBriefcase, FaQuestionCircle, FaUsers } from 'react-icons/fa';

const FourBox = () => {
  const boxData = [
    {
      icon: <FaBookOpen size={28} />,
      title: "Learning",
      isPrimary: true
    },
    {
      icon: <FaBriefcase size={28} />,
      title: "Freelance",
      isPrimary: true
    },
    {
      icon: <FaQuestionCircle size={28} />,
      title: "Take Assessment",
      isPrimary: false
    },
    {
      icon: <FaUsers size={28} />,
      title: "Hire From Us",
      isPrimary: false
    }
  ];

  return (
    <div className="container mx-auto px-6 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {boxData.map((box, index) => (
          <div 
            key={index}
            className={`
              rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105 
              flex flex-col items-center justify-center text-center
              ${box.isPrimary 
                ? 'bg-white border border-[#FC427B] text-gray-900' 
                : 'bg-gradient-to-br from-[#FC427B] to-[#fd6392] text-white'}
            `}
          >
            <div className={`
              h-16 w-16 rounded-full flex items-center justify-center mb-4
              ${box.isPrimary 
                ? 'bg-[#fff5f8] text-[#FC427B]' 
                : 'bg-white/20 text-white'}
            `}>
              {box.icon}
            </div>
            
            <h2 className={`
              text-xl font-bold tracking-wide
              ${box.isPrimary ? 'text-gray-900' : 'text-white'}
            `}>
              {box.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FourBox