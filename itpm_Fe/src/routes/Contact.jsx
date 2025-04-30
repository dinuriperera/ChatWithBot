import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import Footer from '../Components/Footer';

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "Email",
      details: "support@laptopstore.com",
      description: "Send us an email anytime"
    },
    {
      icon: <FaPhone className="w-6 h-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri, 9am-6pm"
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "Location",
      details: "123 Tech Street",
      description: "Silicon Valley, CA 94025"
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "Working Hours",
      details: "24/7 Support",
      description: "Always here to help"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute w-72 h-72 bg-purple-500 rounded-full opacity-10 -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10 -bottom-10 -right-10 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300">
              Get in touch with our team for any questions or support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/50 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-purple-400 mb-4">{info.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-lg font-medium text-purple-300 mb-1">{info.details}</p>
                <p className="text-gray-400">{info.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-900/50 animate-fade-in-up">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-white/5 border border-purple-900/50 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-3 transition-all duration-300"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-white/5 border border-purple-900/50 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-3 transition-all duration-300"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl bg-white/5 border border-purple-900/50 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-3 transition-all duration-300"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-white/5 border border-purple-900/50 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-3 transition-all duration-300"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  rows="4"
                  className="w-full rounded-xl bg-white/5 border border-purple-900/50 text-white shadow-sm focus:border-purple-400 focus:ring-purple-400 p-3 transition-all duration-300"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl transition duration-300 transform hover:scale-105 font-medium text-lg shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                Send Message
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-900/50 animate-fade-in-up">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.123456789!2d-122.123456789!3d37.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDA3JzM0LjQiTiAxMjLCsDA3JzM0LjQiVw!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[450px]"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default Contact; 