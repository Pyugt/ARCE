import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200' : 'bg-stone-50 border-b border-stone-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group">
            <span className="font-display text-2xl font-medium tracking-[0.15em] text-stone-900 group-hover:text-amber-600 transition-colors">ARCÉ</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">Shop</Link>
            {isAdmin && <Link to="/admin" className="nav-link text-amber-600">Admin</Link>}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/orders" className="nav-link">Orders</Link>
                <span className="text-stone-300">|</span>
                <span className="text-sm text-stone-500 font-medium">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-ghost text-stone-500 hover:text-red-600">Logout</button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="btn-primary py-2 text-xs">Sign Up</Link>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center justify-center w-10 h-10 hover:bg-stone-100 transition-colors group">
              <svg className="w-5 h-5 text-stone-700 group-hover:text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 text-stone-900 text-[10px] font-bold font-mono flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex items-center justify-center w-10 h-10 hover:bg-stone-100">
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white animate-slide-down">
          <div className="px-4 py-4 flex flex-col gap-4">
            <Link to="/" className="nav-link py-1">Shop</Link>
            {isAdmin && <Link to="/admin" className="nav-link py-1 text-amber-600">Admin Dashboard</Link>}
            {user ? (
              <>
                <Link to="/orders" className="nav-link py-1">My Orders</Link>
                <button onClick={handleLogout} className="text-left text-sm text-red-500 py-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link py-1">Login</Link>
                <Link to="/signup" className="nav-link py-1">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
