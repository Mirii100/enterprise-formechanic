import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiUsers, FiAward, FiTarget } from 'react-icons/fi';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-bold text-3xl">AE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About AutoEliteSpares</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Building East Africa's most trusted online marketplace for genuine motor vehicle spare parts.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiTarget className="text-accent-500 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Our Mission</h3>
              <p className="text-gray-600 text-sm">To revolutionize the auto parts industry in East Africa by providing a seamless, trustworthy, and efficient online marketplace.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-accent-500 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Our Promise</h3>
              <p className="text-gray-600 text-sm">Every part listed on our platform is verified for authenticity. We guarantee genuine OEM and quality aftermarket parts.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-accent-500 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">Our Standards</h3>
              <p className="text-gray-600 text-sm">We maintain rigorous quality checks, secure payment processing, and dedicated customer support for every order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-500 mb-8">Our Story</h2>
          <div className="bg-white rounded-2xl border p-8 shadow-sm">
            <p className="text-gray-600 leading-relaxed mb-4">
              AutoEliteSpares was founded with a simple vision: make finding the right spare parts for your vehicle as easy as a few clicks. The automotive aftermarket industry in East Africa has long been fragmented, informal, and offline — forcing vehicle owners and mechanics to spend hours visiting multiple shops in search of compatible parts.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We bridge this gap by creating a digital marketplace that connects verified suppliers directly with buyers. Our advanced vehicle compatibility search, real-time inventory, and integrated payment system eliminate the guesswork from buying auto parts.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, AutoEliteSpares serves thousands of customers across Kenya, Tanzania, and Uganda, with plans to expand further across the continent. We're not just selling parts — we're building a trusted ecosystem that powers the mobility of East Africa.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-500 mb-4">Our Team</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            A dedicated team of professionals committed to transforming the auto parts industry.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'James Mwangi', role: 'CEO & Founder', initials: 'JM' },
              { name: 'Sarah Wanjiku', role: 'CTO', initials: 'SW' },
              { name: 'David Ochieng', role: 'Operations', initials: 'DO' },
              { name: 'Grace Akinyi', role: 'Customer Success', initials: 'GA' },
            ].map((member, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-primary-500">
                  {member.initials}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AutoEliteSpares?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Genuine Parts', desc: 'All products verified for authenticity with warranty' },
              { title: 'Fast Delivery', desc: 'Free delivery in Nairobi within 24 hours' },
              { title: 'Secure Payments', desc: 'M-Pesa, cards, and bank transfers with encryption' },
              { title: 'Easy Returns', desc: '30-day return policy with hassle-free process' },
            ].map((v, i) => (
              <div key={i} className="text-center p-6 bg-white/10 rounded-xl">
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-200 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-500 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8">Join thousands of satisfied customers across East Africa.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition">
              Create Free Account
            </Link>
            <Link to="/products" className="border-2 border-accent-500 text-accent-500 px-8 py-3 rounded-lg font-semibold hover:bg-accent-50 transition">
              Browse Parts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
