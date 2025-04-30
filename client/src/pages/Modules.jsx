// import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { FiPlay, FiList, FiClock, FiAward } from 'react-icons/fi'

const modules = [
  {
    id: 1,
    title: 'HTML Quiz',
    description: 'Test your knowledge of HTML fundamentals',
    questions: 10,
    duration: '15 mins',
    level: 'Beginner',
    color: '#E44D26',
  },
  {
    id: 2,
    title: 'CSS Quiz',
    description: 'Assess your understanding of CSS concepts',
    questions: 15,
    duration: '20 mins',
    level: 'Intermediate',
    color: '#264DE4',
  },
  {
    id: 3,
    title: 'JavaScript Quiz',
    description: 'Challenge your JavaScript skills',
    questions: 20,
    duration: '30 mins',
    level: 'Intermediate',
    color: '#F7DF1E',
  },
  {
    id: 4,
    title: 'React.js Quiz',
    description: 'Evaluate your proficiency in React',
    questions: 25,
    duration: '40 mins',
    level: 'Advanced',
    color: '#61DAFB',
  },
]

const Modules = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-800">
        {/* Hero Section */}
        <div className="bg-[#a688d6] py-16">
          <div className="max-w-6xl mx-auto px-8">
            <h1 className="text-4xl font-bold mb-4">Quiz Creation</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Create engaging quizzes to test and enhance your knowledge. Select a module below to start creating quizzes for specific topics.
            </p>
            <div className="flex gap-6 mt-8 text-gray-700">
              <div className="flex items-center gap-2">
                <FiClock className="text-gray-500" />
                <span>Total Duration: Flexible</span>
              </div>
              <div className="flex items-center gap-2">
                <FiAward className="text-gray-500" />
                <span>Customizable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {modules.map((module) => (
              <div
                key={module.id}
                className="relative bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg p-6 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{module.title}</h3>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiList />
                        <span>{module.questions} Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock />
                        <span>{module.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${module.color}20`,
                      color: module.color,
                    }}
                  >
                    {module.level}
                  </span>
                </div>

                {/* Start Button */}
                <div className="mt-6" >
                  <button
                    className="w-full bg-[#8d4fff] text-white py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold hover:bg-[#49366e] transition-all"
                  onClick={() => window.location.href = `/quiz/${module.id}`}
                 >
                    <FiPlay size={20} />
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Modules