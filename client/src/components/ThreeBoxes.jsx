import React from 'react'
import { Zap, Award, Briefcase } from 'lucide-react'

const ThreeBoxes = () => {
  return (
    <div className="flex justify-center mt-[190px]">
      <div className="flex gap-8">
        <div className="w-[450px] bg-white border-2 border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">AI Learning</h2>
            <Zap className="text-[#9b25df]" size={24} />
          </div>
          <p className="text-gray-600">Upskill with smart assessments and AI-powered learning tailored for modern freelancers.</p>
        </div>

        <div className="w-[450px] bg-white border-2 border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Skill Assessment</h2>
            <Award className="text-[#9b25df]" size={24} />
          </div>
          <p className="text-gray-600">No need for years of experience—take tests, prove your skills, and unlock opportunities.</p>
        </div>

        <div className="w-[450px] bg-white border-2 border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Job Matching</h2>
            <Briefcase className="text-[#9b25df]" size={24} />
          </div>
          <p className="text-gray-600">Get matched with clients and projects easily based on your skills and assessment results.</p>
        </div>
      </div>
    </div>
  )
}

export default ThreeBoxes
