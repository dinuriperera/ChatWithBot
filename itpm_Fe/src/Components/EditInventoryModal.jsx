import React, { useState, useEffect } from 'react';
import { FaTimes, FaBox, FaTag, FaWarehouse, FaDollarSign, FaCalendar, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditInventoryModal = ({ isOpen, onClose, item, onSave }) => {
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        brand: '',
        price: '',
        specs: {
            processor: '',
            ram: '',
            storage: '',
            graphics: '',
            display: ''
        },
        image: '',
        stock: '',
        status: 'in-stock'
    });

    const [validationErrors, setValidationErrors] = useState({
        category: '',
        name: '',
        brand: '',
        price: '',
        specs: {
            processor: '',
            ram: '',
            storage: '',
            graphics: '',
            display: ''
        },
        stock: '',
        image: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                category: item.category || '',
                name: item.name || '',
                brand: item.brand || '',
                price: item.price || '',
                specs: item.specs || {
                    processor: '',
                    ram: '',
                    storage: '',
                    graphics: '',
                    display: ''
                },
                image: item.image || '',
                stock: item.stock || '',
                status: item.status || 'in-stock'
            });
        }
    }, [item]);

    const validateField = (name, value) => {
        switch (name) {
            case 'category':
                if (!value.trim()) return 'Category is required';
                return '';
            
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.length < 3) return 'Name must be at least 3 characters';
                if (value.length > 100) return 'Name must be less than 100 characters';
                return '';
            
            case 'brand':
                if (!value.trim()) return 'Brand is required';
                if (value.length < 2) return 'Brand must be at least 2 characters';
                return '';
            
            case 'price':
                if (!value) return 'Price is required';
                if (!/^\d*\.?\d*$/.test(value)) return 'Price must be a valid number';
                if (Number(value) <= 0) return 'Price must be a positive number';
                if (Number(value) > 1000000) return 'Price must be less than $1,000,000';
                return '';
            
            case 'stock':
                if (!value) return 'Stock quantity is required';
                if (!/^\d+$/.test(value)) return 'Stock must be a whole number';
                if (Number(value) < 0) return 'Stock cannot be negative';
                if (Number(value) > 10000) return 'Stock must be less than 10,000';
                return '';
            
            case 'image':
                if (!value.trim()) return 'Image URL is required';
                if (!value.startsWith('http')) return 'Please enter a valid image URL';
                return '';
            
            default:
                return '';
        }
    };

    const validateSpecField = (name, value) => {
        if (!value.trim()) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Restrict stock and price input to numbers only
        if ((name === 'stock' || name === 'price') && value !== '') {
            if (name === 'stock' && !/^\d*$/.test(value)) {
                return;
            }
            if (name === 'price' && !/^\d*\.?\d*$/.test(value)) {
                return;
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Validate field immediately
        const error = validateField(name, value);
        setValidationErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSpecsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            specs: {
                ...prev.specs,
                [name]: value
            }
        }));
        
        // Validate spec field immediately
        const error = validateSpecField(name, value);
        setValidationErrors(prev => ({
            ...prev,
            specs: {
                ...prev.specs,
                [name]: error
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        const errors = {};
        
        // Basic fields validation
        Object.keys(formData).forEach(key => {
            if (key !== 'specs' && key !== 'status' && key !== 'image') {
                const error = validateField(key, formData[key]);
                if (error) errors[key] = error;
            }
        });
        
        // Specs validation
        const specsErrors = {};
        Object.keys(formData.specs).forEach(key => {
            const error = validateSpecField(key, formData.specs[key]);
            if (error) specsErrors[key] = error;
        });
        
        if (Object.keys(specsErrors).length > 0) {
            errors.specs = specsErrors;
        }
        
        setValidationErrors(errors);
        
        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the validation errors before saving');
            return;
        }

        try {
            const processedData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            await onSave(processedData);
            toast.success(item ? 'Item updated successfully' : 'Item added successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save item. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-purple-500/20">
                {/* Modal Header */}
                <div className="flex-none bg-gray-900 border-b border-purple-500/20 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                                <FaBox className="text-purple-500 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{item ? 'Edit Item' : 'Add New Item'}</h2>
                                <p className="text-gray-400 text-sm mt-1">Modify item information</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <FaTag className="text-purple-500" />
                                <span>Basic Information</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.category ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none hover:bg-gray-700/50 transition-colors relative`}
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B5CF6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.5rem center',
                                            backgroundSize: '1.5em 1.5em',
                                            paddingRight: '2.5rem'
                                        }}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Desktop">Desktop</option>
                                        <option value="Component">Component</option>
                                        <option value="Accessory">Accessory</option>
                                    </select>
                                    {validationErrors.category && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.name ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                    />
                                    {validationErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Brand <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.brand ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                    />
                                    {validationErrors.brand && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.brand}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.price ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                        pattern="\d*\.?\d*"
                                        inputMode="decimal"
                                    />
                                    {validationErrors.price && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <FaImage className="text-blue-500" />
                                <span>Product Image</span>
                            </h3>
                            <div className="bg-gray-800/30 p-4 rounded-xl">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Image URL <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="Paste image URL here (Google Drive or Google Images)"
                                            className={`w-full px-3 py-2 bg-gray-800 border ${
                                                validationErrors.image ? 'border-red-500' : 'border-purple-500/20'
                                            } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                            required
                                        />
                                        {validationErrors.image && (
                                            <p className="text-red-500 text-sm mt-1">{validationErrors.image}</p>
                                        )}
                                    </div>
                                    {formData.image && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-purple-500/20">
                                                <img
                                                    src={formData.image}
                                                    alt="Product preview"
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-400">
                                        <p className="mb-2">Instructions:</p>
                                        <ol className="list-decimal list-inside space-y-1">
                                            <li>Upload your image to Google Drive or find an image on Google Images</li>
                                            <li>For Google Drive: Right-click the image and select "Get link"</li>
                                            <li>For Google Images: Right-click the image and select "Copy image address"</li>
                                            <li>Make sure the image is publicly accessible</li>
                                            <li>Paste the image URL here</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <FaWarehouse className="text-blue-500" />
                                <span>Specifications</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Processor <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="processor"
                                        value={formData.specs.processor}
                                        onChange={handleSpecsChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.specs?.processor ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                    />
                                    {validationErrors.specs?.processor && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.specs.processor}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        RAM <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ram"
                                        value={formData.specs.ram}
                                        onChange={handleSpecsChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.specs?.ram ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                    />
                                    {validationErrors.specs?.ram && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.specs.ram}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Storage <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="storage"
                                        value={formData.specs.storage}
                                        onChange={handleSpecsChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.specs?.storage ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                    />
                                    {validationErrors.specs?.storage && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.specs.storage}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Graphics <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="graphics"
                                        value={formData.specs.graphics}
                                        onChange={handleSpecsChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.specs?.graphics ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                    />
                                    {validationErrors.specs?.graphics && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.specs.graphics}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Display <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="display"
                                        value={formData.specs.display}
                                        onChange={handleSpecsChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.specs?.display ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                    />
                                    {validationErrors.specs?.display && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.specs.display}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stock Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <FaDollarSign className="text-green-500" />
                                <span>Stock Information</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Stock <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 bg-gray-800 border ${
                                            validationErrors.stock ? 'border-red-500' : 'border-purple-500/20'
                                        } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        required
                                        pattern="\d*"
                                        inputMode="numeric"
                                    />
                                    {validationErrors.stock && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.stock}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none hover:bg-gray-700/50 transition-colors relative"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B5CF6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.5rem center',
                                            backgroundSize: '1.5em 1.5em',
                                            paddingRight: '2.5rem'
                                        }}
                                        required
                                    >
                                        <option value="in-stock" className="bg-gray-800">In Stock</option>
                                        <option value="low-stock" className="bg-gray-800">Low Stock</option>
                                        <option value="out-of-stock" className="bg-gray-800">Out of Stock</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-purple-500/20">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-purple-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                {item ? 'Update Item' : 'Add Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditInventoryModal; 