import React from 'react';
import { FaShoppingBag, FaCalendarAlt, FaBox, FaEdit, FaTrash } from 'react-icons/fa';

const OrderHistory = ({ orders, onEditOrder, onDeleteOrder }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/50">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FaShoppingBag className="text-purple-400" />
        Order History
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-purple-800">
          <thead className="bg-black/40">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Order ID</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Product</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Total</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="bg-black/10 hover:bg-purple-900/20 transition-colors duration-300">
                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-white tracking-wide">#{order.id}</td>
                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-300 tracking-wide">
                  <div className="flex items-center gap-3">
                    <img 
                      src={order.product?.image} 
                      alt={order.product?.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">{order.product?.name}</p>
                      <p className="text-xs text-gray-400">
                        {order.product?.selectedColor} • {order.product?.selectedRAM} • Qty: {order.product?.quantity}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-300 tracking-wide">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-white tracking-wide">
                  ${(order.product?.price * order.product?.quantity).toFixed(2)}
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full tracking-wide ${
                    order.status === 'Completed' ? 'bg-green-900/50 text-green-200 border border-green-800' :
                    order.status === 'Processing' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-800' :
                    'bg-red-900/50 text-red-200 border border-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEditOrder(order)}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDeleteOrder(order)}
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
  );
};

export default OrderHistory; 