import { useState, useEffect } from 'react'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Other']
const EMPTY_FORM = { name: '', description: '', price: '', category: 'Electronics', image: '', stock: '' }

export default function AdminPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('products')

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=50')
      setProducts(data.products)
    } catch { toast.error('Failed to fetch products') }
    finally { setLoading(false) }
  }

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders')
      setOrders(data)
    } catch { toast.error('Failed to fetch orders') }
  }

  useEffect(() => { fetchProducts(); fetchOrders() }, [])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleEdit = (product) => {
    setForm({ name: product.name, description: product.description, price: product.price, category: product.category, image: product.image, stock: product.stock })
    setEditingId(product._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form)
        toast.success('Product updated')
      } else {
        await api.post('/products', form)
        toast.success('Product created')
      }
      setForm(EMPTY_FORM)
      setEditingId(null)
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status })
      toast.success('Order updated')
      fetchOrders()
    } catch { toast.error('Failed to update order') }
  }

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tag bg-amber-100 text-amber-700 border-amber-200">Admin</span>
          </div>
          <h1 className="section-title">Dashboard</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 mb-8">
        {['products', 'orders'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            {t} {t === 'products' ? `(${products.length})` : `(${orders.length})`}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div>
          {/* Product Form */}
          <div className="mb-6">
            <button onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditingId(null) }} className="btn-primary text-sm">
              {showForm ? '← Cancel' : '+ Add Product'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="card p-6 mb-8 animate-slide-up">
              <h2 className="font-medium text-stone-900 mb-5">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label-xs">Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field mt-1" placeholder="Wireless Headphones" />
                </div>
                <div className="md:col-span-2">
                  <label className="label-xs">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input-field mt-1 resize-none" />
                </div>
                <div>
                  <label className="label-xs">Price ($)</label>
                  <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required className="input-field mt-1" placeholder="49.99" />
                </div>
                <div>
                  <label className="label-xs">Stock</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className="input-field mt-1" placeholder="100" />
                </div>
                <div>
                  <label className="label-xs">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field mt-1">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-xs">Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} className="input-field mt-1" placeholder="https://..." />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" disabled={saving} className="btn-primary text-sm">
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditingId(null) }} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          )}

          {/* Products Table */}
          {loading ? <Spinner size="lg" className="py-16" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-left">
                    <th className="pb-3 text-xs font-medium text-stone-400 uppercase tracking-wider pr-4">Product</th>
                    <th className="pb-3 text-xs font-medium text-stone-400 uppercase tracking-wider pr-4">Category</th>
                    <th className="pb-3 text-xs font-medium text-stone-400 uppercase tracking-wider pr-4">Price</th>
                    <th className="pb-3 text-xs font-medium text-stone-400 uppercase tracking-wider pr-4">Stock</th>
                    <th className="pb-3 text-xs font-medium text-stone-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-cover bg-stone-100" onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }} />
                          <span className="font-medium text-stone-900 line-clamp-1 max-w-xs">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4"><span className="tag">{product.category}</span></td>
                      <td className="py-4 pr-4 font-mono">${product.price.toFixed(2)}</td>
                      <td className="py-4 pr-4">
                        <span className={`font-mono ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-amber-600' : 'text-stone-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(product)} className="btn-ghost py-1 px-3 text-xs text-stone-500 hover:text-stone-900">Edit</button>
                          <button onClick={() => handleDelete(product._id)} className="btn-ghost py-1 px-3 text-xs text-red-400 hover:text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Update'].map(h => (
                  <th key={h} className="pb-3 pr-4 text-xs font-medium text-stone-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-4 pr-4 font-mono text-xs text-stone-500 max-w-[120px] truncate">{order._id}</td>
                  <td className="py-4 pr-4">{order.user?.name || 'Unknown'}</td>
                  <td className="py-4 pr-4 text-stone-500">{order.items.length} item(s)</td>
                  <td className="py-4 pr-4 font-mono">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      { processing: 'bg-amber-100 text-amber-700', shipped: 'bg-blue-100 text-blue-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' }[order.orderStatus]
                    }`}>{order.orderStatus}</span>
                  </td>
                  <td className="py-4 pr-4 text-stone-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="input-field py-1 text-xs w-36"
                    >
                      {['processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
