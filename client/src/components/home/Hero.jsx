import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react'
import Login from '../../pages/Login'

const NAV_LINKS = [
  ['Home', '#'],
  ['Features', '#features'],
  ['Pricing', '/pricing'],
]

const Hero = () => {
  const { user } = useSelector(state => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState(null) // 'login' | 'register' | null

  return (
    <div>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-lg border-b border-white/40 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-40 h-16">
        <Link to="/"><img src="/logo.svg" alt="logo" className="h-9 w-auto" /></Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          {NAV_LINKS.map(([label, href]) => (
            <li key={label}>
              {href.startsWith('/')
                ? <Link to={href} className="hover:text-violet-700 transition">{label}</Link>
                : <a href={href} className="hover:text-violet-700 transition">{label}</a>
              }
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link to="/app" className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-full transition">Dashboard</Link>
          ) : (
            <>
              <button onClick={() => setAuthModal('login')} className="px-5 py-2 text-sm text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 transition">Log in</button>
              <button onClick={() => setAuthModal('register')} className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-full transition">Start Building</button>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(true)} className="md:hidden" aria-label="Open menu">
          <Menu size={22} className="text-slate-700" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center gap-8 text-lg text-slate-800 md:hidden">
          <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-6" aria-label="Close">
            <X size={24} />
          </button>
          {NAV_LINKS.map(([label, href]) => (
            href.startsWith('/')
              ? <Link key={label} to={href} onClick={() => setMenuOpen(false)}>{label}</Link>
              : <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          {user ? (
            <Link to="/app" className="mt-2 px-8 py-3 bg-violet-600 text-white rounded-full text-base" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          ) : (
            <button onClick={() => { setMenuOpen(false); setAuthModal('register') }} className="mt-2 px-8 py-3 bg-violet-600 text-white rounded-full text-base">
              Get Started
            </button>
          )}
        </div>
      )}

      {/* Hero */}
      <style>{`
        @keyframes heartbeat {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0px rgba(139,92,246,0)); }
          10%       { filter: brightness(1.06) drop-shadow(0 0 5px rgba(139,92,246,0.25)); }
          20%       { filter: brightness(1) drop-shadow(0 0 0px rgba(139,92,246,0)); }
          32%       { filter: brightness(1.08) drop-shadow(0 0 8px rgba(168,85,247,0.3)); }
          55%       { filter: brightness(1) drop-shadow(0 0 0px rgba(139,92,246,0)); }
        }
        .animate-heartbeat { animation: heartbeat 5s ease-in-out infinite; display: inline-block; }
      `}</style>
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_30%,rgba(139,92,246,0.45),rgba(167,139,250,0.15)_50%,transparent_75%)]" />

        <div className="flex items-center gap-2 text-xs font-medium text-violet-700 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-8">
          <Sparkles size={12} />
          500+ resumes created this month
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-slate-900 leading-[1.1] max-w-4xl">
          Build Resumes That
          <br />
          <span className="animate-heartbeat bg-linear-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
            Get You Hired
          </span>
          <br />
          Not Ghosted
        </h1>

        <p className="mt-6 text-lg text-slate-500 max-w-xl leading-relaxed">
          AI-powered intelligence meets brutally honest feedback. We don't just format — we transform your story into interview magnets.
        </p>

        <div className="mt-10 flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => setAuthModal('register')}
            className="flex items-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-full transition shadow-lg shadow-violet-200"
          >
            Create My Resume <ArrowRight size={16} />
          </button>
          <a
            href="#features"
            className="px-8 py-3.5 text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-full transition"
          >
            See How It Works
          </a>
        </div>

      </section>

      {authModal && <Login defaultState={authModal} onClose={() => setAuthModal(null)} />}
    </div>
  )
}

export default Hero
