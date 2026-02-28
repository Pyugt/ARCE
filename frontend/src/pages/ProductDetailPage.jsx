import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/products/${id}`)
        setProduct(data)
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, navigate])

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    await addToCart(product._id, quantity)
    setAdding(false)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return }
    setSubmittingReview(true)
    try {
      await api.post(`/products/${id}/reviews`, reviewForm)
      toast.success('Review submitted!')
      const { data } = await api.get(`/products/${id}`)
      setProduct(data)
      setReviewForm({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="aspect-square bg-stone-100 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image' }} />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="tag self-start mb-4">{product.category}</span>
          <h1 className="font-display text-3xl md:text-4xl font-medium text-stone-900">{product.name}</h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-stone-500">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
          )}

          <p className="mt-6 text-stone-600 leading-relaxed">{product.description}</p>

          <div className="flex items-baseline gap-3 mt-8">
            <span className="font-display text-4xl font-medium text-stone-900">${product.price.toFixed(2)}</span>
            {product.stock > 0 ? (
              <span className="text-sm text-emerald-600 font-medium">{product.stock} in stock</span>
            ) : (
              <span className="text-sm text-red-500 font-medium">Out of stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex gap-3 mt-8">
              <div className="flex items-center border border-stone-300">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-12 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-xl transition-colors">−</button>
                <span className="w-12 text-center font-mono text-sm">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-12 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-xl transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={adding} className="btn-primary flex-grow text-sm">
                {adding ? <span className="w-4 h-4 border border-stone-300 border-t-transparent rounded-full animate-spin" /> : 'Add to Cart'}
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-stone-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-stone-400 block text-xs tracking-wider uppercase mb-1">Category</span>
              <span className="font-medium">{product.category}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-xs tracking-wider uppercase mb-1">Stock</span>
              <span className="font-medium">{product.stock} units</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Existing Reviews */}
        <div>
          <h2 className="section-title text-2xl mb-6">Reviews ({product.numReviews})</h2>
          {product.reviews.length === 0 ? (
            <p className="text-stone-400 text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review._id} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{review.name}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Write Review */}
        {user && (
          <div>
            <h2 className="section-title text-2xl mb-6">Write a Review</h2>
            <form onSubmit={handleReview} className="card p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs tracking-wider uppercase text-stone-400 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button type="button" key={star} onClick={() => setReviewForm(f => ({ ...f, rating: star }))}>
                      <svg className={`w-6 h-6 transition-colors ${star <= reviewForm.rating ? 'text-amber-400' : 'text-stone-200 hover:text-amber-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-stone-400 mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  rows={4}
                  placeholder="Share your thoughts about this product..."
                  className="input-field resize-none"
                />
              </div>
              <button type="submit" disabled={submittingReview} className="btn-primary text-sm self-start">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
