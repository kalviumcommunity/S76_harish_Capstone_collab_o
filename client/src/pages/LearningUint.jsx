import React, { useState } from 'react'
import { FiBookOpen, FiDownload, FiSave, FiShare2, FiPrinter } from 'react-icons/fi'

const LearningUnits = ({ units }) => {
  const [activeUnit, setActiveUnit] = useState(0)

  return (
    <div className="space-y-8">
      {/* Unit Navigation */}
      <div className="bg-[#292727] rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Learning Units</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                // In a real app, you would save the learning units to the user's account
                alert('Learning units saved successfully!')
              }}
              className="text-sm bg-[#383838] hover:bg-[#444] text-white rounded-lg px-4 py-2 flex items-center transition-all"
            >
              <FiSave className="mr-2" /> Save
            </button>
            <button 
              onClick={() => window.print()}
              className="text-sm bg-[#AB00EA] hover:bg-[#8900ba] text-white rounded-lg px-4 py-2 flex items-center transition-all"
            >
              <FiPrinter className="mr-2" /> Print
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {units.map((unit, index) => (
            <div
              key={unit.id}
              onClick={() => setActiveUnit(index)}
              className={`relative rounded-lg p-5 cursor-pointer transition-all ${
                activeUnit === index
                  ? 'bg-[#AB00EA] shadow-lg transform scale-[1.02]'
                  : 'bg-[#383838] hover:bg-[#444]'
              }`}
            >
              <div className="flex items-start">
                <div className="text-3xl mr-3">{unit.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-lg">{unit.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {unit.content.split('\n\n')[0].substring(0, 50)}...
                  </p>
                </div>
              </div>
              {activeUnit === index && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#AB00EA]"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Active Unit Content */}
      {units[activeUnit] && (
        <div className="bg-[#292727] rounded-lg shadow-xl p-6">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">{units[activeUnit].icon}</span>
            <h3 className="text-2xl font-bold text-white">
              {units[activeUnit].title}
            </h3>
          </div>

          <div className="bg-[#383838] rounded-lg p-6">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-line text-gray-200 leading-relaxed">
                {units[activeUnit].content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="flex space-x-3">
              <button className="text-sm bg-[#383838] hover:bg-[#444] text-white rounded-lg px-3 py-1.5 flex items-center transition-all">
                <FiDownload className="mr-1" /> PDF
              </button>
              <button className="text-sm bg-[#383838] hover:bg-[#444] text-white rounded-lg px-3 py-1.5 flex items-center transition-all">
                <FiShare2 className="mr-1" /> Share
              </button>
            </div>
            
            <div className="text-gray-400 text-sm">
              Unit {activeUnit + 1} of {units.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningUnits