import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Spinner from '../components/Spinner'

const STATUS_COLORS = {
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders/myorders')
        setOrders(data)
      } catch {
        // handled
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 card">
          <svg className="w-16 h-16 text-stone-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="font-display text-2xl text-stone-400">No orders yet</p>
          <Link to="/" className="btn-primary inline-flex mt-6">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6 animate-fade-in">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono text-stone-400">ORDER</span>
                  <p className="font-mono text-sm text-stone-600 mt-0.5 truncate max-w-xs">{order._id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 text-xs font-medium capitalize rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <span className="price-tag text-lg">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 border border-stone-200 px-3 py-1.5">
                    <span>{item.name}</span>
                    <span className="text-stone-400">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <Link to={`/order-success/${order._id}`} className="text-stone-600 hover:text-stone-900 font-medium transition-colors">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
