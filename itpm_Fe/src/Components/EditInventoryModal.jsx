import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate required fields
            if (!formData.category || !formData.name || !formData.brand || !formData.price || !formData.stock) {
                toast.error('Please fill in all required fields');
                return;
            }

            // Validate price and stock are positive numbers
            if (Number(formData.price) <= 0) {
                toast.error('Price must be greater than 0');
                return;
            }

            if (Number(formData.stock) < 0) {
                toast.error('Stock cannot be negative');
                return;
            }

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-2xl border border-purple-800/50">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-white">
                            {item ? 'Edit Item' : 'Add New Item'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="laptop">Laptop</option>
                                        <option value="desktop">Desktop</option>
                                        <option value="processor">Processor</option>
                                        <option value="motherboard">Motherboard</option>
                                        <option value="ram">RAM</option>
                                        <option value="storage">Storage</option>
                                        <option value="gpu">Graphics Card</option>
                                        <option value="psu">Power Supply</option>
                                        <option value="case">Case</option>
                                        <option value="cooling">Cooling</option>
                                        <option value="peripheral">Peripheral</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <div className="flex space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="in-stock"
                                                checked={formData.status === 'in-stock'}
                                                onChange={handleChange}
                                                className="form-radio text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="ml-2 text-white">In Stock</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="out-of-stock"
                                                checked={formData.status === 'out-of-stock'}
                                                onChange={handleChange}
                                                className="form-radio text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="ml-2 text-white">Out of Stock</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white mb-2">Specifications</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Processor
                                    </label>
                                    <input
                                        type="text"
                                        name="processor"
                                        value={formData.specs.processor}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        RAM
                                    </label>
                                    <input
                                        type="text"
                                        name="ram"
                                        value={formData.specs.ram}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Storage
                                    </label>
                                    <input
                                        type="text"
                                        name="storage"
                                        value={formData.specs.storage}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Graphics
                                    </label>
                                    <input
                                        type="text"
                                        name="graphics"
                                        value={formData.specs.graphics}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Display
                                    </label>
                                    <input
                                        type="text"
                                        name="display"
                                        value={formData.specs.display}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter image URL"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
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