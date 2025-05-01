import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventoryService';
import { toast } from 'react-toastify';
import { FaSearch, FaPlus, FaImage, FaFilter, FaSort, FaTimes } from 'react-icons/fa';
import axios from 'axios';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white p-8 bg-red-900/30 rounded-lg border border-red-500/50 max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-4 text-red-300">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    specs: '',
    stock: '',
    image: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    category: '',
    price: '',
    specs: '',
    stock: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const fetchInventoryData = async () => {
    try {
      console.log('Starting to fetch inventory data...');
      setLoading(true);
      setError(null);

      const response = await inventoryService.getAllItems();
      console.log('Response from server:', response);

      if (!response) {
        throw new Error('No data received from server');
      }

      setData(response);
      console.log('Data set successfully:', response);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError(error.message || 'Failed to fetch products');
      toast.error(`Error loading products: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Component mounted, fetching data...');
    fetchInventoryData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        toast.error('Error reading image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!newProduct.name.trim()) {
      errors.name = 'Product name is required';
    } else if (newProduct.name.length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    } else if (newProduct.name.length > 100) {
      errors.name = 'Product name must be less than 100 characters';
    }

    // Category validation
    if (!newProduct.category.trim()) {
      errors.category = 'Category is required';
    } else if (newProduct.category.length < 2) {
      errors.category = 'Category must be at least 2 characters';
    }

    // Price validation
    if (!newProduct.price) {
      errors.price = 'Price is required';
    } else if (isNaN(newProduct.price) || Number(newProduct.price) <= 0) {
      errors.price = 'Price must be a positive number';
    } else if (Number(newProduct.price) > 1000000) {
      errors.price = 'Price must be less than $1,000,000';
    }

    // Specs validation
    if (!newProduct.specs.trim()) {
      errors.specs = 'Specifications are required';
    } else if (newProduct.specs.length < 10) {
      errors.specs = 'Specifications must be at least 10 characters';
    }

    // Stock validation
    if (!newProduct.stock) {
      errors.stock = 'Stock quantity is required';
    } else if (isNaN(newProduct.stock) || !Number.isInteger(Number(newProduct.stock))) {
      errors.stock = 'Stock must be a whole number';
    } else if (Number(newProduct.stock) < 0) {
      errors.stock = 'Stock cannot be negative';
    } else if (Number(newProduct.stock) > 10000) {
      errors.stock = 'Stock must be less than 10,000';
    }

    // Image validation
    if (!newProduct.image) {
      errors.image = 'Product image is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    try {
      console.log('Submitting new product:', newProduct);
      await inventoryService.createItem(newProduct);
      toast.success('Product added successfully');
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        specs: '',
        stock: '',
        image: ''
      });
      setImagePreview(null);
      setValidationErrors({});
      fetchInventoryData();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(`Failed to add product: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const categories = [...new Set(data.map(item => item.category))];

  const filteredData = data
    .filter(item => {
      const matchesSearch = Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesPrice = (!filters.minPrice || item.price >= Number(filters.minPrice)) &&
                          (!filters.maxPrice || item.price <= Number(filters.maxPrice));
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'price') {
        return (a.price - b.price) * order;
      }
      return a[filters.sortBy].localeCompare(b[filters.sortBy]) * order;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white p-8 bg-red-900/30 rounded-lg border border-red-500/50 max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
          <p className="mb-4 text-red-300">{error}</p>
          <button
            onClick={fetchInventoryData}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="flex">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} w-72 bg-gray-900/95 backdrop-blur-lg border-r border-purple-500/30 transition-transform duration-300 ease-in-out z-30 pt-20`}>
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-purple-500/20 transition-colors"
            >
              <FaTimes />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-purple-400">
                <FaFilter className="text-purple-500" />
                Filters & Sort
              </h2>
              
              {/* Category Filter */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3 text-purple-300">Category</label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-black/30 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white appearance-none cursor-pointer hover:border-purple-500/50 transition-colors"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-900">{category}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3 text-purple-300">Price Range</label>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="w-full pl-8 p-3 bg-black/30 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white hover:border-purple-500/50 transition-colors"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="w-full pl-8 p-3 bg-black/30 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white hover:border-purple-500/50 transition-colors"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3 text-purple-300">Sort By</label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-black/30 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white appearance-none cursor-pointer hover:border-purple-500/50 transition-colors"
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  >
                    <option value="name" className="bg-gray-900">Name</option>
                    <option value="price" className="bg-gray-900">Price</option>
                    <option value="category" className="bg-gray-900">Category</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className={`flex-1 p-2 rounded-lg transition-colors ${
                      filters.sortOrder === 'asc' 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                        : 'bg-black/30 text-gray-400 hover:bg-purple-500/20'
                    }`}
                    onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>Asc</span>
                    </div>
                  </button>
                  <button
                    className={`flex-1 p-2 rounded-lg transition-colors ${
                      filters.sortOrder === 'desc' 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                        : 'bg-black/30 text-gray-400 hover:bg-purple-500/20'
                    }`}
                    onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Desc</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => setFilters({
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'name',
                  sortOrder: 'asc'
                })}
                className="w-full p-3 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-500/30"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'ml-72' : 'ml-0'}`}>
            <div className="p-6 mt-[100px]">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="p-2 rounded-lg bg-black/30 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/20 transition-colors"
                    >
                      <FaFilter />
                    </button>
                    <h1 className="text-3xl font-bold">Our Products</h1>
                  </div>
                </div>

                <div className="mb-6 flex gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-10 p-3 rounded-lg bg-black/30 border border-purple-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredData.map((product) => (
                    <div
                      key={product._id}
                      className="group bg-black/30 rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
                    >
                      <div className="relative">
                        <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                          <img
                            src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                            product.stock === 0
                              ? 'bg-red-500/20 text-red-200 border border-red-500/50'
                              : product.stock <= 10
                              ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50'
                              : 'bg-green-500/20 text-green-200 border border-green-500/50'
                          }`}>
                            {product.stock} in stock
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-xl font-bold text-white drop-shadow-lg">
                            ${product.price?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold group-hover:text-purple-400 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <span className="text-xs text-purple-400/70 bg-purple-500/10 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <div className="text-gray-400">
                          {typeof product.specs === 'object' ? (
                            <div className="space-y-1">
                              {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                                <div key={key} className="flex items-center text-xs">
                                  <span className="font-medium capitalize text-purple-400/70 min-w-[80px]">{key}:</span>
                                  <span className="text-gray-300 truncate">{value}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="line-clamp-2 text-xs text-gray-300">{product.specs}</p>
                          )}
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <button className="px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-500/30 hover:border-purple-500/50 text-sm">
                            View Details
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                // Get token from localStorage
                                const token = localStorage.getItem('token');
                                if (!token) {
                                  toast.error('Please login to add items to cart');
                                  navigate('/auth');
                                  return;
                                }

                                // Create order object with product details
                                const order = {
                                  productId: product._id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  category: product.category,
                                  specs: product.specs,
                                  quantity: 1
                                };

                                // Add to cart using API
                                const response = await axios.post(
                                  'http://localhost:3001/api/cart/add',
                                  order,
                                  {
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                      'Content-Type': 'application/json'
                                    }
                                  }
                                );

                                toast.success('Added to cart successfully');
                                // Navigate to profile page orders tab with product data
                                navigate('/profile?tab=orders', {
                                  state: { 
                                    showProductPopup: true,
                                    productData: {
                                      ...order,
                                      status: 'pending'
                                    }
                                  }
                                });
                              } catch (error) {
                                console.error('Error adding to cart:', error);
                                toast.error(error.response?.data?.message || 'Failed to add to cart');
                              }
                            }}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-purple-500/50">
              <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className={`w-full p-2 bg-black/30 rounded border ${
                      validationErrors.name ? 'border-red-500' : 'border-purple-500/50'
                    } focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                    value={newProduct.name}
                    onChange={handleInputChange}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    required
                    className={`w-full p-2 bg-black/30 rounded border ${
                      validationErrors.category ? 'border-red-500' : 'border-purple-500/50'
                    } focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                    value={newProduct.category}
                    onChange={handleInputChange}
                  />
                  {validationErrors.category && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className={`w-full p-2 bg-black/30 rounded border ${
                      validationErrors.price ? 'border-red-500' : 'border-purple-500/50'
                    } focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                    value={newProduct.price}
                    onChange={handleInputChange}
                  />
                  {validationErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Specifications</label>
                  <textarea
                    name="specs"
                    required
                    className={`w-full p-2 bg-black/30 rounded border ${
                      validationErrors.specs ? 'border-red-500' : 'border-purple-500/50'
                    } focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                    value={newProduct.specs}
                    onChange={handleInputChange}
                    rows="3"
                  />
                  {validationErrors.specs && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.specs}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    className={`w-full p-2 bg-black/30 rounded border ${
                      validationErrors.stock ? 'border-red-500' : 'border-purple-500/50'
                    } focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
                    value={newProduct.stock}
                    onChange={handleInputChange}
                  />
                  {validationErrors.stock && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.stock}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <label className="flex items-center justify-center w-full h-32 px-4 transition bg-black/30 border-2 border-purple-500/50 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-500 focus:outline-none">
                      <div className="flex flex-col items-center space-y-2">
                        <FaImage className="w-6 h-6 text-purple-500" />
                        <span className="text-sm text-gray-400">Click to upload image</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative w-32 h-32">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  {validationErrors.image && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.image}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setValidationErrors({});
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default InventoryTable; 