import React, { useState, useEffect } from 'react';
import { FaFilter, FaStar, FaArrowRight, FaShoppingCart, FaChevronLeft, FaChevronRight, FaSearch, FaSort } from 'react-icons/fa';
import Footer from '../Components/Footer';
import Hero from '../assets/Images/Home/Group 276.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {
  console.log('Product component mounting...'); // Debug log

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect triggered'); // Debug log
    const fetchProducts = async () => {
      try {
        console.log('Attempting to fetch products from:', 'http://localhost:3001/api/inventory'); // Debug log
        const response = await axios.get('http://localhost:3001/api/inventory');
        console.log('API Response received:', response); // Debug log
        if (response.data) {
          console.log('Setting products:', response.data); // Debug log
          setProducts(response.data);
        } else {
          console.log('No data received from API'); // Debug log
          setError('No data received from server');
        }
      } catch (error) {
        console.error('Detailed error:', {
          message: error.message,
          response: error.response,
          status: error.response?.status
        });
        setError(error.message);
        toast.error('Failed to fetch products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log('Current state:', { products, isLoading, error }); // Debug log

  if (error) {
    console.log('Rendering error state'); // Debug log
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-8 max-w-md w-full text-center">
          <p className="text-red-400 text-lg mb-4">Error loading products</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('Rendering loading state'); // Debug log
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main content with products:', products); // Debug log
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">No products available</p>
            <p className="text-gray-500">Check back later for new products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/50 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <div className="relative">
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-400 mb-4">{product.specs}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-400">
                      ${product.price?.toFixed(2)}
                    </span>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
