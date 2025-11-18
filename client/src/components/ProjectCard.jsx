import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiUsers, FiDollarSign, FiBookmark, FiCheckCircle, FiArrowRight, FiTag, FiCalendar } from 'react-icons/fi'; 

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

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

  const [isApplied, setIsApplied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Format deadline
  let durationText = '';
  if (deadline) {
    const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)));
    durationText = daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed';
  }

  const isCompleted = status === 'completed';

  const handleApplyClick = () => {
    navigate(`/proposal/submit/${_id}`);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full group relative">
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
        </div>
      </div>
      
      {/* Hover Apply Button */}
      {!isCompleted && !isApplied && (
        <button
          onClick={handleApplyClick}
          className="absolute top-4 right-4 px-6 py-3 bg-gradient-to-r from-[#FC427B] to-[#e03a6d] text-white rounded-lg font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-10"
        >
          <span>Apply Now</span>
          <FiArrowRight size={18} />
        </button>
      )}
    </div>
  );
};

export default ProjectCard;
