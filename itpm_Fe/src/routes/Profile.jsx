import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaShoppingBag, FaHeart, FaComments, FaCog, FaEdit, FaTrash, FaSave, FaTimes, FaCamera, FaUpload, FaSignOutAlt, FaDownload, FaSpinner, FaMapMarkerAlt, FaBriefcase, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaCreditCard, FaGlobe, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import Slider from 'react-slick';
import Footer from '../Components/Footer';
import ProfileCover from '../../src/assets/Images/Home/Hero.jpg'
import OrderHistory from '../Components/OrderHistory';
import { useSearchParams, useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/carousel.css";
import axios from 'axios';
// Add Space Grotesk font import
const spaceGrotesk = {
  fontFamily: "'Space Grotesk', sans-serif",
};

const Profile = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop');
  const [coverImage, setCoverImage] = useState(ProfileCover);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    occupation: '',
    company: '',
    shippingAddress: '',
    billingAddress: '',
    preferredPayment: 'Credit Card',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    preferences: {
      newsletter: true,
      notifications: true,
      twoFactorAuth: false
    }
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [accountCreationDate] = useState('2023-09-15'); // This should come from your backend
  const [deleteError, setDeleteError] = useState('');
  const [success, setSuccess] = useState('');

  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  const [orders, setOrders] = useState([]);

  const [wishlist] = useState([
    {
      id: '1',
      name: 'Premium Laptop',
      price: '$1499.99',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Ultra Slim Laptop',
      price: '$1299.99',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop'
    }
  ]);

  const [chatHistory] = useState([
    {
      id: '1',
      date: '2024-03-15',
      message: 'Thank you for your purchase!'
    },
    {
      id: '2',
      date: '2024-03-10',
      message: 'Your order has been shipped.'
    }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    // Get orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || 'Male',
        occupation: user.occupation || '',
        company: user.company || '',
        shippingAddress: user.shippingAddress || '',
        billingAddress: user.billingAddress || '',
        preferredPayment: user.preferredPayment || 'Credit Card',
        socialMedia: user.socialMedia || {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        },
        preferences: user.preferences || {
          newsletter: true,
          notifications: true,
          twoFactorAuth: false
        }
      }));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // Here you would typically upload the image to your server
        // uploadProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        // Here you would typically upload the image to your server
        // uploadCoverImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:3001/api/auth/update-profile',
        { name: userData.name },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update localStorage with new user data
        const updatedUser = { ...JSON.parse(localStorage.getItem('user')), name: userData.name };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setDeleteError('Failed to update profile. Please try again.');
      setTimeout(() => setDeleteError(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText.toLowerCase() !== 'yes i need delete my account') {
      setDeleteError('Please type the exact phrase to confirm deletion');
      return;
    }
    
    // Here you would typically make an API call to delete the account
    localStorage.clear();
    navigate('/login');
  };

  const handleSaveEdit = () => {
    if (selectedOrder) {
      // Here you would typically update the order in your backend
      setShowEditModal(false);
      setSelectedOrder(null);
    }
  };

  const handleDownloadOrders = async () => {
    setIsDownloading(true);
    
    try {
      // Create CSV content
      const headers = [
        'Order ID',
        'Date',
        'Items',
        'Total',
        'Status'
      ];

      const csvContent = [
        headers.join(','),
        ...orders.map(order => [
          `"${order.id}"`,
          `"${order.date}"`,
          `"${order.items}"`,
          `"${order.total}"`,
          `"${order.status}"`
        ].join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error downloading orders:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const isAccountOldEnough = () => {
    const creationDate = new Date(accountCreationDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return creationDate <= sixMonthsAgo;
  };

  const handleDeleteAccount = () => {
    if (!isAccountOldEnough()) {
      setDeleteError('Your account must be at least 6 months old to be deleted.');
      return;
    }
    setShowDeleteConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white" style={spaceGrotesk}>
      {/* Profile Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative">
            {/* Cover Image */}
            <div className="relative h-96 md:h-[22rem] rounded-3xl overflow-hidden shadow-[0_35px_60px_-15px_rgba(99,102,241,0.3)]">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-500">
                <label className="cursor-pointer bg-white/90 backdrop-blur-xl text-gray-800 px-8 py-4 rounded-2xl flex items-center space-x-3 hover:bg-white transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] font-medium">
                  <FaCamera className="h-6 w-6" />
                  <span>Change Cover Photo</span>
                  <input
                    type="file"
                    ref={coverImageRef}
                    onChange={handleCoverImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Profile Image */}
            <div className="absolute -bottom-20 left-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <img
                  className="relative h-40 w-40 rounded-full object-cover ring-4 ring-indigo-500/30 transition-all duration-500 group-hover:scale-105"
                  src={profileImage}
                  alt="Profile"
                />
                <div className="absolute bottom-0 right-0 flex space-x-3">
                  <label className="cursor-pointer bg-indigo-600/90 backdrop-blur-xl text-white rounded-full p-3 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                    <FaCamera className="h-5 w-5" />
                    <input
                      type="file"
                      ref={profileImageRef}
                      onChange={handleProfileImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-indigo-600/90 backdrop-blur-xl text-white rounded-full p-3 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 tracking-tight">{userData.name}</h1>
            <p className="text-gray-300 font-light text-lg tracking-wide mt-2">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-indigo-500/20 p-1.5">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
            {[
              { id: 'profile', label: 'Profile', icon: FaUser },
              { id: 'orders', label: 'Orders', icon: FaShoppingBag },
              { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
              { id: 'chat', label: 'Chat History', icon: FaComments },
              { id: 'settings', label: 'Settings', icon: FaCog },
              { id: 'signout', label: 'Sign Out', icon: FaSignOutAlt }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-500 tracking-wide ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)] scale-105'
                    : 'text-gray-400 hover:text-indigo-300 hover:bg-indigo-900/30'
                }`}
              >
                <tab.icon className={`h-5 w-5 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="mt-8">
          {/* Profile Section */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Total Orders",
                    value: "24",
                    change: "↑ 12%",
                    period: "from last month",
                    icon: FaShoppingBag,
                    gradient: "from-indigo-600/20 to-blue-600/20"
                  },
                  {
                    title: "Wishlist Items",
                    value: "12",
                    change: "↑ 8%",
                    period: "from last week",
                    icon: FaHeart,
                    gradient: "from-sky-600/20 to-cyan-600/20"
                  },
                  {
                    title: "Reviews",
                    value: "48",
                    change: "↑ 24%",
                    period: "from last month",
                    icon: FaComments,
                    gradient: "from-blue-600/20 to-indigo-600/20"
                  },
                  {
                    title: "Total Spent",
                    value: "$2.4k",
                    change: "↑ 18%",
                    period: "from last month",
                    icon: FaCreditCard,
                    gradient: "from-violet-600/20 to-indigo-600/20"
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`group hover:scale-105 transition-all duration-500 bg-gradient-to-br ${stat.gradient} backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.3)]`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                          <stat.icon className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300" />
                        </div>
                        <span className="text-emerald-400 text-sm font-medium group-hover:text-emerald-300">{stat.change}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">{stat.value}</h3>
                        <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors duration-300">{stat.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity - Spans 2 columns */}
                <div className="lg:col-span-2 bg-gradient-to-br from-black/40 to-indigo-900/20 backdrop-blur-xl rounded-2xl border border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">Recent Activity</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                          <span className="text-indigo-300 text-sm">Last 7 days</span>
                        </div>
                        <button className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 text-sm flex items-center gap-2">
                          View All
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="relative px-8">
                      <Slider
                        dots={true}
                        infinite={true}
                        speed={500}
                        slidesToShow={2}
                        slidesToScroll={1}
                        autoplay={true}
                        autoplaySpeed={3000}
                        responsive={[
                          {
                            breakpoint: 1024,
                            settings: {
                              slidesToShow: 2,
                            }
                          },
                          {
                            breakpoint: 640,
                            settings: {
                              slidesToShow: 1,
                            }
                          }
                        ]}
                        className="activity-slider -mx-4"
                      >
                        {[
                          {
                            icon: FaShoppingBag,
                            title: "Purchased MacBook Pro",
                            time: "2 hours ago",
                            amount: "$1,999.00",
                            status: "Completed",
                            statusColor: "emerald",
                            bgGradient: "from-emerald-500/5 to-blue-500/5"
                          },
                          {
                            icon: FaHeart,
                            title: "Added to Wishlist",
                            time: "4 hours ago",
                            item: "iPhone 15 Pro",
                            status: "Saved",
                            statusColor: "pink",
                            bgGradient: "from-pink-500/5 to-purple-500/5"
                          },
                          {
                            icon: FaComments,
                            title: "Reviewed Product",
                            time: "1 day ago",
                            item: "Dell XPS 13",
                            status: "Published",
                            statusColor: "blue",
                            bgGradient: "from-blue-500/5 to-indigo-500/5"
                          },
                          {
                            icon: FaCreditCard,
                            title: "Payment Processed",
                            time: "2 days ago",
                            amount: "$899.00",
                            status: "Success",
                            statusColor: "indigo",
                            bgGradient: "from-indigo-500/5 to-violet-500/5"
                          }
                        ].map((activity, index) => (
                          <div key={index} className="px-4 py-2">
                            <div className={`bg-gradient-to-br ${activity.bgGradient} backdrop-blur-sm rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 group hover:transform hover:scale-[1.02] hover:shadow-xl`}>
                              <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4">
                                    <div className={`bg-${activity.statusColor}-500/10 p-3 rounded-xl group-hover:scale-110 transition-all duration-300`}>
                                      <activity.icon className={`h-6 w-6 text-${activity.statusColor}-400`} />
                                    </div>
                                    <div>
                                      <h4 className="text-white font-medium group-hover:text-indigo-300 transition-colors duration-300">{activity.title}</h4>
                                      <p className="text-gray-400 text-sm mt-1">{activity.time}</p>
                                    </div>
                                  </div>
                                  <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${activity.statusColor}-500/10 text-${activity.statusColor}-400 border border-${activity.statusColor}-500/20`}>
                                    {activity.status}
                                  </div>
                                </div>
                                <div className="ml-14">
                                  {activity.amount && (
                                    <p className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">
                                      {activity.amount}
                                    </p>
                                  )}
                                  {activity.item && (
                                    <p className="text-gray-300 group-hover:text-indigo-300 transition-colors duration-300">
                                      {activity.item}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                  <div className="border-t border-indigo-500/20 p-6 bg-black/20">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">Showing recent 4 of 24 activities</p>
                      <button className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 text-sm flex items-center gap-2 group">
                        See all activities
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Stats - Spans 1 column */}
                <div className="bg-gradient-to-br from-indigo-600/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20">
                  <h3 className="text-xl font-semibold text-white mb-6">Personal Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FaHeart className="text-pink-500 h-5 w-5" />
                        <span className="text-gray-300">Wishlist Items</span>
                      </div>
                      <span className="text-white font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FaComments className="text-blue-500 h-5 w-5" />
                        <span className="text-gray-300">Reviews Given</span>
                      </div>
                      <span className="text-white font-semibold">48</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FaCreditCard className="text-emerald-500 h-5 w-5" />
                        <span className="text-gray-300">Total Spent</span>
                      </div>
                      <span className="text-white font-semibold">$2.4k</span>
                    </div>
                  </div>
                </div>

                {/* Personal Information - Spans full width */}
                <div className="lg:col-span-3 bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25"
                      >
                        <FaEdit className="h-5 w-5" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex gap-4">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 border border-indigo-500/50 rounded-xl text-indigo-300 hover:bg-indigo-900/30 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaTimes className="h-5 w-5" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-6 py-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25"
                        >
                          <FaSave className="h-5 w-5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Personal Details Fields */}
                    {[
                      { icon: FaUser, label: 'Full Name', value: userData.name, type: 'text', field: 'name' },
                      { icon: FaEnvelope, label: 'Email', value: userData.email, type: 'email', field: 'email' },
                      { icon: FaPhone, label: 'Phone', value: userData.phone, type: 'tel', field: 'phone' },
                      { icon: FaCalendarAlt, label: 'Date of Birth', value: userData.dateOfBirth, type: 'date', field: 'dateOfBirth' },
                      { icon: FaVenusMars, label: 'Gender', value: userData.gender, type: 'select', field: 'gender', 
                        options: ['Male', 'Female', 'Other'] },
                      { icon: FaBriefcase, label: 'Occupation', value: userData.occupation, type: 'text', field: 'occupation' }
                    ].map((field, index) => (
                      <div key={index} className="bg-indigo-900/20 rounded-xl p-4 border border-indigo-500/20">
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-500/20 p-3 rounded-xl">
                            <field.icon className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-400">{field.label}</label>
                            {isEditing ? (
                              field.type === 'select' ? (
                                <select
                                  value={field.value}
                                  onChange={(e) => setUserData({ ...userData, [field.field]: e.target.value })}
                                  className="mt-1 w-full bg-indigo-900/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                >
                                  {field.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={field.type}
                                  value={field.value}
                                  onChange={(e) => setUserData({ ...userData, [field.field]: e.target.value })}
                                  className="mt-1 w-full bg-indigo-900/20 border border-indigo-500/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                />
                              )
                            ) : (
                              <p className="text-white font-medium mt-1">{field.value}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media and Preferences Grid */}
                <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Social Media Links */}
                  <div className="glass-effect gradient-border bg-gradient-to-br from-indigo-600/10 to-indigo-900/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
                    <h3 className="text-xl font-semibold text-white  ml-6 mt-6">Social Media</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'facebook', icon: FaFacebookF, color: 'blue', label: 'Facebook' },
                        { name: 'twitter', icon: FaTwitter, color: 'sky', label: 'Twitter' },
                        { name: 'linkedin', icon: FaLinkedinIn, color: 'blue', label: 'LinkedIn' },
                        { name: 'instagram', icon: FaInstagram, color: 'pink', label: 'Instagram' }
                      ].map((social) => (
                        <div key={social.name} className="bg-black/20 rounded-xl p-4 hover:bg-black/30 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`bg-${social.color}-500/20 p-2 rounded-lg`}>
                                <social.icon className={`h-5 w-5 text-${social.color}-400`} />
                              </div>
                              <span className="text-gray-300">{social.label}</span>
                            </div>
                            {isEditing ? (
                              <input
                                type="url"
                                value={userData.socialMedia[social.name]}
                                onChange={(e) => setUserData({
                                  ...userData,
                                  socialMedia: { ...userData.socialMedia, [social.name]: e.target.value }
                                })}
                                placeholder={`https://${social.name}.com/username`}
                                className="w-32 bg-indigo-900/20 border border-indigo-500/20 rounded-lg px-3 py-1 text-white text-sm"
                              />
                            ) : userData.socialMedia[social.name] ? (
                              <a
                                href={userData.socialMedia[social.name]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
                              >
                                Visit
                              </a>
                            ) : (
                              <span className="text-gray-500 text-sm">Not linked</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="bg-gradient-to-br from-indigo-600/10 to-indigo-900/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
                    <h3 className="text-xl font-semibold text-white mb-6">Preferences</h3>
                    <div className="space-y-4">
                      {Object.entries(userData.preferences).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                          <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setUserData({
                                ...userData,
                                preferences: { ...userData.preferences, [key]: e.target.checked }
                              })}
                              className="sr-only"
                              id={`toggle-${key}`}
                              disabled={!isEditing}
                            />
                            <label
                              htmlFor={`toggle-${key}`}
                              className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
                                value ? 'bg-indigo-600' : 'bg-gray-600'
                              } cursor-pointer`}
                            >
                              <span
                                className={`block w-6 h-6 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                                  value ? 'translate-x-6' : ''
                                }`}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Section */}
          {activeTab === 'orders' && (
            <div className="bg-black/30 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-indigo-900/50">
              <div className="p-6 border-b border-indigo-800 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">My Orders</h2>
                <button
                  onClick={handleDownloadOrders}
                  disabled={isDownloading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDownloading
                      ? 'bg-indigo-700 text-gray-300 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <FaDownload />
                      <span>Download Orders</span>
                    </>
                  )}
                </button>
              </div>
              {showNotification && (
                <div className="notification fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                  Orders downloaded successfully!
                </div>
              )}
              <OrderHistory 
                orders={orders} 
                onEditOrder={handleEditOrder}
                onDeleteOrder={handleDeleteOrder}
              />
            </div>
          )}

          {/* Wishlist Section */}
          {activeTab === 'wishlist' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-black/30 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-indigo-900/50 transform hover:scale-105 transition-all duration-300">
                  <img src={item.image} alt={item.name} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 tracking-wide">{item.name}</h3>
                    <p className="text-xl font-medium text-indigo-400 mb-4 tracking-wide">{item.price}</p>
                    <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-medium transition-all duration-300 tracking-wide">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chat History Section */}
          {activeTab === 'chat' && (
            <div className="bg-black/30 backdrop-blur-sm shadow-xl rounded-xl divide-y divide-indigo-800 border border-indigo-900/50">
              {chatHistory.map((chat) => (
                <div key={chat.id} className="p-6 hover:bg-indigo-900/20 transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <p className="text-base text-white tracking-wide">{chat.message}</p>
                    <span className="text-sm text-gray-400 tracking-wide">{chat.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Settings Section */}
          {activeTab === 'settings' && (
            <div className="bg-black/30 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-indigo-900/50">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-400 mb-6 tracking-wide">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">Current Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg bg-white/5 border border-indigo-900/50 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 font-light p-3 transition-all duration-300 tracking-wide"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg bg-white/5 border border-indigo-900/50 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 font-light p-3 transition-all duration-300 tracking-wide"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg bg-white/5 border border-indigo-900/50 text-white shadow-sm focus:border-indigo-400 focus:ring-indigo-400 font-light p-3 transition-all duration-300 tracking-wide"
                      />
                    </div>
                    <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-medium transition-all duration-300 tracking-wide">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="border-t border-indigo-800 pt-8">
                  <h3 className="text-xl font-semibold text-red-400 mb-4 tracking-wide">Delete Account</h3>
                  <p className="text-gray-300 mb-6 tracking-wide">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-900/50 text-red-100 py-3 px-6 rounded-lg hover:bg-red-800/50 flex items-center font-medium border border-red-700 transition-all duration-300 tracking-wide">
                    <FaTrash className="mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Section */}
          {activeTab === 'signout' && (
            <div className="bg-black/30 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-indigo-900/50">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/20 mb-4">
                    <FaSignOutAlt className="h-8 w-8 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Sign Out & Account Management</h2>
                  <p className="text-gray-300 mb-8">
                    You can sign out safely or manage your account deletion here.
                    Please note that account deletion is permanent and cannot be undone.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <button
                    onClick={handleLogout}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <FaSignOutAlt className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                    <span>Sign Out Safely</span>
                  </button>

                  <div className="border-t border-indigo-800 pt-8">
                    <div className="bg-red-900/10 rounded-xl p-6 border border-red-900/50">
                      <h3 className="text-xl font-semibold text-red-400 mb-4">Delete Account</h3>
                      <p className="text-gray-300 mb-4">
                        Your account must be at least 6 months old to be eligible for deletion.
                        This action is permanent and will erase all your data.
                      </p>
                      
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={handleDeleteAccount}
                          className="bg-red-600/20 text-red-100 py-3 px-6 rounded-xl hover:bg-red-600/30 flex items-center justify-center gap-2 border border-red-900/50 transition-all duration-300"
                        >
                          <FaTrash className="h-5 w-5" />
                          <span>Initialize Account Deletion</span>
                        </button>

                        {deleteError && (
                          <div className="text-red-400 text-sm bg-red-900/20 p-4 rounded-lg">
                            {deleteError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Account Confirmation Modal */}
              {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-red-900/50 shadow-2xl animate-modalFadeIn">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/20 mb-4">
                        <FaTrash className="h-6 w-6 text-red-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-4">Confirm Account Deletion</h3>
                      <p className="text-gray-300 mb-6">
                        To confirm deletion, please type:<br />
                        <span className="text-red-400 font-medium">"yes i need delete my account"</span>
                      </p>

                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type confirmation phrase"
                        className="w-full bg-black/30 border border-red-900/50 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />

                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            setShowDeleteConfirmation(false);
                            setDeleteConfirmText('');
                            setDeleteError('');
                          }}
                          className="px-6 py-3 border border-indigo-900/50 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirmDelete}
                          className="px-6 py-3 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
                        >
                          Confirm Deletion
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Order Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-indigo-900/50 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Edit Order</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            {selectedOrder && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order ID</label>
                  <input
                    type="text"
                    value={selectedOrder.id}
                    readOnly
                    className="w-full bg-gray-800 border border-indigo-900/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedOrder.date}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, date: e.target.value })}
                    className="w-full bg-gray-800 border border-indigo-900/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Items</label>
                  <input
                    type="text"
                    value={selectedOrder.items}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, items: e.target.value })}
                    className="w-full bg-gray-800 border border-indigo-900/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total</label>
                  <input
                    type="text"
                    value={selectedOrder.total}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, total: e.target.value })}
                    className="w-full bg-gray-800 border border-indigo-900/50 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                    className="w-full bg-gray-800 border border-indigo-900/50 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-indigo-900/50 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-indigo-900/50 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/20 mb-4">
                <FaTrash className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Delete Order</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
              {selectedOrder && (
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <p className="text-gray-300">Order ID: #{selectedOrder.id}</p>
                  <p className="text-gray-300">Items: {selectedOrder.items}</p>
                  <p className="text-gray-300">Total: {selectedOrder.total}</p>
                </div>
              )}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 border border-indigo-900/50 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success and Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
          {success}
        </div>
      )}
      {deleteError && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {deleteError}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
