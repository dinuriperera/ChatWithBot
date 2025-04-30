import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaThermometerHalf, FaBox, FaShoppingCart, FaTrash, FaCheck, FaSearch } from 'react-icons/fa';
import Footer from '../Components/Footer';
import axios from 'axios';

const PCBuilder = () => {
  const navigate = useNavigate();
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: null,
    ram: null,
    ssd: null,
    gpu: null,
    motherboard: null,
    psu: null,
    case: null,
    cooling: null
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [buildName, setBuildName] = useState('');
  const [buildDescription, setBuildDescription] = useState('');
  const [searchQueries, setSearchQueries] = useState({
    cpu: '',
    ram: '',
    ssd: '',
    gpu: '',
    motherboard: '',
    psu: '',
    case: '',
    cooling: ''
  });
  const [selectedBrands, setSelectedBrands] = useState({
    cpu: 'all',
    ram: 'all',
    ssd: 'all',
    gpu: 'all',
    motherboard: 'all',
    psu: 'all',
    case: 'all',
    cooling: 'all'
  });

  const [components, setComponents] = useState({
    cpu: [],
    ram: [],
    ssd: [],
    gpu: [],
    motherboard: [],
    psu: [],
    case: [],
    cooling: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch components from backend
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/getpcbuilds');
        const data = response.data;
        
        // Organize components by category
        const newComponents = {
          cpu: data.filter(item => item.category === 'cpu'),
          ram: data.filter(item => item.category === 'ram'),
          ssd: data.filter(item => item.category === 'ssd'),
          gpu: data.filter(item => item.category === 'gpu'),
          motherboard: data.filter(item => item.category === 'motherboard'),
          psu: data.filter(item => item.category === 'psu'),
          case: data.filter(item => item.category === 'case'),
          cooling: data.filter(item => item.category === 'cooling')
        };
        
        setComponents(newComponents);
        setError(null);
      } catch (err) {
        console.error('Error fetching components:', err);
        setError('Failed to fetch components. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  // Get unique brands for each category
  const getBrands = (category) => {
    return ['all', ...new Set(components[category].map(item => item.brand))];
  };

  // Filter components based on search query and selected brand
  const getFilteredComponents = (category) => {
    return components[category].filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQueries[category].toLowerCase()) ||
                          item.specs.toLowerCase().includes(searchQueries[category].toLowerCase());
      const matchesBrand = selectedBrands[category] === 'all' || item.brand === selectedBrands[category];
      return matchesSearch && matchesBrand;
    });
  };

  // Calculate total price whenever components change
  useEffect(() => {
    const total = Object.values(selectedComponents).reduce((sum, component) => {
      return sum + (component ? component.price : 0);
    }, 0);
    setTotalPrice(total);
  }, [selectedComponents]);

  const handleComponentSelect = (category, component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: component
    }));
  };

  const handleRemoveComponent = (category) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const handleSearchChange = (category, value) => {
    setSearchQueries(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleBrandChange = (category, value) => {
    setSelectedBrands(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleOrder = async () => {
    try {
      const order = {
        buildName,
        buildDescription,
        components: selectedComponents,
        totalPrice,
        status: 'Processing'
      };

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      await axios.post('http://localhost:3001/api/pcbuilds', order, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/profile?tab=orders');
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    }
  };

  const isBuildComplete = () => {
    return Object.values(selectedComponents).every(component => component !== null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading components...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 mb-4">
            Custom PC Builder
          </h1>
          <p className="text-gray-300 text-lg">
            Select your components and build your dream PC
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(components).map(([category]) => (
              <div key={category} className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white capitalize">{category}</h2>
                  {selectedComponents[category] && (
                    <button
                      onClick={() => handleRemoveComponent(category)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                {/* Search and Brand Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Search ${category}...`}
                      value={searchQueries[category]}
                      onChange={(e) => handleSearchChange(category, e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-black/20 border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <select
                    value={selectedBrands[category]}
                    onChange={(e) => handleBrandChange(category, e.target.value)}
                    className="px-4 py-2 bg-black/20 border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer hover:bg-black/30 transition-colors duration-200"
                  >
                    {getBrands(category).map(brand => (
                      <option key={brand} value={brand} className="bg-gray-900 text-white">
                        {brand === 'all' ? 'All Brands' : brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredComponents(category).map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleComponentSelect(category, item)}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        selectedComponents[category]?._id === item._id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-black/20 border-indigo-500/20 text-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      <div className="text-left">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <span className="text-xs text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-full">
                            {item.brand}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{item.specs}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-indigo-400 font-semibold">${item.price.toFixed(2)}</p>
                          {selectedComponents[category]?._id === item._id && (
                            <span className="text-green-400">
                              <FaCheck />
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Build Summary */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Build Summary</h2>
              
              <div className="space-y-4 mb-6">
                {Object.entries(selectedComponents).map(([category, component]) => (
                  component && (
                    <div key={category} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-lg">
                          {category === 'cpu' && <FaMicrochip />}
                          {category === 'ram' && <FaMemory />}
                          {category === 'ssd' && <FaHdd />}
                          {category === 'gpu' && <FaDesktop />}
                          {category === 'motherboard' && <FaBox />}
                          {category === 'psu' && <FaThermometerHalf />}
                          {category === 'case' && <FaBox />}
                          {category === 'cooling' && <FaThermometerHalf />}
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 capitalize">{category}</p>
                          <p className="text-sm font-medium">{component.name}</p>
                          <p className="text-xs text-indigo-400">{component.brand}</p>
                        </div>
                      </div>
                      <p className="text-indigo-400">${component.price}</p>
                    </div>
                  )
                ))}
              </div>

              <div className="border-t border-indigo-500/20 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-semibold">Total Price</span>
                  <span className="text-2xl font-bold text-indigo-400">${totalPrice.toFixed(2)}</span>
                </div>

                {isBuildComplete() ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name your build"
                      value={buildName}
                      onChange={(e) => setBuildName(e.target.value)}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                      placeholder="Add a description (optional)"
                      value={buildDescription}
                      onChange={(e) => setBuildDescription(e.target.value)}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                    />
                    <button
                      onClick={handleOrder}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart />
                      <span>Order Build</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <p>Select all components to complete your build</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PCBuilder; 