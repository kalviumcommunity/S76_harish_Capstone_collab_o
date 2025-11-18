import React, { useState } from 'react';
import { FiZap, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { buildApiUrl } from '../config/api';

const AIProjectGenerator = ({ onProjectGenerated }) => {
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    if (!userInput.trim() || userInput.trim().length < 10) {
      setError('Please provide a more detailed description (at least 10 characters)');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to use AI project generation');
        setIsGenerating(false);
        return;
      }

      const response = await fetch(buildApiUrl('/api/ai-project/generate-project'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: userInput })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate project');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        onProjectGenerated(result.data);
        setShowModal(false);
        setUserInput('');
      } else {
        throw new Error('Invalid response from AI');
      }

    } catch (err) {
      console.error('AI Generation Error:', err);
      setError(err.message || 'Failed to generate project. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const examples = [
    "I want an ecommerce website to sell handmade crafts",
    "Build a mobile app for fitness tracking with meal planning",
    "Create a restaurant management system with online ordering",
    "Design a social media platform for pet lovers",
  ];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
      >
        <FiZap className="text-xl" />
        <span className="font-medium">AI Project Assistant</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiZap className="text-3xl" />
                  <div>
                    <h2 className="text-2xl font-bold">AI Project Assistant</h2>
                    <p className="text-purple-100 text-sm mt-1">
                      Turn your idea into a complete project specification
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                  disabled={isGenerating}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Input Section */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Describe your project idea
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value);
                    setError('');
                  }}
                  placeholder="Example: I want to build a food delivery app for my local area..."
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all min-h-[120px] resize-y"
                  disabled={isGenerating}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {userInput.length} characters (minimum 10 required)
                </p>
              </div>

              {/* Examples */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Or try these examples:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {examples.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserInput(example)}
                      className="text-left text-sm p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all"
                      disabled={isGenerating}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* What AI Will Generate */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FiCheckCircle className="text-blue-600" />
                  What the AI will generate:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 ml-6">
                  <li>• Complete project description & title</li>
                  <li>• Budget range with justification</li>
                  <li>• Timeline estimation</li>
                  <li>• Technical requirements (tech stack, APIs)</li>
                  <li>• Key features & functionalities</li>
                  <li>• Project milestones & phases</li>
                  <li>• Required skills & expertise</li>
                  <li>• Deliverables & success criteria</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !userInput.trim() || userInput.trim().length < 10}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {isGenerating ? (
                    <>
                      <FiLoader className="animate-spin text-xl" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FiZap className="text-xl" />
                      <span>Generate Project</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isGenerating}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Cancel
                </button>
              </div>

              {/* Loading State Info */}
              {isGenerating && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800 text-center">
                    ✨ AI is analyzing your idea and generating a comprehensive project specification...
                    <br />
                    <span className="text-xs text-purple-600">This may take 10-30 seconds</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIProjectGenerator;
