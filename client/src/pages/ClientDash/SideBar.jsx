import React, { useState,  } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiBriefcase, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();
  // Start with the sidebar collapsed by default
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  return (
    <aside
      className={`${
        sidebarCollapsed ? 'w-16' : 'w-56'
      } bg-gray-900 h-screen sticky top-0 transition-all duration-300 z-10`}
    >
      <div className="flex items-center justify-between p-4">
        <h2
          className={`text-purple-500 text-lg font-bold transition-all duration-300 ${
            sidebarCollapsed ? 'hidden' : 'block'
          }`}
        >
          Dashboard
        </h2>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-gray-400 hover:text-white transition-colors"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <FiMenu size={20} /> : '←'}
        </button>
      </div>
      <nav className="mt-8 space-y-4">
        <ul>
          <li>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-4 text-gray-400 hover:text-white px-4 py-2 w-full"
              title="Home"
            >
              <FiHome size={20} />
              {!sidebarCollapsed && <span>Home</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-4 text-gray-400 hover:text-white px-4 py-2 w-full"
              title="Projects"
            >
              <FiBriefcase size={20} />
              {!sidebarCollapsed && <span>Projects</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-4 text-gray-400 hover:text-white px-4 py-2 w-full"
              title="Settings"
            >
              <FiSettings size={20} />
              {!sidebarCollapsed && <span>Settings</span>}
            </button>
          </li>
        </ul>
      </nav>
      <div className="mt-auto border-t border-gray-800 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-red-400 hover:text-red-600 w-full px-4 py-2"
          title="Logout"
        >
          <FiLogOut size={20} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;