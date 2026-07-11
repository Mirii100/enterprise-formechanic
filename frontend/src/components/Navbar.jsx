import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-primary-500 text-white sticky top-0 z-50 shadow-lg">
      <div className="hidden lg:flex bg-primary-700 text-xs py-1 px-6 justify-between">
        <span className="text-gray-400">+254 700 000 000 | Mon-Sat: 8AM-6PM</span>
        <span className="text-gray-300">Free delivery for orders over KES 10,000</span>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-lg">
              <span className="text-white">AE</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">AutoEliteSpares</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="hover:text-accent-300 transition text-sm font-medium">Home</Link>
            <Link to="/products" className="hover:text-accent-300 transition text-sm font-medium">Products</Link>
            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-accent-300 transition text-sm font-medium">
                <span>Categories</span>
                <FiChevronDown className="text-xs" />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white text-gray-900 rounded-lg shadow-xl w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border">
                <Link to="/products" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg">All Products</Link>
                <Link to="/products?category=engine-parts" className="block px-4 py-2 hover:bg-gray-100">Engine Parts</Link>
                <Link to="/products?category=brakes" className="block px-4 py-2 hover:bg-gray-100">Brakes</Link>
                <Link to="/products?category=suspension" className="block px-4 py-2 hover:bg-gray-100">Suspension</Link>
                <Link to="/products?category=electrical" className="block px-4 py-2 hover:bg-gray-100">Electrical</Link>
                <Link to="/products?category=transmission" className="block px-4 py-2 hover:bg-gray-100">Transmission</Link>
                <Link to="/products?category=cooling" className="block px-4 py-2 rounded-b-lg hover:bg-gray-100">Cooling</Link>
              </div>
            </div>
            <Link to="/about" className="hover:text-accent-300 transition text-sm font-medium">About</Link>
          </nav>

          <div className="flex items-center space-x-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-accent-300 rounded-lg transition">
              <FiSearch size={20} />
            </button>
            <Link to="/cart" className="relative p-2 hover:text-accent-300 rounded-lg transition">
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">{itemCount}</span>
              )}
            </Link>
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1 hover:bg-primary-600 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{user.username}</span>
                  <FiChevronDown className={`text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white text-gray-900 rounded-xl shadow-2xl border overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <p className="font-semibold truncate">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 transition">
                      <FiGrid className="text-accent-500" /> <span>Dashboard</span>
                    </Link>
                    <Link to="/account" onClick={() => setDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 transition">
                      <FiSettings className="text-accent-500" /> <span>Account Settings</span>
                    </Link>
                    <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 transition">
                      <FiShoppingCart className="text-accent-500" /> <span>Orders</span>
                    </Link>
                    <hr />
                    <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-50 text-red-600 transition">
                      <FiLogOut /> <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1">
                <Link to="/login" className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition text-sm font-medium">Sign In</Link>
                <Link to="/register" className="px-4 py-2 text-white hover:bg-white hover:text-primary-500 border border-white rounded-lg transition text-sm font-medium">Sign Up</Link>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="bg-primary-600 px-4 py-3 border-t border-primary-400">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex shadow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by part name, SKU, or OEM number..."
              className="w-full px-4 py-2.5 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-400"
              autoFocus
            />
            <button type="submit" className="bg-accent-500 px-6 rounded-r-lg hover:bg-accent-600 transition font-semibold flex items-center">
              <FiSearch className="mr-2" /> Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden bg-primary-600 px-4 py-4 space-y-1 border-t border-primary-400">
          <Link to="/" className="block py-2 px-3 rounded hover:bg-primary-500" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="block py-2 px-3 rounded hover:bg-primary-500" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/about" className="block py-2 px-3 rounded hover:bg-primary-500" onClick={() => setMenuOpen(false)}>About</Link>
          <hr className="border-primary-400" />
          {user ? (
            <>
              <Link to="/dashboard" className="block py-2 px-3 rounded hover:bg-primary-500" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/account" className="block py-2 px-3 rounded hover:bg-primary-500" onClick={() => setMenuOpen(false)}>Account</Link>
              <Link to="/orders" className="block py-2 px-3 rounded hover:bg-primary-500" onClick={() => setMenuOpen(false)}>Cart ({itemCount})</Link>
              <hr className="border-primary-400" />
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="block py-2 px-3 rounded hover:bg-primary-500 w-full text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 px-3 rounded hover:bg-primary-500" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="block py-2 px-3 rounded hover:bg-primary-500" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}