import React from 'react';

const Profile = ({ onEdit }) => {
  // Mock data - this would typically come from an API or database
  const freelancer = {
    name: "John Doe",
    username: "harishb2006",
    title: "Full Stack Developer",
    location: "San Francisco, CA",
    hourlyRate: "$65/hr",
    rating: 4.8,
    totalJobs: 27,
    completionRate: 95,
    lastActive: "2025-05-10", // Current date
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

  return (
    <div className="min-h-screen bg-[#1c1c1c]">
      {/* Dashboard Header */}
      {/* <div className="bg-gradient-to-r from-[#AB00EA] to-[#8900ba] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Last updated: {freelancer.lastActive}</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#383838] text-white">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-[#292727] rounded-xl shadow-md overflow-hidden">
              <div className="p-6 bg-[#AB00EA] text-white text-center">
                <img 
                  src={freelancer.profileImage} 
                  alt={freelancer.name} 
                  className="w-32 h-32 rounded-full border-4 border-white mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold">{freelancer.name}</h2>
                <p className="text-white opacity-80">@{freelancer.username}</p>
                <p className="mt-1 text-xl font-medium">{freelancer.title}</p>
                <div className="flex items-center justify-center mt-2">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{freelancer.location}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Hourly Rate</span>
                  <span className="font-bold text-white">{freelancer.hourlyRate}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Rating</span>
                  <div className="flex items-center">
                    <span className="font-bold text-white mr-1">{freelancer.rating}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(freelancer.rating) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Jobs Completed</span>
                  <span className="font-bold text-white">{freelancer.totalJobs}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Completion Rate</span>
                  <span className="font-bold text-white">{freelancer.completionRate}%</span>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap">
                    {freelancer.skills.map((skill, index) => (
                      <span key={index} className="bg-[#383838] text-white rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={onEdit}
                  className="mt-6 w-full bg-[#AB00EA] hover:bg-[#8900ba] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
            
            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-[#292727] rounded-xl shadow-md p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-[#383838] text-[#AB00EA]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Active Projects</p>
                    <p className="text-xl font-semibold text-white">{freelancer.currentProjects}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#292727] rounded-xl shadow-md p-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-[#383838] text-[#AB00EA]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                    <p className="text-xl font-semibold text-white">{freelancer.earnings}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            {/* Bio */}
            <div className="bg-[#292727] rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300">{freelancer.bio}</p>
            </div>
            
            {/* Experience */}
            <div className="bg-[#292727] rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Experience</h2>
              {freelancer.experience.map((exp, index) => (
                <div key={index} className={`${index !== 0 ? 'mt-6 pt-6 border-t border-[#383838]' : ''}`}>
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-white">{exp.title}</h3>
                    <span className="text-[#AB00EA] font-medium">{exp.period}</span>
                  </div>
                  <p className="text-gray-400 mt-1">{exp.company}</p>
                  <p className="text-gray-300 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
            
            {/* Education */}
            <div className="bg-[#292727] rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Education</h2>
              {freelancer.education.map((edu, index) => (
                <div key={index} className={`${index !== 0 ? 'mt-6 pt-6 border-t border-[#383838]' : ''}`}>
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-white">{edu.degree}</h3>
                    <span className="text-[#AB00EA] font-medium">{edu.year}</span>
                  </div>
                  <p className="text-gray-400 mt-1">{edu.institution}</p>
                </div>
              ))}
            </div>
            
            {/* Portfolio */}
            <div className="bg-[#292727] rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-white mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {freelancer.portfolio.map((item, index) => (
                  <div key={index} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                    <div className="absolute inset-0 bg-[#AB00EA] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="bg-white text-[#AB00EA] px-4 py-2 rounded-lg font-medium shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;