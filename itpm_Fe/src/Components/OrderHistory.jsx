import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave, FaShoppingBag, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrderHistory = ({ 
  orders, 
  onDeleteOrder,
  onSaveOrder,
  showProductPopup,
  setShowProductPopup,
  currentProduct,
  setCurrentProduct
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [localOrders, setLocalOrders] = useState(orders);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Update localOrders when orders prop changes
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to delete orders');
        return;
      }

      if (!orderToDelete) return;

      const response = await axios.delete(`http://localhost:3001/api/cart/${orderToDelete._id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        // Update local state immediately
        setLocalOrders(prevOrders => prevOrders.filter(order => order._id !== orderToDelete._id));
        
        // Notify parent component
        if (onDeleteOrder) {
          onDeleteOrder(orderToDelete._id);
        }
        
        toast.success('Order deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete order');
    } finally {
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
    }
  };

  const handleSaveOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to save orders');
        return;
      }

      // Get the active cart
      const response = await axios.get('http://localhost:3001/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data || !response.data.items || response.data.items.length === 0) {
        toast.error('No items in cart to save');
        return;
      }

      // Update cart status to completed
      await axios.put('http://localhost:3001/api/cart/status', 
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      toast.success('Orders saved successfully!');
      setShowProductPopup(false);
      
      if (onSaveOrder) {
        onSaveOrder();
      }

    } catch (error) {
      console.error('Error saving orders:', error);
      toast.error(error.response?.data?.message || 'Failed to save orders');
    }
  };

  const handleNoteEdit = (order) => {
    setEditingNote(order._id);
    setNoteText(order.userNote || '');
  };

  const handleNoteSave = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to save notes');
        return;
      }

      const response = await axios.put(
        `http://localhost:3001/api/cart/${orderId}/note`,
        { userNote: noteText },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setLocalOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, userNote: noteText }
              : order
          )
        );
        toast.success('Note saved successfully');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setEditingNote(null);
      setNoteText('');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Product Popup */}
      {showProductPopup && currentProduct && (
        <div className="absolute top-0 left-0 right-0 flex justify-center z-[100]">
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-8 max-w-3xl w-full mx-4 border border-purple-900/50 shadow-2xl mt-4">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">Product Details</h3>
                <p className="text-purple-400 text-sm">View complete product information</p>
              </div>
              <button
                onClick={() => setShowProductPopup(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl hover:rotate-90 transform duration-300"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-full h-80 object-cover rounded-lg border border-purple-900/30 group-hover:border-purple-500/50 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-purple-900/30">
                  <p className="text-sm text-gray-400 mb-2">Product ID: #{currentProduct._id}</p>
                  <p className="text-sm text-gray-400">Category: {currentProduct.category}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-medium text-white mb-2">{currentProduct.name}</h4>
                  <p className="text-3xl font-bold text-purple-400">${currentProduct.price}</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-black/20 p-4 rounded-lg border border-purple-900/30">
                    <h5 className="text-sm font-medium text-white mb-3">Specifications</h5>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Quantity: {currentProduct.quantity}</p>
                      {currentProduct.specs && Object.entries(currentProduct.specs).map(([key, value]) => (
                        <p key={key} className="text-sm text-gray-400">
                          {key}: {value}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowProductPopup(false)}
                      className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex-1"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSaveOrders}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 flex-1 font-medium"
                    >
                      Save Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History Table */}
      <div className="mt-8">
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FaShoppingBag className="text-purple-400" />
              Order History
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-800">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">User Note</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {localOrders.map((order) => (
                  <tr key={order._id} className="bg-black/10 hover:bg-purple-900/20 transition-colors duration-300">
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-white tracking-wide">
                      #{order._id}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-300 tracking-wide">
                      <div className="flex items-center gap-3">
                        <img 
                          src={order.product?.image} 
                          alt={order.product?.name}
                          className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all duration-300"
                          onClick={() => {
                            setCurrentProduct(order.product);
                            setShowProductPopup(true);
                          }}
                        />
                        <div>
                          <p className="font-medium text-white">{order.product?.name}</p>
                          <p className="text-xs text-gray-400">
                            {order.product?.category} • Qty: {order.product?.quantity}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-300 tracking-wide">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-white tracking-wide">
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full tracking-wide ${
                        order.status === 'completed' ? 'bg-green-900/50 text-green-200 border border-green-800' :
                        order.status === 'Processing' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-800' :
                        'bg-red-900/50 text-red-200 border border-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {editingNote === order._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="bg-gray-800 border border-purple-500/20 rounded-lg px-3 py-1 text-white text-sm w-full"
                            placeholder="Add a note..."
                          />
                          <button
                            onClick={() => handleNoteSave(order._id)}
                            className="text-green-400 hover:text-green-300 transition-colors duration-300"
                          >
                            <FaSave className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm">
                            {order.userNote || 'No note added'}
                          </span>
                          <button
                            onClick={() => handleNoteEdit(order)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-300"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && orderToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900/95 rounded-xl p-8 max-w-md w-full mx-4 border border-purple-900/50 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <FaTrash className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Delete Order</h3>
              <p className="text-gray-400 mt-2">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setOrderToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 