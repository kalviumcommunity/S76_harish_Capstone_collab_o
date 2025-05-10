import React from 'react';
import { FiClock, FiUsers, FiDollarSign, FiBookmark, FiCheckCircle, FiAward, FiTag, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion'; 

const ProjectCard = ({ project }) => {
  const {
    title = '',
    description = '',
    price = '',
    category = 'Design', // Default category
    // image = '',
    requiredSkills = [],
    deadline = '',
    status = 'active', // Add status field
    _id,
    proposals = 0
  } = project;

  // Format deadline
  let duration = '';
  let isExpired = false;
  if (deadline) {
    const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)));
    isExpired = daysLeft === 0;
    duration = daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed';
  }

  const isCompleted = status === 'completed';

  return (
    <motion.div 
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Card */}
      <div className="bg-gradient-to-br from-[#2D2D2D] to-[#252525] rounded-lg overflow-hidden border-2 border-[#3a3a3a] hover:border-[#AB00EA] transition-all shadow-lg group">
        {/* Status Bar */}
        <div className={`h-1 w-full ${isCompleted ? 'bg-green-500' : 'bg-[#AB00EA]'}`}></div>
        
        <div className="p-5">
          {/* Header with Title and Status */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-xl tracking-tight group-hover:text-[#AB00EA] transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#3a3a3a] hover:border-[#AB00EA] text-gray-400 hover:text-[#AB00EA] transition-all group bg-[#1A1A1A]">
                <FiBookmark size={18} className="group-hover:scale-110 transition-transform" />
              </button>
              <span className={`
                ${isCompleted ? 'bg-green-900 text-green-300' : 'bg-[#3D2463] text-[#D4A6FF]'} 
                text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1
              `}>
                {isCompleted ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                {isCompleted ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>
          
          {/* Main Content Area with 3 Sections */}
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            {/* Left Column - Price and Category */}
            <div className="md:w-1/4 flex flex-col gap-2">
              <div className="bg-[#1A1A1A] rounded-lg p-3 flex flex-col items-center justify-center border border-[#333333]">
                <FiDollarSign size={18} className="text-[#AB00EA] mb-1" />
                <span className="text-white font-medium text-lg">${price}</span>
                <span className="text-xs text-gray-400">Budget</span>
              </div>
              
              <div className="bg-[#1A1A1A] rounded-lg p-3 flex flex-col items-center justify-center border border-[#333333]">
                <FiTag size={18} className="text-[#AB00EA] mb-1" />
                <span className="text-white font-medium">{category}</span>
                <span className="text-xs text-gray-400">Category</span>
              </div>
            </div>
            
            {/* Center Column - Description */}
            <div className="md:w-2/4 flex flex-col">
              <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333333] h-full flex flex-col">
                <h4 className="text-[#AB00EA] text-sm font-medium mb-2">Project Description</h4>
                <p className="text-gray-300 text-sm flex-grow">{description}</p>
                
                {/* Deadline in the bottom of center column */}
                <div className="mt-3 pt-3 border-t border-[#333333] flex items-center justify-center">
                  <FiCalendar size={14} className="text-[#AB00EA] mr-2" />
                  <span className={`text-gray-300 text-sm ${isExpired ? 'text-red-400' : ''}`}>{duration}</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Skills */}
            <div className="md:w-1/4 bg-[#1A1A1A] rounded-lg p-3 border border-[#333333]">
              <h4 className="text-[#AB00EA] text-sm font-medium mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#252525] text-gray-300 text-xs px-2 py-1 rounded-full border border-[#3D2463] hover:border-[#AB00EA] hover:text-[#D4A6FF] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer Info and Apply Button */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-2">
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-gray-300">
                <FiUsers size={16} className="text-[#AB00EA]" />
                <span className="text-sm">{proposals} proposals</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                disabled={isCompleted}
                className={`px-6 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2
                  ${isCompleted 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-[#3D2463] hover:bg-[#9500ca] shadow-md hover:shadow-[#AB00EA]/20 hover:shadow-lg'}`}
              >
                {isCompleted ? 'Closed' : 'Apply Now'}
                {!isCompleted && <FiAward size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;