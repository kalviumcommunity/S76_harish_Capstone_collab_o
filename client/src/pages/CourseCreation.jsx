import React, { useState } from 'react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
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

      const response = await axios.post('http://localhost:5000/api/ai-course/generate', {
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
    <div className="min-h-screen bg-[#1c1c1c]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-3 hidden md:block">
            <div className="bg-[#292727] rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recent Prompts</h3>
              <ul className="space-y-2 mb-6">
                {recentPrompts.map((prompt, index) => (
                  <li
                    key={index}
                    onClick={() => setAiPrompt(prompt)}
                    className="text-white bg-[#383838] hover:bg-[#444] p-3 rounded-lg cursor-pointer truncate"
                  >
                    {prompt}
                  </li>
                ))}
              </ul>

              <div>
                <h4 className="text-sm text-gray-400 mb-2">Quick Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {["Programming", "Science", "Math", "History", "Business"].map(tag => (
                    <span
                      key={tag}
                      onClick={() => setAiPrompt(`Create a learning unit about ${tag}`)}
                      className="bg-[#AB00EA] hover:bg-[#8900ba] text-white text-xs px-3 py-1 rounded-full cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#444]">
                <p className="text-xs text-gray-400">Current time:</p>
                <p className="text-sm text-white">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-[#292727] rounded-lg shadow-xl p-6 mb-8">
              <label className="block text-lg text-white mb-2">What would you like to learn about today?</label>
              <div className="relative">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your topic..."
                  className="w-full h-24 bg-[#383838] text-white rounded-lg p-4 pr-14 border-2 border-[#AB00EA] focus:outline-none resize-none"
                />
                <button
                  onClick={generateCourse}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className={`absolute right-4 bottom-4 text-white p-2 rounded-full ${
                    isGenerating || !aiPrompt.trim()
                      ? 'bg-[#AB00EA] opacity-50 cursor-not-allowed'
                      : 'bg-[#AB00EA] hover:bg-[#8900ba]'
                  }`}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>

            {isGenerating ? (
              <div className="bg-[#292727] p-10 text-center rounded-lg shadow-xl">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-[#AB00EA] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h3 className="text-xl text-white mb-2">Generating Course</h3>
                  <p className="text-gray-400">Please wait while we craft your learning experience...</p>
                </div>
              </div>
            ) : courseData && courseData.lessons?.length > 0 ? (
              <div className="bg-[#292727] p-6 rounded-lg">
                <h2 className="text-2xl text-white font-bold mb-2">{courseData.courseTitle}</h2>
                <p className="text-gray-300 mb-4">{courseData.description}</p>

                <div className="bg-[#383838] rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    Lesson {currentLessonIndex + 1} of {courseData.lessons.length}: {courseData.lessons[currentLessonIndex].title}
                  </h3>
                  <p className="text-gray-300">{courseData.lessons[currentLessonIndex].summary}</p>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    {courseData.lessons[currentLessonIndex].topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setCurrentLessonIndex(i => i - 1)}
                      disabled={currentLessonIndex === 0}
                      className={`px-4 py-2 rounded-md text-white ${
                        currentLessonIndex === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#AB00EA] hover:bg-[#8900ba]'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentLessonIndex(i => i + 1)}
                      disabled={currentLessonIndex === courseData.lessons.length - 1}
                      className={`px-4 py-2 rounded-md text-white ${
                        currentLessonIndex === courseData.lessons.length - 1
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-[#AB00EA] hover:bg-[#8900ba]'
                      }`}
                    >
                      Next
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
