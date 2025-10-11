import React, { useState } from 'react';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { FiSend, FiClock, FiBookOpen, FiTag, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const CourseCreation = () => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [recentPrompts, setRecentPrompts] = useState([
    'Explain machine learning algorithms for beginners',
    'Create a study guide for React hooks',
    'Summarize quantum computing principles'
  ]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const formattedDate = new Date().toLocaleString();

  const generateCourse = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);

    try {
      if (!recentPrompts.includes(aiPrompt)) {
        setRecentPrompts((prev) => [aiPrompt, ...prev.slice(0, 4)]);
      }

      const response = await axios.post(buildApiUrl('/api/ai-course/generate'), {
        prompt: aiPrompt
      });

      const data = response.data;
      setCourseData(data);
      setCurrentLessonIndex(0);
    } catch (err) {
      console.error('Error from backend:', err);
      alert('Something went wrong. Try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateCourse();
    }
  };

  return (
    <div className="min-h-screen bg-[#121112]">
      <Navbar />

      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#231820] py-10">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            AI <span className="text-[#FC427B]">Learning</span> Assistant
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Create personalized learning modules on any topic with our AI assistant. 
            Enter your subject of interest and get a structured course in seconds.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-[#1A1A1A] rounded-lg shadow-lg border border-[#333] p-5 sticky top-20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <FiClock className="mr-2 text-[#FC427B]" />
                Recent Prompts
              </h3>
              
              <ul className="space-y-2 mb-6">
                {recentPrompts.map((prompt, index) => (
                  <li
                    key={index}
                    onClick={() => setAiPrompt(prompt)}
                    className="text-gray-300 bg-[#252525] hover:bg-[#2d212a] p-3 rounded-lg cursor-pointer truncate text-sm transition-colors border border-transparent hover:border-[#FC427B] hover:border-opacity-50"
                  >
                    {prompt}
                  </li>
                ))}
              </ul>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <FiTag className="mr-2 text-[#FC427B]" />
                  Quick Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Programming", "Science", "Math", "History", "Business"].map(tag => (
                    <span
                      key={tag}
                      onClick={() => setAiPrompt(`Create a learning unit about ${tag}`)}
                      className="bg-[#252525] border border-[#FC427B] text-[#FC427B] text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-[#2d212a] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#333]">
                <p className="text-xs text-gray-500">Current time:</p>
                <p className="text-sm text-gray-300">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <div className="bg-[#1A1A1A] rounded-lg shadow-lg border border-[#333] p-6 mb-8">
              <label className="block text-lg font-medium text-white mb-2">
                What would you like to learn about today?
              </label>
              <div className="relative">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your topic... (e.g., 'Explain the basics of cryptocurrency')"
                  className="w-full h-24 bg-[#252525] text-gray-200 rounded-lg p-4 pr-14 border border-[#444] focus:border-[#FC427B] focus:ring-2 focus:ring-[#FC427B] focus:ring-opacity-20 focus:outline-none resize-none transition-colors"
                />
                <button
                  onClick={generateCourse}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className={`absolute right-4 bottom-4 text-white p-2 rounded-full ${
                    isGenerating || !aiPrompt.trim()
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#FC427B] hover:bg-[#e03a6d] shadow-lg hover:shadow-[#FC427B]/20 transition-colors'
                  }`}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>

            {isGenerating ? (
              <div className="bg-[#1A1A1A] border border-[#333] p-10 text-center rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 relative mb-4">
                    <div className="absolute inset-0 border-4 border-[#FC427B] border-opacity-20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#FC427B] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl text-white font-semibold mb-2">Generating Course</h3>
                  <p className="text-gray-400">Please wait while we craft your learning experience...</p>
                </div>
              </div>
            ) : courseData && courseData.lessons?.length > 0 ? (
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg shadow-lg overflow-hidden">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-[#231820] to-[#1A1A1A] p-6 border-b border-[#333]">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {courseData.courseTitle}
                  </h2>
                  <p className="text-gray-300">{courseData.description}</p>
                </div>
                
                {/* Lesson Navigator - Small pills */}
                <div className="px-6 py-3 border-b border-[#333] overflow-x-auto">
                  <div className="flex gap-2">
                    {courseData.lessons.map((lesson, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentLessonIndex(idx)}
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          idx === currentLessonIndex 
                            ? 'bg-[#FC427B] text-white' 
                            : 'bg-[#252525] text-gray-300 hover:bg-[#2d212a] hover:text-[#FC427B]'
                        }`}
                      >
                        Lesson {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Current Lesson Content */}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-[#2d212a] rounded-full flex items-center justify-center mr-3">
                      <FiBookOpen className="text-[#FC427B]" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {courseData.lessons[currentLessonIndex].title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {courseData.lessons[currentLessonIndex].summary}
                  </p>
                  
                  <div className="bg-[#252525] rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-white mb-3">Key Topics</h4>
                    <ul className="space-y-2">
                      {courseData.lessons[currentLessonIndex].topics.map((topic, i) => (
                        <li key={i} className="flex items-start">
                          <span className="flex h-5 w-5 rounded-full bg-[#FC427B] bg-opacity-20 text-[#FC427B] text-xs items-center justify-center font-medium mr-2 mt-0.5">
                            {i+1}
                          </span>
                          <span className="text-gray-300">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between mt-8 border-t border-[#333] pt-6">
                    <button
                      onClick={() => setCurrentLessonIndex(i => i - 1)}
                      disabled={currentLessonIndex === 0}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
                        currentLessonIndex === 0 
                          ? 'text-gray-600 cursor-not-allowed' 
                          : 'text-[#FC427B] hover:bg-[#2d212a]'
                      }`}
                    >
                      <FiArrowLeft size={16} />
                      Previous Lesson
                    </button>
                    <button
                      onClick={() => setCurrentLessonIndex(i => i + 1)}
                      disabled={currentLessonIndex === courseData.lessons.length - 1}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
                        currentLessonIndex === courseData.lessons.length - 1
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-[#FC427B] hover:bg-[#2d212a]'
                      }`}
                    >
                      Next Lesson
                      <FiArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCreation;