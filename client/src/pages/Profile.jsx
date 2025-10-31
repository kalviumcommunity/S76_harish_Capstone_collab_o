import React, { useEffect, useState } from "react";
import axios from "axios";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { buildApiUrl } from '../config/api';

const API_URL = buildApiUrl("/api/profile/me");
const TOKEN = localStorage.getItem("token");

const emptyProfile = {
  name: "",
  username: "",
  title: "",
  location: "",
  hourlyRate: "",
  rating: 0,
  totalJobs: 0,
  completionRate: 0,
  lastActive: "",
  profileImage: "",
  bio: "",
  skills: [],
  skillAssessments: [],
  education: [],
  experience: [],
  portfolio: [],
  currentProjects: 0,
  earnings: "",
};

const Profile = () => {
  const [freelancer, setFreelancer] = useState(emptyProfile);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        setFreelancer(res.data);
        setEditData(res.data);
      } catch (error) {
        console.error('Failed to load profile:', error);
        alert("Failed to load profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditData(freelancer);
    setEditMode(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert to Number for numeric fields
    if (["rating", "totalJobs", "completionRate", "currentProjects"].includes(name)) {
      setEditData({ ...editData, [name]: Number(value) });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  // Skills
  const handleSkillChange = (idx, value) => {
    const updated = [...editData.skills];
    updated[idx] = value;
    setEditData({ ...editData, skills: updated });
  };
  const addSkill = () =>
    setEditData({ ...editData, skills: [...editData.skills, ""] });
  const removeSkill = (idx) => {
    const updated = [...editData.skills];
    updated.splice(idx, 1);
    setEditData({ ...editData, skills: updated });
  };

  // Experience
  const handleExperienceChange = (idx, field, value) => {
    const updated = [...editData.experience];
    updated[idx][field] = value;
    setEditData({ ...editData, experience: updated });
  };
  const addExperience = () =>
    setEditData({
      ...editData,
      experience: [
        ...editData.experience,
        { title: "", company: "", period: "", description: "" },
      ],
    });
  const removeExperience = (idx) => {
    const updated = [...editData.experience];
    updated.splice(idx, 1);
    setEditData({ ...editData, experience: updated });
  };

  // Education
  const handleEducationChange = (idx, field, value) => {
    const updated = [...editData.education];
    updated[idx][field] = value;
    setEditData({ ...editData, education: updated });
  };
  const addEducation = () =>
    setEditData({
      ...editData,
      education: [
        ...editData.education,
        { degree: "", institution: "", year: "" },
      ],
    });
  const removeEducation = (idx) => {
    const updated = [...editData.education];
    updated.splice(idx, 1);
    setEditData({ ...editData, education: updated });
  };

  // Portfolio
  const handlePortfolioChange = (idx, field, value) => {
    const updated = [...editData.portfolio];
    updated[idx][field] = value;
    setEditData({ ...editData, portfolio: updated });
  };
  const addPortfolio = () =>
    setEditData({
      ...editData,
      portfolio: [
        ...editData.portfolio,
        { title: "", description: "", image: "" },
      ],
    });
  const removePortfolio = (idx) => {
    const updated = [...editData.portfolio];
    updated.splice(idx, 1);
    setEditData({ ...editData, portfolio: updated });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(API_URL, editData, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      setFreelancer(res.data);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert("Failed to save profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-opacity-20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card with glassmorphism */}
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8 animate-scaleIn">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FC427B]/5 via-purple-50/50 to-blue-50/50"></div>

          <div className="relative p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FC427B] to-purple-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={editData.profileImage || "https://via.placeholder.com/150"}
                  alt={editData.name}
                  className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    {editMode ? (
                  <>
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="name"
                      value={editData.name || ""}
                      onChange={handleChange}
                      placeholder="Name"
                    />
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="username"
                      value={editData.username || ""}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="title"
                      value={editData.title || ""}
                      onChange={handleChange}
                      placeholder="Title"
                    />
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="location"
                      value={editData.location || ""}
                      onChange={handleChange}
                      placeholder="Location"
                    />
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="profileImage"
                      value={editData.profileImage || ""}
                      onChange={handleChange}
                      placeholder="Profile Image URL"
                    />
                  </>
                    ) : (
                      <>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                          {freelancer.name}
                        </h1>
                        <p className="text-gray-500 font-medium mb-3">@{freelancer.username}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FC427B]/10 to-purple-100/50 rounded-full mb-3">
                          <span className="text-[#FC427B] font-semibold">{freelancer.title || 'Professional Freelancer'}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>{freelancer.location || 'Location not set'}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {editMode ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#FC427B] to-[#e03a6d] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#FC427B] to-[#e03a6d] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-8">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-gray-500 text-xs font-medium mb-1">Hourly Rate</div>
                    <div className="font-bold text-[#FC427B] text-lg">
                      {editMode ? (
                        <input className="border-b border-pink-200 px-1 w-16 text-center" name="hourlyRate" value={editData.hourlyRate || ""} onChange={handleChange} />
                      ) : (
                        freelancer.hourlyRate || '$0'
                      )}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-gray-500 text-xs font-medium mb-1">Rating</div>
                    <div className="font-bold text-[#FC427B] text-lg flex items-center justify-center gap-1">
                      {editMode ? (
                        <input className="border-b border-pink-200 px-1 w-12 text-center" name="rating" value={editData.rating || ""} onChange={handleChange} />
                      ) : (
                        <>
                          <svg className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                          {freelancer.rating || '0.0'}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-gray-500 text-xs font-medium mb-1">Total Jobs</div>
                    <div className="font-bold text-[#FC427B] text-lg">
                      {editMode ? (
                        <input className="border-b border-pink-200 px-1 w-12 text-center" name="totalJobs" value={editData.totalJobs || ""} onChange={handleChange} />
                      ) : (
                        freelancer.totalJobs || '0'
                      )}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-gray-500 text-xs font-medium mb-1">Completion</div>
                    <div className="font-bold text-green-600 text-lg">
                      {editMode ? (
                        <input className="border-b border-pink-200 px-1 w-12 text-center" name="completionRate" value={editData.completionRate || ""} onChange={handleChange} />
                      ) : (
                        `${freelancer.completionRate || 0}%`
                      )}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-gray-500 text-xs font-medium mb-1">Active</div>
                    <div className="font-bold text-blue-600 text-lg">
                      {editMode ? (
                        <input className="border-b border-pink-200 px-1 w-12 text-center" name="currentProjects" value={editData.currentProjects || ""} onChange={handleChange} />
                      ) : (
                        freelancer.currentProjects || '0'
                      )}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-gray-500 text-xs font-medium mb-1">Earnings</div>
                    <div className="font-bold text-[#FC427B] text-lg">
                      {editMode ? (
                        <input className="border-b border-pink-200 px-1 w-16 text-center" name="earnings" value={editData.earnings || ""} onChange={handleChange} />
                      ) : (
                        freelancer.earnings || '$0'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 animate-fadeIn border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-[#FC427B] to-purple-600 rounded-full"></span>
            About Me
          </h2>
          {editMode ? (
            <textarea
              className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC427B] focus:border-transparent transition-all"
              name="bio"
              value={editData.bio || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{freelancer.bio || 'No bio available yet.'}</p>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 animate-fadeIn border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-[#FC427B] to-purple-600 rounded-full"></span>
            Skills & Expertise
          </h2>
          {editMode ? (
            <div className="space-y-3">
              {editData.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="flex-1 border-2 border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC427B] focus:border-transparent"
                    value={skill}
                    onChange={(e) => handleSkillChange(idx, e.target.value)}
                    placeholder="Enter skill..."
                  />
                  <button
                    className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    onClick={() => removeSkill(idx)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-[#FC427B] to-[#e03a6d] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={addSkill}
                type="button"
              >
                + Add Skill
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {freelancer.skills && freelancer.skills.length > 0 ? (
                freelancer.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gradient-to-r from-[#FC427B]/10 to-purple-100/50 text-[#FC427B] rounded-full text-sm font-semibold border border-[#FC427B]/20 hover:shadow-md transition-shadow"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Skill Assessments */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#FC427B]">Skill Assessments</h2>
            <button
              onClick={() => window.location.href = '/modules'}
              className="text-sm text-[#FC427B] hover:text-[#e03a6d] font-semibold"
            >
              Take New Assessment
            </button>
          </div>
          
          {freelancer.skillAssessments && freelancer.skillAssessments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {freelancer.skillAssessments.map((assessment, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{assessment.skill}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assessment.status === 'Expert' ? 'bg-purple-100 text-purple-800' :
                      assessment.status === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                      assessment.status === 'Intermediate' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assessment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Score: {assessment.score}/{assessment.totalQuestions}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {assessment.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-[#FC427B] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${assessment.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Difficulty: {assessment.difficulty}</span>
                    <span>
                      {new Date(assessment.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-lg font-medium mb-2">No skill assessments yet</p>
              <p className="text-sm">Take your first assessment to showcase your skills!</p>
            </div>
          )}
        </div>
        {/* Experience & Education */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Experience */}
          <div className="bg-white rounded-xl shadow p-6 flex-1">
            <h2 className="text-lg font-bold text-[#FC427B] mb-2">Experience</h2>
            {editMode ? (
              <div>
                {editData.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="mb-4 border-b border-pink-100 pb-2"
                  >
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      value={exp.title}
                      onChange={(e) =>
                        handleExperienceChange(idx, "title", e.target.value)
                      }
                      placeholder="Title"
                    />
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      value={exp.company}
                      onChange={(e) =>
                        handleExperienceChange(idx, "company", e.target.value)
                      }
                      placeholder="Company"
                    />
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      value={exp.period}
                      onChange={(e) =>
                        handleExperienceChange(idx, "period", e.target.value)
                      }
                      placeholder="Period"
                    />
                    <textarea
                      className="border px-2 py-1 rounded mb-1 w-full"
                      value={exp.description}
                      onChange={(e) =>
                        handleExperienceChange(idx, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                    <button
                      className="text-red-500 font-bold"
                      onClick={() => removeExperience(idx)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="bg-[#FC427B] text-white px-3 py-1 rounded"
                  onClick={addExperience}
                  type="button"
                >
                  Add Experience
                </button>
              </div>
            ) : (
              freelancer.experience.map((exp, i) => (
                <div
                  key={i}
                  className={
                    i !== 0 ? "mt-4 pt-4 border-t border-pink-100" : ""
                  }
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {exp.title}
                    </span>
                    <span className="text-[#FC427B] text-sm">{exp.period}</span>
                  </div>
                  <div className="text-gray-500 text-sm">{exp.company}</div>
                  <div className="text-gray-700 text-sm mt-1">
                    {exp.description}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Education */}
          <div className="bg-white rounded-xl shadow p-6 flex-1">
            <h2 className="text-lg font-bold text-[#FC427B] mb-2">Education</h2>
            {editMode ? (
              <div>
                {editData.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="mb-4 border-b border-pink-100 pb-2"
                  >
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      value={edu.degree}
                      onChange={(e) =>
                        handleEducationChange(idx, "degree", e.target.value)
                      }
                      placeholder="Degree"
                    />
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      value={edu.institution}
                      onChange={(e) =>
                        handleEducationChange(
                          idx,
                          "institution",
                          e.target.value
                        )
                      }
                      placeholder="Institution"
                    />
                    <input
                      className="border px-2 py-1 rounded mb-1 w-full"
                      value={edu.year}
                      onChange={(e) =>
                        handleEducationChange(idx, "year", e.target.value)
                      }
                      placeholder="Year"
                    />
                    <button
                      className="text-red-500 font-bold"
                      onClick={() => removeEducation(idx)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="bg-[#FC427B] text-white px-3 py-1 rounded"
                  onClick={addEducation}
                  type="button"
                >
                  Add Education
                </button>
              </div>
            ) : (
              freelancer.education.map((edu, i) => (
                <div
                  key={i}
                  className={
                    i !== 0 ? "mt-4 pt-4 border-t border-pink-100" : ""
                  }
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {edu.degree}
                    </span>
                    <span className="text-[#FC427B] text-sm">{edu.year}</span>
                  </div>
                  <div className="text-gray-500 text-sm">{edu.institution}</div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Portfolio */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-[#FC427B] mb-4">Portfolio</h2>
          {editMode ? (
            <div>
              {editData.portfolio.map((item, idx) => (
                <div key={idx} className="mb-4 border-b border-pink-100 pb-2">
                  <input
                    className="border px-2 py-1 rounded mb-1 w-full"
                    value={item.title}
                    onChange={(e) =>
                      handlePortfolioChange(idx, "title", e.target.value)
                    }
                    placeholder="Project Title"
                  />
                  <input
                    className="border px-2 py-1 rounded mb-1 w-full"
                    value={item.description}
                    onChange={(e) =>
                      handlePortfolioChange(idx, "description", e.target.value)
                    }
                    placeholder="Description"
                  />
                  <input
                    className="border px-2 py-1 rounded mb-1 w-full"
                    value={item.image}
                    onChange={(e) =>
                      handlePortfolioChange(idx, "image", e.target.value)
                    }
                    placeholder="Image URL"
                  />
                  <button
                    className="text-red-500 font-bold"
                    onClick={() => removePortfolio(idx)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="bg-[#FC427B] text-white px-3 py-1 rounded"
                onClick={addPortfolio}
                type="button"
              >
                Add Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {freelancer.portfolio.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-[#FC427B] text-base">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;