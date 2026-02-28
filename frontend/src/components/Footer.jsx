import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="font-display text-2xl text-white tracking-[0.15em]">ARCÉ</Link>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">
              A modern e-commerce platform built with React, Node.js, and MongoDB.
            </p>
          </div>
          <div>
            <h4 className="text-stone-300 font-medium text-sm tracking-wider uppercase mb-4">Shop</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm hover:text-white transition-colors">All Products</Link>
              <Link to="/cart" className="text-sm hover:text-white transition-colors">Cart</Link>
              <Link to="/orders" className="text-sm hover:text-white transition-colors">My Orders</Link>
            </div>
          </div>
          <div>
            <h4 className="text-stone-300 font-medium text-sm tracking-wider uppercase mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Tailwind'].map(tech => (
                <span key={tech} className="tag bg-stone-800 border-stone-700 text-stone-400">{tech}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-10 pt-6 text-center text-xs text-stone-600 font-mono">
          © {new Date().getFullYear()} ARCÉ — Built for portfolio demonstration
        </div>
      </div>
    </footer>
  )
}
