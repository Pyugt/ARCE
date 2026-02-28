import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Spinner from '../components/Spinner'

export default function CartPage() {
  const { cart, cartCount, loading, updateQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  const subtotal = cart.totalPrice || 0
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 10 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-8">Shopping Cart <span className="font-sans text-lg font-normal text-stone-400">({cartCount} items)</span></h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-24 card">
          <svg className="w-16 h-16 text-stone-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="font-display text-2xl text-stone-400">Your cart is empty</p>
          <p className="text-stone-400 text-sm mt-2">Browse our collection to find something you love</p>
          <Link to="/" className="btn-primary inline-flex mt-6">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-px bg-stone-200">
            {cart.items.map((item) => (
              <div key={item.product?._id} className="flex gap-5 p-5 bg-stone-50 items-center animate-fade-in">
                <Link to={`/products/${item.product?._id}`} className="flex-shrink-0 w-20 h-20 bg-stone-100 overflow-hidden">
                  <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover hover:scale-105 transition-transform" onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80' }} />
                </Link>

                <div className="flex-grow min-w-0">
                  <Link to={`/products/${item.product?._id}`} className="font-medium text-stone-900 text-sm hover:text-amber-700 line-clamp-1 transition-colors">
                    {item.product?.name}
                  </Link>
                  <p className="price-tag text-sm text-stone-600 mt-0.5">${item.price.toFixed(2)} each</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300">
                    <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-lg">−</button>
                    <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-lg">+</button>
                  </div>
                  <span className="price-tag w-20 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.product?._id)} className="text-stone-300 hover:text-red-500 transition-colors ml-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl font-medium mb-6">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping</span>
                <span className="font-mono">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal > 0 && subtotal <= 100 && (
                <p className="text-xs text-stone-400">Add ${(100 - subtotal).toFixed(2)} more for free shipping</p>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Tax (8%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-stone-200 font-medium text-base">
                <span>Total</span>
                <span className="price-tag">${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3.5 text-sm mt-6">
              Proceed to Checkout →
            </button>
            <Link to="/" className="btn-secondary w-full py-3 text-sm mt-3">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  )
}
