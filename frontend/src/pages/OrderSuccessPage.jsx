import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axios'
import Spinner from '../components/Spinner'

export default function OrderSuccessPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`)
        setOrder(data)
      } catch {
        // handled
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-display text-4xl font-medium text-stone-900">Order Confirmed!</h1>
      <p className="text-stone-500 mt-3">Thank you for your purchase. Your order is being processed.</p>

      {order && (
        <div className="card p-6 mt-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-stone-400">ORDER ID</span>
            <span className="text-xs font-mono text-stone-600 truncate ml-4">{order._id}</span>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover bg-stone-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/48' }} />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-stone-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                </div>
                <span className="font-mono text-sm">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span className="font-mono">${order.itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Shipping</span><span className="font-mono">${order.shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Tax</span><span className="font-mono">${order.taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-stone-200">
              <span>Total</span><span className="price-tag">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-stone-400 tracking-wider uppercase block mb-1">Shipping to</span>
              <span className="text-stone-700">{order.shippingAddress.address}, {order.shippingAddress.city}</span>
            </div>
            <div>
              <span className="text-xs text-stone-400 tracking-wider uppercase block mb-1">Payment</span>
              <span className="text-stone-700">{order.paymentMethod}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center mt-8">
        <Link to="/orders" className="btn-secondary py-3 px-6 text-sm">View All Orders</Link>
        <Link to="/" className="btn-primary py-3 px-6 text-sm">Continue Shopping</Link>
      </div>
    </div>
  )
}
