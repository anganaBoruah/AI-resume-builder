import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, Zap, Crown, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../configs/api'
import { login } from '../app/features/authSlice'
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay'

const PLANS = [
  {
    id: 'free',
    label: 'Free',
    price: '₹0',
    period: '/month',
    description: 'Perfect for getting started.',
    buttonText: 'Get Started Free',
    features: [
      '1 Professional Resume',
      'Standard Templates',
      'Preview Resume',
      'Basic AI Suggestions',
    ],
  },
  {
    id: 'monthly',
    label: 'Pro',
    badge: 'Most Popular',
    price: '₹99',
    period: '/month',
    description: 'Everything you need to land the job.',
    buttonText: 'Upgrade to Pro',
    features: [
      'Unlimited Resumes',
      'Download as PDF',
      'AI Writing Assistant',
      'All Premium Templates',
      'Real-time AI Enhancement',
    ],
  },
  {
    id: 'yearly',
    label: 'Elite',
    badge: 'Best Value',
    price: '₹499',
    period: '/year',
    saving: 'Save ₹689',
    description: 'All of Pro, billed annually.',
    buttonText: 'Go Elite',
    features: [
      'Everything in Pro',
      'Priority Support 24/7',
      'Early Access to Features',
      'Save ₹689 vs monthly',
    ],
  },
]

const Pricing = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const [loadingPlan, setLoadingPlan] = useState(null)

  const isPremium =
    (user?.plan === 'monthly' || user?.plan === 'yearly') &&
    user?.subscriptionStatus === 'active'

  const handleUpgrade = async (planId) => {
    if (planId === 'free') {
      navigate(user ? '/app' : '/')
      return
    }
    if (!user) {
      toast.error('Please log in to upgrade.')
      navigate('/')
      return
    }
    if (isPremium && user.plan === planId) {
      toast('You are already on this plan.')
      return
    }
    try {
      setLoadingPlan(planId)
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast.error('Could not load payment gateway.'); return }

      const { data: order } = await api.post('/api/payments/create-order', { plan: planId }, { headers: { Authorization: token } })
      const paymentResponse = await openRazorpayCheckout({ orderId: order.orderId, amount: order.amount, currency: order.currency, user, plan: planId })
      const { data: verifyData } = await api.post('/api/payments/verify-payment', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        plan: planId,
      }, { headers: { Authorization: token } })

      dispatch(login({ token, user: verifyData.user }))
      toast.success('🎉 Subscription activated!')
      navigate('/app')
    } catch (error) {
      if (error.message !== 'Payment cancelled') {
        toast.error(error?.response?.data?.message || error.message || 'Payment failed.')
      }
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
        <div className="px-6 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <span className="text-slate-300">|</span>
          <Link to="/"><img src="/logo.svg" alt="logo" className="h-7 w-auto" /></Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Invest in your career, <span className="text-violet-600">not your resume tool</span>
        </h1>
        <p className="mt-4 text-base text-slate-500 max-w-md mx-auto leading-relaxed">
          One-time upgrade. Cancel anytime. No hidden fees.
        </p>
        {isPremium && (
          <div className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
            <Crown size={14} /> Active: {user.plan === 'monthly' ? 'Pro Monthly' : 'Elite Yearly'}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan) => {
            const isCurrentPlan = user?.plan === plan.id && isPremium
            const isLoading = loadingPlan === plan.id
            const isPro = plan.id === 'monthly'
            const isElite = plan.id === 'yearly'

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl p-7 transition-all duration-200 ${
                  isPro
                    ? 'bg-white border-2 border-violet-500 shadow-xl shadow-violet-100 scale-[1.02]'
                    : isElite
                    ? 'bg-[#0f0c1a] border border-[#2a2040]'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      isPro ? 'bg-violet-600 text-white shadow-sm shadow-violet-400/40' : 'bg-amber-400 text-amber-900'
                    }`}>
                      <Zap size={9} /> {plan.badge}
                    </span>
                  </div>
                )}

                {/* Label */}
                <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${
                  isPro ? 'text-violet-600' : isElite ? 'text-violet-400' : 'text-slate-400'
                }`}>
                  {plan.label}
                </p>

                {/* Price */}
                <div className="flex items-end gap-2 mb-1">
                  <span className={`text-4xl font-extrabold tracking-tight ${isElite ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm pb-1 ${isElite ? 'text-slate-400' : 'text-slate-400'}`}>{plan.period}</span>
                  {plan.saving && (
                    <span className="ml-auto mb-1 inline-block text-[11px] font-semibold px-2.5 py-0.5 bg-violet-500/20 text-violet-300 rounded-full">
                      {plan.saving}
                    </span>
                  )}
                </div>

                <p className={`text-sm mb-6 ${isElite ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>

                {/* CTA */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading || isCurrentPlan}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-6 ${
                    isPro
                      ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-400/30'
                      : isElite
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : isLoading ? 'Processing…' : plan.buttonText}
                </button>

                {/* Divider */}
                <div className={`border-t mb-5 ${isElite ? 'border-white/10' : 'border-slate-100'}`} />

                {/* Features */}
                <ul className="space-y-3 mt-auto">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5">
                      <CheckCircle2 size={15} className={`shrink-0 ${isPro ? 'text-violet-500' : isElite ? 'text-violet-400' : 'text-slate-400'}`} />
                      <span className={`text-sm ${isElite ? 'text-slate-300' : 'text-slate-600'}`}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2 text-sm">
            <Shield size={14} className="text-green-500" />
            <span>Secure payment via Razorpay</span>
          </div>
          <span className="text-slate-200">|</span>
          <span className="text-sm">Cancel anytime</span>
          <span className="text-slate-200">|</span>
          <span className="text-sm">No hidden charges</span>
        </div>
      </div>
    </div>
  )
}

export default Pricing
