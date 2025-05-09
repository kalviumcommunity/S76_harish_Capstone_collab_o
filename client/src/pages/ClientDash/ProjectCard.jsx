import React from 'react';
import { Edit, Trash2, Calendar, DollarSign, Tag, CheckCircle, Clock } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  // Determine if project is active or completed based on status
  const isCompleted = project.status === 'completed';
  
  // Format deadline to show days remaining
  const calculateTimeLeft = () => {
    const difference = new Date(project.deadline) - new Date();
    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed';
  };

  return (
    <div className="bg-gradient-to-br from-[#2D2D2D] to-[#252525] hover:scale-100 transform  rounded-lg overflow-hidden border-2 border-[#3a3a3a] hover:border-[#5e7eff] transition-all shadow-lg group">
      {/* Status Bar - Conditionally colored based on project status */}
      <div className={`h-1 w-full ${isCompleted ? 'bg-green-500' : 'bg-[#AB00EA]'}`}></div>
      
      <div className="p-5">
        {/* Header with Title and Status */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-xl tracking-tight group-hover:text-[#AB00EA] transition-colors">
            {project.title}
          </h3>
          <span className={`
            ${isCompleted ? 'bg-green-900 text-green-300' : 'bg-[#3D2463] text-[#D4A6FF]'} 
            text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1
          `}>
            {isCompleted ? <CheckCircle size={12} /> : <Clock size={12} />}
            {isCompleted ? 'Completed' : 'Active'}
          </span>
        </div>
        
        {/* Main Content Area with 3 Sections: Left Metadata, Center Description, Right Metadata */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          {/* Left Column - Price and Category */}
          <div className="md:w-1/4 flex flex-col gap-2">
            <div className="bg-[#1A1A1A] rounded-lg p-3 flex flex-col items-center justify-center border border-[#333333]">
              <DollarSign size={18} className="text-[#AB00EA] mb-1" />
              <span className="text-white font-medium text-lg">${project.price}</span>
              <span className="text-xs text-gray-400">Budget</span>
            </div>
            
            <div className="bg-[#1A1A1A] rounded-lg p-3 flex flex-col items-center justify-center border border-[#333333]">
              <Tag size={18} className="text-[#AB00EA] mb-1" />
              <span className="text-white font-medium">{project.category}</span>
              <span className="text-xs text-gray-400">Category</span>
            </div>
          </div>
          
          {/* Center Column - Description */}
          <div className="md:w-2/4 flex flex-col">
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#333333] h-full flex flex-col">
              <h4 className="text-[#AB00EA] text-sm font-medium mb-2">Project Description</h4>
              <p className="text-gray-300 text-sm flex-grow">{project.description}</p>
              
              {/* Deadline in the bottom of center column */}
              <div className="mt-3 pt-3 border-t border-[#333333] flex items-center justify-center">
                <Calendar size={14} className="text-[#AB00EA] mr-2" />
                <span className="text-gray-300 text-sm">{calculateTimeLeft()}</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Skills */}
          <div className="md:w-1/4 bg-[#1A1A1A] rounded-lg p-3 border border-[#333333]">
            <h4 className="text-[#AB00EA] text-sm font-medium mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills?.map((skill, index) => (
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
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(project._id)}
            className="items-center w-[150px] flex justify-center gap-2  bg-[#3D2463] hover:bg-[#9500ca] text-white px-4 py-2 rounded-md transition-all text-sm font-medium shadow-md hover:shadow-[#AB00EA]/20 hover:shadow-lg"
          >
            <Edit size={16} />
            <span>Edit Project</span>
          </button>
          <button
            onClick={() => onDelete(project._id)}
            className="w-12 flex items-center justify-center bg-[#1A1A1A] hover:bg-red-900 text-red-500 hover:text-white rounded-md transition-all border border-[#333333] hover:border-red-700"
            title="Delete Project"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;