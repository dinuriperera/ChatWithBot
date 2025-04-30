import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Delete Item</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-300">
              Are you sure you want to delete <span className="font-semibold text-white">{item?.itemName}</span>?
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 