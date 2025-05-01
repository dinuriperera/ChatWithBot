import React from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const ProductPopup = ({ product, onClose, onSave }) => {
  if (!product) return null;

  return (
    <>
      {/* Dark overlay for entire page */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="relative h-[400px] bg-gradient-to-b from-gray-900/95 to-purple-900/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-2xl w-full max-w-4xl border border-purple-500/30">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-purple-500/30">
                <h2 className="text-xl font-bold text-white">Product Details</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="md:w-1/2">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="relative w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:w-1/2">
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-purple-400 mb-4">{product.category}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-gray-400 text-sm">Price</label>
                        <p className="text-white font-bold text-lg">${product.price?.toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Quantity</label>
                        <p className="text-white font-bold text-lg">{product.quantity}</p>
                      </div>
                    </div>

                    {product.specs && (
                      <div>
                        <label className="text-gray-400 text-sm block mb-2">Specifications</label>
                        {typeof product.specs === 'object' ? (
                          <div className="space-y-2">
                            {Object.entries(product.specs).map(([key, value]) => (
                              <div key={key} className="grid grid-cols-2 text-sm">
                                <span className="text-gray-400 capitalize">{key}:</span>
                                <span className="text-white">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white text-sm">{product.specs}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 border-t border-purple-500/30">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:border-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={onSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <FaSave className="w-4 h-4" />
                  <span>Save Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPopup; 