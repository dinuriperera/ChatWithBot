import React from 'react';
import { FaLaptop, FaShieldAlt, FaHeadset, FaTruck } from 'react-icons/fa';
import Footer from '../Components/Footer';
const About = () => {
  const features = [
    {
      icon: <FaLaptop className="w-8 h-8" />,
      title: "Premium Laptops",
      description: "Discover our curated selection of high-performance laptops from leading brands."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Every laptop undergoes rigorous testing to ensure premium quality and performance."
    },
    {
      icon: <FaHeadset className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Our expert team is always ready to assist you with any queries or concerns."
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick and secure delivery to your doorstep with real-time tracking."
    }
  ];

  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "500+", label: "Laptop Models" },
    { number: "50+", label: "Brands" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
    {/* Hero Section */}
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Explore the Future of Computing
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Your trusted destination for premium laptops and exceptional service
          </p>
          <div className="inline-flex space-x-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition duration-300 transform hover:scale-105">
              View Collection
            </button>
            <button className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-full transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-72 h-72 bg-purple-500 rounded-full opacity-10 -top-10 -left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10 -bottom-10 -right-10 animate-pulse delay-1000"></div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{stat.number}</div>
            <div className="text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Features Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
        <p className="text-gray-300">Experience excellence in every interaction</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition duration-300">
            <div className="text-purple-400 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Mission Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white/5 backdrop-blur-lg rounded-lg p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-300 text-lg mb-8">
            To provide our customers with the best computing solutions through carefully curated premium laptops, 
            exceptional service, and expert guidance. We strive to make technology accessible and empower users 
            to achieve their full potential.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition duration-300 transform hover:scale-105">
            Join Our Journey
          </button>
        </div>
      </div>
    </div>

    {/* Newsletter Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-200 mb-8">Subscribe to our newsletter for the latest updates and exclusive offers</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none focus:border-white/40 flex-grow max-w-md"
            />
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
};

export default About;
