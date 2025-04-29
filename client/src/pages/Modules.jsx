import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { FiPlay, FiCode, FiBook, FiAward, FiClock } from 'react-icons/fi'

const modules = [ 
  {
    id: 1,
    title: 'HTML',
    description: 'Learn the fundamentals of web structure and semantics',
    topics: ['HTML Basics', 'Forms & Tables', 'Semantic Elements', 'Accessibility'],
    duration: '4 weeks',
    level: 'Beginner',
    progress: 0,
    color: '#E44D26',
    icon: '🌐'
  },
  {
    id: 2,
    title: 'CSS',
    description: 'Master styling and responsive web design',
    topics: ['Selectors & Properties', 'Flexbox & Grid', 'Animations', 'Responsive Design'],
    duration: '6 weeks',
    level: 'Intermediate',
    progress: 0,
    color: '#264DE4',
    icon: '🎨'
  },
  {
    id: 3,
    title: 'JavaScript',
    description: 'Build dynamic and interactive web applications',
    topics: ['Core Concepts', 'DOM Manipulation', 'Async Programming', 'ES6+'],
    duration: '8 weeks',
    level: 'Intermediate',
    progress: 0,
    color: '#F7DF1E',
    icon: '⚡'
  },
  {
    id: 4,
    title: 'React.js',
    description: 'Create modern user interfaces with React',
    topics: ['Components', 'State & Props', 'Hooks', 'Context API'],
    duration: '10 weeks',
    level: 'Advanced',
    progress: 0,
    color: '#61DAFB',
    icon: '⚛️'
  }
  
]

const Modules = () => {
  const [hoveredModule, setHoveredModule] = useState(null)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section remains the same */}
        <div className="bg-[#a688d6] py-16">
          <div className="max-w-6xl mx-auto px-8">
            <h1 className="text-4xl text-black font-bold mb-4">Frontend Development Path</h1>
            <p className="text-lg text-black/60  max-w-2xl">
              Master modern web development with our comprehensive curriculum. 
              Learn through hands-on projects and build your portfolio.
            </p>
            <div className="flex gap-6 mt-8 text-black">
              <div className="flex items-center  gap-2">
                <FiClock className="text-white/30" />
                <span>28 Weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBook className="text-white/30" />
                <span>24 Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <FiAward className="text-white/30" />
                <span>Certificate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="relative">
                {/* Main Card */}
                <div
                  className="relative bg-[#574b77] rounded-lg p-6 cursor-pointer z-10"
                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-4xl mb-4 block">{module.icon}</span>
                      <h3 className="text-2xl font-semibold mb-2">{module.title}</h3>
                      <p className="text-gray-300 mb-4">{module.description}</p>
                    </div>
                    {hoveredModule === module.id && (
                      <button 
                        className="bg-[#AB00EA] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#8d4fff] transition-all"
                      >
                        <FiPlay size={16} />
                        Start
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {module.topics.map((topic, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <FiCode size={16} />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
                    <span className="text-sm text-gray-300">Duration: {module.duration}</span>
                    <span 
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: `${module.color}20`,
                        color: module.color 
                      }}
                    >
                      {module.level}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg">
                    <div 
                      className="h-full rounded-b-lg transition-all duration-300"
                      style={{ 
                        width: `${module.progress}%`,
                        backgroundColor: module.color 
                      }}
                    />
                  </div>
                </div>

                {/* Purple Border Effect */}
                <div 
                  className="absolute inset-0 bg-[#AB00EA] translate-x-[8px] translate-y-[8px] rounded-lg" 
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Modules