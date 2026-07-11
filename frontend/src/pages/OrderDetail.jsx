import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/index';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(res => setOrder(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div></div>;
  if (!order) return <div className="text-center py-20"><p>Order not found</p></div>;

  const statusSteps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKED', 'DISPATCHED', 'DELIVERED'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-accent-500 hover:underline text-sm">&larr; Back to Orders</Link>

      <div className="flex items-center space-x-3 mt-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Order #{order.id}</h1>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${
          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>{order.status}</span>
      </div>

      {/* Status Tracker */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, i) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= currentStep ? 'bg-accent-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {i + 1}
              </div>
              <span className="text-xs mt-1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Order Items */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-bold text-lg mb-4">Items</h2>
            <div className="space-y-3">
              {order.items?.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">SKU: {item.product_sku} | Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">KES {Number(item.total_price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>KES {order.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>KES {order.shipping_cost.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax (VAT)</span><span>KES {order.tax.toLocaleString()}</span></div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-accent-600">KES {order.total.toLocaleString()}</span>
            </div>
          </div>
          <hr className="my-4" />
          <h3 className="font-semibold mb-2 text-sm">Shipping To</h3>
          <p className="text-sm text-gray-600">{order.shipping_address}</p>
          <p className="text-sm text-gray-600">Phone: {order.contact_phone}</p>
          {order.tracking_number && <>
            <hr className="my-4" />
            <h3 className="font-semibold mb-2 text-sm">Tracking Number</h3>
            <p className="text-sm font-medium">{order.tracking_number}</p>
          </>}
        </div>
      </div>
    </div>
  );
}
