import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Plus, Edit, Trash2, RefreshCw, Briefcase, MessageSquare, Settings, LogOut, Home } from 'lucide-react';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get userId and token from localStorage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Calculate navbar height - used for positioning
  const navbarHeight = 70; // Adjust this value if your navbar has a different height

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Projects', icon: <Briefcase size={20} />, onClick: () => setActiveTab('projects') },
    { name: 'Proposals', icon: <MessageSquare size={20} />, onClick: () => setActiveTab('proposals') },
    { name: 'Settings', icon: <Settings size={20} />, onClick: () => navigate('/settings') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c1c1c] to-[#252525]">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-30">
        <Navbar />
        <div className="h-[2px] bg-gradient-to-r from-[#AB00EA] via-[#ffffff] to-[#AB00EA]"></div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      {/* Main layout with fixed position sidebar */}
      <div className="flex" style={{ paddingTop: `${navbarHeight}px` }}>
        {/* Fixed Sidebar */}
        <aside 
          className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#1a1a1a] fixed top-[${navbarHeight}px] bottom-0 left-0 border-r border-[#3a3a3a] transition-all duration-300 flex flex-col z-20`}
          style={{ height: `calc(100vh - ${navbarHeight}px)` }}
        >
          <div className="p-4 border-b border-[#3a3a3a]">
            <h2 className={`text-white font-bold ${sidebarCollapsed ? 'text-center text-sm' : 'text-xl'}`}>
              {sidebarCollapsed ? 'CD' : 'Client Dashboard'}
            </h2>
          </div>
          
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={item.onClick}
                    className={`w-full flex items-center px-4 py-3 text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors
                      ${activeTab === item.name.toLowerCase() ? 'bg-[#2a2a2a] text-white border-l-2 border-[#AB00EA]' : ''}`}
                  >
                    <span className="flex-shrink-0 text-[#AB00EA]">{item.icon}</span>
                    {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-[#3a3a3a] mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-[#2a2a2a] text-red-400 hover:text-white hover:bg-red-800 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
            
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#2a2a2a] text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </aside>
        
        {/* Main content area with margin to accommodate the sidebar */}
        <main 
          className="flex-1 min-h-screen overflow-y-auto p-6 transition-all duration-300"
          style={{ marginLeft: sidebarCollapsed ? '5rem' : '16rem' }}
        >
          {/* Header with title and action buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-[30px] items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#AB00EA]">
                {activeTab === 'projects' ? 'My Projects' : 'Proposals'}
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
              
              {activeTab === 'projects' && (
                <button
                  className="flex items-center gap-1 bg-[#AB00EA] text-white px-3 py-2 rounded-lg hover:bg-[#9500ca] transition-all"
                  onClick={handleNewProject}
                >
                  <Plus size={16} />
                  <span>New Project</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Content based on active tab */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Projects/Proposals section */}
            <div className={`${showMessages ? 'hidden md:block md:w-1/2 lg:w-3/5' : 'w-full'}`}>
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
                  <div className="grid grid-cols-1 max-w-[1300px] mx-auto gap-[30px]">
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
            
            {/* Messages panel (conditionally shown) */}
            {showMessages && (
              <div className="md:w-1/2 lg:w-2/5">
                <MessagePanel 
                  proposal={selectedProposal} 
                  onClose={() => setShowMessages(false)} 
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;