import React from 'react'
import { FiClock, FiUsers, FiDollarSign, FiBookmark } from 'react-icons/fi'

const ProjectCard = ({ project }) => {
  // Ensure compatibility with your new schema
  // Fallbacks to avoid breaking UI if some fields are missing
  const {
    title = '',
    description = '',
    price = '',
    // category = '',
    image = '',
    requiredSkills = [],
    deadline = '',
    // proposals = 0, // You may want to fetch proposals count from backend
    _id
  } = project

  // Format deadline
  let duration = ''
  if (deadline) {
    const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)))
    duration = daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'
  }



  return (
    <div className="relative">
      {/* Purple Border Effect */}
      <div 
        className="absolute inset-0 bg-[#AB00EA] w-[993px]  translate-x-[9px] translate-y-[8px] rounded-xl" 
        aria-hidden="true"
      />
      
      {/* Main Card */}
      <div className='relative bg-white rounded-xl shadow-lg hover:shadow-xl pt-[30px]  transition-all overflow-hidden h-[300px]  w-[1000px] z-10'>
        <div className='flex'>
          {/* Project Image */}
          <div className='w-[200px] h-[200px] flex-shrink-0'>
            <img 
              src={image} 
              alt={title}
              className='w-full h-full object-cover'
            />
          </div>

          {/* Project Details */}
          <div className='flex-1 p-6 w-[760px]'>
            <div className='flex justify-between items-start gap-4'>
              <div className='w-[650px]'>
                <h2 className='text-xl font-semibold text-gray-800 mb-4'>{title}</h2>
                <p className='text-gray-600 mb-8 line-clamp-2'>{description}</p>
                
                <div className='flex gap-2 flex-wrap mb-8'>
                  {requiredSkills.map((skill, index) => (
                    <span 
                      key={index}
                      className='px-3 py-1 bg-[#e3e2e2] text-[#8d4fff] rounded-full text-sm font-medium'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <button className='flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-[#8d4fff] text-gray-400 hover:text-[#8d4fff] transition-all'>
                <FiBookmark size={18} />
              </button>
            </div>

            {/* Project Meta */}
            <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
              <div className='flex gap-6'>
                <div className='flex items-center gap-2 text-gray-500'>
                  <FiDollarSign size={18} />
                  <span className='font-semibold text-gray-700'>${price}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-500'>
                  <FiClock size={18} />
                  <span>{duration}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-500'>
                  <FiUsers size={18} />
                  <span>{project.proposals || 0} proposals</span>
                </div>
              </div>

              <div className='flex items-center gap-4'>
              <button
             
                  className='px-6 py-2 bg-[#8d4fff] text-white rounded-lg hover:bg-[#7c3fee] transition-all'
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard