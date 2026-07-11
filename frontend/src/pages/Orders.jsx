import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import { getOrders } from '../services/index';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-xl text-gray-500 mb-4">No orders yet</p>
          <Link to="/products" className="inline-flex bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`} className="bg-white rounded-xl border p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-bold">Order #{order.id}</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'CONFIRMED' || order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'DISPATCHED' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>{order.status}</span>
                </div>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()} - {order.items?.length || 0} items</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-accent-600">KES {Number(order.total).toLocaleString()}</p>
                <FiChevronRight className="ml-auto text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
