import React from 'react'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About Us */}
        <div>
          <h3 className="text-xl font-semibold mb-3">About Us</h3>
          <p className="text-sm leading-relaxed">
            We're a freelance community connecting talented developers with opportunities to learn, earn, and grow. Our mission is to empower the next generation of tech professionals.
          </p>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">Email: <a href="mailto:contact@freelancehub.com" className="underline">contact@freelancehub.com</a></p>
          <p className="text-sm mt-1">Phone: +91 98765 43210</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
          
            <a href="#" className="text-white hover:text-purple-400"><FaTwitter /></a>
            <a href="#" className="text-white hover:text-purple-400"><FaLinkedinIn /></a>
            <a href="mailto:contact@freelancehub.com" className="text-white hover:text-purple-400"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} FreelanceHub. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
