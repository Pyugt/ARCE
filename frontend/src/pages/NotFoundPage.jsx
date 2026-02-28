import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page-enter min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-8xl font-bold text-stone-200">404</p>
        <h1 className="font-display text-3xl font-medium text-stone-900 mt-4">Page not found</h1>
        <p className="text-stone-500 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-flex mt-8">← Back to Shop</Link>
      </div>
    </div>
  )
}
