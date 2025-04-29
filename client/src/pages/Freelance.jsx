import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'
import { FiSearch } from 'react-icons/fi'

const categories = [
  { name: 'All Projects', count: 150 },
  { name: 'Web Development', count: 45 },
  { name: 'Mobile Apps', count: 32 },
  { name: 'UI/UX Design', count: 28 },
  { name: 'Content Writing', count: 25 },
  { name: 'Digital Marketing', count: 20 },
  { name: 'Digital ', count: 20 }
]

const projects = [
  {
    id: 1,
    title: 'Modern E-commerce Platform Development',
    description: 'Looking for a full-stack developer to build a scalable e-commerce platform with advanced features including payment integration, real-time analytics, and inventory management.',
    price: '4000',
    duration: '8 weeks',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    image: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1000&auto=format&fit=crop',
    postedDate: '2025-04-27',
    proposals: 12,
    // clientRating: 4.9,
    // clientCountry: '🇺🇸',
    verified: true
  },
  {
    id: 2,
    title: 'iOS Social Media App Development',
    description: 'Need an experienced mobile developer to create a social networking app with features like real-time messaging, media sharing, and location-based services.',
    price: '5500',
    duration: '12 weeks',
    skills: ['Swift', 'Firebase', 'WebRTC', 'CoreData'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop',
    postedDate: '2025-04-26',
    proposals: 8,
    // clientRating: 4.7,
    // clientCountry: '🇬🇧',
    verified: true
  },
  {
    id: 3,
    title: 'AI-Powered Content Management System',
    description: 'Seeking a developer to build a CMS with AI capabilities for content optimization, automated tagging, and smart content recommendations.',
    price: '6000',
    duration: '10 weeks',
    skills: ['Python', 'TensorFlow', 'Django', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop',
    postedDate: '2025-04-27',
    proposals: 15,
    // clientRating: 4.8,
    // clientCountry: '🇨🇦',
    verified: true
  }
]

const Freelance = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Projects')
  
  return (
    <>
      <Navbar/>
      <div className='min-h-screen bg-[#f5e8f8] '>
        {/* Hero Section */}
        <div className='w-full px-8 py-12 bg-[#a688d6]'>
          <div className='w-[1000px] mx-auto'>
            <h1 className='text-4xl font-bold text-black mb-4'>Find Your Next Project</h1>
            <p className='text-gray-600 text-lg mb-8'>
              {projects.length.toLocaleString()} available projects for talented freelancers
            </p>
            
            {/* Search Bar */}
            <div className='flex gap-4 mb-8'>
              <div className='flex-1 relative'>
                <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-700' size={20} />
                <input 
                  type="text"
                  placeholder="Search projects by skill or keyword"
                  className='w-full h-14 pl-12 pr-4 rounded-xl border-2 border-white/20 bg-white/10  placeholder-white/60 outline-none  focus:border-white/40 transition-all text-lg'
                />
              </div>
              <button className='px-8 py-2 bg-white text-[#8d4fff] rounded-xl font-semibold hover:bg-gray-100 transition-all'>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className='w-[1000px] mx-auto px-8 py-8'>
          {/* Categories */}
          <div className='flex gap-4 mb-8'>
            {categories.map((category, index) => (
              <button 
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                  selectedCategory === category.name 
                    ? 'bg-black text-white' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                <span>{category.name}</span>
                <span className='text-sm opacity-75'>({category.count})</span>
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className='space-y-6'>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Freelance