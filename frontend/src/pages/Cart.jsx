import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart();

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div></div>;

  if (!cart?.items?.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any parts yet.</p>
        <Link to="/products" className="inline-flex items-center bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600">
          <FiArrowLeft className="mr-2" /> Browse Parts
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.product_detail.price * item.quantity, 0);
  const shipping = subtotal >= 10000 ? 0 : 500;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {item.product_detail?.primary_image ? (
                  <img src={item.product_detail.primary_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_detail?.slug}`} className="font-semibold hover:text-accent-500 block truncate">
                  {item.product_detail?.name}
                </Link>
                <p className="text-sm text-gray-500">{item.product_detail?.condition}</p>
                <p className="text-sm font-bold text-accent-600 mt-1">KES {Number(item.product_detail?.price).toLocaleString()}</p>
              </div>
              <div className="flex items-center border rounded-lg">
                <button onClick={() => updateItem(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-100"><FiMinus size={14} /></button>
                <span className="px-3 font-medium text-sm">{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-100"><FiPlus size={14} /></button>
              </div>
              <p className="font-bold w-24 text-right">KES {Number(item.subtotal).toLocaleString()}</p>
              <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `KES ${shipping.toLocaleString()}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax (16% VAT)</span><span>KES {tax.toLocaleString()}</span></div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-accent-600">KES {total.toLocaleString()}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-6 block w-full bg-accent-500 text-white py-3 rounded-lg font-semibold text-center hover:bg-accent-600 transition">
            Proceed to Checkout
          </Link>
          <Link to="/products" className="mt-3 block text-center text-sm text-accent-500 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
