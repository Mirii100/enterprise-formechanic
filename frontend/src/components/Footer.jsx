import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-lg text-white">AE</div>
            <span className="font-bold text-xl text-white">AutoEliteSpares</span>
          </div>
          <p className="text-sm">East Africa's premier online marketplace for genuine motor vehicle spare parts and accessories.</p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-accent-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-accent-400">All Products</Link></li>
            <li><Link to="/about" className="hover:text-accent-400">About Us</Link></li>
            <li><Link to="/cart" className="hover:text-accent-400">Shopping Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products?category=engine-parts" className="hover:text-accent-400">Engine Parts</Link></li>
            <li><Link to="/products?category=brakes" className="hover:text-accent-400">Brakes</Link></li>
            <li><Link to="/products?category=suspension" className="hover:text-accent-400">Suspension</Link></li>
            <li><Link to="/products?category=electrical" className="hover:text-accent-400">Electrical</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2"><FiPhone className="text-accent-400 flex-shrink-0" /><span>+254 700 000 000</span></li>
            <li className="flex items-center space-x-2"><FiMail className="text-accent-400 flex-shrink-0" /><span>info@autoelitespares.co.ke</span></li>
            <li className="flex items-center space-x-2"><FiMapPin className="text-accent-400 flex-shrink-0" /><span>Nairobi, Kenya</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-700 py-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} AutoEliteSpares. All rights reserved.</p>
      </div>
    </footer>
  );
}
