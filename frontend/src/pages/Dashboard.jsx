import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingCart, FiUser, FiTrendingUp,
  FiClock, FiCheckCircle, FiXCircle, FiArrowRight, FiDollarSign
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const quickStats = [
    { icon: FiPackage, label: 'Total Orders', value: '0', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: FiShoppingCart, label: 'Cart Items', value: cart?.items?.length || 0, color: 'text-accent-500', bg: 'bg-orange-50' },
    { icon: FiCheckCircle, label: 'Delivered', value: '0', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: FiDollarSign, label: 'Total Spent', value: 'KES 0', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const recentActivity = [
    { icon: FiUser, text: 'Account created', time: new Date(user.date_joined).toLocaleDateString(), color: 'text-blue-500' },
    { icon: FiShoppingCart, text: 'Cart updated', time: 'Today', color: 'text-accent-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {user.username}!
            </h1>
            <p className="text-gray-200 mt-1">Here's what's happening with your account today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {quickStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`${stat.color} text-xl`} />
            </div>
            <p className="text-2xl font-bold text-primary-500">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Recent Activity</h2>
            <Link to="/orders" className="text-sm text-accent-500 hover:underline flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <activity.icon className={activity.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-gray-400 text-sm">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/products" className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-accent-50 hover:text-accent-600 transition group">
              <FiTrendingUp className="mr-3 text-accent-500" />
              <div>
                <p className="font-medium text-sm group-hover:text-accent-600">Browse Products</p>
                <p className="text-xs text-gray-400">Find parts for your vehicle</p>
              </div>
            </Link>
            <Link to="/orders" className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-accent-50 hover:text-accent-600 transition group">
              <FiPackage className="mr-3 text-accent-500" />
              <div>
                <p className="font-medium text-sm group-hover:text-accent-600">My Orders</p>
                <p className="text-xs text-gray-400">Track your orders</p>
              </div>
            </Link>
            <Link to="/account" className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-accent-50 hover:text-accent-600 transition group">
              <FiUser className="mr-3 text-accent-500" />
              <div>
                <p className="font-medium text-sm group-hover:text-accent-600">Account Settings</p>
                <p className="text-xs text-gray-400">Manage your profile</p>
              </div>
            </Link>
            <Link to="/cart" className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-accent-50 hover:text-accent-600 transition group">
              <FiShoppingCart className="mr-3 text-accent-500" />
              <div>
                <p className="font-medium text-sm group-hover:text-accent-600">Shopping Cart</p>
                <p className="text-xs text-gray-400">{cart?.items?.length || 0} items</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Preview */}
      {cart?.items?.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold text-lg mb-4">Cart Summary</h2>
          <div className="divide-y">
            {cart.items.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center py-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product_detail?.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">KES {Number(item.subtotal).toLocaleString()}</p>
              </div>
            ))}
            {cart.items.length > 3 && (
              <p className="text-center text-sm text-gray-400 pt-3">
                +{cart.items.length - 3} more items
              </p>
            )}
          </div>
          <Link to="/checkout" className="mt-4 block w-full bg-accent-500 text-white py-2.5 rounded-lg font-semibold text-center hover:bg-accent-600 transition">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
