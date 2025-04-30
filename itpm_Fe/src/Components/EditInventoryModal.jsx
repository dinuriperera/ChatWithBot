import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaBox, FaBarcode, FaTag, FaWarehouse, FaDollarSign, FaMicrochip, FaMemory, FaDesktop, FaHdd, FaTv } from 'react-icons/fa';

const EditInventoryModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    stock: '',
    cost: '',
    details: {
      price: '',
      ram: '',
      vga: '',
      processor: '',
      storage: '',
      display: ''
    }
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        sku: '',
        brand: '',
        stock: '',
        cost: '',
        details: {
          price: '',
          ram: '',
          vga: '',
          processor: '',
          storage: '',
          display: ''
        }
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-purple-500/20 transform transition-all">
        {/* Modal Header - Fixed */}
        <div className="flex-none bg-gray-900 border-b border-purple-500/20 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                <FaBox className="text-purple-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {item ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {item ? 'Update product information' : 'Fill in the product details'}
                </p>
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

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <FaBox className="text-purple-500" />
                <span>Basic Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">SKU</label>
                  <div className="relative">
                    <FaBarcode className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Brand</label>
                  <div className="relative">
                    <FaTag className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Stock</label>
                  <div className="relative">
                    <FaWarehouse className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <FaDollarSign className="text-green-500" />
                <span>Pricing</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Cost Price</label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Retail Price</label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.details.price}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, price: e.target.value }
                      })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <FaMicrochip className="text-purple-500" />
                <span>Technical Specifications</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Processor</label>
                  <div className="relative">
                    <FaMicrochip className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.details.processor}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, processor: e.target.value }
                      })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">RAM</label>
                  <div className="relative">
                    <FaMemory className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.details.ram}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, ram: e.target.value }
                      })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Graphics Card</label>
                  <div className="relative">
                    <FaDesktop className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.details.vga}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, vga: e.target.value }
                      })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Storage</label>
                  <div className="relative">
                    <FaHdd className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.details.storage}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, storage: e.target.value }
                      })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Display</label>
                  <div className="relative">
                    <FaTv className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.details.display}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details, display: e.target.value }
                      })}
                      className="w-full p-3 pl-10 bg-gray-800/50 border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="flex-none flex justify-end space-x-4 p-6 border-t border-purple-500/20">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 flex items-center space-x-2 transition-colors duration-200"
          >
            <FaSave className="text-lg" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInventoryModal; 