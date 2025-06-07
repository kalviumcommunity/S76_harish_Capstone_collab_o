import React from 'react'
import { Zap, Award, Briefcase } from 'lucide-react'

const ThreeBoxes = () => {
  return (
    <div className="container mx-auto px-6 mt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-100 rounded-lg shadow-xl p-8 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">AI Learning</h2>
            <div className="h-12 w-12 rounded-full bg-[#fff5f8] flex items-center justify-center">
              <Zap className="text-[#FC427B]" size={24} strokeWidth={2} />
            </div>
          </div>
          <p className="text-gray-600 text-lg">Upskill with smart assessments and AI-powered learning tailored for modern freelancers.</p>
          <div className="h-1 w-16 bg-[#FC427B] mt-6 rounded-full"></div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg shadow-xl p-8 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Skill Assessment</h2>
            <div className="h-12 w-12 rounded-full bg-[#fff5f8] flex items-center justify-center">
              <Award className="text-[#FC427B]" size={24} strokeWidth={2} />
            </div>
          </div>
          <p className="text-gray-600 text-lg">No need for years of experience—take tests, prove your skills, and unlock opportunities.</p>
          <div className="h-1 w-16 bg-[#FC427B] mt-6 rounded-full"></div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg shadow-xl p-8 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Job Matching</h2>
            <div className="h-12 w-12 rounded-full bg-[#fff5f8] flex items-center justify-center">
              <Briefcase className="text-[#FC427B]" size={24} strokeWidth={2} />
            </div>
          </div>
          <p className="text-gray-600 text-lg">Get matched with clients and projects easily based on your skills and assessment results.</p>
          <div className="h-1 w-16 bg-[#FC427B] mt-6 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default ThreeBoxes