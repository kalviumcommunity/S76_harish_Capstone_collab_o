import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProposalCard from './ProposalCard';
import Sidebar from './SideBar';
import axios from 'axios';
import { FiPlus, FiGrid, FiList, FiFilter, FiCalendar, FiSearch } from 'react-icons/fi';

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Current date formatted as shown in the UI
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get user data from localStorage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'user';

  useEffect(() => {
    if (!userId || !token) {
      toast.error('Authentication required. Please login.');
      navigate('/login');
      return;
    }
    fetchUserProposals();
  }, [userId, token, navigate]);

  const fetchUserProposals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://s76-harish-capstone-collab-o.onrender.com/api/proposals/freelancer/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const proposalsWithProjectData = response.data.map(proposal => ({
        ...proposal,
        projectTitle: proposal.projectId?.title || 'Unknown Project',
        clientName: proposal.projectId?.createdBy?.name || 'Client',
        clientCompany: proposal.projectId?.createdBy?.company || '',
        clientId: proposal.projectId?.createdBy?._id || '',
      }));
      
      setProposals(proposalsWithProjectData);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error(error.response?.data?.error || 'Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    toast.success("Logout successful");
    navigate('/login');
  };

  const handleConnect = async (proposalId) => {
    try {
      // Here you'd implement the actual connection logic
      // For now we'll just update the UI
      setProposals(proposals.map(p => {
        if (p._id === proposalId) {
          return {...p, connected: true};
        }
        return p;
      }));
      toast.success("Connection request sent to client!");
    } catch (error) {
      toast.error("Failed to connect with client");
    }
  };

  const handleMessage = (clientId) => {
    navigate(`/messages/chat/${clientId}`);
  };

  // Filter proposals based on search query and active filter
  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = searchQuery === '' || 
                          proposal.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proposal.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || proposal.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
        handleLogout={handleLogout}
        userType="freelancer"
        username={username}
      />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} bg-gray-50`}>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="py-8 px-8">
          {/* Header Area */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <FiCalendar className="mr-2" />
                  <span>{currentDate}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">My Proposals</h1>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search proposals..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC427B] focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-1 flex border border-gray-200">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' 
                      ? 'bg-[#fff5f8] text-[#FC427B]' 
                      : 'text-gray-500 hover:text-gray-800'}`}
                    aria-label="Grid view"
                  >
                    <FiGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' 
                      ? 'bg-[#fff5f8] text-[#FC427B]' 
                      : 'text-gray-500 hover:text-gray-800'}`}
                    aria-label="List view"
                  >
                    <FiList size={18} />
                  </button>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                    className={`p-2 rounded-lg border ${filterMenuOpen 
                      ? 'bg-[#fff5f8] text-[#FC427B] border-[#FC427B] border-opacity-30' 
                      : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}
                    aria-label="Filter"
                  >
                    <FiFilter size={18} />
                  </button>
                  
                  {filterMenuOpen && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                      <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</div>
                      <button 
                        onClick={() => {
                          setActiveFilter('all');
                          setFilterMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          activeFilter === 'all' ? 'text-[#FC427B] bg-[#fff5f8]' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        All Proposals
                      </button>
                      <button 
                        onClick={() => {
                          setActiveFilter('pending');
                          setFilterMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          activeFilter === 'pending' ? 'text-[#FC427B] bg-[#fff5f8]' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => {
                          setActiveFilter('accepted');
                          setFilterMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          activeFilter === 'accepted' ? 'text-[#FC427B] bg-[#fff5f8]' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Accepted
                      </button>
                      <button 
                        onClick={() => {
                          setActiveFilter('rejected');
                          setFilterMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          activeFilter === 'rejected' ? 'text-[#FC427B] bg-[#fff5f8]' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Rejected
                      </button>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => navigate('/browse-projects')}
                  className="px-4 py-2 bg-[#FC427B] hover:bg-[#e03a6d] text-white rounded-lg font-medium flex items-center shadow-sm transition-colors"
                >
                  <FiPlus className="mr-2" size={18} />
                  New Proposal
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Proposals</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">{proposals.length}</h3>
                </div>
                <div className="p-3 bg-[#fff5f8] rounded-full">
                  <svg className="w-6 h-6 text-[#FC427B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Accepted Proposals</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">
                    {proposals.filter(p => p.status === 'accepted').length}
                  </h3>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pending Proposals</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">
                    {proposals.filter(p => p.status === 'pending').length}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path>
                    <path d="M10 5a1 1 0 011 1v4a1 1 0 01-.293.707l-2.5 2.5a1 1 0 01-1.414-1.414L9 9.586V6a1 1 0 011-1z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-opacity-20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#fff5f8] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#FC427B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Proposals Found</h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                {activeFilter !== 'all' 
                  ? `You don't have any ${activeFilter} proposals yet.` 
                  : "You haven't submitted any proposals yet. Browse available projects and start bidding to win exciting freelance work."}
              </p>
              <button 
                onClick={() => navigate('/browse-projects')}
                className="px-6 py-3 bg-[#FC427B] hover:bg-[#e03a6d] text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                Browse Available Projects
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredProposals.map((proposal) => (
                <ProposalCard
                  key={proposal._id}
                  proposal={proposal}
                  onViewProject={handleViewProject}
                  onConnect={handleConnect}
                  onMessage={handleMessage}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;