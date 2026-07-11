import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import api from '../services/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: code + new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password/', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password/', {
        email,
        code,
        new_password: newPassword,
      });
      setMessage('Password reset successful! You can now sign in.');
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-primary-500">
              {step === 1 ? 'Forgot Password' : step === 2 ? 'Reset Password' : 'Done!'}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 1 ? "Enter your email and we'll send you a reset code" :
               step === 2 ? 'Enter the code sent to your email' :
               'Password reset successful'}
            </p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
          {message && step !== 3 && <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm mb-4 border border-blue-100">{message}</div>}

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 disabled:opacity-50 transition">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none"
                  placeholder="6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-400 focus:outline-none"
                  placeholder="Repeat new password"
                  minLength={8}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 disabled:opacity-50 transition">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center">
              <FiCheck className="mx-auto text-5xl text-green-500 mb-4" />
              <p className="text-gray-600 mb-6">Your password has been reset successfully.</p>
              <Link to="/login" className="inline-flex items-center bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition">
                <FiArrowLeft className="mr-2" /> Back to Sign In
              </Link>
            </div>
          )}

          {step < 3 && (
            <p className="text-center text-sm mt-6 text-gray-500">
              Remember your password?{' '}
              <Link to="/login" className="text-accent-500 font-medium hover:underline">Sign In</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
