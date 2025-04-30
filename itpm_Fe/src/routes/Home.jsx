import React, { useEffect, useState } from 'react';
import { FaLaptop, FaShieldAlt, FaHeadset, FaTruck, FaStar, FaArrowRight } from 'react-icons/fa';
import Footer from '../Components/Footer';
import Hero from '../assets/Images/Home/Group 276.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]); // ✅ Corrected: useState, not userState

  useEffect(() => {
    axios.get('http://localhost:3001/getusers') // Match the port 3001
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);
  
const [pcBuilds, setPcBuilds] = useState([]); // State for PC builds

useEffect(() => {
  try {
    axios.get('http://localhost:3001/getpcbuilds')
      .then(response => {
        setPcBuilds(response.data); // Corrected to setPcBuilds
      });
  } catch (error) {
    console.error('Error fetching pc builds:', error);
  }
}, []);


  const navigate = useNavigate();
  
  const handleSeeAll = () => {
    navigate('/product');
  };

  const handleChatWithBot = () => {
    window.location.href = 'http://localhost:3001'; // Navigate to the chatbot application running on port 3001
  };




  
  const featuredProducts = [
    {
      id: 1,
      name: "MacBook Pro M3",
      price: "$1999.99",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop",
      rating: 4.8,
      specs: "M3 Chip, 16GB RAM, 512GB SSD"
    },
    {
      id: 2,
      name: "Dell XPS 15",
      price: "$1799.99",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop",
      rating: 4.6,
      specs: "Intel i7, 32GB RAM, 1TB SSD"
    },
    {
      id: 3,
      name: "Lenovo ThinkPad X1",
      price: "$1599.99",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop",
      rating: 4.7,
      specs: "Intel i5, 16GB RAM, 256GB SSD"
    }
  ];

  const features = [
    {
      icon: <FaLaptop className="w-8 h-8" />,
      title: "Premium Selection",
      description: "Curated collection of high-performance laptops from leading brands"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Secure Shopping",
      description: "100% secure payment processing and data protection"
    },
    {
      icon: <FaHeadset className="w-8 h-8" />,
      title: "Expert Support",
      description: "24/7 technical support and customer service"
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping worldwide"
    }
  ];
  
  useEffect(() => {
    axios.get('http://localhost:8000/getUsers') // ensure the port matches backend
      .then(response => {
        setUsers(response.data); // <-- set state here
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute w-72 h-72 bg-purple-500 rounded-full opacity-10 -top-10 -left-10 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10 -bottom-10 -right-10 animate-pulse delay-1000"></div>
          <div className="absolute w-48 h-48 bg-pink-500 rounded-full opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
          <div className="absolute w-64 h-64 bg-indigo-500 rounded-full opacity-10 top-1/4 right-1/4 animate-pulse delay-1500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <div className="text-left animate-fade-in-up">
              <div className="inline-block mb-4">
                <span className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
                  AI-Powered Shopping Experience
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-fade-in-up">
                Find Your Perfect Laptop
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up delay-200">
                Discover premium laptops tailored to your needs with our AI-powered recommendation system
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl transition duration-300 transform hover:scale-105 font-medium text-lg shadow-lg hover:shadow-purple-500/25">
                  Shop Now
                </button>
                <button 
                  onClick={handleChatWithBot}
                  className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-xl transition duration-300 font-medium text-lg hover:shadow-lg hover:shadow-purple-500/25">
                  Chat with BOT
                </button>
              </div>
            </div>

            {/* Robot Image - Right Side */}
            <div className="relative w-full animate-fade-in-up delay-400">
              <div className="relative z-10">
                <img
                  src={Hero}
                  alt="AI Assistant"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-500 hover:rotate-1"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-pink-500 rounded-full opacity-20 animate-pulse delay-500"></div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-indigo-500 rounded-full opacity-20 animate-pulse delay-1500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products - with overflow effect */}
      <div className=" -mt-20 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="text-center mb-16 animate-fade-in-up">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        Featured Products
      </h2>
      <p className="text-gray-300">Discover our most popular laptop models</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProducts.map((product, index) => (
        <div 
          key={product.id} 
          className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/50 transform hover:scale-105 transition-all duration-300 shadow-xl animate-fade-in-up"
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <div className="relative">
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.rating} <FaStar className="inline-block ml-1" />
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
            <p className="text-gray-300 text-sm mb-2">{product.specs}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-purple-400">{product.price}</span>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center hover:shadow-lg hover:shadow-purple-500/25">
                Add to Cart
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="text-center mt-10">
      
    <button 
              onClick={handleSeeAll}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition duration-300 transform hover:scale-105 font-medium text-lg shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
            >
              See All
              <FaArrowRight className="text-sm" />
            </button>
    </div>
  </div>
</div>

{/* Features Section */}
<div className="bg-black/30 backdrop-blur-sm py-20 ">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16 animate-fade-in-up">
      <h2 className=" text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        Why Choose Us
      </h2>
      <p className="text-gray-300">Experience excellence in every interaction</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/50 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <div className="text-purple-400 mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
          <p className="text-gray-300">{feature.description}</p>
        </div>
      ))}
    </div>
    <div className="text-center mt-10">
      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25">
        See All Features
      </button>
    </div>
  </div>
</div>


      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 animate-fade-in-up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-200 mb-8">Subscribe to our newsletter for the latest updates and exclusive offers</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none focus:border-white/40 flex-grow max-w-md text-white placeholder-gray-300"
              />
              <button className="bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition duration-300 font-medium hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24">
        <Footer />
      </div>


      <div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td>{user.Name}</td>
          <td>{user.Email}</td>
          <td>{user.Role}</td>
          <td>{user.Status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


<div>
  <table>
    <thead>
      <tr>
        <th>category</th>
        <th>id</th>
        <th>name</th>
        <th>price</th>
        <th>specs</th>
        <th>brand</th>
      </tr>
    </thead>
    <tbody>
      {pcBuilds.map((pcBuild) => (
        <tr key={pcBuild._id}> {/* Corrected key */}
          <td>{pcBuild.category}</td> {/* Corrected property */}
          <td>{pcBuild.id}</td> {/* Corrected property */}
          <td>{pcBuild.name}</td> {/* Corrected property */}
          <td>{pcBuild.price}</td> {/* Corrected property */}
          <td>{pcBuild.specs}</td> {/* Corrected property */}
          <td>{pcBuild.brand}</td> {/* Corrected property */}
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </div>
  );
};

export default Home; 