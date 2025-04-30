import React from 'react';
import { FaTimes, FaBox, FaTag, FaWarehouse, FaDollarSign, FaCalendar } from 'react-icons/fa';

const ViewDetailsModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

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
                <h2 className="text-2xl font-bold text-white">Item Details</h2>
                <p className="text-gray-400 text-sm mt-1">View complete item information</p>
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
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <FaTag className="text-purple-500" />
                <span>Basic Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-xl">
                <div>
                  <label className="text-sm text-gray-400">Category</label>
                  <p className="text-white font-medium mt-1">{item.category}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-white font-medium mt-1">{item.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Brand</label>
                  <p className="text-white font-medium mt-1">{item.brand}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Price</label>
                  <p className="text-white font-medium mt-1">${item.price?.toFixed(2)}</p>
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
                  <label className="text-sm text-gray-400">Processor</label>
                  <p className="text-white font-medium mt-1">{item.specs?.processor || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">RAM</label>
                  <p className="text-white font-medium mt-1">{item.specs?.ram || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Storage</label>
                  <p className="text-white font-medium mt-1">{item.specs?.storage || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Graphics</label>
                  <p className="text-white font-medium mt-1">{item.specs?.graphics || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Display</label>
                  <p className="text-white font-medium mt-1">{item.specs?.display || 'N/A'}</p>
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
                  <label className="text-sm text-gray-400">Stock</label>
                  <p className="text-white font-medium mt-1">{item.stock} units</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <p className="text-white font-medium mt-1">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'in-stock'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : item.status === 'low-stock'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {item.status === 'in-stock'
                        ? 'In Stock'
                        : item.status === 'low-stock'
                        ? 'Low Stock'
                        : 'Out of Stock'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-6 border-t border-purple-500/20">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-purple-500/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal; 