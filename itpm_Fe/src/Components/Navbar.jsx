import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, UserPlus, LogOut, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Signing in...');
    setShowSignInModal(false);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Signing up...');
    setShowSignUpModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Brand</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
          <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
          <li><Link to="/Product" className="hover:text-gray-400">Product</Link></li>
          <li><Link to="/inventory" className="hover:text-gray-400">Inventory</Link></li>
          <li><Link to="/PCBuilder" className="hover:text-gray-400">PC Builder</Link></li>
          <li><Link to="/contact" className="hover:text-gray-400">Contact</Link></li>
          <li><Link to="/admin" className="hover:text-gray-400">Admin</Link></li>
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <span>Profile</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showProfileDropdown ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-xl py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm text-gray-300">Welcome back!</p>
                  <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    <FaUser className="w-4 h-4 mr-3" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    <FaCog className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle mobile menu"
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col bg-gray-800 p-4 space-y-2">
          <li><Link to="/" className="block p-2 hover:bg-gray-700">Home</Link></li>
          <li><Link to="/about" className="block p-2 hover:bg-gray-700">About</Link></li>
          <li><Link to="/Product" className="block p-2 hover:bg-gray-700">Product</Link></li>
          <li><Link to="/inventory" className="block p-2 hover:bg-gray-700">Inventory</Link></li>
          <li><Link to="/PCBuilder" className="block p-2 hover:bg-gray-700">PC Builder</Link></li>
          <li><Link to="/contact" className="block p-2 hover:bg-gray-700">Contact</Link></li>
          <li><Link to="/admin" className="block p-2 hover:bg-gray-700">Admin</Link></li>
          <li className="space-y-1">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-700"
            >
              <span>Profile</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showProfileDropdown ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showProfileDropdown && (
              <div className="pl-4 space-y-1">
                <Link to="/profile" className="block p-2 hover:bg-gray-700">My Profile</Link>
                <Link to="/settings" className="block p-2 hover:bg-gray-700">Settings</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-2 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      )}

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-purple-900/50 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Sign In</h3>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-600" />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
                <button type="button" className="text-sm text-purple-400 hover:text-purple-300">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Sign In
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-300">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setShowSignInModal(false);
                  setShowSignUpModal(true);
                }}
                className="text-purple-400 hover:text-purple-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-purple-900/50 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Sign Up</h3>
              <button
                onClick={() => setShowSignUpModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-purple-900/50 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" required className="form-checkbox h-4 w-4 text-purple-600" />
                <span className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <button type="button" className="text-purple-400 hover:text-purple-300">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-purple-400 hover:text-purple-300">
                    Privacy Policy
                  </button>
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-300">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setShowSignUpModal(false);
                  setShowSignInModal(true);
                }}
                className="text-purple-400 hover:text-purple-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
