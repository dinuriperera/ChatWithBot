import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaThermometerHalf, FaBox, FaShoppingCart, FaTrash, FaCheck, FaSearch, FaDownload } from 'react-icons/fa';
import Footer from '../Components/Footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
        const response = await axios.get('http://localhost:3001/api/components');
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
        toast.error('Failed to fetch components');
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  // Calculate total price whenever selected components change
  useEffect(() => {
    const total = Object.values(selectedComponents)
      .reduce((sum, component) => sum + (component ? Number(component.price) : 0), 0);
    setTotalPrice(total);
  }, [selectedComponents]);

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

  // Handle component selection
  const handleSelectComponent = (category, component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: component
    }));
  };

  // Handle component removal
  const handleRemoveComponent = (category) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: null
    }));
  };

  // Handle search input change
  const handleSearchChange = (category, value) => {
    setSearchQueries(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Handle brand filter change
  const handleBrandChange = (category, brand) => {
    setSelectedBrands(prev => ({
      ...prev,
      [category]: brand
    }));
  };

  // Save PC Build
  const handleSaveBuild = async () => {
    if (!buildName.trim()) {
      toast.error('Please enter a build name');
      return;
    }

    try {
      const buildData = {
        name: buildName,
        description: buildDescription,
        components: selectedComponents,
        totalPrice,
      };

      await axios.post('http://localhost:3001/api/pcbuilds', buildData);
      toast.success('PC Build saved successfully!');
      navigate('/profile'); // Redirect to profile or builds list
    } catch (error) {
      toast.error('Failed to save PC Build');
    }
  };

  // Add download CSV function
  const downloadBuildCSV = () => {
    if (Object.values(selectedComponents).filter(Boolean).length === 0) {
      toast.error('Please select at least one component before downloading');
      return;
    }

    // Create CSV header
    const headers = ['Category', 'Name', 'Brand', 'Price', 'Specifications'];
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...Object.entries(selectedComponents)
        .filter(([_, component]) => component)
        .map(([category, component]) => [
          category,
          `"${component.name}"`,
          component.brand,
          component.price,
          `"${component.specs}"`
        ].join(','))
    ].join('\n');

    // Add total price at the end
    const totalRow = `\nTotal Price,${totalPrice.toFixed(2)}`;
    const finalContent = csvContent + totalRow;

    // Create and trigger download
    const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${buildName || 'pc_build'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 pt-20 px-4">
        <div className="container mx-auto text-white text-center">
          Loading components...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 pt-20 px-4">
        <div className="container mx-auto text-red-400 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 mt-[100px]">
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
            {Object.keys(components).map((category) => (
              <div key={category} className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white capitalize flex items-center gap-2">
                    <span className="bg-indigo-500/20 p-2 rounded-lg">
                      {category === 'cpu' && <FaMicrochip />}
                      {category === 'ram' && <FaMemory />}
                      {category === 'ssd' && <FaHdd />}
                      {category === 'gpu' && <FaDesktop />}
                      {category === 'motherboard' && <FaMicrochip />}
                      {category === 'psu' && <FaBox />}
                      {category === 'case' && <FaBox />}
                      {category === 'cooling' && <FaThermometerHalf />}
                    </span>
                    {category.toUpperCase()}
                  </h2>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredComponents(category).map((component) => (
                    <div
                      key={component._id}
                      onClick={() => handleSelectComponent(category, component)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        selectedComponents[category]?._id === component._id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-black/20 border-indigo-500/20 text-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-white">{component.name}</h3>
                          <span className="text-xs text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-full">
                            {component.brand}
                          </span>
                        </div>
                        {selectedComponents[category]?._id === component._id && (
                          <span className="text-green-400">
                            <FaCheck />
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{component.specs}</p>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-indigo-400 font-semibold">${component.price}</p>
                        <p className="text-sm text-gray-400">Stock: {component.stock}</p>
                      </div>
                    </div>
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
                          {category === 'motherboard' && <FaMicrochip />}
                          {category === 'psu' && <FaBox />}
                          {category === 'case' && <FaBox />}
                          {category === 'cooling' && <FaThermometerHalf />}
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 capitalize">{category}</p>
                          <p className="text-sm font-medium text-white">{component.name}</p>
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
                  <span className="text-lg font-semibold text-white">Total Price</span>
                  <span className="text-2xl font-bold text-indigo-400">${totalPrice.toFixed(2)}</span>
                </div>

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
                    className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={downloadBuildCSV}
                      disabled={Object.values(selectedComponents).filter(Boolean).length === 0}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                        Object.values(selectedComponents).filter(Boolean).length === 0
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      <FaDownload />
                      <span>Download CSV</span>
                    </button>
                    <button
                      onClick={handleSaveBuild}
                      disabled={Object.values(selectedComponents).filter(Boolean).length === 0}
                      className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                        Object.values(selectedComponents).filter(Boolean).length === 0
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      <FaShoppingCart />
                      <span>Save Build</span>
                    </button>
                  </div>
                </div>
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