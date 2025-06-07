import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FiPlay, FiList, FiClock, FiAward, FiUser, FiCalendar } from 'react-icons/fi';

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
];

const Modules = () => {
  const [activeModule, setActiveModule] = useState(null);
  
  // User info from your input
  const currentUser = "harishb2006";
  const currentDateTime = "2025-06-03 06:29:19";
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Header Section */}
        <div className="relative bg-white">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-[#fff5f8] to-transparent"></div>
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#FC427B] opacity-5"></div>
            <div className="absolute right-1/3 bottom-0 w-64 h-64 rounded-full bg-[#FC427B] opacity-3"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-8 py-16 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Collection</h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Test and enhance your knowledge with our expertly crafted quizzes. 
                  Select from the modules below to start your learning journey.
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex items-center gap-4 bg-white shadow-sm rounded-lg px-4 py-2 border border-gray-100">
                <div className="flex items-center text-gray-700">
                  <FiUser className="mr-1 text-[#FC427B]" />
                  <span className="text-sm font-medium">{currentUser}</span>
                </div>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FiCalendar className="mr-1 text-[#FC427B]" />
                  <span>{currentDateTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-12 gap-y-6 mt-8">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#fff5f8] flex items-center justify-center mr-2">
                  <FiList className="text-[#FC427B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Quizzes</p>
                  <p className="font-semibold text-gray-800">{modules.length}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#fff5f8] flex items-center justify-center mr-2">
                  <FiClock className="text-[#FC427B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Duration</p>
                  <p className="font-semibold text-gray-800">1hr 45min</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#fff5f8] flex items-center justify-center mr-2">
                  <FiAward className="text-[#FC427B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Difficulty Levels</p>
                  <p className="font-semibold text-gray-800">Beginner to Advanced</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Available Quizzes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md hover:border-[#FC427B] transition-all duration-300"
                  onMouseEnter={() => setActiveModule(module.id)}
                  onMouseLeave={() => setActiveModule(null)}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Level Badge - Mobile Position */}
                      <div className="md:hidden">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium inline-block"
                          style={{
                            backgroundColor: `${module.color}15`,
                            color: module.color,
                          }}
                        >
                          {module.level}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h3>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        
                        <div className="flex flex-wrap gap-6">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center mr-2">
                              <FiList className="text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Questions</p>
                              <p className="font-semibold text-gray-800">{module.questions}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center mr-2">
                              <FiClock className="text-gray-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Duration</p>
                              <p className="font-semibold text-gray-800">{module.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Level Badge - Desktop Position */}
                      <div className="hidden md:block">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: `${module.color}15`,
                            color: module.color,
                          }}
                        >
                          {module.level}
                        </span>
                      </div>
                    </div>

                    {/* Start Button */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => window.location.href = `/quiz/${module.id}`}
                        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-base font-medium transition-all ${
                          activeModule === module.id
                            ? "bg-[#FC427B] text-white"
                            : "bg-[#fff5f8] text-[#FC427B] hover:bg-[#ffebf2]"
                        }`}
                      >
                        <FiPlay size={18} />
                        {activeModule === module.id ? "Start Now" : "Begin Quiz"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer CTA Section */}
        <div className="bg-white border-t border-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to create your own quiz?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Design custom quizzes tailored to your specific learning objectives and share them with friends or colleagues.
            </p>
            <button 
              className="bg-[#FC427B] hover:bg-[#e03a6d] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              onClick={() => window.location.href = '/create-quiz'}
            >
              Create Custom Quiz
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modules;