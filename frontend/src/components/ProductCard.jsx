import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

const StarIcon = ({ filled }) => (
  <svg className={`w-3 h-3 ${filled ? 'text-amber-400' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { window.location.href = '/login'; return }
    setAdding(true)
    await addToCart(product._id)
    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white flex flex-col border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all duration-300"
    >
      {/* Fixed-height image eliminates uneven grid */}
      <div className="relative overflow-hidden bg-stone-100" style={{ height: '220px' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x220/e7e5e4/78716c?text=${encodeURIComponent(product.category)}`
          }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
            <span className="text-white font-medium text-xs tracking-widest uppercase bg-stone-900/70 px-3 py-1">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-mono font-medium tracking-widest uppercase bg-white/90 text-stone-600 px-2 py-0.5 border border-stone-200">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-stone-800 text-sm leading-snug line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Rating row — fixed height so cards align */}
        <div className="flex items-center gap-1.5 mt-2 h-5">
          {product.numReviews > 0 ? (
            <>
              <div className="flex gap-px">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={star <= Math.round(product.rating)} />
                ))}
              </div>
              <span className="text-xs text-stone-400 font-mono">({product.numReviews})</span>
            </>
          ) : (
            <span className="text-xs text-stone-300">No reviews yet</span>
          )}
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
          <span className="font-mono font-semibold text-stone-900 text-base">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={`text-xs font-medium px-3 py-2 transition-all duration-200 border disabled:opacity-40 disabled:cursor-not-allowed
              ${added
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-900 text-white border-stone-900 hover:bg-stone-700'
              }`}
          >
            {adding ? (
              <span className="w-3 h-3 border border-stone-300 border-t-transparent rounded-full animate-spin inline-block" />
            ) : added ? '✓ Added' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
