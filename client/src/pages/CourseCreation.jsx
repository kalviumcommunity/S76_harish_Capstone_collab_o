import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CourseCreation = () => {
  const [formData, setFormData] = useState({
    courseTitle: '',
    description: '',
    category: '',
    duration: '',
  })
  const navigate = useNavigate()

  const handleSubmitCourse = () => {
    navigate('/learning')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Course Created:', formData)
    handleSubmitCourse()
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c]">
      <Navbar />
      <div className="h-[2px] w-full bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA]" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-[700px] mx-auto bg-[#292727] rounded-lg shadow-2xl text-white p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-bold bg-gradient-to-r from-[#AB00EA] via-white to-[#AB00EA] bg-clip-text text-transparent">
              Create Your Course
            </h1>
            <p className="text-gray-400 mt-2">Provide the details below to create a new course</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Course Title */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Course Title</label>
              <input
                type="text"
                name="courseTitle"
                placeholder="Enter Course Title"
                value={formData.courseTitle}
                onChange={handleInputChange}
                className="w-full h-[50px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 focus:border-[#d6a3e9] transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Course Description</label>
              <textarea
                name="description"
                placeholder="Enter Course Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full h-[120px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 py-2 focus:border-[#d6a3e9] transition-all resize-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Category</label>
              <input
                type="text"
                name="category"
                placeholder="Enter Category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-[50px] bg-[#383838] text-white rounded-lg outline-none border-2 border-[#AB00EA] px-4 focus:border-[#d6a3e9] transition-all"
                required
              />
            </div>

           

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[60px] bg-[#AB00EA] text-white text-[18px] font-semibold rounded-lg hover:bg-[#b670cf] transition-all shadow-lg hover:shadow-xl active:transform active:scale-[0.99] mt-4"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CourseCreation