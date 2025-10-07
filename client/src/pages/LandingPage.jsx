import React, { useState } from 'react';
// import './App.css'; // You'll need to include Tailwind CSS

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">
                Collab-O
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {/* Find Talent Dropdown */}
                <div className="relative group">
                  <button className="text-gray-700 hover:text-[#FC427B] px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Find talent
                    <svg className="ml-1 w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <div className="py-6 px-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Browse Talent</h3>
                          <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-gray-600 hover:text-[#FC427B]">Web Development</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-[#FC427B]">Mobile Development</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-[#FC427B]">Design & Creative</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-[#FC427B]">Data Science</a></li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Success Stories</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Discover how teams work strategically and grow together.
                          </p>
                          <a href="#" className="text-sm text-[#FC427B]  font-medium">View all stories →</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Find Work Dropdown */}
                <div className="relative group">
                  <button className="text-gray-700 hover:text-[#FC427B] px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Find work
                    <svg className="ml-1 w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <div className="py-6 px-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">How to find work</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Learn about how to grow your independent career.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Featured resources</h3>
                          <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-gray-600 hover:text-[#FC427B]">How to Use Collab-O as a Freelancer</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-[#FC427B]">Grow Your Freelance Business</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Collab-O Dropdown */}
                <div className="relative group">
                  <button className="text-gray-700 hover:text-[#FC427B] px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Why Collab-O
                    <svg className="ml-1 w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <div className="py-6 px-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Success Stories</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        See what it's like to collaborate on Collab-O.
                      </p>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-600 hover:text-[#FC427B]">Reviews</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-[#FC427B]">Case Studies</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <a href="#" className="text-gray-700 hover:text-[#FC427B] px-3 py-2 text-sm font-medium transition-colors duration-200">
                  For enterprise
                </a>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-700 hover:text-[#FC427B] px-4 py-2 text-sm font-medium transition-colors duration-200">
                Log in
              </button>
              <button className="bg-[#FC427B] hover:bg-[#b85270] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Sign up
              </button>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Harish</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#FC427B] focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <a href="#" className="text-gray-700 hover:text-[#FC427B] block px-3 py-2 text-base font-medium">Find talent</a>
                <a href="#" className="text-gray-700 hover:text-[#FC427B] block px-3 py-2 text-base font-medium">Find work</a>
                <a href="#" className="text-gray-700 hover:text-[#FC427B] block px-3 py-2 text-base font-medium">Why Collab-O</a>
                <a href="#" className="text-gray-700 hover:text-[#FC427B] block px-3 py-2 text-base font-medium">For enterprise</a>
                <div className="pt-4 border-t">
                  <a href="#" className="text-gray-700 hover:text-[#FC427B] block px-3 py-2 text-base font-medium">Log in</a>
                  <a href="#" className="bg-[#FC427B] text-white block px-3 py-2 rounded-md text-base font-medium">Sign up</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative bg-black rounded-3xl overflow-hidden min-h-[600px] flex items-center justify-center">
            {/* Dot Pattern Background */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px'
                }}
              ></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 text-center">
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider">
                COLLAB-O
              </h1>
              <p className="mt-8 text-xl text-gray-300 max-w-2xl mx-auto">
                Connect with top freelancers and grow your business with professional collaboration
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#FC427B] hover:bg-[#b85270] text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200">
                  Find Talent
                </button>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200">
                  Start Freelancing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Collab-O?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The world's work marketplace where millions of businesses and independent professionals connect and collaborate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#FC427B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Talent</h3>
              <p className="text-gray-600">
                Access to millions of skilled freelancers across various industries and expertise levels
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Payments</h3>
              <p className="text-gray-600">
                Safe and secure payment processing with escrow protection for all transactions
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your projects completed quickly with our streamlined collaboration tools
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join millions of businesses and freelancers who trust Collab-O for their professional needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#FC427B] hover:bg-[#b85270] text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200">
                Get Started Today
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Collab-O</h3>
              <p className="text-gray-600">
                The world's work marketplace connecting businesses with independent professionals.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">For Clients</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">How to Hire</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">Talent Marketplace</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">Project Catalog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">For Talent</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">How to Find Work</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">Direct Contracts</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">Find Freelance Jobs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">Success Stories</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FC427B]">Reviews</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">© 2024 Collab-O. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;