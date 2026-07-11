import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiCreditCard, FiPhone } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, mpesaPayment, cardPayment } from '../services/index';

export default function Checkout() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    shipping_address: '',
    contact_phone: '',
    notes: '',
    payment_method: 'mpesa',
    card_number: '',
    expiry: '',
    cvv: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!cart?.items?.length) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.product_detail.price * item.quantity, 0);
  const shipping = subtotal >= 10000 ? 0 : 500;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const orderRes = await createOrder({
        shipping_address: form.shipping_address,
        contact_phone: form.contact_phone,
        notes: form.notes,
        payment_method: form.payment_method,
      });
      const { order_id } = orderRes.data;

      if (form.payment_method === 'mpesa') {
        await mpesaPayment({ order_id, phone_number: form.contact_phone });
      } else if (form.payment_method === 'card') {
        await cardPayment({
          order_id,
          card_number: form.card_number,
          expiry: form.expiry,
          cvv: form.cvv,
        });
      }

      navigate(`/orders/${order_id}`);
    } catch (err) {
      alert('Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex mb-8 border-b">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <button key={s} onClick={() => setStep(i + 1)} className={`pb-3 px-6 text-sm font-medium border-b-2 transition ${step === i + 1 ? 'border-accent-500 text-accent-500' : 'border-transparent text-gray-400'}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h2 className="font-bold text-lg">Shipping Information</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Shipping Address</label>
                <textarea value={form.shipping_address} onChange={(e) => setForm({...form, shipping_address: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none" placeholder="Street, City, County, Landmark" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" value={form.contact_phone} onChange={(e) => setForm({...form, contact_phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none" placeholder="+254 7XX XXX XXX" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none" placeholder="Any special instructions..." />
              </div>
              <button onClick={() => setStep(2)} className="bg-accent-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-accent-600">Continue to Payment</button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h2 className="font-bold text-lg">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${form.payment_method === 'mpesa' ? 'border-accent-500 bg-accent-50' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="mpesa" checked={form.payment_method === 'mpesa'} onChange={() => setForm({...form, payment_method: 'mpesa'})} className="mr-3" />
                  <FiPhone className="text-green-500 text-xl mr-2" />
                  <div><span className="font-medium">M-Pesa</span><p className="text-sm text-gray-500">Pay via M-Pesa STK Push</p></div>
                </label>
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${form.payment_method === 'card' ? 'border-accent-500 bg-accent-50' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="card" checked={form.payment_method === 'card'} onChange={() => setForm({...form, payment_method: 'card'})} className="mr-3" />
                  <FiCreditCard className="text-blue-500 text-xl mr-2" />
                  <div><span className="font-medium">Card Payment</span><p className="text-sm text-gray-500">Visa, Mastercard</p></div>
                </label>
              </div>
              {form.payment_method === 'card' && (
                <div className="space-y-3 border-t pt-4">
                  <input type="text" value={form.card_number} onChange={(e) => setForm({...form, card_number: e.target.value})} placeholder="Card Number" className="w-full px-4 py-2 border rounded-lg" maxLength={16} />
                  <div className="flex space-x-3">
                    <input type="text" value={form.expiry} onChange={(e) => setForm({...form, expiry: e.target.value})} placeholder="MM/YY" className="w-full px-4 py-2 border rounded-lg" maxLength={5} />
                    <input type="text" value={form.cvv} onChange={(e) => setForm({...form, cvv: e.target.value})} placeholder="CVV" className="w-full px-4 py-2 border rounded-lg" maxLength={4} />
                  </div>
                </div>
              )}
              <div className="flex space-x-3">
                <button onClick={() => setStep(1)} className="px-6 py-2.5 border rounded-lg font-medium hover:bg-gray-50">Back</button>
                <button onClick={() => setStep(3)} className="bg-accent-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-accent-600">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white rounded-xl border p-6 space-y-4">
              <h2 className="font-bold text-lg">Review Your Order</h2>
              <div className="border-b pb-4">
                <h3 className="font-medium text-sm text-gray-500">Shipping To</h3>
                <p>{form.shipping_address}</p>
                <p>{form.contact_phone}</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium text-sm text-gray-500">Payment Method</h3>
                <p className="capitalize">{form.payment_method === 'mpesa' ? 'M-Pesa' : 'Card'}</p>
              </div>
              <div className="space-y-2">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product_detail?.name} x {item.quantity}</span>
                    <span>KES {Number(item.subtotal).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleSubmit} disabled={submitting} className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 disabled:opacity-50 flex items-center justify-center">
                <FiLock className="mr-2" /> {submitting ? 'Processing...' : `Pay KES ${total.toLocaleString()}`}
              </button>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="bg-white rounded-xl border p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal ({cart.items.length} items)</span><span>KES {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `KES ${shipping.toLocaleString()}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax (16% VAT)</span><span>KES {tax.toLocaleString()}</span></div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-accent-600">KES {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
