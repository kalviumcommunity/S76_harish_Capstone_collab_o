import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Briefcase, ClipboardCheck, Users, Menu, LogOut, User, Settings, X, ChevronDown } from 'lucide-react';
import { AuthContext } from '../AuthContext'; // Ensure path is correct

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Access AuthContext with a fallback for safety
  const authContext = useContext(AuthContext);
  
  // Safely extract values with defaults
  const isAuthenticated = authContext?.isAuthenticated || false;
  const userProfile = authContext?.userProfile || {};
  const setIsAuthenticated = authContext?.setIsAuthenticated || (() => {});
  const setUserProfile = authContext?.setUserProfile || (() => {});
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  // Check local storage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Update username when userProfile changes
  useEffect(() => {
    if (userProfile && userProfile.name) {
      setUsername(userProfile.name);
    }
  }, [userProfile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    
    setIsAuthenticated(false);
    setUserProfile(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLearningClick = () => navigate('/courseCreation');
  const handleFreeLanceClick = () => navigate('/freelance');
  const handleQuizClick = () => navigate('/modules');
  const handleFormClick = () => navigate('/clientDashBoard');
  const handleDashboardClick = () => navigate('/freelancerDashboard');
  const handleProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };
  const handleSettingsClick = () => {
    navigate('/settings');
    setIsMenuOpen(false);
  };

  const getActiveStyle = (path) => {
    return location.pathname === path
      ? 'text-[#FC427B] font-semibold'
      : 'text-gray-800';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (username && username.length > 0) {
      return username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="h-10 w-10 bg-[#FC427B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="ml-2 text-gray-900 font-bold text-xl">collab-o</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleLearningClick}
              className={`flex items-center space-x-1 font-medium hover:text-[#FC427B] transition-colors ${getActiveStyle('/courseCreation')}`}
            >
              <BookOpen size={18} />
              <span>Learning</span>
            </button>

            <button 
              onClick={handleFreeLanceClick}
              className={`flex items-center space-x-1 font-medium hover:text-[#FC427B] transition-colors ${getActiveStyle('/freelance')}`}
            >
              <Briefcase size={18} />
              <span>Freelance</span>
            </button>

            <button 
              onClick={handleQuizClick}
              className={`flex items-center space-x-1 font-medium hover:text-[#FC427B] transition-colors ${getActiveStyle('/modules')}`}
            >
              <ClipboardCheck size={18} />
              <span>Take Quiz</span>
            </button>

            <button 
              onClick={handleFormClick}
              className={`flex items-center space-x-1 font-medium hover:text-[#FC427B] transition-colors ${getActiveStyle('/clientDashBoard')}`}
            >
              <Users size={18} />
              <span>Hire</span>
            </button>

            <button 
              onClick={handleDashboardClick}
              className={`flex items-center space-x-1 font-medium hover:text-[#FC427B] transition-colors ${getActiveStyle('/freelancerDashboard')}`}
            >
              <Users size={18} />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Authentication Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 text-gray-900 font-medium hover:text-[#FC427B] transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2 bg-[#FC427B] text-white rounded-lg font-medium shadow-sm hover:bg-[#e03a6d] transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="flex items-center space-x-2 text-gray-800 font-medium hover:text-[#FC427B] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#fff5f8] flex items-center justify-center">
                    <span className="text-[#FC427B] font-bold">
                      {getUserInitials()}
                    </span>
                  </div>
                  <span className="hidden lg:inline-block">{username || 'User'}</span>
                  <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{username || 'User'}</p>
                      <p className="text-sm text-gray-500">{userProfile?.email || 'user@example.com'}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User size={16} className="mr-3 text-gray-400" />
                        Profile
                      </button>
                      <button
                        onClick={handleSettingsClick}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings size={16} className="mr-3 text-gray-400" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-[#FC427B] hover:bg-gray-50"
                      >
                        <LogOut size={16} className="mr-3 text-[#FC427B]" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 hover:text-[#FC427B] transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  handleLearningClick();
                  toggleMobileMenu();
                }}
                className={`flex items-center space-x-2 py-2 ${getActiveStyle('/courseCreation')}`}
              >
                <BookOpen size={18} />
                <span>Learning</span>
              </button>

              <button
                onClick={() => {
                  handleFreeLanceClick();
                  toggleMobileMenu();
                }}
                className={`flex items-center space-x-2 py-2 ${getActiveStyle('/freelance')}`}
              >
                <Briefcase size={18} />
                <span>Freelance</span>
              </button>

              <button
                onClick={() => {
                  handleQuizClick();
                  toggleMobileMenu();
                }}
                className={`flex items-center space-x-2 py-2 ${getActiveStyle('/modules')}`}
              >
                <ClipboardCheck size={18} />
                <span>Take Quiz</span>
              </button>

              <button
                onClick={() => {
                  handleFormClick();
                  toggleMobileMenu();
                }}
                className={`flex items-center space-x-2 py-2 ${getActiveStyle('/clientDashBoard')}`}
              >
                <Users size={18} />
                <span>Hire</span>
              </button>

              <button
                onClick={() => {
                  handleDashboardClick();
                  toggleMobileMenu();
                }}
                className={`flex items-center space-x-2 py-2 ${getActiveStyle('/freelancerDashboard')}`}
              >
                <Users size={18} />
                <span>Freelancer Dashboard</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-4 py-2">
                  <button
                    onClick={() => {
                      navigate('/login');
                      toggleMobileMenu();
                    }}
                    className="py-2 text-center text-gray-900 border border-gray-200 rounded-lg font-medium"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      toggleMobileMenu();
                    }}
                    className="py-2 text-center bg-[#FC427B] text-white rounded-lg font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#fff5f8] flex items-center justify-center">
                      <span className="text-[#FC427B] font-bold">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{username || 'User'}</p>
                      <p className="text-sm text-gray-500">{userProfile?.email || 'user@example.com'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        handleProfileClick();
                        toggleMobileMenu();
                      }}
                      className="flex w-full items-center py-2 text-gray-700"
                    >
                      <User size={18} className="mr-3 text-gray-400" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        handleSettingsClick();
                        toggleMobileMenu();
                      }}
                      className="flex w-full items-center py-2 text-gray-700"
                    >
                      <Settings size={18} className="mr-3 text-gray-400" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="flex w-full items-center py-2 text-[#FC427B]"
                    >
                      <LogOut size={18} className="mr-3 text-[#FC427B]" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;