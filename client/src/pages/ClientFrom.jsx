import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjectDescriptionGenerator from '../components/ProjectDescriptionGenerator';
import { FiCalendar, FiDollarSign, FiUser, FiClock, FiList, FiTag, FiImage, FiFileText, FiInfo, FiCheck } from 'react-icons/fi';
import { buildApiUrl } from '../config/api';
import { projectCategories, getSkillsForCategory, generateProjectTips, validateProjectData } from '../utils/projectHelpers';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Current date and time from your input
  const currentDateTime = "2025-06-04 14:17:02";
  const currentUser = "harishb2006";

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    requiredSkills: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectTips, setProjectTips] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchProjectDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setErrorMessage('Unauthorized: Please log in.');
            return;
          }

          const response = await fetch(buildApiUrl(`/projects/${id}`), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Failed to fetch project details.');
          }

          const project = await response.json();
          setFormData({
            title: project.title || '',
            description: project.description || '',
            price: project.price || '',
            category: project.category || '',
            image: project.image || '',
            requiredSkills: project.requiredSkills ? project.requiredSkills.join(', ') : '',
            deadline: project.deadline ? project.deadline.split('T')[0] : '',
          });
        } catch (error) {
          console.error('Error fetching project details:', error.message);
          setErrorMessage(error.message || 'Failed to load project details.');
        }
      };

      fetchProjectDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Generate tips based on current form state
    const tips = generateProjectTips(newFormData);
    setProjectTips(tips);
    
    // Show skill suggestions when category changes
    if (name === 'category' && value) {
      setShowSkillSuggestions(true);
    }
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      const errors = validateProjectData(newFormData);
      setValidationErrors(errors);
    }
  };

  const handleAIDescriptionGenerated = (generatedDescription) => {
    const newFormData = { ...formData, description: generatedDescription };
    setFormData(newFormData);
    
    // Update tips after description is generated
    const tips = generateProjectTips(newFormData);
    setProjectTips(tips);
  };

  const handleSkillSuggestionClick = (skill) => {
    const currentSkills = formData.requiredSkills ? formData.requiredSkills.split(',').map(s => s.trim()) : [];
    if (!currentSkills.includes(skill)) {
      const newSkills = [...currentSkills, skill].join(', ');
      setFormData({ ...formData, requiredSkills: newSkills });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateProjectData(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setErrorMessage('Please fix the validation errors below');
      return;
    }
    
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    setValidationErrors([]);

    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('Unauthorized: No token provided. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const url = isEditMode
        ? buildApiUrl(`/projects/update/${id}`)
        : buildApiUrl('/projects/create');

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(isEditMode ? 'Project updated successfully!' : 'Project posted successfully!');
        if (!isEditMode) {
          setFormData({
            title: '',
            description: '',
            price: '',
            category: '',
            image: '',
            requiredSkills: '',
            deadline: '',
          });
        }

        setTimeout(() => navigate('/clientDashboard'), 2000);
      } else {
        setErrorMessage(result.message || 'Failed to submit project.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Error submitting project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Luxury Header */}
        <div className="relative bg-[#FC427B] overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-2/3 h-64 bg-white opacity-5 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
            <div className="absolute top-0 left-1/4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          </div>

          <div className="container mx-auto px-6 py-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {isEditMode ? 'Enhance Your Project' : 'Create New Project'}
                </h1>
                <p className="text-white text-opacity-90 mt-2">
                  {isEditMode
                    ? 'Update your project details to attract the right talent'
                    : 'Define your vision and find the perfect collaborators'}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 bg-white bg-opacity-10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white border-opacity-20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <FiUser className="text-white mr-2" />
                    <span className="text-white text-sm">{currentUser}</span>
                  </div>
                  <div className="h-4 w-px bg-white bg-opacity-30"></div>
                  <div className="flex items-center">
                    <FiClock className="text-white mr-2" />
                    <span className="text-white text-opacity-80 text-sm">{currentDateTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-6 pb-16 -mt-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              {/* Success and Error Messages */}
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-medium text-red-800">Please fix the following issues:</h4>
                  </div>
                  <ul className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                
                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <FiFileText className="text-[#FC427B]" />
                    Project Title
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter a descriptive title for your project"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="block w-full border-gray-300 rounded-lg py-3 px-4 placeholder-gray-400 focus:ring-[#FC427B] focus:border-[#FC427B] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <FiList className="text-[#FC427B]" />
                    Project Description
                  </label>
                  
                  {/* AI Description Generator */}
                  <ProjectDescriptionGenerator
                    onDescriptionGenerated={handleAIDescriptionGenerated}
                    currentTitle={formData.title}
                    currentCategory={formData.category}
                  />
                  
                  <div className="relative rounded-md shadow-sm">
                    <textarea
                      name="description"
                      placeholder="Provide a detailed description of your project requirements, or use AI to generate one above"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                      className="block w-full border-gray-300 rounded-lg py-3 px-4 placeholder-gray-400 focus:ring-[#FC427B] focus:border-[#FC427B] transition-all"
                      required
                    />
                  </div>
                </div>
                
                {/* Two-column layout for price and category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <FiDollarSign className="text-[#FC427B]" />
                      Budget (USD)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="price"
                        placeholder="Enter budget amount"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-lg py-3 px-4 placeholder-gray-400 focus:ring-[#FC427B] focus:border-[#FC427B] transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <FiTag className="text-[#FC427B]" />
                      Category
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:ring-[#FC427B] focus:border-[#FC427B] transition-all"
                        required
                      >
                        <option value="">Select project category</option>
                        {projectCategories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Skill Suggestions */}
                {showSkillSuggestions && formData.category && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FiInfo className="text-blue-600" />
                      <h4 className="font-medium text-blue-800">Suggested Skills for {formData.category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getSkillsForCategory(formData.category).map((skill, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSkillSuggestionClick(skill)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSkillSuggestions(false)}
                      className="text-sm text-blue-600 mt-2 hover:text-blue-700"
                    >
                      Hide suggestions
                    </button>
                  </div>
                )}

                {/* Project Tips */}
                {projectTips.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FiInfo className="text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Tips to improve your project</h4>
                    </div>
                    <ul className="space-y-1">
                      {projectTips.map((tip, index) => (
                        <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                          <FiCheck className="text-yellow-600 mt-0.5 flex-shrink-0" size={14} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Two-column layout for skills and deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Required Skills */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <FiList className="text-[#FC427B]" />
                      Required Skills
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="requiredSkills"
                        placeholder="e.g. React, Node.js, UI Design"
                        value={formData.requiredSkills}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-lg py-3 px-4 placeholder-gray-400 focus:ring-[#FC427B] focus:border-[#FC427B] transition-all"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Separate multiple skills with commas</p>
                  </div>

                  {/* Deadline */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <FiCalendar className="text-[#FC427B]" />
                      Project Deadline
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="block w-full border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:ring-[#FC427B] focus:border-[#FC427B] transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <FiImage className="text-[#FC427B]" />
                    Project Image (Optional)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="image"
                      placeholder="Enter image URL"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="block w-full border-gray-300 rounded-lg py-3 px-4 placeholder-gray-400 focus:ring-[#FC427B] focus:border-[#FC427B] transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Add a relevant image to make your project stand out</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#FC427B] hover:bg-[#e03a6d] text-white py-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditMode ? 'Updating Project...' : 'Creating Project...'}
                      </div>
                    ) : (
                      <span>{isEditMode ? 'Update Project' : 'Create Project'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientForm;