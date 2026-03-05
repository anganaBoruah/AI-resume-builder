import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'
import { Crown, LogOut, Zap } from 'lucide-react'

const Navbar = () => {
  const { user } = useSelector(state => state.auth)

  const isPremium =
    (user?.plan === 'monthly' || user?.plan === 'yearly') &&
    user?.subscriptionStatus === 'active'
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutUser = () => {
    navigate('/')
    dispatch(logout())
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="bg-white border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.06)] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2.5">

        <Link to="/" className="flex items-center">
          <img src="/logo.svg" alt="logo" className="h-7 w-auto block" />
        </Link>

        <div className="flex items-center gap-6">
          {/* Upgrade CTA — only for free users */}
          {!isPremium && (
            <Link
              to="/pricing"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm shadow-violet-500/20"
            >
              <Zap size={12} /> Upgrade
            </Link>
          )}

          {/* Profile group */}
          <div className="flex items-center gap-4">
            {/* User chip */}
            <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="relative shrink-0">
                <div className="size-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-[11px]">
                  {initials}
                </div>
                {isPremium && (
                  <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-violet-600 flex items-center justify-center ring-1 ring-white">
                    <Crown size={7} className="text-white" />
                  </span>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-sm font-medium text-slate-700 leading-none">{user?.name}</span>
                {isPremium && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-600 leading-none tracking-wide">
                    PRO
                  </span>
                )}
              </div>
            </div>

            {/* Log out */}
            <button
              onClick={logoutUser}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:block"></span>
            </button>
          </div>
        </div>

      </nav>
    </div>
  )
}

export default Navbar
