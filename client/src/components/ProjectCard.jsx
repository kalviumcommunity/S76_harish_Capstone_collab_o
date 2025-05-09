import React from 'react';
import { FiClock, FiUsers, FiDollarSign, FiBookmark, FiCheckCircle, FiAward, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion'; // For animations - install with: npm install framer-motion

const ProjectCard = ({ project }) => {
  const {
    title = '',
    description = '',
    price = '',
    category = 'Design', // Default category
    image = '',
    requiredSkills = [],
    deadline = '',
    status = 'active', // Add status field
    _id
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
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Purple Border Effect */}
      <div 
        className={`absolute inset-0 ${isCompleted ? 'bg-emerald-500' : 'bg-[#AB00EA]'} rounded-xl translate-x-[8px] translate-y-[8px]`}
        aria-hidden="true"
      />
      
      {/* Main Card */}
      <div className='relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-gray-100 z-10'>
        {/* Status Badge - Only show if completed */}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center z-20">
            <FiCheckCircle className="mr-1" />
            Completed
          </div>
        )}

        <div className='flex'>
          {/* Project Image with Category Badge */}
          <div className='relative w-56 h-64 flex-shrink-0'>
            <img 
              src={image} 
              alt={title}
              className='w-full h-full object-cover'
            />
            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <FiTag className="mr-1" size={12} />
              {category}
            </div>
          </div>

          {/* Project Details */}
          <div className='flex-1 p-6 flex flex-col h-64'>
            <div className='flex justify-between items-start gap-4 mb-2'>
              <div className='flex-1'>
                <h2 className='text-xl font-bold text-gray-800 mb-2'>{title}</h2>
                <p className='text-gray-600 mb-4 line-clamp-2'>{description}</p>
              </div>
              <button className='flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-[#8d4fff] text-gray-400 hover:text-[#8d4fff] transition-all group'>
                <FiBookmark size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
            
            {/* Skills Section with hover effects */}
            <div className='flex gap-2 flex-wrap mb-auto'>
              {requiredSkills.map((skill, index) => (
                <span 
                  key={index}
                  className='px-3 py-1 bg-[#f4f0ff] text-[#8d4fff] rounded-full text-sm font-medium hover:bg-[#ebe3ff] transition-colors cursor-default'
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Project Meta - Fixed at bottom */}
            <div className='flex items-center justify-between pt-4 border-t border-gray-100 mt-4'>
              <div className='flex gap-6'>
                <div className='flex items-center gap-2 text-gray-700'>
                  <FiDollarSign size={18} className="text-[#8d4fff]" />
                  <span className='font-bold'>${price}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-700'>
                  <FiClock size={18} className={isExpired ? 'text-red-500' : 'text-[#8d4fff]'} />
                  <span className={isExpired ? 'text-red-500 font-medium' : ''}>{duration}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-700'>
                  <FiUsers size={18} className="text-[#8d4fff]" />
                  <span>{project.proposals || 0} proposals</span>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <button
                  disabled={isCompleted}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2
                    ${isCompleted 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-[#8d4fff] hover:bg-[#7c3fee] shadow-md hover:shadow-lg hover:shadow-[#8d4fff]/20'}`}
                >
                  {isCompleted ? 'Closed' : 'Apply Now'}
                  {!isCompleted && <FiAward size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;