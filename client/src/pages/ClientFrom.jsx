import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ClientForm = () => {
  const { id } = useParams(); // Get 'id' from the URL
  const navigate = useNavigate();

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

  // Fetch project details if 'id' is present
  useEffect(() => {
    if (id) {
      setIsEditMode(true); // We are in edit mode
      const fetchProjectDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setErrorMessage('Unauthorized: Please log in.');
            return;
          }

          const response = await fetch(`http://localhost:5000/projects/${id}`, {
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
            deadline: project.deadline ? project.deadline.split('T')[0] : '', // Format date
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
      setErrorMessage('Unauthorized: No token provided. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const url = isEditMode
        ? `http://localhost:5000/projects/update/${id}` // Update endpoint
        : 'http://localhost:5000/projects/create'; // Create endpoint

      const method = isEditMode ? 'PUT' : 'POST'; // Use PUT for update, POST for create

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          ...formData,
          requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()), // Convert to array
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

        // Redirect back to dashboard after a short delay
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
      <div className="bg-[#1c1c1c] min-h-screen ">
        <div className="h-[4px] w-full bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA]" />

        <div className="container ml-auto mr-auto flex justify-center px-4 py-8">
          <div className="flex gap-8">
            {/* Form Section */}
            <div className="flex w-[700px]">
              <div className="w-full bg-[#292727] rounded-lg p-8 shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h1 className="text-[28px] font-bold bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA] bg-clip-text text-transparent">
                    {isEditMode ? 'Edit Your Project' : 'Post Your Project'}
                  </h1>
                  <p className="text-gray-400 mt-2">
                    {isEditMode
                      ? 'Update the details of your project and save changes!'
                      : 'Fill in the details to post your project and attract collaborators!'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Success and Error Messages */}
                  {successMessage && (
                    <div className="bg-green-600 text-white text-center py-2 rounded">
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="bg-red-600 text-white text-center py-2 rounded">
                      {errorMessage}
                    </div>
                  )}

                  {/* Form Fields */}
                  {/* Title, Description, Price, Category, Required Skills, Deadline, Image */}
                  {/* Same as your current Form UI */}

                  {/* Submit Button */}
                      {/* Title */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Project Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter your project title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full h-[50px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 focus:border-[#d6a3e9] transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Project Description</label>
                    <textarea
                      name="description"
                      placeholder="Describe your project"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full h-[100px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 py-2 focus:border-[#d6a3e9] transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Price (in USD)</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Enter the price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full h-[50px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 focus:border-[#d6a3e9] transition-all"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full h-[50px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 focus:border-[#d6a3e9] transition-all"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="All Projects">All Projects</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Apps">Mobile Apps</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Content Writing">Content Writing</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Graphic Design">Graphic Design</option>
                    </select>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Required Skills</label>
                    <input
                      type="text"
                      name="requiredSkills"
                      placeholder="Enter skills (comma separated)"
                      value={formData.requiredSkills}
                      onChange={handleInputChange}
                      className="w-full h-[50px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 focus:border-[#d6a3e9] transition-all"
                      required
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full h-[50px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 focus:border-[#d6a3e9] transition-all"
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      placeholder="Enter image URL"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full h-[50px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 focus:border-[#d6a3e9] transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                

                  <button
                    type="submit"
                    className="w-full h-[50px] bg-[#AB00EA] text-white text-[16px] font-semibold rounded-lg hover:bg-[#b670cf] transition-all shadow-lg hover:shadow-xl active:transform active:scale-[0.99]"
                    disabled={loading}
                  >
                    {loading ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Project' : 'Submit Project')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientForm;






