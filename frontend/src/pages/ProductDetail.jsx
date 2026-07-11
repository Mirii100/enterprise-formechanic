import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiCheck, FiTruck, FiShield, FiRefreshCw, FiStar, FiMinus, FiPlus } from 'react-icons/fi';
import { getProduct } from '../services/index';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getProduct(slug).then(res => setProduct(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    try {
      await addItem(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      alert('Please sign in to add items to cart');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div></div>;
  if (!product) return <div className="text-center py-20"><p className="text-xl">Product not found</p></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-accent-500">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-accent-500">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-xl h-80 md:h-96 flex items-center justify-center mb-4">
            {product.images?.length > 0 ? (
              <img src={product.images[0].image} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400">No image available</span>
            )}
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images?.slice(1).map((img, i) => (
              <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={img.image} alt="" className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded ${product.condition === 'OEM' ? 'bg-blue-100 text-blue-700' : product.condition === 'GENUINE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{product.condition}</span>
            <span className="text-xs text-gray-500">SKU: {product.sku}</span>
            {product.oem_number && <span className="text-xs text-gray-500">OEM: {product.oem_number}</span>}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          {product.brand_name && <p className="text-gray-500 mb-4">Brand: <span className="font-medium">{product.brand_name}</span></p>}

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-yellow-400">
              {[1,2,3,4,5].map(i => <FiStar key={i} className={i <= 4 ? 'fill-current' : ''} />)}
            </div>
            <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3 mb-6">
            <span className="text-3xl font-bold text-accent-600">KES {Number(product.price).toLocaleString()}</span>
            {product.compare_price && (
              <span className="text-lg text-gray-400 line-through">KES {Number(product.compare_price).toLocaleString()}</span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && <p className="text-gray-600 mb-6">{product.short_description}</p>}

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="flex items-center text-green-600 font-medium"><FiCheck className="mr-1" /> In Stock ({product.stock} units)</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100"><FiMinus /></button>
                <span className="px-4 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-gray-100"><FiPlus /></button>
              </div>
              <button onClick={handleAddToCart} className={`flex-1 py-3 rounded-lg font-semibold text-white transition flex items-center justify-center ${added ? 'bg-green-500' : 'bg-accent-500 hover:bg-accent-600'}`}>
                <FiShoppingCart className="mr-2" /> {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Trust */}
          <div className="border-t pt-6 grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="text-center">
              <FiTruck className="mx-auto mb-1 text-accent-500 text-xl" />
              <p>Free delivery over KES 10,000</p>
            </div>
            <div className="text-center">
              <FiShield className="mx-auto mb-1 text-accent-500 text-xl" />
              <p>{product.warranty} Warranty</p>
            </div>
            <div className="text-center">
              <FiRefreshCw className="mx-auto mb-1 text-accent-500 text-xl" />
              <p>30-day returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Product Details</h2>
        <div className="prose max-w-none text-gray-600">{product.description}</div>
      </div>

      {/* Specifications */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.sku && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">SKU</span><span className="font-medium">{product.sku}</span></div>}
          {product.oem_number && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">OEM Number</span><span className="font-medium">{product.oem_number}</span></div>}
          {product.condition && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Condition</span><span className="font-medium">{product.condition}</span></div>}
          {product.brand_name && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Brand</span><span className="font-medium">{product.brand_name}</span></div>}
          {product.warranty && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Warranty</span><span className="font-medium">{product.warranty}</span></div>}
          {product.weight && <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Weight</span><span className="font-medium">{product.weight} kg</span></div>}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews?.length > 0 ? product.reviews.map(review => (
          <div key={review.id} className="border-b pb-4 mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium">{review.user_name}</span>
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(i => <FiStar key={i} className={i <= review.rating ? 'fill-current' : ''} size={14} />)}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        )) : <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
      </div>
    </div>
  );
}
