import React, { useState } from 'react';

const initialFreelancer = {
  name: "John Doe",
  username: "harishb2006",
  title: "Full Stack Developer",
  location: "San Francisco, CA",
  hourlyRate: "$65/hr",
  rating: 4.8,
  totalJobs: 27,
  completionRate: 95,
  lastActive: "2025-05-10",
  profileImage: "https://randomuser.me/api/portraits/men/44.jpg",
  bio: "Full stack developer with 5+ years of experience in React, Node.js, and MongoDB. Specialized in building responsive web applications and e-commerce solutions.",
  skills: ["React", "Node.js", "JavaScript", "MongoDB", "AWS", "UI/UX Design"],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "University of California",
      year: "2018"
    }
  ],
  experience: [
    {
      title: "Senior Developer",
      company: "TechStart Inc.",
      period: "2020 - Present",
      description: "Lead developer for client projects, specializing in React applications."
    },
    {
      title: "Web Developer",
      company: "Digital Solutions",
      period: "2018 - 2020",
      description: "Built and maintained e-commerce websites and applications."
    }
  ],
  portfolio: [
    {
      title: "E-commerce Platform",
      description: "A full-featured online store with payment integration",
      image: "https://via.placeholder.com/150"
    },
    {
      title: "Portfolio Website",
      description: "Responsive portfolio website for a photographer",
      image: "https://via.placeholder.com/150"
    }
  ],
  currentProjects: 3,
  earnings: "$15,750",
};

const Profile = () => {
  const [freelancer, setFreelancer] = useState(initialFreelancer);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(freelancer);

  const handleEdit = () => {
    setEditData(freelancer);
    setEditMode(true);
  };

  const handleCancel = () => setEditMode(false);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Here you can call your backend API to update the data
    // await fetch(..., { method: 'PUT', body: JSON.stringify(editData) })
    setFreelancer(editData);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-[#FC427B] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center mb-8">
          <img
            src={freelancer.profileImage}
            alt={freelancer.name}
            className="w-32 h-32 rounded-full border-4 border-[#FC427B] object-cover mb-4 md:mb-0 md:mr-8"
          />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                {editMode ? (
                  <>
                    <input 
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                    />
                    <input 
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="username"
                      value={editData.username}
                      onChange={handleChange}
                    />
                    <input 
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="title"
                      value={editData.title}
                      onChange={handleChange}
                    />
                    <input 
                      className="border px-2 py-1 rounded mb-1 w-full"
                      name="location"
                      value={editData.location}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-[#FC427B]">{freelancer.name}</h2>
                    <p className="text-gray-500">@{freelancer.username}</p>
                    <div className="mt-2 text-[#FC427B] font-medium">{freelancer.title}</div>
                    <div className="flex items-center mt-1 text-gray-700 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {freelancer.location}
                    </div>
                  </>
                )}
              </div>
              {editMode ? (
                <div className="mt-4 md:mt-0 flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-[#FC427B] text-white px-4 py-2 rounded hover:bg-pink-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="mt-4 md:mt-0 bg-[#FC427B] text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
            {/* ...rest of profile (bio, stats, etc.) */}
            <div className="mt-4">
              <h2 className="text-lg font-bold text-[#FC427B] mb-1">About</h2>
              {editMode ? (
                <textarea
                  className="border px-2 py-1 rounded w-full"
                  name="bio"
                  value={editData.bio}
                  onChange={handleChange}
                  rows={3}
                />
              ) : (
                <p className="text-gray-700">{freelancer.bio}</p>
              )}
            </div>
          </div>
        </div>
        {/* You can add similar edit logic for other sections (skills, experience, education, etc.) */}
      </div>
    </div>
  );
};

export default Profile;