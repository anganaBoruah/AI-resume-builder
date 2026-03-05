import { useState } from 'react'
import { MailIcon, LockIcon, User2Icon, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import api from '../configs/api'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'

const Login = ({ onClose, defaultState }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const urlState = new URLSearchParams(window.location.search).get('state')
  const [state, setState] = useState(defaultState || urlState || 'login')
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post(`/api/users/${state}`, formData, { timeout: 8000 })
      dispatch(login(data))
      localStorage.setItem('token', data.token)
      toast.success(data.message)
      if (onClose) { onClose(); navigate('/app') }
    } catch (error) {
      toast(error?.response?.data?.message || error.message)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post('/api/users/google', { credential: credentialResponse.credential })
      dispatch(login(data))
      localStorage.setItem('token', data.token)
      toast.success(data.message)
      if (onClose) { onClose(); navigate('/app') }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Google sign-in failed')
    }
  }

  const form = (
    <form
      onSubmit={handleSubmit}
      className="relative sm:w-[380px] w-full text-center rounded-2xl px-8 py-10 bg-white shadow-[0_8px_40px_-8px_rgba(139,92,246,0.3)] border border-slate-100"
    >
      {onClose && (
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition" aria-label="Close">
          <X size={18} />
        </button>
      )}

      <h1 className="text-slate-900 text-2xl font-semibold">
        {state === 'login' ? 'Welcome back' : 'Create account'}
      </h1>
      <p className="text-slate-400 text-sm mt-1.5 mb-6">
        {state === 'login' ? 'Log in to continue' : 'Sign up to get started'}
      </p>

      {/* Google OAuth */}
      <div className="flex justify-center mb-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google sign-in failed')}
          theme="outline"
          shape="pill"
          size="large"
          width="320"
          text={state === 'login' ? 'signin_with' : 'signup_with'}
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {state !== 'login' && (
        <div className="flex items-center w-full bg-white border border-slate-200 h-12 rounded-full overflow-hidden px-4 gap-2 mb-3">
          <User2Icon size={15} className="text-slate-400 shrink-0" />
          <input type="text" name="name" placeholder="Full name" className="flex-1 outline-none text-sm bg-transparent" value={formData.name} onChange={handleChange} required />
        </div>
      )}

      <div className="flex items-center w-full bg-white border border-slate-200 h-12 rounded-full overflow-hidden px-4 gap-2 mb-3">
        <MailIcon size={15} className="text-slate-400 shrink-0" />
        <input type="email" name="email" placeholder="Email address" className="flex-1 outline-none text-sm bg-transparent" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="flex items-center w-full bg-white border border-slate-200 h-12 rounded-full overflow-hidden px-4 gap-2">
        <LockIcon size={15} className="text-slate-400 shrink-0" />
        <input type="password" name="password" placeholder="Password" className="flex-1 outline-none text-sm bg-transparent" value={formData.password} onChange={handleChange} required />
      </div>

      {state === 'login' && (
        <div className="mt-3 text-left">
          <button type="reset" className="text-xs text-violet-500 hover:underline">Forgot password?</button>
        </div>
      )}

      <button type="submit" className="mt-5 w-full h-11 rounded-full text-white bg-violet-600 hover:bg-violet-700 transition font-medium text-sm">
        {state === 'login' ? 'Log in' : 'Create account'}
      </button>

      <p className="text-slate-400 text-sm mt-4">
        {state === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" onClick={() => setState(s => s === 'login' ? 'register' : 'login')} className="text-violet-600 hover:underline font-medium">
          {state === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </form>
  )

  if (onClose) {
    return (
      <div
        className="fixed inset-0 z-200 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {form}
      </div>
    )
  }

  return <div className="flex items-center justify-center min-h-screen bg-gray-50">{form}</div>
}

export default Login
