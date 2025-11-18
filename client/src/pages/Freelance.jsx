import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { buildApiUrl } from '../config/api';
import ProjectCard from '../components/ProjectCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const categories = [
  { name: 'All Projects', count: 0 },
  { name: 'Web Development', count: 0 },
  { name: 'Mobile Apps', count: 0 },
  { name: 'UI/UX Design', count: 0 },
  { name: 'Content Writing', count: 0 },
  { name: 'Digital Marketing', count: 0 },
  { name: 'Graphic Design', count: 0 },
];

const Freelance = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryCounts, setCategoryCounts] = useState(categories);
  const [loading, setLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // No authentication required to view projects
        const res = await fetch(buildApiUrl('/projects'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch projects: ${res.statusText} (${res.status})`);
        }

        const data = await res.json();
        setProjects(data.projects || data);

        // Calculate category counts
        let counts = { 'All Projects': 0 };
        data.forEach((p) => {
          counts[p.category] = (counts[p.category] || 0) + 1;
          counts['All Projects'] += 1;
        });
        setCategoryCounts(
          categories.map((cat) => ({
            ...cat,
            count: counts[cat.name] || 0,
          }))
        );
      } catch (err) {
        console.error('Error fetching projects:', err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Search and filter logic
  const filteredProjects = projects.filter((project) => {
    const matchCategory =
      selectedCategory === 'All Projects' || project.category === selectedCategory;

    const matchSearch =
      (project.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (project.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (project.requiredSkills?.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) || '');

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-white to-[#fff5f8] overflow-hidden py-16">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FC427B] opacity-10 rounded-bl-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-[#FC427B] opacity-5 rounded-tr-[100px]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover <span className="text-[#FC427B]">Premium</span> Projects
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              {projects.length > 0 ? projects.length.toLocaleString() : 'Exclusive'} opportunities for talented freelancers to showcase their expertise
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <FiSearch
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search projects by skill or keyword"
                className="w-full h-14 pl-12 pr-4 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FC427B] focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button 
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <span className="font-medium text-gray-700">
              Filter: <span className="text-[#FC427B]">{selectedCategory}</span>
            </span>
            <FiFilter size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories - Desktop */}
          <div className={`md:w-64 md:block ${showMobileFilter ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Categories</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {categoryCounts.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setShowMobileFilter(false);
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-[#fff5f8] text-[#FC427B] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      selectedCategory === category.name
                        ? 'bg-[#FC427B] bg-opacity-10 text-[#FC427B]'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-opacity-20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-[#FC427B] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="ml-4 text-gray-600 font-medium">Loading projects...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    {filteredProjects.length} {selectedCategory} Available
                  </h2>
                  <div className="text-sm text-gray-500">
                    Showing {filteredProjects.length} of {projects.length} projects
                  </div>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center">
                    <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-sm">
                      <FiSearch size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
                    <p className="text-gray-600">
                      We couldn't find any projects matching your search. Try adjusting your filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freelance;