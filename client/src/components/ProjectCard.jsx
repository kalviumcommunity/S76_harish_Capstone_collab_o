import React, { useState } from 'react';
import { FiClock, FiUsers, FiDollarSign, FiBookmark, FiCheckCircle, FiArrowRight, FiTag, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion'; 

const ProjectCard = ({ project }) => {
  const freelancerId = localStorage.getItem('userId');

  const {
    title = '',
    description = '',
    price = '',
    category = 'Design',
    requiredSkills = [],
    deadline = '',
    status = 'active',
    _id,
    proposals = 0
  } = project;

  const [message, setMessage] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Format deadline
  let durationText = '';
  let isExpired = false;
  if (deadline) {
    const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)));
    isExpired = daysLeft === 0;
    durationText = daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed';
  }

  const isCompleted = status === 'completed';

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleApplyNow = async () => {
    if (isCompleted || isApplied) return;

    if (!message) {
      alert('Please write a message before applying!');
      return;
    }

    const proposalData = {
      freelancerId,
      projectId: _id,
      message: message,
    };

    try {
      const response = await fetch('http://localhost:5000/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposalData),
      });

      if (response.ok) {
        setIsApplied(true);
        alert(`Your proposal message: "${message}"`);
      } else {
        alert('Failed to submit the proposal!');
      }
    } catch (err) {
      console.error('Error submitting proposal:', err);
      alert('There was an error. Please try again.');
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all ${isCompleted ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-[#FC427B]'}`}>
        <div className="p-6">
          {/* Header with Title and Status */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`
                  text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1
                  ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-[#fff5f8] text-[#FC427B]'}
                `}>
                  {isCompleted ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                  {isCompleted ? 'Completed' : 'Active'}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <FiCalendar size={12} className="mr-1" />
                  {durationText}
                </span>
              </div>
              
              <h3 className="text-gray-900 font-bold text-xl">
                {title}
              </h3>
            </div>
            
            <button className="p-2 rounded-full text-gray-400 hover:text-[#FC427B] hover:bg-[#fff5f8] transition-all">
              <FiBookmark size={18} />
            </button>
          </div>
          
          {/* Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-5">
            {/* Left Column - Price & Category */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#fff5f8] flex items-center justify-center mr-3">
                  <FiDollarSign className="text-[#FC427B]" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-lg font-semibold text-gray-900">${price}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#fff5f8] flex items-center justify-center mr-3">
                  <FiTag className="text-[#FC427B]" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-gray-900 font-medium">{category}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#fff5f8] flex items-center justify-center mr-3">
                  <FiUsers className="text-[#FC427B]" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Proposals</p>
                  <p className="text-gray-900 font-medium">{proposals}</p>
                </div>
              </div>
            </div>
            
            {/* Center Column - Description */}
            <div className="md:col-span-5">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Project Description</h4>
              <p className={`text-gray-600 text-sm ${!isExpanded && 'line-clamp-4'}`}>
                {description}
              </p>
              {description.length > 150 && (
                <button 
                  onClick={toggleExpand} 
                  className="text-[#FC427B] text-sm font-medium mt-2 flex items-center hover:underline"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
            
            {/* Right Column - Skills */}
            <div className="md:col-span-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-[#fff5f8] hover:text-[#FC427B] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Apply Form */}
          {!isCompleted && (
            <div className={`mt-6 pt-6 border-t border-gray-100 ${isApplied ? 'opacity-70' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-9">
                  <label htmlFor="proposalMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Your proposal message
                  </label>
                  <textarea 
                    id="proposalMessage"
                    className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-[#FC427B] focus:border-[#FC427B] transition-colors"
                    placeholder="Describe why you're a good fit for this project..."
                    value={message}
                    onChange={handleMessageChange}
                    rows={3}
                    disabled={isApplied}
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button
                    disabled={isCompleted || isApplied}
                    onClick={handleApplyNow}
                    className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2
                      ${isCompleted || isApplied
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-[#FC427B] text-white hover:bg-[#e03a6d] shadow-sm hover:shadow-md'}`}
                  >
                    {isCompleted ? 'Closed' : isApplied ? 'Applied' : 'Submit Proposal'}
                    {!isCompleted && !isApplied && <FiArrowRight size={16} />}
                  </button>
                </div>
              </div>
              
              {isApplied && (
                <p className="mt-3 text-green-600 text-sm flex items-center">
                  <FiCheckCircle className="mr-2" />
                  Your proposal has been successfully submitted!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;