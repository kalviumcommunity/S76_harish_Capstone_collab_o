import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { FiSearch } from 'react-icons/fi';

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

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          console.error('No token found. Please log in.');
          throw new Error('Unauthorized: No token provided.');
        }

        const res = await fetch('http://localhost:5000/projects/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
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
        setProjects([]); // Clear projects if the fetch fails
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
    <>
      <Navbar />
      <div className="min-h-screen bg-[#121112]">
        {/* Hero Section */}
        <div className="w-full px-8 py-12 bg-[#a688d6]">
          <div className="w-[1000px] mx-auto">
            <h1 className="text-4xl font-bold text-black mb-4">Find Your Next Project</h1>
            <p className="text-gray-600 text-lg mb-8">
              {projects.length.toLocaleString()} available projects for talented freelancers
            </p>

            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <FiSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search projects by skill or keyword"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-white/20 bg-white/10 placeholder-white/60 outline-none focus:border-white/40 transition-all text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[1000px] mx-auto px-8 py-8">
          {/* Categories */}
          <div className="flex gap-4 mb-8">
            {categoryCounts.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                  selectedCategory === category.name
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                <span>{category.name}</span>
                <span className="text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-lg text-gray-700 py-20">
              <svg
                className="mx-auto mb-4 animate-spin h-10 w-10 text-[#8d4fff]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Loading projects...
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProjects.length === 0 && (
                <div className="text-center text-gray-500 py-12">No projects found.</div>
              )}
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Freelance;