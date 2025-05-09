import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectCard from './ProjectCard';
import ProposalCard from './ProposalCard';
import MessagePanel from './MessagePanel';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'proposals'
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showMessages, setShowMessages] = useState(false);

  // Get userId and token from localStorage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check if user is authenticated
    if (!userId || !token) {
      toast.error('Authentication required. Please login.');
      navigate('/login');
      return;
    }

    // Fetch user projects
    fetchUserProjects();
  }, [userId, token, navigate]);

  const fetchUserProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/projects/user/${userId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
      }
  
      setProjects(data.data);  
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      toast.error(error.message || 'Something went wrong.');
      if (error.message.includes('expired')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    navigate('/clientForm');
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/projects/delete/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete project');
      }

      toast.success('Project deleted successfully');
      fetchUserProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please try again.');
    }
  };

  const handleEditProject = (projectId) => {
    navigate(`/clientForm/${projectId}`);
  };

  const handleMessageClick = (proposal) => {
    setSelectedProposal(proposal);
    setShowMessages(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c1c1c] to-[#252525]">
      <Navbar />
      <div className="h-[2px] bg-gradient-to-r from-[#AB00EA] via-[#ffffff] to-[#AB00EA]"></div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Main content area with conditional message panel */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side - Projects/Proposals */}
          <div className={`${showMessages ? 'hidden md:block md:w-1/2 lg:w-3/5' : 'w-full'}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#AB00EA]">
                  Client Dashboard
                </span>
              </h1>
              
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 bg-[#2a2a2a] text-white px-3 py-2 rounded-lg hover:bg-[#333333] transition-all border border-[#3a3a3a]"
                  onClick={fetchUserProjects}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>
                
                <button
                  className="flex items-center gap-1 bg-[#AB00EA] text-white px-3 py-2 rounded-lg hover:bg-[#9500ca] transition-all"
                  onClick={handleNewProject}
                >
                  <Plus size={16} />
                  <span>New Project</span>
                </button>
              </div>
            </div>
            
            {/* Tab navigation */}
            <div className="flex border-b border-[#3a3a3a] mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'projects' 
                    ? 'text-white border-b-2 border-[#AB00EA]' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'proposals' 
                    ? 'text-white border-b-2 border-[#AB00EA]' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('proposals')}
              >
                Proposals
              </button>
            </div>
            
            {/* Content based on active tab */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-[#AB00EA] rounded-full border-t-transparent"></div>
              </div>
            ) : activeTab === 'projects' ? (
              projects.length === 0 ? (
                <div className="bg-[#2a2a2a] rounded-lg p-8 text-center border border-[#3a3a3a]">
                  <h3 className="text-white text-xl font-semibold mb-2">No projects yet</h3>
                  <p className="text-gray-300 mb-4">Create your first project to get started!</p>
                  <button 
                    onClick={handleNewProject}
                    className="inline-flex items-center gap-2 bg-[#AB00EA] text-white px-4 py-2 rounded-lg hover:bg-[#9500ca] transition-all"
                  >
                    <Plus size={16} />
                    <span>Create Project</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              )
            ) : (
              <ProposalCard onMessageClick={handleMessageClick} />
            )}
          </div>
          
          {/* Right side - Messages panel (conditionally shown) */}
          {showMessages && (
            <div className="md:w-1/2 lg:w-2/5">
              <MessagePanel 
                proposal={selectedProposal} 
                onClose={() => setShowMessages(false)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;