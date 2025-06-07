import React, { useState } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiDollarSign, FiFileText, FiUser, FiMessageSquare, FiLink, FiUpload } from 'react-icons/fi';
import DeliverableUpload from '../../components/DelivarableUpload';

const ProposalCard = ({ proposal, onViewProject, onConnect, onMessage, viewMode }) => {
  const [showDeliverables, setShowDeliverables] = useState(false);

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

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Truncate text if too long
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const renderDeliverableUpload = () => {
    if (!showDeliverables) {
      return (
        <button 
          onClick={() => setShowDeliverables(true)}
          className="w-full py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors flex items-center justify-center mt-2"
        >
          <FiUpload className="mr-2" size={14} />
          Upload Deliverables
        </button>
      );
    }
    
    return <DeliverableUpload proposal={proposal} />;
  };

  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {proposal.message}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center ${getStatusColor(proposal.status)}`}>
              {getStatusIcon(proposal.status)}
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
            {truncateText(proposal.description, 100)}
          </p>
          
          <div className="flex items-center text-gray-500 text-sm mb-1">
            <FiUser className="mr-2" size={14} />
            <span>{proposal.projectTitle}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm mb-1">
            <FiCalendar className="mr-2" size={14} />
            <span>Submitted: {formatDate(proposal.createdAt)}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <FiDollarSign className="mr-2" size={14} />
            <span>Bid Amount: ${proposal.bidAmount}</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => onViewProject(proposal.projectId)}
              className="w-full py-2 bg-[#fff5f8] text-[#FC427B] hover:bg-[#FC427B] hover:text-white rounded-lg font-medium transition-colors"
            >
              View Project
            </button>
            
            {proposal.status === 'accepted' && (
              <>
                <div className="flex space-x-2">
                  {proposal.connected ? (
                    <button 
                      onClick={() => onMessage(proposal.clientId)}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <FiMessageSquare className="mr-2" size={14} />
                      Message
                    </button>
                  ) : (
                    <button 
                      onClick={() => onConnect(proposal._id)}
                      className="flex-1 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <FiLink className="mr-2" size={14} />
                      Connect
                    </button>
                  )}
                </div>
                
                {/* Add deliverable upload button/component */}
                {showDeliverables ? (
                  <DeliverableUpload proposal={proposal} />
                ) : (
                  <button 
                    onClick={() => setShowDeliverables(true)}
                    className="w-full py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <FiUpload className="mr-2" size={14} />
                    Upload Deliverables
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // List view
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {proposal.projectTitle}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center ${getStatusColor(proposal.status)}`}>
                {getStatusIcon(proposal.status)}
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-3 text-sm">
              {truncateText(proposal.description, 150)}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center text-gray-500 text-sm">
                <FiUser className="mr-1" size={14} />
                <span>{proposal.clientName}</span>
              </div>
            
              <div className="flex items-center text-gray-500 text-sm">
                <FiCalendar className="mr-1" size={14} />
                <span>Submitted: {formatDate(proposal.createdAt)}</span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <FiDollarSign className="mr-1" size={14} />
                <span>Bid: ${proposal.bidAmount}</span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm">
                <FiFileText className="mr-1" size={14} />
                <span>Delivery: {proposal.deliveryTime} days</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onViewProject(proposal.projectId)}
              className="px-4 py-2 bg-[#fff5f8] text-[#FC427B] hover:bg-[#FC427B] hover:text-white rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              View Project
            </button>
            
            {proposal.status === 'accepted' && (
              proposal.connected ? (
                <button 
                  onClick={() => onMessage(proposal.clientId)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center"
                >
                  <FiMessageSquare className="mr-2" size={14} />
                  Message
                </button>
              ) : (
                <button 
                  onClick={() => onConnect(proposal._id)}
                  className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center"
                >
                  <FiLink className="mr-2" size={14} />
                  Connect
                </button>
              )
            )}
            
            {proposal.status === 'accepted' && (
              <button 
                onClick={() => setShowDeliverables(!showDeliverables)}
                className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center"
              >
                <FiUpload className="mr-2" size={14} />
                {showDeliverables ? 'Hide Upload' : 'Upload Deliverables'}
              </button>
            )}
          </div>
        </div>

        {/* Skills tags */}
        {proposal.skills && proposal.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {proposal.skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}
        
        {/* Deliverable upload section */}
        {proposal.status === 'accepted' && showDeliverables && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <DeliverableUpload proposal={proposal} />
          </div>
        )}
      </div>
    );
  }
};

export default ProposalCard;