import React from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash } from 'react-icons/fa';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/20 transform transition-all">
        {/* Modal Header */}
        <div className="p-6 border-b border-red-500/20">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Delete Product</h2>
                <p className="text-gray-400 text-sm mt-1">This action cannot be undone</p>
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
        <div className="p-6">
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-red-500 text-lg mt-1" />
              <div>
                <h3 className="text-red-400 font-medium">Warning</h3>
                <p className="text-gray-300 text-sm mt-1">
                  You are about to delete <span className="font-semibold text-white">{itemName}</span>. 
                  This will permanently remove the product from your inventory.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-red-500/20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center space-x-2 transition-colors duration-200"
          >
            <FaTrash className="text-lg" />
            <span>Delete Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 