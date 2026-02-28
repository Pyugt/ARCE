import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Other']

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page, limit: 12 })
        if (search) params.append('keyword', search)
        if (category !== 'All') params.append('category', category)
        const { data } = await api.get(`/products?${params}`)
        setProducts(data.products)
        setTotalPages(data.totalPages)
        setTotal(data.total)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [search, category, page])

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1) }
  const handleCategory = (cat) => { setCategory(cat); setPage(1) }

  return (
    <div className="page-enter">
      {/* Hero — tighter, better proportioned */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23fff' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Amber glow bottom-right */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono font-medium tracking-[0.2em] uppercase text-amber-400 border border-amber-400/30 px-3 py-1.5 mb-6">
              <span className="w-1 h-1 bg-amber-400 rounded-full" />
              New Collection
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-medium leading-[1.1] tracking-tight">
              Quality<br />
              <em className="text-amber-400 not-italic">without compromise.</em>
            </h1>
            <p className="mt-5 text-stone-400 text-base leading-relaxed max-w-sm">
              Premium products, thoughtfully selected. From electronics to everyday essentials.
            </p>
            <button
              onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
              className="mt-7 inline-flex items-center gap-2 bg-amber-400 text-stone-900 font-semibold text-sm px-7 py-3.5 hover:bg-amber-300 transition-colors"
            >
              Explore Collection
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Header row */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-medium text-stone-900">All Products</h2>
            <p className="text-stone-400 text-sm mt-0.5">{total} items available</p>
          </div>
          {/* Search */}
          <div className="relative w-full md:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 text-stone-800 text-sm placeholder-stone-400 outline-none focus:border-stone-500 transition-colors"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-1.5 text-xs font-medium tracking-wide transition-all border ${
                category === cat
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid — gap instead of gap-px for cleaner look */}
        {loading ? (
          <Spinner size="lg" className="py-24" />
        ) : products.length === 0 ? (
          <div className="text-center py-24 border border-stone-200 bg-white">
            <svg className="w-12 h-12 text-stone-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-stone-400 font-display text-xl">No products found</p>
            <p className="text-stone-400 text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-5 py-2 text-sm font-medium border border-stone-300 text-stone-600 hover:border-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="font-mono text-sm text-stone-500 px-2">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-5 py-2 text-sm font-medium border border-stone-300 text-stone-600 hover:border-stone-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
