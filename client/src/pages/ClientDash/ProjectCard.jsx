import React from 'react';
import { FiClock, FiDollarSign, FiArrowRight, FiFileText, FiAward, FiTrash2 } from 'react-icons/fi';

const ProjectCard = ({ project, onViewProposals, onDelete }) => {
  const { _id, title, description, price, deadline, category, proposals, requiredSkills } = project;

  const formatDeadline = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const daysLeft = Math.ceil((deadlineDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
      return {
        text: `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} remaining`,
        isExpired: false
      };
    } else {
      return {
        text: 'Deadline expired',
        isExpired: true
      };
    }
  };

  const deadlineInfo = formatDeadline(deadline);
  const proposalCount = proposals || 0;
  const skills = requiredSkills || [];

  return (
    <div className="relative backdrop-blur-sm border border-gray-800/10 rounded-xl overflow-hidden group">
      {/* Luxurious gradient background with glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black opacity-95 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#FC427B] rounded-full filter blur-[100px] opacity-20 z-0"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600 rounded-full filter blur-[100px] opacity-20 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Top section with luxury badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="bg-gradient-to-r from-[#FC427B]/10 to-[#FC427B]/30 backdrop-blur-md px-4 py-1.5 rounded-full inline-flex items-center border border-[#FC427B]/20">
            <FiAward className="mr-1.5 text-[#FC427B]" />
            <span className="text-xs font-medium text-white">{category || 'Premium Project'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-4 py-1.5 rounded-full text-xs font-medium ${
              deadlineInfo.isExpired
                ? 'bg-gradient-to-r from-red-500/10 to-red-500/30 text-white border border-red-500/20'
                : 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/30 text-white border border-emerald-500/20'
            } backdrop-blur-md`}>
              <FiClock className="inline mr-1.5" />
              {deadlineInfo.text}
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(_id);
                }}
                className="p-2 rounded-full bg-gradient-to-r from-red-500/10 to-red-500/30 backdrop-blur-md border border-red-500/20 text-red-400 hover:text-white hover:bg-red-500 transition-all duration-300"
                title="Delete project"
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
        </div>
        
        {/* Project title and description */}
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h2>
        <p className="text-gray-300 mb-6 line-clamp-2 text-sm">{description}</p>
        
        {/* Project details */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#FC427B]/20 to-[#FC427B]/10 backdrop-blur-md border border-[#FC427B]/20">
              <FiDollarSign className="text-[#FC427B]" size={22} />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Budget</p>
              <p className="text-xl font-bold text-white">${price.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="w-px h-10 bg-gradient-to-b from-gray-800/0 via-gray-800/80 to-gray-800/0"></div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur-md border border-purple-500/20">
              <FiFileText className="text-purple-400" size={22} />
            </div>
            <div className="ml-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Proposals</p>
              <p className="text-xl font-bold text-white">{proposalCount}</p>
            </div>
          </div>
        </div>
        
        {/* Skills section */}
        {skills.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-3 py-1 text-xs bg-gray-800/50 border border-gray-700/50 rounded-full text-gray-300">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="px-3 py-1 text-xs bg-gray-800/50 border border-gray-700/50 rounded-full text-gray-300">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Button */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FC427B] to-purple-600 rounded-lg opacity-30 blur-sm group-hover:opacity-100 transition-all duration-500"></div>
          <button
            onClick={() => onViewProposals(_id)}
            className="relative w-full py-3 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg font-medium 
            border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center justify-center group-hover:border-transparent overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              View Proposals
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FC427B] to-purple-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;