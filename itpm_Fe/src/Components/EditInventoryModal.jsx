import React, { useState, useEffect } from 'react';
import { FaTimes, FaBox, FaTag, FaWarehouse, FaDollarSign, FaCalendar } from 'react-icons/fa';
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
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
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
                                        <option value="">Select Category</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Desktop">Desktop</option>
                                        <option value="Component">Component</option>
                                        <option value="Accessory">Accessory</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
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
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Processor</label>
                                    <input
                                        type="text"
                                        name="processor"
                                        value={formData.specs.processor}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">RAM</label>
                                    <input
                                        type="text"
                                        name="ram"
                                        value={formData.specs.ram}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Storage</label>
                                    <input
                                        type="text"
                                        name="storage"
                                        value={formData.specs.storage}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Graphics</label>
                                    <input
                                        type="text"
                                        name="graphics"
                                        value={formData.specs.graphics}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Display</label>
                                    <input
                                        type="text"
                                        name="display"
                                        value={formData.specs.display}
                                        onChange={handleSpecsChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
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
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
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