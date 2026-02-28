import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = ['Credit Card', 'PayPal', 'Cash on Delivery']

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: '' })
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const subtotal = cart.totalPrice || 0
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.postalCode.trim()) errs.postalCode = 'Postal code is required'
    if (!form.country.trim()) errs.country = 'Country is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    if (!cart.items.length) { toast.error('Your cart is empty'); return }

    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod,
      })
      await fetchCart()
      toast.success('Order placed successfully!')
      navigate(`/order-success/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Shipping + Payment */}
        <div className="flex flex-col gap-6">
          {/* Shipping */}
          <div className="card p-6">
            <h2 className="font-medium text-stone-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-stone-900 text-white text-xs flex items-center justify-center font-mono">1</span>
              Shipping Address
            </h2>
            <div className="flex flex-col gap-4">
              {[
                { name: 'address', label: 'Street Address', placeholder: '123 Main St' },
                { name: 'city', label: 'City', placeholder: 'New York' },
                { name: 'postalCode', label: 'Postal Code', placeholder: '10001' },
                { name: 'country', label: 'Country', placeholder: 'United States' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-medium tracking-wider uppercase text-stone-400 mb-1.5">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`input-field ${errors[name] ? 'border-red-400' : ''}`}
                  />
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-medium text-stone-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-stone-900 text-white text-xs flex items-center justify-center font-mono">2</span>
              Payment Method
            </h2>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((method) => (
                <label key={method} className={`flex items-center gap-3 p-4 cursor-pointer border transition-colors ${paymentMethod === method ? 'border-stone-700 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}>
                  <input
                    type="radio"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-stone-700"
                  />
                  <span className="text-sm font-medium text-stone-700">{method}</span>
                  {method === 'Credit Card' && <span className="ml-auto text-xs text-stone-400 font-mono">Mock — no real charge</span>}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-medium text-stone-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-stone-900 text-white text-xs flex items-center justify-center font-mono">3</span>
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-6">
              {cart.items.map((item) => (
                <div key={item.product?._id} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                  <img src={item.product?.image} alt={item.product?.name} className="w-10 h-10 object-cover bg-stone-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }} />
                  <span className="flex-grow text-sm text-stone-700 line-clamp-1">{item.product?.name}</span>
                  <span className="text-sm font-mono text-stone-600">×{item.quantity}</span>
                  <span className="text-sm font-mono text-stone-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-sm pt-3 border-t border-stone-200">
              <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span className="font-mono">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Shipping</span><span className="font-mono">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Tax</span><span className="font-mono">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between pt-3 border-t border-stone-200 font-semibold text-base">
                <span>Total</span><span className="price-tag">${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" disabled={loading || !cart.items.length} className="btn-primary w-full py-4 text-sm mt-6">
              {loading ? (
                <><span className="w-4 h-4 border border-stone-300 border-t-transparent rounded-full animate-spin" /> Placing Order...</>
              ) : `Place Order — $${total.toFixed(2)}`}
            </button>

            <p className="text-center text-xs text-stone-400 mt-3">This is a demo — no real payment is processed</p>
          </div>
        </div>
      </form>
    </div>
  )
}
