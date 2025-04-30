import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye, FaPlus, FaBoxOpen, FaFilter, FaChartLine, FaUsers, FaCog, FaQuestionCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';
import DeleteConfirmationModal from '../Components/DeleteConfirmationModal';
import EditInventoryModal from '../Components/EditInventoryModal';
import ViewDetailsModal from '../Components/ViewDetailsModal';

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

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: 'Laptop Pro X',
        sku: 'LPX-001',
        brand: 'TechBrand',
        stock: 15,
        cost: 1200,
        details: {
          price: 1500,
          ram: '16GB',
          vga: 'NVIDIA RTX 3060',
          processor: 'Intel i7',
          storage: '512GB SSD',
          display: '15.6" FHD'
        }
      },
      {
        id: 2,
        name: 'MacBook Pro M3',
        sku: 'MBP-M3-001',
        brand: 'Apple',
        stock: 8,
        cost: 1800,
        details: {
          price: 2200,
          ram: '32GB',
          vga: 'M3 Integrated',
          processor: 'Apple M3',
          storage: '1TB SSD',
          display: '16" Retina'
        }
      },
      {
        id: 3,
        name: 'Dell XPS 15',
        sku: 'DXP-015',
        brand: 'Dell',
        stock: 12,
        cost: 1400,
        details: {
          price: 1800,
          ram: '32GB',
          vga: 'NVIDIA RTX 4070',
          processor: 'Intel i9',
          storage: '1TB SSD',
          display: '15.6" 4K OLED'
        }
      },
      {
        id: 4,
        name: 'Lenovo ThinkPad X1',
        sku: 'TPX-001',
        brand: 'Lenovo',
        stock: 20,
        cost: 1300,
        details: {
          price: 1700,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i7',
          storage: '512GB SSD',
          display: '14" FHD'
        }
      },
      {
        id: 5,
        name: 'ASUS ROG Zephyrus',
        sku: 'ROG-Z-001',
        brand: 'ASUS',
        stock: 5,
        cost: 2000,
        details: {
          price: 2500,
          ram: '32GB',
          vga: 'NVIDIA RTX 4080',
          processor: 'AMD Ryzen 9',
          storage: '2TB SSD',
          display: '16" QHD 165Hz'
        }
      },
      {
        id: 6,
        name: 'HP Spectre x360',
        sku: 'SPX-001',
        brand: 'HP',
        stock: 10,
        cost: 1100,
        details: {
          price: 1400,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i5',
          storage: '512GB SSD',
          display: '13.3" FHD Touch'
        }
      },
      {
        id: 7,
        name: 'Razer Blade 15',
        sku: 'RB-015',
        brand: 'Razer',
        stock: 7,
        cost: 1800,
        details: {
          price: 2200,
          ram: '16GB',
          vga: 'NVIDIA RTX 4070',
          processor: 'Intel i7',
          storage: '1TB SSD',
          display: '15.6" QHD 240Hz'
        }
      },
      {
        id: 8,
        name: 'MacBook Air M2',
        sku: 'MBA-M2-001',
        brand: 'Apple',
        stock: 25,
        cost: 900,
        details: {
          price: 1200,
          ram: '8GB',
          vga: 'M2 Integrated',
          processor: 'Apple M2',
          storage: '256GB SSD',
          display: '13.6" Retina'
        }
      },
      {
        id: 9,
        name: 'Dell Alienware x17',
        sku: 'ALW-X17',
        brand: 'Dell',
        stock: 3,
        cost: 2200,
        details: {
          price: 2800,
          ram: '32GB',
          vga: 'NVIDIA RTX 4090',
          processor: 'Intel i9',
          storage: '2TB SSD',
          display: '17.3" QHD 360Hz'
        }
      },
      {
        id: 10,
        name: 'Lenovo Legion Pro 7',
        sku: 'LGP-007',
        brand: 'Lenovo',
        stock: 6,
        cost: 1900,
        details: {
          price: 2400,
          ram: '32GB',
          vga: 'NVIDIA RTX 4080',
          processor: 'Intel i9',
          storage: '1TB SSD',
          display: '16" QHD 165Hz'
        }
      },
      {
        id: 11,
        name: 'MSI GE76 Raider',
        sku: 'MSI-GE76-001',
        brand: 'MSI',
        stock: 4,
        cost: 2500,
        details: {
          price: 3000,
          ram: '32GB',
          vga: 'NVIDIA RTX 4080',
          processor: 'Intel i9-13900H',
          storage: '2TB SSD',
          display: '17.3" QHD 240Hz'
        }
      },
      {
        id: 12,
        name: 'Acer Predator Helios 300',
        sku: 'ACH-300-001',
        brand: 'Acer',
        stock: 18,
        cost: 1300,
        details: {
          price: 1600,
          ram: '16GB',
          vga: 'NVIDIA RTX 4060',
          processor: 'Intel i7-13700H',
          storage: '1TB SSD',
          display: '15.6" QHD 165Hz'
        }
      },
      {
        id: 13,
        name: 'LG Gram 17',
        sku: 'LGG-17-001',
        brand: 'LG',
        stock: 22,
        cost: 1400,
        details: {
          price: 1700,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i7-1360P',
          storage: '1TB SSD',
          display: '17" WQXGA'
        }
      },
      {
        id: 14,
        name: 'Framework Laptop 16',
        sku: 'FWL-16-001',
        brand: 'Framework',
        stock: 8,
        cost: 1600,
        details: {
          price: 1900,
          ram: '32GB',
          vga: 'AMD Radeon 780M',
          processor: 'AMD Ryzen 9 7940HS',
          storage: '1TB SSD',
          display: '16" QHD 165Hz'
        }
      },
      {
        id: 15,
        name: 'XPS 13 Plus',
        sku: 'DXP-13P-001',
        brand: 'Dell',
        stock: 12,
        cost: 1500,
        details: {
          price: 1800,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i7-1360P',
          storage: '512GB SSD',
          display: '13.4" 4K OLED'
        }
      },
      {
        id: 16,
        name: 'ThinkPad X1 Carbon',
        sku: 'TPX-1C-001',
        brand: 'Lenovo',
        stock: 25,
        cost: 1400,
        details: {
          price: 1700,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i7-1360P',
          storage: '512GB SSD',
          display: '14" WUXGA'
        }
      },
      {
        id: 17,
        name: 'ROG Strix G16',
        sku: 'ROG-SG-001',
        brand: 'ASUS',
        stock: 6,
        cost: 1800,
        details: {
          price: 2200,
          ram: '16GB',
          vga: 'NVIDIA RTX 4070',
          processor: 'Intel i9-13900H',
          storage: '1TB SSD',
          display: '16" QHD 165Hz'
        }
      },
      {
        id: 18,
        name: 'MacBook Pro 14"',
        sku: 'MBP-14-001',
        brand: 'Apple',
        stock: 15,
        cost: 2000,
        details: {
          price: 2400,
          ram: '16GB',
          vga: 'M3 Pro Integrated',
          processor: 'Apple M3 Pro',
          storage: '512GB SSD',
          display: '14.2" Liquid Retina XDR'
        }
      },
      {
        id: 19,
        name: 'Surface Laptop 5',
        sku: 'MSL-5-001',
        brand: 'Microsoft',
        stock: 20,
        cost: 1300,
        details: {
          price: 1600,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i7-1255U',
          storage: '512GB SSD',
          display: '13.5" PixelSense'
        }
      },
      {
        id: 20,
        name: 'Razer Blade 14',
        sku: 'RB-14-001',
        brand: 'Razer',
        stock: 9,
        cost: 1900,
        details: {
          price: 2300,
          ram: '16GB',
          vga: 'NVIDIA RTX 4070',
          processor: 'AMD Ryzen 9 7940HS',
          storage: '1TB SSD',
          display: '14" QHD 165Hz'
        }
      },
      // New products
      {
        id: 21,
        name: 'HP Omen 17',
        sku: 'HPO-17-001',
        brand: 'HP',
        stock: 7,
        cost: 1700,
        details: {
          price: 2100,
          ram: '32GB',
          vga: 'NVIDIA RTX 4070',
          processor: 'Intel i7-13700HX',
          storage: '1TB SSD',
          display: '17.3" QHD 165Hz'
        }
      },
      {
        id: 22,
        name: 'Gigabyte Aorus 15',
        sku: 'GA-15-001',
        brand: 'Gigabyte',
        stock: 11,
        cost: 1600,
        details: {
          price: 2000,
          ram: '16GB',
          vga: 'NVIDIA RTX 4060',
          processor: 'Intel i7-13700H',
          storage: '1TB SSD',
          display: '15.6" QHD 165Hz'
        }
      },
      {
        id: 23,
        name: 'Samsung Galaxy Book 3 Ultra',
        sku: 'SGB-3U-001',
        brand: 'Samsung',
        stock: 15,
        cost: 1900,
        details: {
          price: 2300,
          ram: '32GB',
          vga: 'NVIDIA RTX 4070',
          processor: 'Intel i9-13900H',
          storage: '1TB SSD',
          display: '16" AMOLED 3K'
        }
      },
      {
        id: 24,
        name: 'Lenovo Yoga 9i',
        sku: 'LY-9I-001',
        brand: 'Lenovo',
        stock: 13,
        cost: 1500,
        details: {
          price: 1800,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i7-1360P',
          storage: '512GB SSD',
          display: '14" 4K OLED'
        }
      },
      {
        id: 25,
        name: 'ASUS ZenBook 14 OLED',
        sku: 'AZ-14O-001',
        brand: 'ASUS',
        stock: 16,
        cost: 1200,
        details: {
          price: 1500,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i7-1360P',
          storage: '512GB SSD',
          display: '14" 2.8K OLED'
        }
      },
      {
        id: 26,
        name: 'Dell Latitude 9440',
        sku: 'DL-9440-001',
        brand: 'Dell',
        stock: 19,
        cost: 1600,
        details: {
          price: 1900,
          ram: '16GB',
          vga: 'Intel Iris Xe',
          processor: 'Intel i7-1360P',
          storage: '512GB SSD',
          display: '14" QHD+'
        }
      },
      {
        id: 27,
        name: 'MacBook Air 15"',
        sku: 'MBA-15-001',
        brand: 'Apple',
        stock: 14,
        cost: 1300,
        details: {
          price: 1600,
          ram: '8GB',
          vga: 'M2 Integrated',
          processor: 'Apple M2',
          storage: '256GB SSD',
          display: '15.3" Liquid Retina'
        }
      },
      {
        id: 28,
        name: 'MSI Prestige 14',
        sku: 'MSP-14-001',
        brand: 'MSI',
        stock: 8,
        cost: 1400,
        details: {
          price: 1700,
          ram: '16GB',
          vga: 'NVIDIA RTX 4050',
          processor: 'Intel i7-13700H',
          storage: '512GB SSD',
          display: '14" QHD+'
        }
      },
      {
        id: 29,
        name: 'Acer Swift X 14',
        sku: 'ASX-14-001',
        brand: 'Acer',
        stock: 12,
        cost: 1100,
        details: {
          price: 1400,
          ram: '16GB',
          vga: 'NVIDIA RTX 4050',
          processor: 'AMD Ryzen 7 7840U',
          storage: '512GB SSD',
          display: '14" 2.8K OLED'
        }
      },
      {
        id: 30,
        name: 'ROG Flow X13',
        sku: 'RFX-13-001',
        brand: 'ASUS',
        stock: 6,
        cost: 1500,
        details: {
          price: 1800,
          ram: '16GB',
          vga: 'NVIDIA RTX 4060',
          processor: 'AMD Ryzen 9 7940HS',
          storage: '512GB SSD',
          display: '13.4" 2.8K OLED'
        }
      }
    ];
    setInventory(mockData);
  }, []);

  // Filter and sort inventory
  const filteredInventory = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'in-stock' && item.stock > 10) ||
        (filterStatus === 'low-stock' && item.stock > 0 && item.stock <= 10) ||
        (filterStatus === 'out-of-stock' && item.stock === 0);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return a.stock - b.stock;
      if (sortBy === 'price') return a.details.price - b.details.price;
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
    setSelectedItem(null);
    setShowNewItemModal(true);
  };

  const handleDownload = () => {
    const headers = ['Name', 'SKU', 'Brand', 'Stock', 'Cost', 'Retail Price', 'Processor', 'RAM', 'Graphics Card', 'Storage', 'Display'];
    const csvContent = [
      headers.join(','),
      ...filteredInventory.map(item => [
        `"${item.name}"`,
        `"${item.sku}"`,
        `"${item.brand}"`,
        item.stock,
        item.cost,
        item.details.price,
        `"${item.details.processor}"`,
        `"${item.details.ram}"`,
        `"${item.details.vga}"`,
        `"${item.details.storage}"`,
        `"${item.details.display}"`
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
    if (selectedItem) {
      setInventory(inventory.filter(item => item.id !== selectedItem.id));
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  const handleSaveNewItem = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: inventory.length + 1
    };
    setInventory([...inventory, itemWithId]);
    setShowNewItemModal(false);
    setSelectedItem(null);
  };

  const handleSaveEdit = (updatedItem) => {
    if (selectedItem) {
      setInventory(inventory.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      ));
      setShowEditModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex flex-col pt-[60px]">
      {/* Header Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-800/50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
              <p className="text-gray-300 mt-1 text-sm">Manage your product inventory efficiently</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-purple-600/50 text-white rounded-lg hover:bg-purple-600 flex items-center space-x-2 transition-all duration-200 border border-purple-500/50 hover:border-purple-400 text-sm"
              >
                <FaDownload className="text-base" />
                <span>Download CSV</span>
              </button>
              <button
                onClick={handleAddNew}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-all duration-200 text-sm"
              >
                <FaPlus className="text-base" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-800/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 bg-gray-900/50 border border-purple-800/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-gray-900/50 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-gray-900/50 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="stock">Sort by Stock</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-800/50 overflow-hidden h-[calc(100vh-280px)]">
          <div className="overflow-x-auto h-full">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-900/50 border-b border-purple-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Brand</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Cost</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Retail Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/50">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-900/30 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-900/30 rounded-lg flex items-center justify-center border border-purple-800/50">
                          <FaBoxOpen className="text-purple-400 text-sm" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{item.name}</div>
                          <div className="text-xs text-gray-400">{item.details.processor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-300">{item.sku}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-300">{item.brand}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.stock < 5 ? 'bg-red-900/50 text-red-200 border border-red-800' :
                        item.stock < 10 ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-800' :
                        'bg-green-900/50 text-green-200 border border-green-800'
                      }`}>
                        {item.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-300">${item.cost}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-300">${item.details.price}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                        >
                          <FaEye className="text-base" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          <FaEdit className="text-base" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <FaTrash className="text-base" />
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

      {/* Pagination */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-sm text-gray-300">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInventory.length)} of {filteredInventory.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-900/50 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600/50 text-white hover:bg-purple-600 border border-purple-500/50 hover:border-purple-400'
                }`}
              >
                <FaChevronLeft className="text-base" />
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                      currentPage === page
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-900/50 text-gray-300 hover:bg-purple-600/50 border border-purple-800/50 hover:border-purple-400'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-900/50 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600/50 text-white hover:bg-purple-600 border border-purple-500/50 hover:border-purple-400'
                }`}
              >
                <FaChevronRight className="text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onConfirm={confirmDelete}
        itemName={selectedItem?.name}
      />

      <EditInventoryModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSave={handleSaveEdit}
      />

      <EditInventoryModal
        isOpen={showNewItemModal}
        onClose={() => {
          setShowNewItemModal(false);
          setSelectedItem(null);
        }}
        item={null}
        onSave={handleSaveNewItem}
      />

      <ViewDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-purple-800/50 mt-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <FaBoxOpen className="text-purple-500 text-xl" />
                </div>
                <h3 className="text-lg font-bold text-white">Inventory System</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Efficiently manage your product inventory with our comprehensive system.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                    Reports
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <FaEnvelope className="text-purple-500" />
                  <span>support@inventory.com</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <FaPhone className="text-purple-500" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400 text-sm">
                  <FaMapMarkerAlt className="text-purple-500" />
                  <span>123 Business Ave, Suite 100</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-purple-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Inventory System. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Inventory; 