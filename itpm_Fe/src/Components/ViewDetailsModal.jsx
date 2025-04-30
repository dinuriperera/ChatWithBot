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
                <FaBox className="text-purple-500" />
                <span>Basic Information</span>
              </h3>
              <div className="grid grid-cols-1 gap-4 bg-gray-800/30 p-4 rounded-xl">
                <div>
                  <label className="text-sm text-gray-400">Item Name</label>
                  <p className="text-white font-medium mt-1">{item.itemName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Category</label>
                  <p className="text-white font-medium mt-1">{item.category}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <p className="text-white font-medium mt-1">{item.description}</p>
                </div>
              </div>
            </div>

            {/* Stock and Price Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <FaWarehouse className="text-blue-500" />
                <span>Stock and Price Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-xl">
                <div>
                  <label className="text-sm text-gray-400">Quantity</label>
                  <p className="text-white font-medium mt-1">{item.quantity}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Price</label>
                  <p className="text-white font-medium mt-1">${item.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <FaCalendar className="text-green-500" />
                <span>Timestamps</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-xl">
                <div>
                  <label className="text-sm text-gray-400">Created At</label>
                  <p className="text-white font-medium mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Last Updated</label>
                  <p className="text-white font-medium mt-1">
                    {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal; 