import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiCalendar, 
  FiDollarSign, 
  FiFileText, 
  FiUser, 
  FiMessageSquare,
  FiFile
} from 'react-icons/fi';

const ProposalCard = ({ proposal, onViewProject, onMessage, viewMode }) => {
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loadingContract, setLoadingContract] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch contract if proposal is accepted
  useEffect(() => {
    const fetchContract = async () => {
      if (proposal.status === 'accepted' && !contract) {
        setLoadingContract(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contracts/proposal/${proposal._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setContract(response.data);
        } catch {
          // Contract doesn't exist yet
          setContract(null);
        } finally {
          setLoadingContract(false);
        }
      }
    };
    
    fetchContract();
  }, [proposal._id, proposal.status, token, contract]);

  const handleViewContract = () => {
    if (contract) {
      navigate(`/contract/${contract._id}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-500 bg-green-50';
      case 'rejected':
        return 'text-red-500 bg-red-50';
      case 'pending':
      default:
        return 'text-blue-500 bg-blue-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <FiCheckCircle className="mr-1" />;
      case 'rejected':
        return <FiXCircle className="mr-1" />;
      case 'pending':
      default:
        return <FiClock className="mr-1" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // GRID VIEW
  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {proposal.projectTitle || 'Project'}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center ${getStatusColor(proposal.status)}`}>
              {getStatusIcon(proposal.status)}
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Your Proposal:</p>
            <p className="text-gray-700 text-sm line-clamp-3">
              {proposal.message || 'No message provided'}
            </p>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <FiUser className="mr-2 text-gray-400" size={14} />
            <span className="font-medium">Client:</span>
            <span className="ml-1">{proposal.clientName || 'Unknown'}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm mb-2">
            <FiCalendar className="mr-2 text-gray-400" size={14} />
            <span className="font-medium">Submitted:</span>
            <span className="ml-1">{formatDate(proposal.createdAt)}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <FiDollarSign className="mr-2 text-gray-400" size={14} />
            <span className="font-medium">Project Budget:</span>
            <span className="ml-1">${proposal.projectId?.price || 'N/A'}</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => onViewProject(proposal.projectId?._id || proposal.projectId)}
              className="w-full py-2 bg-[#fff5f8] text-[#FC427B] hover:bg-[#FC427B] hover:text-white rounded-lg font-medium transition-colors"
            >
              View Project Details
            </button>

            {proposal.status === 'accepted' && contract && (
              <button 
                onClick={handleViewContract}
                className="w-full py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <FiFile className="mr-2" size={14} />
                View Contract
              </button>
            )}

            {proposal.status === 'accepted' && !contract && !loadingContract && (
              <div className="text-xs text-center text-gray-500 py-2">
                No contract generated yet
              </div>
            )}

            <button 
              onClick={() => proposal.status === 'accepted' && onMessage(proposal._id)}
              disabled={proposal.status !== 'accepted'}
              className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                proposal.status === 'accepted'
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FiMessageSquare className="mr-2" size={14} />
              {proposal.status === 'accepted' ? 'Chat with Client' : 'Message (Pending)'}
            </button>
          </div>
        </div>
      </div>
    );
  } 
  
  // LIST VIEW
  else {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {proposal.projectTitle || 'Project'}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center ${getStatusColor(proposal.status)}`}>
                {getStatusIcon(proposal.status)}
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-500 mb-1">Your Proposal:</p>
              <p className="text-gray-700 text-sm">
                {truncateText(proposal.message, 150) || 'No message provided'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center text-gray-500 text-sm">
                <FiUser className="mr-1 text-gray-400" size={14} />
                <span className="font-medium">Client:</span>
                <span className="ml-1">{proposal.clientName || 'Unknown'}</span>
              </div>
            
              <div className="flex items-center text-gray-500 text-sm">
                <FiCalendar className="mr-1 text-gray-400" size={14} />
                <span className="font-medium">Submitted:</span>
                <span className="ml-1">{formatDate(proposal.createdAt)}</span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <FiDollarSign className="mr-1 text-gray-400" size={14} />
                <span className="font-medium">Budget:</span>
                <span className="ml-1">${proposal.projectId?.price || 'N/A'}</span>
              </div>
              
              {proposal.projectId?.deadline && (
                <div className="flex items-center text-gray-500 text-sm">
                  <FiFileText className="mr-1 text-gray-400" size={14} />
                  <span className="font-medium">Deadline:</span>
                  <span className="ml-1">{formatDate(proposal.projectId.deadline)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => onViewProject(proposal.projectId?._id || proposal.projectId)}
              className="px-4 py-2 bg-[#fff5f8] text-[#FC427B] hover:bg-[#FC427B] hover:text-white rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              View Project
            </button>

            {proposal.status === 'accepted' && contract && (
              <button 
                onClick={handleViewContract}
                className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center"
              >
                <FiFile className="mr-2" size={14} />
                View Contract
              </button>
            )}

            <button 
              onClick={() => proposal.status === 'accepted' && onMessage(proposal._id)}
              disabled={proposal.status !== 'accepted'}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center ${
                proposal.status === 'accepted'
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FiMessageSquare className="mr-2" size={14} />
              Chat
            </button>
          </div>
        </div>

        {proposal.projectId?.requiredSkills && proposal.projectId.requiredSkills.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-2">
              {proposal.projectId.requiredSkills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default ProposalCard;
