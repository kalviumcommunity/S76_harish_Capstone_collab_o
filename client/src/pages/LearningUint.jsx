import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const content = [
  {
    unit: 1,
    title: "Frontend Development Introduction",
    content: [
      "Frontend refers to the part of a website or web application that users interact with directly. It includes everything you see on the screen—buttons, text,",
      "images, layout, and design. Frontend development uses languages like HTML, CSS, and JavaScript, along",
      "with frameworks like React, Angular, or Vue.js to create responsive and interactive user interfaces."
    ]
  },
  {
    unit: 2,
    title: "HTML Basics",
    content: [
      "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.",
      "It defines the structure and layout of your web document using various tags and elements.",
      "HTML elements are represented by tags and browsers use these tags to render the content."
    ]
  }
]

const LearningUnit = () => {
  const [currentUnit, setCurrentUnit] = useState(0)

  const handleNext = () => {
    if (currentUnit < content.length - 1) {
      setCurrentUnit(currentUnit + 1)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* Learning Card */}
          <div className="relative">
            {/* Main Card */}
            <div className="relative bg-[#574b77] rounded-lg p-8 z-10">
              <h2 className="text-2xl mb-8">
                Learning unit {content[currentUnit].unit}
              </h2>

              {/* Content Paragraphs */}
              <div className="space-y-6">
                {content[currentUnit].content.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Navigation Button */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleNext}
                  className="bg-[#AB00EA] text-white px-12 py-3 rounded-md hover:bg-[#8d4fff] transition-all text-lg"
                >
                  next
                </button>
              </div>
            </div>

            {/* Purple Border Effect */}
            <div 
              className="absolute inset-0 bg-[#AB00EA] translate-x-[28px] translate-y-[28px] rounded-lg" 
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default LearningUnit