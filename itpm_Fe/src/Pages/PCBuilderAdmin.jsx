import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaMicrochip, FaMemory, FaHdd, FaDesktop, FaThermometerHalf, FaBox, FaSort, FaSortUp, FaSortDown, FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PCBuilderAdmin = () => {
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

  const [editingComponent, setEditingComponent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    field: 'name',
    direction: 'asc'
  });
  const [activeCategory, setActiveCategory] = useState('cpu');
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const [newComponent, setNewComponent] = useState({
    name: '',
    price: '',
    specs: '',
    brand: '',
    stock: 0,
    category: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);

  // Fetch components from backend
  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching components:', error);
      toast.error('Failed to fetch components');
    }
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedComponents = (category) => {
    // Get all components if 'all' is selected, otherwise filter by category
    let componentsList = category === 'all' 
      ? Object.values(components).flat()
      : [...components[category]];
    
    if (sortConfig.field) {
      componentsList.sort((a, b) => {
        if (sortConfig.field === 'price') {
          const comparison = parseFloat(a.price) - parseFloat(b.price);
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        } else if (sortConfig.field === 'stock') {
          const comparison = a.stock - b.stock;
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        } else {
          const comparison = String(a[sortConfig.field]).localeCompare(String(b[sortConfig.field]));
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
      });
    }

    return componentsList.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category === 'all' && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (value.trim().length > 100) return 'Name cannot exceed 100 characters';
        return '';

      case 'brand':
        if (!value.trim()) return 'Brand is required';
        if (value.trim().length < 2) return 'Brand must be at least 2 characters';
        if (value.trim().length > 50) return 'Brand cannot exceed 50 characters';
        return '';

      case 'price':
        if (!value) return 'Price is required';
        if (isNaN(value) || parseFloat(value) <= 0) return 'Price must be greater than 0';
        if (parseFloat(value) > 100000) return 'Price cannot exceed $100,000';
        return '';

      case 'stock':
        if (!value) return 'Stock is required';
        if (!/^\d+$/.test(value)) return 'Only numbers are allowed';
        if (parseInt(value) < 0) return 'Stock cannot be negative';
        if (parseInt(value) > 10000) return 'Stock cannot exceed 10,000';
        return '';

      case 'category':
        if (!value) return 'Category is required';
        return '';

      case 'specs':
        if (!value.trim()) return 'Specifications are required';
        if (value.trim().length < 10) return 'Specifications must be at least 10 characters';
        if (value.trim().length > 500) return 'Specifications cannot exceed 500 characters';
        return '';

      default:
        return '';
    }
  };

  const handleFieldChange = (name, value) => {
    if (name === 'stock') {
      // Only allow numeric input for stock
      if (value === '' || /^\d+$/.test(value)) {
        setNewComponent(prev => ({ ...prev, [name]: value }));
        // Clear validation error if input is valid
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      } else {
        // Show validation error for non-numeric input
        setValidationErrors(prev => ({ ...prev, [name]: 'Only numbers are allowed' }));
      }
    } else if (name === 'price') {
      // Handle price input - allow numbers and one decimal point
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setNewComponent(prev => ({ ...prev, [name]: value }));
        // Clear validation error if input is valid
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      } else {
        // Show validation error for invalid price format
        setValidationErrors(prev => ({ ...prev, [name]: 'Please enter a valid price' }));
      }
    } else {
      setNewComponent(prev => ({ ...prev, [name]: value }));
      
      // Real-time validation for other fields
      if (fieldTouched[name]) {
        const error = validateField(name, value);
        setValidationErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleFieldBlur = (name, value) => {
    setFieldTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: error }));

    // Format values on blur
    if (name === 'name' || name === 'brand') {
      const formattedValue = value.trim();
      setNewComponent(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'price') {
      // Format price to 2 decimal places
      if (value && !isNaN(value)) {
        const formattedValue = parseFloat(value).toFixed(2);
        setNewComponent(prev => ({ ...prev, [name]: formattedValue }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const fields = ['name', 'brand', 'price', 'stock', 'specs'];
    if (!editingComponent) {
      fields.push('category');
    }

    fields.forEach(field => {
      const error = validateField(field, newComponent[field]);
      if (error) {
        errors[field] = error;
      }
    });

    // Set all fields as touched
    setFieldTouched(
      fields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddComponent = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/components', newComponent);
      await fetchComponents();
      setShowAddModal(false);
      setNewComponent({
        name: '',
        price: '',
        specs: '',
        brand: '',
        stock: 0,
        category: ''
      });
      setValidationErrors({});
      toast.success('Component saved successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4F46E5',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '16px',
        },
        icon: '✅',
      });
    } catch (error) {
      console.error('Error adding component:', error);
      toast.error('Failed to save component', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '16px',
        },
      });
    }
  };

  const handleUpdateComponent = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/components/${editingComponent._id}`, newComponent);
      await fetchComponents();
      setEditingComponent(null);
      setNewComponent({
        name: '',
        price: '',
        specs: '',
        brand: '',
        stock: 0,
        category: ''
      });
      setValidationErrors({});
      toast.success('Component updated successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4F46E5',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '16px',
        },
        icon: '✅',
      });
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update component', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '16px',
        },
      });
    }
  };

  const handleDeleteClick = (component) => {
    setComponentToDelete(component);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/components/${componentToDelete._id}`);
      await fetchComponents();
      setShowDeleteConfirm(false);
      setComponentToDelete(null);
      toast.success('Component deleted successfully', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4F46E5',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '16px',
        },
        icon: '✅',
      });
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error('Failed to delete component');
    }
  };

  const categories = [
    { id: 'all', name: 'View All', icon: <FaBox /> },
    { id: 'cpu', name: 'CPU', icon: <FaMicrochip /> },
    { id: 'ram', name: 'RAM', icon: <FaMemory /> },
    { id: 'ssd', name: 'Storage', icon: <FaHdd /> },
    { id: 'gpu', name: 'Graphics', icon: <FaDesktop /> },
    { id: 'motherboard', name: 'Motherboard', icon: <FaMicrochip /> },
    { id: 'psu', name: 'Power Supply', icon: <FaBox /> },
    { id: 'case', name: 'Case', icon: <FaBox /> },
    { id: 'cooling', name: 'Cooling', icon: <FaThermometerHalf /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white flex flex-col">
      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/20">
            <div className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="bg-red-500/20 p-4 rounded-full">
                  <FaTrash className="text-4xl text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Delete Component</h3>
                <p className="text-gray-300 text-center">
                  Are you sure you want to delete {componentToDelete?.name}? This action cannot be undone.
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setComponentToDelete(null);
                    }}
                    className="px-6 py-2 border border-purple-500/20 rounded-lg text-gray-300 hover:bg-purple-500/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-6 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 mt-[100px]">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              PC Builder Admin
            </h1>
            <p className="text-gray-300 text-lg">
              Manage your PC components inventory
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/30 text-gray-300 hover:bg-purple-600/20'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Add Component
            </button>
          </div>

          {/* Components Table */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                      >
                        Name
                        {sortConfig.field === 'name' && (
                          sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('brand')}
                        className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                      >
                        Brand
                        {sortConfig.field === 'brand' && (
                          sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </button>
                    </th>
                    {activeCategory === 'all' && (
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('category')}
                          className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                        >
                          Category
                          {sortConfig.field === 'category' && (
                            sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                          )}
                        </button>
                      </th>
                    )}
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('price')}
                        className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                      >
                        Price
                        {sortConfig.field === 'price' && (
                          sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <button
                        onClick={() => handleSort('stock')}
                        className="flex items-center gap-2 hover:text-purple-400 transition-colors"
                      >
                        Stock
                        {sortConfig.field === 'stock' && (
                          sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left">Specifications</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedComponents(activeCategory).map((component) => (
                    <tr key={component._id} className="border-b border-purple-500/10 hover:bg-purple-500/5">
                      <td className="px-6 py-4">{component.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-500/20 rounded-full text-sm">
                          {component.brand}
                        </span>
                      </td>
                      {activeCategory === 'all' && (
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-purple-600/20 rounded-full text-sm text-purple-400">
                            {categories.find(cat => cat.id === component.category)?.name || component.category}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-purple-400">${component.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          component.stock > 10
                            ? 'bg-green-500/20 text-green-400'
                            : component.stock > 0
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {component.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{component.specs}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingComponent(component);
                              setNewComponent({
                                name: component.name,
                                price: component.price,
                                specs: component.specs,
                                brand: component.brand,
                                stock: component.stock,
                                category: component.category
                              });
                            }}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(component)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-purple-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                PC Builder Pro
              </h3>
              <p className="text-gray-400 text-sm">
                Building your dream PC has never been easier. Manage your components with our advanced admin interface.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/PCBuilder" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    PC Builder
                  </a>
                </li>
                <li>
                  <a href="/inventory" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    Inventory
                  </a>
                </li>
                <li>
                  <a href="/inventory-table" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/admin" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    Admin Dashboard
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={24} />
                </a>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-white mb-2">Newsletter</h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-black/20 border border-purple-500/20 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors text-sm">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-purple-500/20 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PC Builder Pro. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Add/Edit Modal */}
      {(showAddModal || editingComponent) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-purple-500/20">
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingComponent ? 'Edit Component' : 'Add New Component'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingComponent(null);
                    setNewComponent({
                      name: '',
                      price: '',
                      specs: '',
                      brand: '',
                      stock: 0,
                      category: ''
                    });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={newComponent.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={(e) => handleFieldBlur('name', e.target.value)}
                    className={`w-full bg-black/20 border ${validationErrors.name ? 'border-red-500' : 'border-purple-500/20'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200`}
                    placeholder="Enter component name"
                    required
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                  <input
                    type="text"
                    value={newComponent.brand}
                    onChange={(e) => handleFieldChange('brand', e.target.value)}
                    onBlur={(e) => handleFieldBlur('brand', e.target.value)}
                    className={`w-full bg-black/20 border ${validationErrors.brand ? 'border-red-500' : 'border-purple-500/20'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200`}
                    placeholder="Enter brand name"
                    required
                  />
                  {validationErrors.brand && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.brand}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="text"
                      value={newComponent.price}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      onBlur={(e) => handleFieldBlur('price', e.target.value)}
                      className={`w-full bg-black/20 border ${validationErrors.price ? 'border-red-500' : 'border-purple-500/20'} rounded-lg pl-7 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200`}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  {validationErrors.price && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                  <input
                    type="number"
                    value={newComponent.stock}
                    onChange={(e) => handleFieldChange('stock', e.target.value)}
                    onBlur={(e) => handleFieldBlur('stock', e.target.value)}
                    className={`w-full bg-black/20 border ${validationErrors.stock ? 'border-red-500' : 'border-purple-500/20'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200`}
                    placeholder="Enter stock quantity"
                    min="0"
                    required
                  />
                  {validationErrors.stock && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.stock}
                    </p>
                  )}
                </div>
                {!editingComponent && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <div className="relative">
                      <select
                        value={newComponent.category}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        onBlur={(e) => handleFieldBlur('category', e.target.value)}
                        className={`w-full bg-black/20 border ${validationErrors.category ? 'border-red-500' : 'border-purple-500/20'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none transition-all duration-200 hover:border-purple-500/40`}
                        required
                      >
                        <option value="" className="bg-gray-900">Select Category</option>
                        {categories.filter(category => category.id !== 'all').map(category => (
                          <option key={category.id} value={category.id} className="bg-gray-900">
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {validationErrors.category && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {validationErrors.category}
                      </p>
                    )}
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specifications</label>
                  <textarea
                    value={newComponent.specs}
                    onChange={(e) => handleFieldChange('specs', e.target.value)}
                    onBlur={(e) => handleFieldBlur('specs', e.target.value)}
                    className={`w-full bg-black/20 border ${validationErrors.specs ? 'border-red-500' : 'border-purple-500/20'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none transition-colors duration-200`}
                    placeholder="Enter detailed specifications"
                    required
                  />
                  {validationErrors.specs && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {validationErrors.specs}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-purple-500/20 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingComponent(null);
                  setNewComponent({
                    name: '',
                    price: '',
                    specs: '',
                    brand: '',
                    stock: 0,
                    category: ''
                  });
                }}
                className="px-4 py-2 border border-purple-500/20 rounded-lg text-gray-300 hover:bg-purple-500/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingComponent ? handleUpdateComponent : handleAddComponent}
                className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <FaSave />
                {editingComponent ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PCBuilderAdmin; 