import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate('/');
    } catch (err) {
      setError('Registration failed. Username or email may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">AH</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-500">Create Account</h1>
            <p className="text-gray-500 text-sm">Join AutoParts Hub today</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input type="text" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none" placeholder="+254 7XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none" required minLength={8} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input type="password" value={form.confirm_password} onChange={(e) => setForm({...form, confirm_password: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            Already have an account? <Link to="/login" className="text-accent-500 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
