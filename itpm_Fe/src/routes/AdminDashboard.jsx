import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaMicrochip, FaMemory, FaHdd, FaDesktop, FaThermometerHalf, FaBox } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const AdminDashboard = () => {
  const [components, setComponents] = useState({
    cpu: [],
    ram: [],
    ssd: [],
    gpu: [],
    motherboard: [],
    psu: [],
    case: [],
    cooling: []
  });

  const [editingComponent, setEditingComponent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newComponent, setNewComponent] = useState({
    name: '',
    price: '',
    specs: '',
    brand: '',
    size: '',
    speed: '',
    capacity: '',
    type: '',
    wattage: '',
    formFactor: '',
    coolingType: '',
    rgb: false,
    stock: 0
  });

  // Load components from localStorage on mount
  useEffect(() => {
    const savedComponents = localStorage.getItem('pcComponents');
    if (savedComponents) {
      setComponents(JSON.parse(savedComponents));
    }
  }, []);

  // Save components to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pcComponents', JSON.stringify(components));
  }, [components]);

  const handleAddComponent = () => {
    if (!selectedCategory || !newComponent.name || !newComponent.price || !newComponent.specs || !newComponent.brand) {
      alert('Please fill in all fields');
      return;
    }

    const updatedComponents = {
      ...components,
      [selectedCategory]: [
        ...components[selectedCategory],
        {
          id: Date.now(),
          ...newComponent,
          price: parseFloat(newComponent.price)
        }
      ]
    };

    setComponents(updatedComponents);
    setShowAddModal(false);
    setNewComponent({ name: '', price: '', specs: '', brand: '', size: '', speed: '', capacity: '', type: '', wattage: '', formFactor: '', coolingType: '', rgb: false, stock: 0 });
  };

  const handleEditComponent = (category, component) => {
    setEditingComponent({ category, ...component });
    setNewComponent({
      name: component.name,
      price: component.price.toString(),
      specs: component.specs,
      brand: component.brand,
      size: component.size || '',
      speed: component.speed || '',
      capacity: component.capacity || '',
      type: component.type || '',
      wattage: component.wattage || '',
      formFactor: component.formFactor || '',
      coolingType: component.coolingType || '',
      rgb: component.rgb || false,
      stock: component.stock || 0
    });
  };

  const handleSaveEdit = () => {
    if (!editingComponent || !newComponent.name || !newComponent.price || !newComponent.specs || !newComponent.brand) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedComponents = {
      ...components,
      [editingComponent.category]: components[editingComponent.category].map(item =>
        item.id === editingComponent.id
          ? {
              ...item,
              name: newComponent.name,
              price: parseFloat(newComponent.price),
              specs: newComponent.specs,
              brand: newComponent.brand,
              size: newComponent.size,
              speed: newComponent.speed,
              capacity: newComponent.capacity,
              type: newComponent.type,
              wattage: newComponent.wattage,
              formFactor: newComponent.formFactor,
              coolingType: newComponent.coolingType,
              rgb: newComponent.rgb,
              stock: parseInt(newComponent.stock)
            }
          : item
      )
    };

    setComponents(updatedComponents);
    setEditingComponent(null);
    setNewComponent({ 
      name: '', 
      price: '', 
      specs: '', 
      brand: '', 
      size: '', 
      speed: '', 
      capacity: '', 
      type: '', 
      wattage: '', 
      formFactor: '', 
      coolingType: '', 
      rgb: false, 
      stock: 0 
    });
  };

  const handleDeleteComponent = (category, id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      const updatedComponents = {
        ...components,
        [category]: components[category].filter(item => item.id !== id)
      };
      setComponents(updatedComponents);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'cpu': return <FaMicrochip />;
      case 'ram': return <FaMemory />;
      case 'ssd': return <FaHdd />;
      case 'gpu': return <FaDesktop />;
      case 'motherboard': return <FaBox />;
      case 'psu': return <FaThermometerHalf />;
      case 'case': return <FaBox />;
      case 'cooling': return <FaThermometerHalf />;
      default: return <FaBox />;
    }
  };

  const filteredComponents = (category) => {
    return components[category].filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2"
          >
            <FaPlus />
            Add New Component
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Component Categories */}
        {Object.entries(components).map(([category]) => (
          <div key={category} className="mb-8 bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                {getCategoryIcon(category)}
              </div>
              <h2 className="text-xl font-semibold text-white capitalize">{category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComponents(category).map((item) => (
                <div key={item.id} className="bg-black/20 rounded-lg p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{item.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComponent(category, item)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteComponent(category, item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">{item.specs}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-full">
                        {item.brand}
                      </span>
                      <span className="text-indigo-400 font-semibold">${item.price}</span>
                    </div>
                    {/* Additional component details */}
                    {item.size && (
                      <div className="text-xs text-gray-400">
                        Size: {item.size}GB
                      </div>
                    )}
                    {item.speed && (
                      <div className="text-xs text-gray-400">
                        Speed: {item.speed}MHz
                      </div>
                    )}
                    {item.capacity && (
                      <div className="text-xs text-gray-400">
                        Capacity: {item.capacity}
                      </div>
                    )}
                    {item.type && (
                      <div className="text-xs text-gray-400">
                        Type: {item.type}
                      </div>
                    )}
                    {item.wattage && (
                      <div className="text-xs text-gray-400">
                        Wattage: {item.wattage}W
                      </div>
                    )}
                    {item.formFactor && (
                      <div className="text-xs text-gray-400">
                        Form Factor: {item.formFactor}
                      </div>
                    )}
                    {item.coolingType && (
                      <div className="text-xs text-gray-400">
                        Cooling: {item.coolingType}
                      </div>
                    )}
                    {item.rgb !== undefined && (
                      <div className="text-xs text-gray-400">
                        RGB: {item.rgb ? 'Yes' : 'No'}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      Stock: {item.stock} units
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Component Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-indigo-500/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Add New Component</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Category</option>
                  {Object.keys(components).map(category => (
                    <option key={category} value={category} className="bg-gray-900 text-white">
                      {category.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                <input
                  type="number"
                  value={newComponent.price}
                  onChange={(e) => setNewComponent({ ...newComponent, price: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Specifications</label>
                <input
                  type="text"
                  value={newComponent.specs}
                  onChange={(e) => setNewComponent({ ...newComponent, specs: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                <input
                  type="text"
                  value={newComponent.brand}
                  onChange={(e) => setNewComponent({ ...newComponent, brand: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-indigo-500/20 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComponent}
                className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
              >
                Add Component
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Component Modal */}
      {editingComponent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-indigo-500/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Edit Component</h3>
              <button
                onClick={() => setEditingComponent(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                <input
                  type="number"
                  value={newComponent.price}
                  onChange={(e) => setNewComponent({ ...newComponent, price: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                <input
                  type="text"
                  value={newComponent.brand}
                  onChange={(e) => setNewComponent({ ...newComponent, brand: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Specifications</label>
                <textarea
                  value={newComponent.specs}
                  onChange={(e) => setNewComponent({ ...newComponent, specs: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                />
              </div>

              {/* Additional fields based on component category */}
              {editingComponent.category === 'ram' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Size (GB)</label>
                    <input
                      type="number"
                      value={newComponent.size}
                      onChange={(e) => setNewComponent({ ...newComponent, size: e.target.value })}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Speed (MHz)</label>
                    <input
                      type="number"
                      value={newComponent.speed}
                      onChange={(e) => setNewComponent({ ...newComponent, speed: e.target.value })}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </>
              )}

              {editingComponent.category === 'ssd' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Capacity (GB/TB)</label>
                    <input
                      type="text"
                      value={newComponent.capacity}
                      onChange={(e) => setNewComponent({ ...newComponent, capacity: e.target.value })}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={newComponent.type}
                      onChange={(e) => setNewComponent({ ...newComponent, type: e.target.value })}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="SATA">SATA</option>
                      <option value="NVMe">NVMe</option>
                      <option value="PCIe">PCIe</option>
                    </select>
                  </div>
                </>
              )}

              {editingComponent.category === 'psu' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Wattage</label>
                    <input
                      type="number"
                      value={newComponent.wattage}
                      onChange={(e) => setNewComponent({ ...newComponent, wattage: e.target.value })}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Form Factor</label>
                    <select
                      value={newComponent.formFactor}
                      onChange={(e) => setNewComponent({ ...newComponent, formFactor: e.target.value })}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Form Factor</option>
                      <option value="ATX">ATX</option>
                      <option value="SFX">SFX</option>
                      <option value="TFX">TFX</option>
                    </select>
                  </div>
                </>
              )}

              {editingComponent.category === 'cooling' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cooling Type</label>
                    <select
                      value={newComponent.coolingType}
                      onChange={(e) => setNewComponent({ ...newComponent, coolingType: e.target.value })}
                      className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Cooling Type</option>
                      <option value="Air">Air Cooling</option>
                      <option value="Liquid">Liquid Cooling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">RGB Support</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newComponent.rgb}
                        onChange={(e) => setNewComponent({ ...newComponent, rgb: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-300">RGB Support</span>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={newComponent.stock}
                  onChange={(e) => setNewComponent({ ...newComponent, stock: e.target.value })}
                  className="w-full bg-black/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingComponent(null)}
                className="px-4 py-2 border border-indigo-500/20 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard; 