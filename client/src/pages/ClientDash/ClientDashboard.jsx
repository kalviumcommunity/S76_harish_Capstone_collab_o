import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectCard from './ProjectCard';
import { buildApiUrl } from '../../config/api';
import Sidebar from './SideBar';
import { FiPlus, FiGrid, FiList, FiFilter, FiCalendar } from 'react-icons/fi';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Format current date in a readable format
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fetchUserProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl(`/projects/user/${userId}`), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
      setProjects(data.data);
    } catch (error) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) {
      toast.error('Authentication required. Please login.');
      navigate('/login');
      return;
    }
    fetchUserProjects();
  }, [userId, token, navigate, fetchUserProjects]);

  const handleViewProposals = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
        handleLogout={handleLogout}
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
                <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
              </div>
              
              <div className="flex items-center gap-3">
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
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FC427B]">All Projects</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FC427B]">Active</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FC427B]">Completed</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FC427B]">In Progress</a>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => navigate('/clientForm')}
                  className="px-4 py-2 bg-[#FC427B] hover:bg-[#e03a6d] text-white rounded-lg font-medium flex items-center shadow-sm transition-colors"
                >
                  <FiPlus className="mr-2" size={18} />
                  New Project
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Projects</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">{projects.length}</h3>
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
                  <p className="text-gray-500 text-sm">Active Projects</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">
                    {projects.filter(p => p.status === 'active').length}
                  </h3>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Completed Projects</p>
                  <h3 className="text-gray-800 text-2xl font-bold mt-1">
                    {projects.filter(p => p.status === 'completed').length}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
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
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#fff5f8] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-[#FC427B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Projects Found</h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                You haven't created any projects yet. Start by creating your first project to begin receiving proposals from talented freelancers.
              </p>
              <button 
                onClick={() => navigate('/create-project')}
                className="px-6 py-3 bg-[#FC427B] hover:bg-[#e03a6d] text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onViewProposals={handleViewProposals}
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

export default ClientDashboard;