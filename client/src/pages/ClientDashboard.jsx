import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Plus, ClipboardList, MessageSquare, Users, Calendar, Settings, Trash, Edit } from 'lucide-react';

const ClientDashboard = () => {
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch projects for the user
  useEffect(() => {
    const fetchUserProjects = async () => {
      setLoading(true);

      try {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        if (!userId || !token) {
          console.error('User ID or token not found. Please log in.');
          return;
        }

        const res = await fetch(`http://localhost:5000/projects/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user projects: ${res.statusText}`);
        }

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching user projects:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, []);

  const handleNewProject = () => {
    navigate('/clientForm');
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#1c1c1c] min-h-screen">
        <div className="h-[4px] w-full bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA]" />

        {/* Dashboard Container */}
        <div className="container mx-auto px-4 py-6">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-[32px] font-bold text-white">Client Dashboard</h1>
              <p className="text-gray-400">Manage your projects and communicate with freelancers</p>
            </div>
            <button
              className="flex items-center gap-2 bg-[#AB00EA] text-white px-4 py-2 rounded-lg hover:bg-[#b670cf] transition-all shadow-lg"
              onClick={handleNewProject}
            >
              <Plus size={18} />
              <span>New Project</span>
            </button>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-12 md:col-span-3 lg:col-span-2">
              <div className="bg-[#292727] rounded-xl shadow-xl p-4">
                <div className="flex flex-col space-y-2">
                  <button
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeTab === 'projects' ? 'bg-[#AB00EA] text-white' : 'text-gray-300 hover:bg-[#383838]'
                    }`}
                    onClick={() => setActiveTab('projects')}
                  >
                    <ClipboardList size={20} />
                    <span>Projects</span>
                  </button>
                  <button
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeTab === 'messages' ? 'bg-[#AB00EA] text-white' : 'text-gray-300 hover:bg-[#383838]'
                    }`}
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageSquare size={20} />
                    <span>Messages</span>
                  </button>
                  <button
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeTab === 'freelancers' ? 'bg-[#AB00EA] text-white' : 'text-gray-300 hover:bg-[#383838]'
                    }`}
                    onClick={() => setActiveTab('freelancers')}
                  >
                    <Users size={20} />
                    <span>Proposal</span>
                  </button>
                  <button
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeTab === 'schedule' ? 'bg-[#AB00EA] text-white' : 'text-gray-300 hover:bg-[#383838]'
                    }`}
                    onClick={() => setActiveTab('schedule')}
                  >
                    <Calendar size={20} />
                    <span>Schedule</span>
                  </button>
                  <button
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeTab === 'settings' ? 'bg-[#AB00EA] text-white' : 'text-gray-300 hover:bg-[#383838]'
                    }`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="bg-[#292727] rounded-xl shadow-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">My Projects</h2>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AB00EA]"></div>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <h3 className="text-white text-xl font-semibold mb-2">No projects found</h3>
                      <p className="text-gray-400 mb-4">Get started by creating your first project</p>
                      <button
                        className="bg-[#AB00EA] text-white px-4 py-2 rounded-lg hover:bg-[#b670cf] transition-all flex items-center gap-2"
                        onClick={handleNewProject}
                      >
                        <Plus size={18} />
                        New Project
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {projects.map((project) => (
                        <div key={project._id} className="bg-[#383838] rounded-lg p-5 hover:border-[#AB00EA] border border-[#4d4d4d] transition-all duration-300">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                            <div className={`px-3 py-1 rounded-full text-xs ${project.status === 'active' ? 'bg-[#AB00EA] text-white' : 'bg-green-600 text-white'}`}>
                              {project.status === 'active' ? 'Active' : 'Completed'}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="text-gray-400 text-xs">Budget</span>
                              <p className="text-white font-semibold">${project.price}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs">Proposals</span>
                              <p className="text-white font-semibold">{project.proposals}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs">Deadline</span>
                              <p className="text-white font-semibold">{project.deadline}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-[#4d4d4d]">
                            <span className="text-gray-400 text-xs">Posted on {project.createdAt}</span>
                            <div className="flex gap-2">
                              <button className="p-2 rounded-lg bg-[#2e2e2e] hover:bg-[#4d4d4d] transition-all">
                                <Edit size={16} className="text-white" />
                              </button>
                              <button className="p-2 rounded-lg bg-[#2e2e2e] hover:bg-red-900 transition-all">
                                <Trash size={16} className="text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;