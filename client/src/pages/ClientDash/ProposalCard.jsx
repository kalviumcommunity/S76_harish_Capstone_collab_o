import React, { useState, useEffect } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const ProposalCard = ({ onMessageClick }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const res = await fetch('http://localhost:5000/proposals', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch proposals');
      }

      setProposals(data.data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      // Replace with your actual API endpoint
      const res = await fetch(`http://localhost:5000/proposals/${proposalId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to accept proposal');
      }

      toast.success('Proposal accepted successfully');
      fetchProposals();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast.error('Failed to accept proposal');
    }
  };

  const handleRejectProposal = async (proposalId) => {
    if (!window.confirm('Are you sure you want to reject this proposal?')) {
      return;
    }
    
    try {
      // Replace with your actual API endpoint
      const res = await fetch(`http://localhost:5000/proposals/${proposalId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reject proposal');
      }

      toast.success('Proposal rejected');
      fetchProposals();
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      toast.error('Failed to reject proposal');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-[#AB00EA] rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-8 text-center border border-[#3a3a3a]">
        <h3 className="text-white text-xl font-semibold mb-2">No proposals yet</h3>
        <p className="text-gray-300">
          When freelancers submit proposals to your projects, they will appear here.
        </p>
      </div>
    );
  }

  // Mock data for demonstration
  const mockProposals = [
    {
      _id: 'proposal1',
      freelancer: {
        _id: 'freelancer1',
        name: 'John Developer',
        title: 'Full Stack Developer',
        skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'TypeScript'],
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      project: {
        _id: 'project1',
        title: 'E-commerce Website Development'
      },
      bidAmount: 1250,
      deliveryTime: 14,
      coverLetter: "I'm excited to work on your e-commerce project. I have extensive experience building online stores with React and Node.js, and I can deliver a high-quality solution within your timeframe.",
      status: 'pending'
    },
    {
      _id: 'proposal2',
      freelancer: {
        _id: 'freelancer2',
        name: 'Sarah Designer',
        title: 'UI/UX Designer',
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      project: {
        _id: 'project2',
        title: 'Mobile App Redesign'
      },
      bidAmount: 950,
      deliveryTime: 10,
      coverLetter: "I specialize in creating intuitive and visually appealing mobile app interfaces. I've reviewed your project requirements and am confident I can deliver a modern, user-friendly design that meets your needs.",
      status: 'accepted'
    }
  ];

  // Use mockProposals for demonstration or real data from API
  const displayProposals = proposals.length > 0 ? proposals : mockProposals;

  return (
    <div className="grid grid-cols-1 gap-4">
      {displayProposals.map((proposal) => (
        <div 
          key={proposal._id} 
          className="bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a] hover:border-[#AB00EA]/50 transition-all shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src={proposal.freelancer.avatar || 'https://via.placeholder.com/40'} 
                  alt={proposal.freelancer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-white font-semibold">{proposal.freelancer.name}</h3>
                  <p className="text-gray-400 text-sm">{proposal.freelancer.title}</p>
                </div>
              </div>
              
              <div className="mb-2">
                <h4 className="text-white text-sm mb-1">For: <span className="text-[#c560ea]">{proposal.project.title}</span></h4>
                <div className="flex gap-3 text-sm text-gray-400">
                  <span>Bid: <span className="text-green-400">${proposal.bidAmount}</span></span>
                  <span>Delivery: <span className="text-[#AB00EA]">{proposal.deliveryTime} days</span></span>
                </div>
              </div>
              
              <div className="bg-[#222222] p-3 rounded mb-3 border border-[#3a3a3a]">
                <p className="text-gray-300 text-sm">{proposal.coverLetter}</p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {proposal.freelancer.skills?.map((skill, index) => (
                  <span key={index} className="bg-[#222222] text-xs text-gray-400 px-2 py-0.5 rounded border border-[#3a3a3a]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex sm:flex-col gap-2">
              {proposal.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleAcceptProposal(proposal._id)}
                    className="flex-1 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-colors text-sm"
                  >
                    <Check size={14} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleRejectProposal(proposal._id)}
                    className="flex-1 flex items-center gap-1 bg-[#222222] hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors text-sm border border-[#3a3a3a]"
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </>
              ) : (
                <div className={`text-sm px-3 py-1 rounded-full ${
                  proposal.status === 'accepted' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </div>
              )}
              
              {proposal.status === 'accepted' && (
                <button
                  onClick={() => onMessageClick(proposal)}
                  className="flex items-center gap-1 bg-[#AB00EA] hover:bg-[#9500ca] text-white px-3 py-1.5 rounded-md transition-colors text-sm"
                >
                  <MessageSquare size={14} />
                  <span>Message</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProposalCard;