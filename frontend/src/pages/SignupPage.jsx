import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const { register } = useAuth()
  const { fetchCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.includes('@')) errs.email = 'Valid email required'
    if (form.password.length < 6) errs.password = 'Password must be 6+ characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      await fetchCart()
      toast.success('Account created!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 page-enter">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl tracking-[0.2em] text-stone-900">ARCÉ</Link>
          <h1 className="mt-4 text-xl font-medium text-stone-800">Create your account</h1>
          <p className="mt-1 text-sm text-stone-500">Already have one? <Link to="/login" className="text-amber-600 hover:underline font-medium">Sign in</Link></p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5">
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
            { name: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-medium tracking-wider uppercase text-stone-500 mb-2">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`input-field ${errors[name] ? 'border-red-400 focus:border-red-500' : ''}`}
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-primary py-3.5 text-sm mt-2">
            {loading ? (
              <><span className="w-4 h-4 border border-stone-300 border-t-transparent rounded-full animate-spin" /> Creating account...</>
            ) : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
