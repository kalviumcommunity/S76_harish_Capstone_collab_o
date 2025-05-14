import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiCheckCircle, FiArrowLeft, FiUser, FiMessageSquare, FiCalendar, FiCheck, FiXCircle, FiClock } from 'react-icons/fi';

const ProposalsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const currentUser = localStorage.getItem('username') || 'harishb2006'; // Default to the current user's login

  // Current UTC date formatting
  const getCurrentUTCDate = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };
  const [currentDateTime, setCurrentDateTime] = useState('2025-05-12 11:19:28'); // Default value

  useEffect(() => {
    setCurrentDateTime(getCurrentUTCDate());
    const timer = setInterval(() => setCurrentDateTime(getCurrentUTCDate()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!projectId) {
      toast.error('Project ID is missing!');
      return;
    }
    fetchProposals();
  }, [projectId]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/proposals/${projectId}`, {
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
  };

  const handleAccept = async (proposalId, freelancerId) => {
    try {
      // Accept the proposal
      const res = await fetch(`http://localhost:5000/api/proposals/${proposalId}/accept`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to accept proposal');
  
      toast.success('Proposal accepted successfully!');
  
      // Create or fetch the conversation
      const conversationRes = await fetch('http://localhost:5000/api/messaging/conversation', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: localStorage.getItem('userId'),
          freelancerId,
        }),
      });
      const conversation = await conversationRes.json();
      if (!conversationRes.ok) throw new Error('Failed to create or fetch conversation');
  
      // Redirect to the messaging page
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      toast.error(error.message || 'Something went wrong while accepting the proposal.');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={() => navigate('/clientDashboard')}
              className="flex items-center text-gray-300 hover:text-white transition-colors mr-4"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Project Proposals
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-indigo-300 text-sm flex items-center mb-1">
              <FiUser className="mr-2" />
              <span>{currentUser}</span>
            </div>
            <div className="text-purple-300 text-sm flex items-center">
              <FiClock className="mr-2" />
              <span>{currentDateTime}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
            </div>
          ) : proposals.length === 0 ? (
            <div className="bg-black bg-opacity-50 p-8 rounded-xl shadow-md text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                No Proposals Yet
              </h2>
              <p className="text-gray-300 mb-6">
                There are no proposals for this project yet. Check back later or modify your project details to attract more freelancers.
              </p>
              <button 
                onClick={() => navigate(`/projects/edit/${projectId}`)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg
                hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
              >
                Edit Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {proposals.map((proposal) => {
                const isAccepted = proposal.status === 'accepted';
                const isDisabled = hasAcceptedProposal && !isAccepted;
                
                return (
                  <div
                    key={proposal._id}
                    className={`bg-black bg-opacity-40 rounded-xl overflow-hidden shadow-lg 
                    transition-all duration-300 hover:shadow-2xl hover:transform hover:scale-[1.02] 
                    ${isAccepted 
                      ? 'border-2 border-green-500/50' 
                      : isDisabled
                        ? 'border border-gray-700 opacity-75'
                        : 'border border-purple-900/40'}`}
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
                    
                    {isDisabled && (
                      <div className="bg-gray-800 py-2 px-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FiXCircle className="text-gray-400 mr-2" />
                          <span className="text-gray-400 text-sm font-medium">Not Selected</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3
                          ${isAccepted 
                            ? 'bg-gradient-to-r from-green-600 to-green-500' 
                            : isDisabled
                              ? 'bg-gray-700'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600'}`}
                        >
                          <FiUser className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {proposal.freelancerId?.name || 'Freelancer'}
                          </h3>
                          <p className={
                            isAccepted 
                              ? "text-green-400 text-sm" 
                              : isDisabled 
                                ? "text-gray-400 text-sm"
                                : "text-indigo-300 text-sm"
                          }>
                            {proposal.freelancerId?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-purple-300 text-sm mb-3">
                        <FiCalendar className="mr-2" />
                        <span>{formatDate(proposal.createdAt)}</span>
                      </div>
                      
                      <div className={`p-4 rounded-lg mb-4 
                        ${isAccepted 
                          ? 'bg-green-900/10 border border-green-500/20' 
                          : isDisabled
                            ? 'bg-gray-800/50'
                            : 'bg-purple-900/20'}`}
                      >
                        <div className="flex items-start mb-2">
                          <FiMessageSquare className={`mr-2 mt-1 
                            ${isAccepted 
                              ? 'text-green-400' 
                              : isDisabled
                                ? 'text-gray-500'
                                : 'text-purple-400'}`} 
                          />
                          <p className={isDisabled ? "text-gray-500" : "text-gray-300"}>
                            {proposal.message}
                          </p>
                        </div>
                      </div>
                      
                      {isAccepted ? (
                        <div className="mt-6 bg-green-900/20 p-4 rounded-lg border border-green-500/20">
                          <p className="text-green-400 flex items-center justify-center gap-2">
                            <FiCheckCircle />
                            <span>This proposal has been accepted</span>
                          </p>
                        </div>
                      ) : isDisabled ? (
                        <div className="mt-6 bg-gray-800/30 p-4 rounded-lg">
                          <p className="text-gray-400 flex items-center justify-center gap-2">
                            <FiXCircle />
                            <span>You've already accepted another proposal</span>
                          </p>
                        </div>
                      ) : (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() => handleAccept(proposal._id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 
                            bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg 
                            hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                          >
                            <FiCheckCircle />
                            <span>Accept Proposal</span>
                          </button>
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