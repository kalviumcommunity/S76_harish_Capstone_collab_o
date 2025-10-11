import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buildApiUrl } from '../config/api';
import { 
  FiArrowLeft, 
  FiMail, 
  FiMapPin, 
  FiDollarSign, 
  FiStar, 
  FiBriefcase, 
  FiAward,
  FiUser,
  FiCalendar,
  FiExternalLink,
  FiTrendingUp
} from 'react-icons/fi';

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      
      let response = await fetch(buildApiUrl(`/api/profile/${userId}`));
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        setError('Profile not available yet. The user may not have completed their profile setup.');
      } else {
        throw new Error('Unable to load profile');
      }
    } catch (err) {
      setError(err.message || 'Unable to load profile');
      toast.error('Unable to load profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<FiStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const getSkillStatusColor = (status) => {
    switch (status) {
      case 'Expert': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Intermediate': return 'bg-green-100 text-green-800 border-green-200';
      case 'Beginner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FC427B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Unavailable</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error || 'This freelancer has not set up their public profile yet.'}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate(-1)}
              className="block w-full px-6 py-3 bg-[#FC427B] text-white rounded-lg hover:bg-[#e03a6d] transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-[#FC427B] transition-colors font-medium"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Public Profile</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sticky top-8">
              {/* Profile Image & Basic Info */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name} 
                      className="w-full h-full rounded-full object-cover border-4 border-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FC427B] to-[#e03a6d] flex items-center justify-center">
                      <FiUser className="text-white text-4xl" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.name || 'Freelancer'}
                </h2>
                <p className="text-lg text-[#FC427B] font-medium mb-2">
                  {profile.title || 'Professional'}
                </p>
                {profile.username && (
                  <p className="text-gray-500 text-sm">@{profile.username}</p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {renderStars(profile.rating || 0)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{profile.rating || 0}/5</p>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                {profile.userId?.email && (
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-3 text-[#FC427B] w-5 h-5" />
                    <span className="text-sm">{profile.userId.email}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-3 text-[#FC427B] w-5 h-5" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                {profile.hourlyRate && (
                  <div className="flex items-center text-gray-600">
                    <FiDollarSign className="mr-3 text-[#FC427B] w-5 h-5" />
                    <span className="text-sm font-semibold">${profile.hourlyRate}/hour</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FiBriefcase className="text-[#FC427B] w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{profile.totalJobs || 0}</p>
                  <p className="text-sm text-gray-500">Jobs Completed</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FiTrendingUp className="text-[#FC427B] w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{profile.completionRate || 0}%</p>
                  <p className="text-sm text-gray-500">Success Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {profile.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="mr-2 text-[#FC427B]" />
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills Section */}
            {profile.skills?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiAward className="mr-2 text-[#FC427B]" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-[#FC427B]/10 text-[#FC427B] rounded-full text-sm font-medium border border-[#FC427B]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Assessments */}
            {profile.skillAssessments?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiAward className="mr-2 text-[#FC427B]" />
                  Skill Assessments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.skillAssessments.map((assessment, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{assessment.skill}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getSkillStatusColor(assessment.status)}`}>
                          {assessment.status}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl font-bold text-gray-900 mr-2">
                          {assessment.percentage || Math.round((assessment.score / assessment.totalQuestions) * 100)}%
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (assessment.percentage || Math.round((assessment.score / assessment.totalQuestions) * 100)) >= 90 ? 'bg-purple-500' :
                              (assessment.percentage || Math.round((assessment.score / assessment.totalQuestions) * 100)) >= 75 ? 'bg-blue-500' :
                              (assessment.percentage || Math.round((assessment.score / assessment.totalQuestions) * 100)) >= 60 ? 'bg-green-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${assessment.percentage || Math.round((assessment.score / assessment.totalQuestions) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Score: {assessment.score}/{assessment.totalQuestions}</div>
                        <div>Difficulty: {assessment.difficulty}</div>
                        <div>Completed: {new Date(assessment.completedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {profile.experience?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiBriefcase className="mr-2 text-[#FC427B]" />
                  Experience
                </h3>
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-[#FC427B] pl-6 pb-6">
                      <h4 className="font-semibold text-gray-900 text-lg">{exp.title}</h4>
                      <p className="text-[#FC427B] font-medium mb-1">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-3 flex items-center">
                        <FiCalendar className="mr-1 w-4 h-4" />
                        {exp.period}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {profile.education?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiAward className="mr-2 text-[#FC427B]" />
                  Education
                </h3>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-[#FC427B] font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <FiCalendar className="mr-1 w-4 h-4" />
                        {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Section */}
            {profile.portfolio?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiExternalLink className="mr-2 text-[#FC427B]" />
                  Portfolio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.portfolio.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                        {item.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!profile.bio && !profile.skills?.length && !profile.skillAssessments?.length && 
             !profile.experience?.length && !profile.education?.length && !profile.portfolio?.length && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Under Construction</h3>
                <p className="text-gray-600">This freelancer is still setting up their profile. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;