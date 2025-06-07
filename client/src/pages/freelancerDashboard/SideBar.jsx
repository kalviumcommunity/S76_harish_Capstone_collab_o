import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiMessageSquare, FiUser, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiBriefcase, FiSearch, FiCreditCard, FiStar, FiAlertCircle } from 'react-icons/fi';

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed, handleLogout, userType = 'client', username = 'user' }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Define menu items based on user type
  const menuItems = userType === 'client' 
    ? [
        { icon: <FiHome size={20} />, text: 'Dashboard', path: '/client-dashboard' },
        { icon: <FiBriefcase size={20} />, text: 'My Projects', path: '/my-projects' },
        { icon: <FiFileText size={20} />, text: 'Contracts', path: '/contracts' },
        { icon: <FiMessageSquare size={20} />, text: 'Messages', path: '/messages' },
        { icon: <FiUser size={20} />, text: 'Freelancers', path: '/find-freelancers' },
        { icon: <FiCreditCard size={20} />, text: 'Payments', path: '/payments' },
      ]
    : [
        { icon: <FiHome size={20} />, text: 'Dashboard', path: '/freelancer-dashboard' },
        { icon: <FiSearch size={20} />, text: 'Find Work', path: '/browse-projects' },
        { icon: <FiBriefcase size={20} />, text: 'My Proposals', path: '/my-proposals' },
        { icon: <FiFileText size={20} />, text: 'Active Jobs', path: '/active-jobs' },
        { icon: <FiMessageSquare size={20} />, text: 'Messages', path: '/messages' },
        { icon: <FiStar size={20} />, text: 'Reviews', path: '/reviews' },
        { icon: <FiCreditCard size={20} />, text: 'Earnings', path: '/earnings' },
      ];

  return (
    <div className={`h-screen bg-white border-r border-gray-100 transition-all duration-300 fixed z-10 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-full flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Logo & User */}
          <div className={`h-16 flex items-center px-4 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!sidebarCollapsed ? (
              <>
                <Link to="/" className="text-xl font-bold text-[#FC427B]">FreelanceHub</Link>
                <button 
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FiChevronLeft size={20} className="text-gray-500" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FiChevronRight size={20} className="text-gray-500" />
                </button>
              </>
            )}
          </div>
          
          {/* User Info */}
          {!sidebarCollapsed && (
            <div className="px-5 py-3 mb-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#fff5f8] flex items-center justify-center text-[#FC427B] font-medium">
                  {username.slice(0, 1).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">@{username}</p>
                  <p className="text-xs text-gray-500">{userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="px-3 py-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center py-2 px-3 mb-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#fff5f8] text-[#FC427B]'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.text}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Links */}
        <div className="px-3 py-4">
          <Link
            to="/settings"
            className={`flex items-center py-2 px-3 mb-2 rounded-lg transition-colors 
              ${isActive('/settings') ? 'bg-[#fff5f8] text-[#FC427B]' : 'text-gray-600 hover:bg-gray-50'}
              ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <span className="mr-3"><FiSettings size={20} /></span>
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
          
          <Link
            to="/help"
            className={`flex items-center py-2 px-3 mb-4 rounded-lg transition-colors 
              ${isActive('/help') ? 'bg-[#fff5f8] text-[#FC427B]' : 'text-gray-600 hover:bg-gray-50'}
              ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <span className="mr-3"><FiAlertCircle size={20} /></span>
            {!sidebarCollapsed && <span>Help Center</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center py-2 px-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <span className="mr-3"><FiLogOut size={20} /></span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;