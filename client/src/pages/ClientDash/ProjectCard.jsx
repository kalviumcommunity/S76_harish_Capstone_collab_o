import React from 'react';
import { FiClock, FiDollarSign, FiArrowRight } from 'react-icons/fi';

const ProjectCard = ({ project, onViewProposals }) => {
  const { _id, title, description, price, deadline } = project;

  const formatDeadline = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed';
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-400">
            <FiDollarSign className="mr-1 text-purple-500" />
            <span>${price}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <FiClock className="mr-1 text-purple-500" />
            <span>{formatDeadline(deadline)}</span>
          </div>
        </div>
        <button
          onClick={() => onViewProposals(_id)}
          className="flex items-center gap-2 text-purple-500 hover:text-purple-300 transition-all"
        >
          View Proposals
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;