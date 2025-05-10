import React from 'react';
import { FiClock, FiUsers, FiDollarSign, FiBookmark, FiCheckCircle, FiAward, FiTag, FiEdit, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion'; // For animations - install with: npm install framer-motion

const ProjectCard = ({ project, onEdit, onDelete }) => {
  // Extract project properties with defaults
  const {
    title = '',
    description = '',
    price = '',
    category = 'Design', // Default category
    requiredSkills = [],
    deadline = '',
    status = 'active',
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
      <div className='relative bg-zinc-900 rounded-xl  shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-gray-100 z-10'>
        {/* Status Badge - Only show if completed */}
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center z-20">
            <FiCheckCircle className="mr-1" />
            Completed
          </div>
        )}

        {/* Project Details - Full width since we removed the image */}
        <div className='p-6 flex flex-col'>
          <div className='flex justify-between items-start gap-4 mb-2'>
            <div className='flex-1'>
              <div className="flex items-center gap-3 mb-2">
                <h2 className='text-xl font-bold text-white'>{title}</h2>
                <span className="bg-green-400/50 text-white px-3 py-1 rounded-full text-xs font-medium flex ml-[1020px] absolute">
                  <FiTag className="mr-1" size={12} />
                  {category}
                </span>
              </div>
              <p className='text-gray-400 mb-4 line-clamp-2'>{description}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit && onEdit(project._id)}
                className='flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-[#8d4fff] text-gray-400 hover:text-[#8d4fff] transition-all group'
                title="Edit Project"
              >
                <FiEdit size={18} className="group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => onDelete && onDelete(project._id)}
                className='flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-red-500 text-gray-400 hover:text-red-500 transition-all group'
                title="Delete Project"
              >
                <FiTrash2 size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Skills Section with hover effects */}
          <div className='flex gap-2 flex-wrap mb-6'>
            {requiredSkills.map((skill, index) => (
              <span 
                key={index}
                className='px-3 py-1 bg-[#f4f0ff] text-[#8d4fff] rounded-full text-sm font-medium hover:bg-[#ebe3ff] transition-colors cursor-default'
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Project Meta */}
          <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
            <div className='flex gap-6'>
              <div className='flex items-center gap-2 text-gray-700'>
                <FiDollarSign size={18} className="text-[#8d4fff]" />
                <span className='font-bold'>${price}</span>
              </div>
              <div className='flex items-center gap-2 text-gray-700'>
                <FiClock size={18} className={isExpired ? 'text-red-500' : 'text-[#8d4fff]'} />
                <span className={isExpired ? 'text-red-500 font-medium' : ''}>{duration}</span>
              </div>
              
            </div>

           
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;