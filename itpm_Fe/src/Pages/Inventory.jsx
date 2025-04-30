import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye, FaPlus, FaBoxOpen, FaFilter, FaChartLine, FaUsers, FaCog, FaQuestionCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';
import DeleteConfirmationModal from '../Components/DeleteConfirmationModal';
import EditInventoryModal from '../Components/EditInventoryModal';
import ViewDetailsModal from '../Components/ViewDetailsModal';
import { inventoryService } from '../services/inventoryService';
import { toast } from 'react-toastify';

const Inventory = () => {
  // State management
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await inventoryService.getAllItems();
      console.log('Fetched inventory data:', data); // Debug log
      setInventory(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory items');
      toast.error('Failed to load inventory items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Filter and sort inventory
  const filteredInventory = inventory
    .filter(item => {
      if (!item) return false; // Skip null or undefined items
      
      const matchesSearch = (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'in-stock' && item.stock > 10) ||
        (filterStatus === 'low-stock' && item.stock > 0 && item.stock <= 10) ||
        (filterStatus === 'out-of-stock' && item.stock === 0);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'stock') return (a.stock || 0) - (b.stock || 0);
      if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
      return 0;
    });

  // Update pagination when filtered results change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredInventory.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredInventory.length, itemsPerPage]);

  // Calculate current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);

  // Handler functions
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleAddNew = () => {
    setShowNewItemModal(true);
  };

  const handleDownload = () => {
    const headers = ['Name', 'Brand', 'Stock', 'Price', 'Category'];
    const csvContent = [
      headers.join(','),
      ...filteredInventory.map(item => [
        `"${item.name || ''}"`,
        `"${item.brand || ''}"`,
        item.stock || 0,
        item.price || 0,
        `"${item.category || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmDelete = async () => {
    try {
      await inventoryService.deleteItem(selectedItem._id);
      toast.success('Item deleted successfully');
      fetchInventory(); // Refresh the data
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error('Failed to delete item');
      console.error('Error deleting item:', error);
    }
  };

  const handleSaveNewItem = async (newItem) => {
    try {
      await inventoryService.createItem(newItem);
      toast.success('Item added successfully');
      fetchInventory(); // Refresh the data
      setShowNewItemModal(false);
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Error adding item:', error);
    }
  };

  const handleSaveEdit = async (updatedItem) => {
    try {
      await inventoryService.updateItem(selectedItem._id, updatedItem);
      toast.success('Item updated successfully');
      fetchInventory(); // Refresh the data
      setShowEditModal(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error('Failed to update item');
      console.error('Error updating item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mt-[100px]">
          {/* Header Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-800/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
                <p className="text-gray-300 mt-1">Manage your product inventory efficiently</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-purple-600/50 text-white rounded-lg hover:bg-purple-600 flex items-center space-x-2 transition-all duration-200 border border-purple-500/50"
                >
                  <FaDownload />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-all duration-200"
                >
                  <FaPlus />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-96 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-purple-800/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none hover:bg-gray-700/50 transition-colors relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B5CF6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="all" className="bg-gray-800">All Status</option>
                  <option value="in-stock" className="bg-gray-800">In Stock</option>
                  <option value="low-stock" className="bg-gray-800">Low Stock</option>
                  <option value="out-of-stock" className="bg-gray-800">Out of Stock</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none hover:bg-gray-700/50 transition-colors relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B5CF6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="name" className="bg-gray-800">Sort by Name</option>
                  <option value="stock" className="bg-gray-800">Sort by Stock</option>
                  <option value="price" className="bg-gray-800">Sort by Price</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-800/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-800/50">
                  {currentItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-900/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-800/50">
                            <FaBoxOpen className="text-purple-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.stock === 0
                            ? 'bg-red-900/50 text-red-200 border border-red-800'
                            : item.stock <= 10
                            ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-800'
                            : 'bg-green-900/50 text-green-200 border border-green-800'
                        }`}>
                          {item.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button onClick={() => handleViewDetails(item)} className="text-purple-400 hover:text-purple-300">
                            <FaEye />
                          </button>
                          <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-300">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(item)} className="text-red-400 hover:text-red-300">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-300">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInventory.length)} of {filteredInventory.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={selectedItem?.name}
      />
      <EditInventoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={selectedItem}
        onSave={handleSaveEdit}
      />
      <ViewDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        item={selectedItem}
      />
      <EditInventoryModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        item={null}
        onSave={handleSaveNewItem}
      />
    </div>
  );
};

export default Inventory; 