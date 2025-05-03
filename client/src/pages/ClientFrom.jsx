import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const ClientForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '', 
    requiredSkills: '',
    deadline: '',
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('http://localhost:5000/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()), // Convert to array
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccessMessage('Project posted successfully!')
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          image: '',
          requiredSkills: '',
          deadline: '',
        })
      } else {
        setErrorMessage(result.message || 'Failed to post project.')
      }
    } catch (error) {
      setErrorMessage(error,'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const proposals = [
    {
      id: 1,
      freelancer: 'Alex Thompson',
      bid: '$480',
      timeStamp: '2025-04-29 10:55:24',
      status: 'Pending',
      avatar: 'https://via.placeholder.com/40',
      experience: '5 years',
      rating: 4.8
    },
    {
      id: 2,
      freelancer: 'Sarah Wilson',
      bid: '$520',
      timeStamp: '2025-04-29 10:30:15',
      status: 'Pending',
      avatar: 'https://via.placeholder.com/40',
      experience: '3 years',
      rating: 4.5
    }
  ]

  return (
    <>
      <Navbar />
      <div className="bg-[#1c1c1c] min-h-screen">
        <div className="h-[4px] w-full bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA]" />

        <div className="container ml-[360px] px-4 py-8">
          <div className="flex gap-8">
            {/* Form Section */}
            <div className="flex w-[700px]">
              <div className="w-full bg-[#292727] rounded-lg p-8 shadow-2xl text-white">
                <div className="text-center mb-8">
                  <h1 className="text-[28px] font-bold bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA] bg-clip-text text-transparent">
                    Post Your Project
                  </h1>
                  <p className="text-gray-400 mt-2">Fill in the details to post your project and attract collaborators!</p>
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
                    {loading ? 'Submitting...' : 'Submit Project'}
                  </button>
                </form>
              </div>
            </div>

            {/* Proposals Section */}
            <div className="w-[350px] bg-[#292727] h-fit rounded-lg shadow-2xl text-white">
              <div className="p-6 border-b border-[#383838]">
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA] bg-clip-text text-transparent">
                  Recent Proposals
                </h2>
              </div>

              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="bg-[#383838] p-4 rounded-lg hover:bg-[#424242] transition-all border border-[#AB00EA]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={proposal.avatar}
                          alt={proposal.freelancer}
                          className="w-10 h-10 rounded-full border-2 border-[#AB00EA]"
                        />
                        <div>
                          <h3 className="font-semibold text-white">{proposal.freelancer}</h3>
                          <p className="text-xs text-gray-400">{proposal.experience} experience</p>
                        </div>
                      </div>
                      <span className="text-[#AB00EA] font-bold">{proposal.bid}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-300">{proposal.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">{proposal.timeStamp}</span>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 py-2 px-3 bg-[#AB00EA] text-white text-sm rounded-lg hover:bg-[#b670cf] transition-all">
                        Accept
                      </button>
                      <button className="flex-1 py-2 px-3 border border-[#AB00EA] text-white text-sm rounded-lg hover:bg-[#4d4d4d] transition-all">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClientForm