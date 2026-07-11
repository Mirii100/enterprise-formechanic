import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import { getProducts, getCategories, getVehicleHierarchy } from '../services/index';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: '',
    max_price: '',
    condition: '',
    in_stock: false,
  });
  const [vehicleData, setVehicleData] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [engines, setEngines] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
    getVehicleHierarchy().then(res => {
      setVehicleData(res.data);
      setMakes(res.data.map(m => ({ id: m.id, name: m.name })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.condition) params.condition = filters.condition;
    if (filters.in_stock) params.in_stock = 'true';
    if (selectedEngine) params.engine = selectedEngine;

    getProducts(params).then(res => setProducts(res.data.results || res.data)).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [filters, selectedEngine]);

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

  const clearFilters = () => {
    setFilters({ search: '', category: '', min_price: '', max_price: '', condition: '', in_stock: false });
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedEngine('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-500">Auto Parts</h1>
          <p className="text-gray-500 text-sm">{products.length} products found</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-1 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 md:hidden">
            <FiFilter /> <span>Filters</span>
          </button>
          <div className="hidden sm:flex border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'}`}><FiGrid /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'}`}><FiList /></button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-xl border p-4 space-y-5 sticky top-24">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-accent-500 hover:underline">Clear all</button>
            </div>

            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
              <input type="text" value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} placeholder="Search products..." className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-accent-400 focus:outline-none" />
            </div>

            {/* Vehicle Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Vehicle Compatibility</label>
              <div className="space-y-2">
                <select value={selectedMake} onChange={handleMakeChange} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Make</option>
                  {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select value={selectedModel} onChange={handleModelChange} className="w-full px-3 py-2 border rounded-lg text-sm" disabled={!selectedMake}>
                  <option value="">Model</option>
                  {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select value={selectedYear} onChange={handleYearChange} className="w-full px-3 py-2 border rounded-lg text-sm" disabled={!selectedModel}>
                  <option value="">Year</option>
                  {years.map(y => <option key={y.id} value={y.id}>{y.year}</option>)}
                </select>
                <select value={selectedEngine} onChange={(e) => setSelectedEngine(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" disabled={!selectedYear}>
                  <option value="">Engine</option>
                  {engines.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price Range (KES)</label>
              <div className="flex items-center space-x-2">
                <input type="number" value={filters.min_price} onChange={(e) => setFilters({...filters, min_price: e.target.value})} placeholder="Min" className="w-full px-3 py-2 border rounded-lg text-sm" />
                <span>-</span>
                <input type="number" value={filters.max_price} onChange={(e) => setFilters({...filters, max_price: e.target.value})} placeholder="Max" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Condition</label>
              <select value={filters.condition} onChange={(e) => setFilters({...filters, condition: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="">All</option>
                <option value="OEM">OEM</option>
                <option value="AFTERMARKET">Aftermarket</option>
                <option value="GENUINE">Genuine</option>
              </select>
            </div>

            {/* In Stock */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={filters.in_stock} onChange={(e) => setFilters({...filters, in_stock: e.target.checked})} className="rounded text-accent-500 focus:ring-accent-400" />
              <span className="text-sm">In stock only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No products found</p>
              <button onClick={clearFilters} className="mt-4 text-accent-500 hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
              : 'space-y-4'
            }>
              {products.map(product => (
                <Link key={product.id} to={`/products/${product.slug}`} className={`bg-white rounded-xl border hover:shadow-lg transition-shadow group ${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={`bg-gray-100 flex items-center justify-center overflow-hidden ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'h-48'}`}>
                    {product.primary_image ? (
                      <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </div>
                  <div className="p-4 flex-1">
                    <p className="text-xs text-gray-500 mb-1">{product.category_name}{product.brand_name ? ` | ${product.brand_name}` : ''}</p>
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-accent-500">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${product.condition === 'OEM' ? 'bg-blue-100 text-blue-700' : product.condition === 'GENUINE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{product.condition}</span>
                      {product.stock <= 0 && <span className="text-xs text-red-500 font-medium">Out of stock</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-accent-600">KES {Number(product.price).toLocaleString()}</span>
                      {product.compare_price && (
                        <span className="text-sm text-gray-400 line-through">KES {Number(product.compare_price).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
