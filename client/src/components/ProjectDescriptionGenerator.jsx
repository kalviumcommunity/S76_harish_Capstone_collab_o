import React, { useState } from 'react';
import { FiZap, FiLoader, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { buildApiUrl } from '../config/api';

const ProjectDescriptionGenerator = ({ onDescriptionGenerated, currentTitle, currentCategory }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);

  const generateDescription = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a brief description or requirement');
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/ai-project/generate-description'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          title: currentTitle,
          category: currentCategory,
          type: 'project_description'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      
      if (data.success && data.description) {
        onDescriptionGenerated(data.description);
        setPrompt('');
        setShowPrompt(false);
        toast.success('Project description generated successfully!');
        
        // Store suggestions for quick access
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } else {
        throw new Error(data.error || 'Failed to generate description');
      }
    } catch (error) {
      console.error('Description generation error:', error);
      toast.error(error.message || 'Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    "Build a responsive e-commerce website with user authentication",
    "Create a mobile app for food delivery with GPS tracking",
    "Design a modern landing page for a tech startup",
    "Develop a inventory management system with reporting",
    "Build a social media dashboard with analytics",
    "Create a booking system for appointments with calendar",
    "Design a portfolio website with animation effects",
    "Develop a chat application with real-time messaging"
  ];

  const handleQuickPrompt = (quickPrompt) => {
    setPrompt(quickPrompt);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiZap className="text-purple-600" />
          <h3 className="font-medium text-gray-800">AI Description Generator</h3>
        </div>
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          {showPrompt ? 'Hide' : 'Generate'}
        </button>
      </div>

      {showPrompt && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your project in a few words:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Need a mobile app for food delivery with payment integration"
              rows="3"
              className="block w-full border-gray-300 rounded-lg py-2 px-3 text-sm placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Quick Prompt Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or choose from examples:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {quickPrompts.map((quickPrompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(quickPrompt)}
                  className="text-left p-2 text-xs border border-gray-200 rounded hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  {quickPrompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={generateDescription}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiZap />
                  Generate Description
                </>
              )}
            </button>
            
            {prompt && (
              <button
                onClick={() => setPrompt('')}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Previous Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-t pt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recent suggestions:
              </label>
              <div className="space-y-1">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onDescriptionGenerated(suggestion)}
                    className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    {suggestion.substring(0, 100)}...
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDescriptionGenerator;