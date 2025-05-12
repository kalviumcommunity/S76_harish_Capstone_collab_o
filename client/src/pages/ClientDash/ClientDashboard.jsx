import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectCard from './ProjectCard';
import Sidebar from './SideBar';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId || !token) {
      toast.error('Authentication required. Please login.');
      navigate('/login');
      return;
    }
    fetchUserProjects();
  }, [userId, token, navigate]);

  const fetchUserProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/projects/user/${userId}`, {
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
  };

  const handleViewProposals = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-400 via-purple-900 to-gray-900">
      {/* Sidebar Component */}
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        
        <div className="container mx-auto py-8 px-4">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-10 text-center">
              My Projects
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-black bg-opacity-50 p-8 rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  No Projects Found
                </h2>
                <p className="text-gray-300 mb-6">
                  You haven't created any projects yet. Start by creating your first project!
                </p>
                <button 
                  onClick={() => navigate('/create-project')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg
                  hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onViewProposals={handleViewProposals}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;