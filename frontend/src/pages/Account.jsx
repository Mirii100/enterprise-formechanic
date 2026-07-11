import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiPlus, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [vehicleForm, setVehicleForm] = useState({ make: '', model: '', year: '', engine: '', nickname: '' });
  const [addressForm, setAddressForm] = useState({ label: 'Home', street: '', city: '', state: '', country: 'Kenya', phone: '' });
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get('/auth/vehicles/').then(res => setSavedVehicles(res.data)).catch(() => {});
    api.get('/auth/addresses/').then(res => setAddresses(res.data)).catch(() => {});
  }, [user, navigate]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const res = await api.post('/auth/vehicles/', vehicleForm);
    setSavedVehicles([...savedVehicles, res.data]);
    setShowVehicleForm(false);
    setVehicleForm({ make: '', model: '', year: '', engine: '', nickname: '' });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const res = await api.post('/auth/addresses/', addressForm);
    setAddresses([...addresses, res.data]);
    setShowAddressForm(false);
    setAddressForm({ label: 'Home', street: '', city: '', state: '', country: 'Kenya', phone: '' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border p-4 space-y-1">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2 shadow">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${activeTab === 'profile' ? 'bg-accent-50 text-accent-600 font-medium border border-accent-200' : 'hover:bg-gray-50'}`}>
              <FiUser className="inline mr-2" /> Profile
            </button>
            <button onClick={() => setActiveTab('vehicles')} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${activeTab === 'vehicles' ? 'bg-accent-50 text-accent-600 font-medium border border-accent-200' : 'hover:bg-gray-50'}`}>
              <FiMapPin className="inline mr-2" /> Saved Vehicles
            </button>
            <button onClick={() => setActiveTab('addresses')} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${activeTab === 'addresses' ? 'bg-accent-50 text-accent-600 font-medium border border-accent-200' : 'hover:bg-gray-50'}`}>
              <FiMapPin className="inline mr-2" /> Addresses
            </button>
            <Link to="/orders" className="block px-3 py-2.5 rounded-lg text-sm hover:bg-gray-50">
              <FiPackage className="inline mr-2" /> Orders
            </Link>
            <Link to="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm hover:bg-gray-50">
              <FiGrid className="inline mr-2" /> Dashboard
            </Link>
            <hr className="my-2" />
            <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50">
              <FiLogOut className="inline mr-2" /> Sign Out
            </button>
          </div>
        </div>

        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-bold text-lg mb-4">Profile</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Username</span><span className="font-medium">{user.username}</span></div>
                <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Email</span><span className="font-medium">{user.email}</span></div>
                <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Phone</span><span className="font-medium">{user.phone || 'Not set'}</span></div>
                <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Member since</span><span className="font-medium">{new Date(user.date_joined).toLocaleDateString()}</span></div>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Saved Vehicles</h2>
                <button onClick={() => setShowVehicleForm(!showVehicleForm)} className="flex items-center text-sm text-accent-500 font-medium hover:text-accent-600">
                  <FiPlus className="mr-1" /> Add Vehicle
                </button>
              </div>
              {showVehicleForm && (
                <form onSubmit={handleAddVehicle} className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-3 border">
                  <input type="text" placeholder="Make" value={vehicleForm.make} onChange={(e) => setVehicleForm({...vehicleForm, make: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
                  <input type="text" placeholder="Model" value={vehicleForm.model} onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
                  <input type="number" placeholder="Year" value={vehicleForm.year} onChange={(e) => setVehicleForm({...vehicleForm, year: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
                  <input type="text" placeholder="Engine (optional)" value={vehicleForm.engine} onChange={(e) => setVehicleForm({...vehicleForm, engine: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" />
                  <input type="text" placeholder="Nickname" value={vehicleForm.nickname} onChange={(e) => setVehicleForm({...vehicleForm, nickname: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" />
                  <button type="submit" className="bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600">Save</button>
                </form>
              )}
              {savedVehicles.length === 0 ? (
                <p className="text-gray-500 text-sm">No saved vehicles. Add your vehicle to quickly find compatible parts.</p>
              ) : savedVehicles.map(v => (
                <div key={v.id} className="border rounded-lg p-4 mb-3 hover:border-accent-200 transition">
                  <p className="font-medium">{v.make} {v.model} ({v.year})</p>
                  {v.engine && <p className="text-sm text-gray-500">Engine: {v.engine}</p>}
                  {v.nickname && <p className="text-xs text-gray-400">Nickname: {v.nickname}</p>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Saved Addresses</h2>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="flex items-center text-sm text-accent-500 font-medium hover:text-accent-600">
                  <FiPlus className="mr-1" /> Add Address
                </button>
              </div>
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-2 gap-3 border">
                  <input type="text" placeholder="Label (Home, Work)" value={addressForm.label} onChange={(e) => setAddressForm({...addressForm, label: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
                  <input type="text" placeholder="Street" value={addressForm.street} onChange={(e) => setAddressForm({...addressForm, street: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
                  <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" required />
                  <input type="text" placeholder="State/Province" value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" />
                  <input type="text" placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm({...addressForm, country: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" />
                  <input type="tel" placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" required />
                  <button type="submit" className="col-span-2 bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600">Save Address</button>
                </form>
              )}
              {addresses.length === 0 ? (
                <p className="text-gray-500 text-sm">No saved addresses.</p>
              ) : addresses.map(a => (
                <div key={a.id} className="border rounded-lg p-4 mb-3 hover:border-accent-200 transition">
                  <p className="font-medium">{a.label}</p>
                  <p className="text-sm text-gray-500">{a.street}, {a.city}, {a.state}, {a.country}</p>
                  <p className="text-sm text-gray-500">Phone: {a.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
