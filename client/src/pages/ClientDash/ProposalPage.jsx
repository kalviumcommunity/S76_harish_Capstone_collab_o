import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiArrowLeft, FiUser, FiMessageSquare, FiCalendar, FiCheck, FiXCircle, FiClock, FiFile, FiPackage } from 'react-icons/fi';
import DeliverableViewer from '../../components/DeliverableVeiwer';
import { buildApiUrl } from '../../config/api';

const ProposalsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedProposal, setExpandedProposal] = useState(null);
  const [viewDeliverables, setViewDeliverables] = useState(false);
  
  const token = localStorage.getItem('token');
  const currentUser = localStorage.getItem('username') || 'harishb2006now'; // Default to the current user's login
  
  // Format current date for display
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl(`/api/proposals/${projectId}`), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch proposals');
      setProposals(data || []);
    } catch (error) {
      toast.error(error.message || 'Something went wrong while fetching proposals.');
    } finally {
      setLoading(false);
    }
  }, [projectId, token]);

  useEffect(() => {
    if (!projectId) {
      toast.error('Project ID is missing!');
      return;
    }
    fetchProposals();
  }, [projectId, fetchProposals]);

  const handleAccept = async (proposalId) => {
    try {
      // Accept the proposal
      const res = await fetch(buildApiUrl(`/api/proposals/${proposalId}/accept`), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to accept proposal');
  
      toast.success('Proposal accepted successfully!');
      
      // Update the local proposals state to reflect the acceptance
      setProposals(proposals.map(p => 
        p._id === proposalId ? {...p, status: 'accepted'} : p
      ));
      
      // Optionally redirect to messaging
      // navigate(`/messages/chat/${freelancerId}`);
    } catch (error) {
      toast.error(error.message || 'Something went wrong while accepting the proposal.');
    }
  };

  const toggleProposalDetails = (proposalId) => {
    if (expandedProposal === proposalId) {
      setExpandedProposal(null);
      setViewDeliverables(false);
    } else {
      setExpandedProposal(proposalId);
      setViewDeliverables(false);
    }
  };

  const toggleDeliverables = (proposalId) => {
    setExpandedProposal(proposalId);
    setViewDeliverables(!viewDeliverables);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if any proposal is accepted
  const hasAcceptedProposal = proposals.some(p => p.status === 'accepted');
  const acceptedProposal = proposals.find(p => p.status === 'accepted');

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FC427B] rounded-full opacity-5 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FC427B] rounded-full opacity-5 translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[#FC427B] rounded-full opacity-3"></div>
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#FC427B] opacity-5"></div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={() => navigate('/clientDashboard')}
              className="flex items-center text-gray-700 hover:text-[#FC427B] transition-colors mr-4 font-medium"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Project Proposals
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-indigo-600 text-sm flex items-center mb-1 font-medium">
              <FiUser className="mr-2" />
              <span>{currentUser}</span>
            </div>
            <div className="text-[#FC427B] text-sm flex items-center">
              <FiClock className="mr-2" />
              <span>{currentDateTime}</span>
            </div>
          </div>
        </div>
        
        {/* Accepted proposal deliverables view */}
        {hasAcceptedProposal && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Active Project Deliverables
              </h3>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 mr-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <FiCheck className="mr-1" />
                  Accepted Proposal
                </span>
                <span className="text-gray-500 text-sm">
                  {formatDate(acceptedProposal?.createdAt)}
                </span>
              </div>
            </div>
            
            {/* Freelancer info */}
            <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <button 
                onClick={() => navigate(`/profile/${acceptedProposal?.freelancerId?._id}`)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center hover:from-green-700 hover:to-green-600 transition-all duration-200 cursor-pointer"
                title="View Profile"
              >
                <FiUser className="text-white" size={24} />
              </button>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {acceptedProposal?.freelancerId?.name || 'Freelancer'}
                </h4>
                <p className="text-green-600">
                  {acceptedProposal?.freelancerId?.email || 'N/A'}
                </p>
              </div>
              <button 
                onClick={() => navigate(`/messages/chat/${acceptedProposal?.freelancerId?._id}`)}
                className="ml-auto px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors flex items-center"
              >
                <FiMessageSquare className="mr-2" />
                Message Freelancer
              </button>
            </div>
            
            {/* Deliverables viewer component */}
            <DeliverableViewer proposal={acceptedProposal} />
          </div>
        )}
        
        {/* Proposals list */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {hasAcceptedProposal ? 'All Proposals' : 'Project Proposals'}
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-opacity-20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : proposals.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#fff5f8] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#FC427B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                No Proposals Yet
              </h2>
              <p className="text-gray-600 mb-6">
                There are no proposals for this project yet. Check back later or modify your project details to attract more freelancers.
              </p>
              <button 
                onClick={() => navigate(`/projects/edit/${projectId}`)}
                className="px-6 py-3 bg-gradient-to-r from-[#FC427B] to-[#e03a6d] text-white rounded-lg
                hover:from-[#e03a6d] hover:to-[#d42e60] transition-all duration-300 shadow-md"
              >
                Edit Project
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {proposals.map((proposal) => {
                const isAccepted = proposal.status === 'accepted';
                const isDisabled = hasAcceptedProposal && !isAccepted;
                const isExpanded = expandedProposal === proposal._id;
                const hasDeliverables = isAccepted && proposal.deliveryStatus !== 'not_submitted';
                
                return (
                  <div
                    key={proposal._id}
                    className={`bg-white rounded-xl overflow-hidden shadow-lg 
                    transition-all duration-300 border 
                    ${isAccepted 
                      ? 'border-green-500' 
                      : isDisabled
                        ? 'border-gray-200 opacity-75'
                        : 'border-gray-100 hover:border-[#FC427B]'}`}
                  >
                    {isAccepted && (
                      <div className="bg-gradient-to-r from-green-600 to-green-500 py-2 px-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FiCheck className="text-white mr-2" />
                          <span className="text-white text-sm font-medium">Accepted</span>
                        </div>
                        <span className="text-white text-xs opacity-80">
                          {formatDate(proposal.acceptedAt)}
                        </span>
                      </div>
                    )}
                    
                    {isDisabled && !isAccepted && (
                      <div className="bg-gray-200 py-2 px-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FiXCircle className="text-gray-600 mr-2" />
                          <span className="text-gray-600 text-sm font-medium">Not Selected</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleProposalDetails(proposal._id)}
                      >
                        <div className="flex items-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profile/${proposal.freelancerId?._id}`);
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 cursor-pointer
                              ${isAccepted 
                                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600' 
                                : isDisabled
                                  ? 'bg-gray-300 hover:bg-gray-400'
                                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}`}
                            title="View Profile"
                          >
                            <FiUser className="text-white" />
                          </button>
                          <div className="ml-3">
                            <h3 className="text-xl font-bold text-gray-800">
                              {proposal.freelancerId?.name || 'Freelancer'}
                            </h3>
                            <div className="flex items-center gap-3">
                              <p className={
                                isAccepted 
                                  ? "text-green-600 text-sm" 
                                  : isDisabled 
                                    ? "text-gray-500 text-sm"
                                    : "text-indigo-600 text-sm"
                              }>
                                {proposal.freelancerId?.email || 'N/A'}
                              </p>
                              <span className="text-gray-400 text-sm">
                                {formatDate(proposal.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {isAccepted && hasDeliverables && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDeliverables(proposal._id);
                            }}
                            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors flex items-center"
                          >
                            <FiPackage className="mr-2" />
                            {viewDeliverables && expandedProposal === proposal._id 
                              ? "Hide Deliverables" 
                              : "View Deliverables"
                            }
                          </button>
                        )}
                      </div>
                      
                      {isExpanded && !viewDeliverables && (
                        <div className="mt-4">
                          <div className={`p-4 rounded-lg mb-4 
                            ${isAccepted 
                              ? 'bg-green-50 border border-green-100' 
                              : isDisabled
                                ? 'bg-gray-50 border border-gray-100'
                                : 'bg-[#fff5f8] border border-pink-100'}`}
                          >
                            <div className="flex items-start mb-2">
                              <FiMessageSquare className={`mr-2 mt-1 
                                ${isAccepted 
                                  ? 'text-green-600' 
                                  : isDisabled
                                    ? 'text-gray-500'
                                    : 'text-[#FC427B]'}`} 
                              />
                              <p className={isDisabled ? "text-gray-500" : "text-gray-700"}>
                                {proposal.message}
                              </p>
                            </div>
                          </div>
                          
                          {isAccepted ? (
                            <div className="flex justify-between">
                              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <p className="text-green-600 flex items-center gap-2 font-medium">
                                  <FiCheckCircle />
                                  <span>This proposal has been accepted</span>
                                </p>
                              </div>
                              
                              {hasDeliverables && (
                                <button
                                  onClick={() => toggleDeliverables(proposal._id)}
                                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors flex items-center"
                                >
                                  <FiFile className="mr-2" />
                                  View Deliverables
                                </button>
                              )}
                            </div>
                          ) : isDisabled ? (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <p className="text-gray-500 flex items-center justify-center gap-2">
                                <FiXCircle />
                                <span>You've already accepted another proposal</span>
                              </p>
                            </div>
                          ) : (
                            <div className="flex justify-center mt-4">
                              <button
                                onClick={() => handleAccept(proposal._id)}
                                className="flex items-center justify-center gap-2 px-4 py-3 w-full
                                bg-gradient-to-r from-[#FC427B] to-[#e03a6d] text-white rounded-lg 
                                hover:from-[#e03a6d] hover:to-[#d42e60] transition-all duration-300 shadow-md"
                              >
                                <FiCheckCircle />
                                <span>Accept Proposal</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Deliverables viewer */}
                      {isAccepted && viewDeliverables && expandedProposal === proposal._id && (
                        <div className="mt-6">
                          <DeliverableViewer proposal={proposal} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalsPage;