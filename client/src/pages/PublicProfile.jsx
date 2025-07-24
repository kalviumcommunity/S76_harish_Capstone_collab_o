import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  FiExternalLink
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
      
      // Try to fetch the profile first
      let response = await fetch(`https://s76-harish-capstone-collab-o.onrender.com/api/profile/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        // If profile route doesn't exist or profile not found, create a basic profile from user data
        // For now, we'll show a message that the profile is not available
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
        stars.push(<FiStar key={i} className="text-yellow-500 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FiStar key={i} className="text-yellow-500 fill-current opacity-50" />);
      } else {
        stars.push(<FiStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const getSkillStatusColor = (status) => {
    switch (status) {
      case 'Expert': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Beginner': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-opacity-20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#fff5f8] rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#FC427B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Unavailable</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error || 'This freelancer has not set up their public profile yet.'}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate(-1)}
              className="block w-full px-6 py-3 bg-gradient-to-r from-[#FC427B] to-[#e03a6d] text-white rounded-lg hover:from-[#e03a6d] hover:to-[#d42e60] transition-all duration-300"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FC427B] rounded-full opacity-5 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FC427B] rounded-full opacity-5 translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-[#FC427B] transition-colors mr-4 font-medium"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Freelancer Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 mb-6">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-white text-5xl" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{profile.name || 'Freelancer'}</h2>
                <p className="text-lg text-indigo-600 font-medium">{profile.title || 'Professional'}</p>
                {profile.username && (
                  <p className="text-gray-600">@{profile.username}</p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {profile.userId?.email && (
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-3 text-[#FC427B]" />
                    <span>{profile.userId.email}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-3 text-[#FC427B]" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.hourlyRate && (
                  <div className="flex items-center text-gray-600">
                    <FiDollarSign className="mr-3 text-[#FC427B]" />
                    <span>${profile.hourlyRate}/hour</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {renderStars(profile.rating)}
                  </div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-bold text-gray-800">{profile.rating}/5</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FiBriefcase className="text-[#FC427B]" />
                  </div>
                  <p className="text-sm text-gray-600">Jobs</p>
                  <p className="font-bold text-gray-800">{profile.totalJobs}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">About</h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills & Assessments */}
            {(profile.skills?.length > 0 || profile.skillAssessments?.length > 0) && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Skills & Assessments</h3>
                
                {profile.skills?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-[#FC427B] bg-opacity-10 text-[#FC427B] rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.skillAssessments?.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Skill Assessments</h4>
                    <div className="space-y-3">
                      {profile.skillAssessments.map((assessment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h5 className="font-medium text-gray-800">{assessment.skill}</h5>
                            <p className="text-sm text-gray-600">
                              {assessment.score}/{assessment.totalQuestions} • {assessment.percentage}%
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillStatusColor(assessment.status)}`}>
                            {assessment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience */}
            {profile.experience?.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Experience</h3>
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800">{exp.title}</h4>
                      <p className="text-indigo-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-600 mb-2">{exp.period}</p>
                      {exp.description && (
                        <p className="text-gray-700">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education?.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Education</h3>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                      <p className="text-indigo-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-600">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {profile.portfolio?.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.portfolio.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
