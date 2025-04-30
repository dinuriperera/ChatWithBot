import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-sm border-t border-purple-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">LaptopLane</h3>
            <p className="text-gray-300 mb-4">Your trusted destination for premium laptops and exceptional service.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-400 hover:text-purple-300"><FaFacebook className="h-6 w-6" /></a>
              <a href="#" className="text-purple-400 hover:text-purple-300"><FaTwitter className="h-6 w-6" /></a>
              <a href="#" className="text-purple-400 hover:text-purple-300"><FaInstagram className="h-6 w-6" /></a>
              <a href="#" className="text-purple-400 hover:text-purple-300"><FaLinkedin className="h-6 w-6" /></a>
              <a href="#" className="text-purple-400 hover:text-purple-300"><FaGithub className="h-6 w-6" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-purple-400">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-purple-400">About Us</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-purple-400">Products</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-purple-400">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <FaEnvelope className="h-5 w-5 mr-2 text-purple-400" />
                info@laptoplane.com
              </li>
              <li className="flex items-center text-gray-300">
                <FaPhone className="h-5 w-5 mr-2 text-purple-400" />
                +94 11 234 5678
              </li>
              <li className="flex items-center text-gray-300">
                <FaMapMarkerAlt className="h-5 w-5 mr-2 text-purple-400" />
                123 Main Street, Colombo, Sri Lanka
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-purple-900/50 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-purple-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 LaptopLane. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 