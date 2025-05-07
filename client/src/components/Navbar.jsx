import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Import AuthContext
import Cimg from '../assets/Rectangle 14.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Briefcase, ClipboardCheck, Users, Menu, LogOut, User, Settings, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userProfile, setIsAuthenticated, setUserProfile } = useContext(AuthContext); // Use context
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserProfile(null);
    setIsMenuOpen(false);
    navigate('/'); // Redirect to home or login page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLearningClick = () => navigate('/courseCreation');
  const handleFreeLanceClick = () => navigate('/freelance');
  const handleQuizClick = () => navigate('/modules');
  const handleFormClick = () => navigate('/clientDashBoard');
  const handleProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };
  const handleSettingsClick = () => {
    navigate('/settings');
    setIsMenuOpen(false);
  };

  const getUnderlineStyle = (path) => {
    return location.pathname === path
      ? 'underline decoration-[#9E00D7] underline-offset-4'
      : '';
  };

  return (
    <>
      <div className="bg-black h-[15px] w-full" />
      <div className="h-[90px] w-full bg-[#252323] flex items-center justify-between px-6">
        {/* Logo Section */}
        <div className="relative" onClick={() => navigate('/')}>
          <h1 className="text-black absolute ml-[12px] pt-[2px] font-semibold cursor-pointer">collab-o</h1>
          <img src={Cimg} alt="" className="h-[40px] w-[99px] cursor-pointer" />
        </div>

        {/* Navigation Links Section */}
        <div className="flex items-center justify-center flex-grow">
          <div className={`group relative mx-6 flex items-center`}>
            <h1
              className={`text-[#d6cdcd] text-[20px] cursor-pointer transition-all duration-300 hover:text-purple-500  flex items-center ${getUnderlineStyle(
                '/courseCreation'
              )}`}
              onClick={handleLearningClick}
            >
              <BookOpen size={18} className="mr-2" /> Learning
            </h1>
          </div>
          <div className={`group relative mx-6 flex items-center`}>
            <h1
              className={`text-[#d6cdcd] text-[20px] cursor-pointer  transition-all duration-300 hover:text-purple-500 flex items-center ${getUnderlineStyle(
                '/freelance'
              )}`}
              onClick={handleFreeLanceClick}
            >
              <Briefcase size={18} className="mr-2" /> Freelance
            </h1>
          </div>
          <div className={`group relative mx-6 flex items-center`}>
            <h1
              className={`text-[#d6cdcd] text-[20px] cursor-pointer transition-all duration-300 hover:text-purple-500  flex items-center ${getUnderlineStyle(
                '/modules'
              )}`}
              onClick={handleQuizClick}
            >
              <ClipboardCheck size={18} className="mr-2" /> Take quiz
            </h1>
          </div>
          <div className={`group relative mx-6 flex items-center`}>
            <h1
              className={`text-[#d6cdcd] text-[20px] cursor-pointer transition-all duration-300 hover:text-purple-500  flex items-center ${getUnderlineStyle(
                '/clientDashBoard'
              )}`}
              onClick={handleFormClick}
            >
              <Users size={18} className="mr-2" /> Hire
            </h1>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <button
                className="h-[40px] w-[80px] border-2 border-[#9E00D7] bg-white rounded-[5px] transition-all duration-300 ease-in-out hover:rounded-full font-semibold"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="text-[#d6cdcd] text-[20px] transition-all duration-300 hover:text-white"
                onClick={() => navigate('/signup')}
              >
                Signup
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="text-white p-2 rounded-full hover:bg-[#3a3838] transition-all"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-black ring-2 ring-[#9E00D7] ring-opacity-5 z-50">
                  <div className="py-2 px-3 border-b border-gray-">
                    <p className="text-sm font-medium text-gray-50">{userProfile?.name}</p>
                  </div>
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-50 hover:bg-gray-900"
                      role="menuitem"
                    >
                      <User size={16} className="mr-3 text-gray-500" />
                      Profile
                    </button>
                    <button
                      onClick={handleSettingsClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-50 hover:bg-gray-900"
                      role="menuitem"
                    >
                      <Settings size={16} className="mr-3 text-gray-500" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-900"
                      role="menuitem"
                    >
                      <LogOut size={16} className="mr-3 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;