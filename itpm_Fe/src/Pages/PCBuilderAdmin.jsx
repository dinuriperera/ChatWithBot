import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaDownload, FaTimes, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const PCBuilderAdmin = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    brand: '',
    price: '',
    specs: '',
    stock: ''
  });
  const [formErrors, setFormErrors] = useState({
    category: '',
    name: '',
    brand: '',
    price: '',
    specs: '',
    stock: ''
  });

  // Fetch all components
  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/components');
      setComponents(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch components');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  // Validation function for individual fields
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'category':
        if (!value.trim()) {
          error = 'Category is required';
        }
        break;

      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.length < 3) {
          error = 'Name must be at least 3 characters';
        }
        break;

      case 'brand':
        if (!value.trim()) {
          error = 'Brand is required';
        }
        break;

      case 'price':
        if (!value) {
          error = 'Price is required';
        } else if (isNaN(value)) {
          error = 'Price must be a number';
        } else if (Number(value) <= 0) {
          error = 'Price must be greater than 0';
        } else if (!/^\d*\.?\d{0,2}$/.test(value)) {
          error = 'Price can have up to 2 decimal places';
        }
        break;

      case 'stock':
        if (!value) {
          error = 'Stock is required';
        } else if (isNaN(value)) {
          error = 'Stock must be a number';
        } else if (Number(value) < 0) {
          error = 'Stock cannot be negative';
        } else if (!Number.isInteger(Number(value))) {
          error = 'Stock must be a whole number';
        }
        break;

      case 'specs':
        if (!value.trim()) {
          error = 'Specifications are required';
        } else if (value.length < 10) {
          error = 'Specifications must be at least 10 characters';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle input change with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for price and stock fields
    if (name === 'price' || name === 'stock') {
      // Only allow numbers and decimal point for price
      if (name === 'price') {
        if (!/^\d*\.?\d{0,2}$/.test(value) && value !== '') {
          return; // Don't update if invalid
        }
      }
      // Only allow whole numbers for stock
      if (name === 'stock') {
        if (!/^\d*$/.test(value) && value !== '') {
          return; // Don't update if invalid
        }
      }
    }
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate the field and update errors
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Form submission validation
  const validateForm = () => {
    const newErrors = {
      category: validateField('category', formData.category),
      name: validateField('name', formData.name),
      brand: validateField('brand', formData.brand),
      price: validateField('price', formData.price),
      specs: validateField('specs', formData.specs),
      stock: validateField('stock', formData.stock)
    };

    setFormErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      if (editingComponent) {
        await axios.put(`http://localhost:3001/api/components/${editingComponent._id}`, formData);
        toast.success('Component updated successfully');
      } else {
        await axios.post('http://localhost:3001/api/components', formData);
        toast.success('Component added successfully');
      }
      setShowModal(false);
      setEditingComponent(null);
      setFormData({
        category: '',
        name: '',
        brand: '',
        price: '',
        specs: '',
        stock: ''
      });
      setFormErrors({
        category: '',
        name: '',
        brand: '',
        price: '',
        specs: '',
        stock: ''
      });
      fetchComponents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save component');
    }
  };

  // Handle component deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await axios.delete(`http://localhost:3001/api/components/${id}`);
        toast.success('Component deleted successfully');
        fetchComponents();
      } catch (error) {
        toast.error('Failed to delete component');
      }
    }
  };

  // Handle edit button click
  const handleEdit = (component) => {
    setEditingComponent(component);
    setFormData({
      category: component.category,
      name: component.name,
      brand: component.brand,
      price: component.price,
      specs: component.specs,
      stock: component.stock
    });
    setShowModal(true);
  };

  // Filter components based on search term
  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add download CSV function
  const downloadCSV = () => {
    // Create CSV header
    const headers = ['Category', 'Name', 'Brand', 'Price', 'Specifications', 'Stock'];
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...components.map(component => [
        component.category,
        `"${component.name}"`,
        component.brand,
        component.price,
        `"${component.specs}"`,
        component.stock
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pc_components.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-4 flex flex-col">
      <div className="mx-auto mt-[100px] flex-grow w-[95%]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">PC Builder Components Management</h1>
          <div className="flex gap-4">
            <button
              onClick={downloadCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FaDownload /> Download CSV
            </button>
            <button
              onClick={() => {
                setEditingComponent(null);
                setFormData({
                  category: '',
                  name: '',
                  brand: '',
                  price: '',
                  specs: '',
                  stock: ''
                });
                setShowModal(true);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaPlus /> Add New Component
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Components Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Brand</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredComponents.map((component) => (
                <tr key={component._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">{component.category}</td>
                  <td className="px-6 py-4">{component.name}</td>
                  <td className="px-6 py-4">{component.brand}</td>
                  <td className="px-6 py-4">${component.price}</td>
                  <td className="px-6 py-4">{component.stock}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(component)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(component._id)}
                        className="text-red-400 hover:text-red-300"
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

      {/* Footer */}
      <footer className="w-full mt-16 border-t border-purple-500/20 px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">PC Builder Pro</h3>
            <p className="text-gray-400">
              Building your dream PC has never been easier. Manage your components with our advanced admin interface.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/PCBuilder" className="text-gray-400 hover:text-purple-400 transition-colors">
                  PC Builder
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/inventory" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Inventory
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={24} />
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
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-purple-500/20 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} PC Builder Pro. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modernized Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full border border-purple-500/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingComponent ? 'Edit Component' : 'Add New Component'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormErrors({
                    category: '',
                    name: '',
                    brand: '',
                    price: '',
                    specs: '',
                    stock: ''
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full bg-black/20 border ${
                      formErrors.category ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="cpu">CPU</option>
                    <option value="ram">RAM</option>
                    <option value="ssd">SSD</option>
                    <option value="gpu">GPU</option>
                    <option value="motherboard">Motherboard</option>
                    <option value="psu">Power Supply</option>
                    <option value="case">Case</option>
                    <option value="cooling">Cooling</option>
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={`w-full bg-black/20 border ${
                      formErrors.brand ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                  />
                  {formErrors.brand && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.brand}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-black/20 border ${
                      formErrors.name ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full bg-black/20 border ${
                      formErrors.price ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                    placeholder="Enter price (e.g., 299.99)"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                  <input
                    type="text"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className={`w-full bg-black/20 border ${
                      formErrors.stock ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                    placeholder="Enter stock quantity"
                  />
                  {formErrors.stock && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.stock}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specifications</label>
                  <textarea
                    name="specs"
                    value={formData.specs}
                    onChange={handleInputChange}
                    className={`w-full bg-black/20 border ${
                      formErrors.specs ? 'border-red-500' : 'border-purple-500/20'
                    } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                    rows="3"
                  />
                  {formErrors.specs && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.specs}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormErrors({
                      category: '',
                      name: '',
                      brand: '',
                      price: '',
                      specs: '',
                      stock: ''
                    });
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingComponent ? 'Update Component' : 'Add Component'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PCBuilderAdmin; 