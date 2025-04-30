import React from 'react';
import { FaTimes, FaBox, FaBarcode, FaTag, FaWarehouse, FaDollarSign, FaMicrochip, FaMemory, FaDesktop, FaHdd, FaTv } from 'react-icons/fa';

const ViewDetailsModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-purple-500/20 transform transition-all">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-purple-500/20 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                <FaBox className="text-purple-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Product Details</h2>
                <p className="text-gray-400 text-sm mt-1">View complete product information</p>
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
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <FaBox className="text-purple-500" />
              <span>Basic Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaBarcode className="text-purple-500" />
                  <span className="text-sm font-medium">Product Name</span>
                </div>
                <p className="text-white font-medium">{item.name}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaBarcode className="text-purple-500" />
                  <span className="text-sm font-medium">SKU</span>
                </div>
                <p className="text-white font-medium">{item.sku}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaTag className="text-purple-500" />
                  <span className="text-sm font-medium">Brand</span>
                </div>
                <p className="text-white font-medium">{item.brand}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaWarehouse className="text-purple-500" />
                  <span className="text-sm font-medium">Stock</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.stock < 5 ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  item.stock < 10 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                  'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                  {item.stock} units
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <FaDollarSign className="text-green-500" />
              <span>Pricing</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaDollarSign className="text-green-500" />
                  <span className="text-sm font-medium">Cost Price</span>
                </div>
                <p className="text-white font-medium">${item.cost}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaDollarSign className="text-green-500" />
                  <span className="text-sm font-medium">Retail Price</span>
                </div>
                <p className="text-white font-medium">${item.details.price}</p>
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
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaMicrochip className="text-purple-500" />
                  <span className="text-sm font-medium">Processor</span>
                </div>
                <p className="text-white font-medium">{item.details.processor}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaMemory className="text-purple-500" />
                  <span className="text-sm font-medium">RAM</span>
                </div>
                <p className="text-white font-medium">{item.details.ram}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaDesktop className="text-purple-500" />
                  <span className="text-sm font-medium">Graphics Card</span>
                </div>
                <p className="text-white font-medium">{item.details.vga}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaHdd className="text-purple-500" />
                  <span className="text-sm font-medium">Storage</span>
                </div>
                <p className="text-white font-medium">{item.details.storage}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <FaTv className="text-purple-500" />
                  <span className="text-sm font-medium">Display</span>
                </div>
                <p className="text-white font-medium">{item.details.display}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t border-purple-500/20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal; 