import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { Search, Star, ChevronLeft, ChevronRight, Code, Smartphone, Palette, PenTool, Video, Music, FileText, TrendingUp } from 'lucide-react'
import { AuthContext } from '../AuthContext'

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useContext(AuthContext);

  const handleSignup = () => {
    navigate('/signup')
  }

  // Carousel data
  const carouselSlides = [
    {
      id: 1,
      title: "Find the perfect freelance services for your business",
      subtitle: "Millions of people use FreelanceHub to turn their ideas into reality.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
      buttonText: "Get Started"
    },
    {
      id: 2,
      title: "The #1 Global Freelancing Platform",
      subtitle: "Connect with talented freelancers and grow your business.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      buttonText: "Hire Freelancers"
    },
    {
      id: 3,
      title: "Scale your professional workforce",
      subtitle: "Access talent for every business need.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      buttonText: "Find Talent"
    }
  ];

  // Project categories
  const categories = [
    { icon: Code, name: "Website Development", description: "Custom websites & web apps", color: "bg-blue-500" },
    { icon: Smartphone, name: "Mobile App Development", description: "iOS & Android apps", color: "bg-green-500" },
    { icon: Palette, name: "Graphic Design", description: "Logos, branding & design", color: "bg-purple-500" },
    { icon: PenTool, name: "UI/UX Design", description: "User interface design", color: "bg-pink-500" },
    { icon: Video, name: "Video & Animation", description: "Video editing & motion graphics", color: "bg-red-500" },
    { icon: Music, name: "Music & Audio", description: "Voice over & sound design", color: "bg-yellow-500" },
    { icon: FileText, name: "Content Writing", description: "Articles, blogs & copywriting", color: "bg-indigo-500" },
    { icon: TrendingUp, name: "Digital Marketing", description: "SEO, social media & ads", color: "bg-orange-500" }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      
      {/* Main Content */}
      <div>
        {/* Hero Carousel */}
        <div className="relative h-[500px] overflow-hidden">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative h-full bg-gradient-to-r from-gray-900/70 to-gray-900/50">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover -z-10"
                />
                <div className="container mx-auto px-6 h-full flex items-center">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-xl mb-8 opacity-90">{slide.subtitle}</p>
                    {!isAuthenticated && (
                      <button
                        onClick={handleSignup}
                        className="bg-[#FC427B] hover:bg-[#e03a6d] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                      >
                        {slide.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="container mx-auto px-6 -mt-8 relative z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="What service are you looking for today?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC427B] focus:border-transparent outline-none"
                />
              </div>
              <button className="bg-[#FC427B] hover:bg-[#e03a6d] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className={`inline-flex p-3 rounded-lg ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <category.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + item}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                    alt={`Project ${item}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Modern Website Design</h3>
                    <p className="text-gray-600 text-sm mb-4">Professional web design for your business</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span className="text-sm text-gray-600 ml-1">5.0 (120)</span>
                      </div>
                      <span className="text-lg font-bold text-[#FC427B]">Starting at $99</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="bg-[#FC427B] text-white py-16">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-xl mb-8 opacity-90">Join millions of people who use FreelanceHub to turn their ideas into reality.</p>
              <button
                onClick={handleSignup}
                className="bg-white text-[#FC427B] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started Today
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

export default LandingPage