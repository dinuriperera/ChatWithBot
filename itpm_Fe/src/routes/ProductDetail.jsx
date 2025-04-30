import React, { useState } from 'react';
import { FaShieldAlt, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';

const ProductDetail = () => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedRAM, setSelectedRAM] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Mock product data (replace with actual data from your backend)
  const product = {
    id: 1,
    name: "MacBook Pro M3",
    price: 2000.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop",
    rating: 4.8,
    specs: "M3 Chip, 16GB RAM, 512GB SSD",
    brand: "Apple",
    description: "Experience the power of Apple's latest M3 chip with this stunning MacBook Pro. Perfect for professionals and creatives.",
    colors: ["Space Gray", "Silver", "Gold"],
    ramOptions: ["8GB", "16GB", "32GB"],
    stock: 15
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new order
    const newOrder = {
      id: Date.now(), // Use timestamp as order ID
      date: new Date().toISOString(),
      product: {
        ...product,
        selectedColor,
        selectedRAM,
        quantity
      },
      status: 'Processing',
      shippingInfo: formData
    };

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Add new order to the list
    const updatedOrders = [...existingOrders, newOrder];
    
    // Save updated orders to localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Navigate to profile page orders tab
    navigate('/profile?tab=orders');
  };

  return (
    <div className="mt-[60px] min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image and Basic Info */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-xl shadow-2xl"
            />
            <div className="mt-6">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <FaStar className="text-yellow-400" />
                <span>{product.rating}</span>
              </div>
              <p className="text-2xl font-bold text-purple-400 mb-4">${product.price}</p>
              <p className="text-gray-300">{product.description}</p>
            </div>
          </div>

          {/* Product Configuration and Checkout Form */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/50">
            <h2 className="text-2xl font-semibold mb-6">Configure Your Product</h2>
            
            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                      selectedColor === color
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'border-purple-900/50 text-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* RAM Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select RAM</h3>
              <div className="flex gap-3">
                {product.ramOptions.map((ram) => (
                  <button
                    key={ram}
                    onClick={() => setSelectedRAM(ram)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                      selectedRAM === ram
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'border-purple-900/50 text-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                >
                  -
                </button>
                <span className="text-xl font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  className="w-10 h-10 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <FaShieldAlt className="text-purple-400" />
                <span className="text-sm text-gray-400">Secure payment with SSL encryption</span>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center gap-2 mt-6"
              >
                <FaShoppingCart />
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail; 