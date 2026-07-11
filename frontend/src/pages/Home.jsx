import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiTruck, FiShield, FiRefreshCw, FiArrowRight, FiStar, FiChevronRight } from 'react-icons/fi';
import { getFeaturedProducts, getCategories, getVehicleHierarchy, getProducts } from '../services/index';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [engines, setEngines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedProducts().then(res => setFeatured(res.data));
    getVehicleHierarchy().then(res => {
      const data = res.data;
      setVehicleData(data);
      setMakes(data.map(m => ({ id: m.id, name: m.name })));
    }).catch(() => {});
  }, []);

  const handleMakeChange = (e) => {
    const makeId = e.target.value;
    setSelectedMake(makeId);
    setSelectedModel('');
    setSelectedYear('');
    setSelectedEngine('');
    const make = vehicleData.find(m => m.id == makeId);
    setModels(make?.models || []);
    setYears([]);
    setEngines([]);
  };

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    setSelectedModel(modelId);
    setSelectedYear('');
    setSelectedEngine('');
    const model = models.find(m => m.id == modelId);
    setYears(model?.years || []);
    setEngines([]);
  };

  const handleYearChange = (e) => {
    const yearId = e.target.value;
    setSelectedYear(yearId);
    setSelectedEngine('');
    const year = years.find(y => y.id == yearId);
    setEngines(year?.engines || []);
  };

  const handleVehicleSearch = () => {
    let params = {};
    if (selectedEngine) params.engine = selectedEngine;
    else if (selectedYear) params.year = selectedYear;
    else if (selectedModel) params.model = selectedModel;
    else if (selectedMake) params.make = selectedMake;
    navigate(`/products?${new URLSearchParams(params)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Your <span className="text-accent-400">Genuine Auto Parts</span> Marketplace
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Browse thousands of verified spare parts for your vehicle. Easy search, secure payments, fast delivery across East Africa.
            </p>

            {/* Vehicle Compatibility Search */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-2xl">
              <p className="text-gray-700 font-semibold mb-3 flex items-center"><FiSearch className="mr-2 text-accent-500" /> Find parts for your vehicle</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select value={selectedMake} onChange={handleMakeChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none">
                  <option value="">Make</option>
                  {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select value={selectedModel} onChange={handleModelChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" disabled={!selectedMake}>
                  <option value="">Model</option>
                  {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select value={selectedYear} onChange={handleYearChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" disabled={!selectedModel}>
                  <option value="">Year</option>
                  {years.map(y => <option key={y.id} value={y.id}>{y.year}</option>)}
                </select>
                <select value={selectedEngine} onChange={(e) => setSelectedEngine(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" disabled={!selectedYear}>
                  <option value="">Engine</option>
                  {engines.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <button onClick={handleVehicleSearch} className="mt-3 w-full bg-accent-500 text-white py-2.5 rounded-lg font-semibold hover:bg-accent-600 transition flex items-center justify-center">
                Search Compatible Parts <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <FiTruck className="text-accent-500 text-3xl flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Free Delivery</h3>
              <p className="text-gray-600 text-sm">Free shipping on orders over KES 10,000 within Nairobi.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <FiShield className="text-accent-500 text-3xl flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Genuine Parts Guarantee</h3>
              <p className="text-gray-600 text-sm">All parts verified. OEM and quality aftermarket options.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <FiRefreshCw className="text-accent-500 text-3xl flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day return policy. Hassle-free refunds and exchanges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-500">Featured Parts</h2>
            <Link to="/products" className="text-accent-500 hover:text-accent-600 font-medium flex items-center">View All <FiChevronRight className="ml-1" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map(product => (
              <Link key={product.id} to={`/products/${product.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden group">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.primary_image ? (
                    <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category_name}</p>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-accent-500">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-accent-600">KES {Number(product.price).toLocaleString()}</span>
                    {product.stock <= 0 && <span className="text-xs text-red-500 font-medium">Out of stock</span>}
                  </div>
                </div>
              </Link>
            ))}
            {featured.length === 0 && (
              <p className="col-span-4 text-center text-gray-500 py-8">Featured products coming soon...</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Parts?</h2>
          <p className="text-lg text-gray-200 mb-8">Join thousands of satisfied customers across East Africa.</p>
          <Link to="/products" className="inline-flex items-center bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-accent-600 transition">
            Browse All Products <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
