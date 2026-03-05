import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, Zap, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../configs/api'
import { login } from '../app/features/authSlice'
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay'

const PLANS = [
  {
    id: 'free',
    label: 'FREE',
    price: '₹0',
    period: '/month',
    description: 'Get started with the basics.',
    buttonText: 'Get Started',
    buttonStyle: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    cardStyle: 'bg-white border border-slate-200',
    labelStyle: 'text-slate-500',
    priceStyle: 'text-slate-900',
    featureStyle: 'text-slate-600',
    checkStyle: 'text-violet-500',
    features: [
      '1 Professional Resume',
      'Standard Templates',
      'Preview Resume',
      'Basic AI Suggestions',
    ],
  },
  {
    id: 'monthly',
    label: 'PRO',
    badge: 'MOST POPULAR',
    price: '₹99',
    period: '/month',
    description: 'Unlock everything, pay monthly.',
    buttonText: 'Upgrade Now',
    buttonStyle: 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/30',
    cardStyle: 'bg-white border-2 border-violet-400 shadow-xl shadow-violet-100',
    labelStyle: 'text-violet-600',
    priceStyle: 'text-slate-900',
    featureStyle: 'text-slate-600',
    checkStyle: 'text-violet-500',
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
    label: 'ELITE',
    badge: 'BEST VALUE',
    price: '₹499',
    period: '/year',
    saving: 'Save ₹689',
    description: 'Everything in Pro, billed yearly.',
    buttonText: 'Go Elite',
    buttonStyle: 'bg-white text-slate-900 hover:bg-slate-100',
    cardStyle: 'bg-[#1a1535] border border-[#2d2550]',
    labelStyle: 'text-violet-400',
    priceStyle: 'text-white',
    featureStyle: 'text-slate-300',
    checkStyle: 'text-violet-400',
    features: [
      'Everything in Pro',
      'Save ₹689 vs monthly',
      'Priority Support 24/7',
      'Early Access to Features',
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
      if (!loaded) {
        toast.error('Could not load payment gateway. Please try again.')
        return
      }

      // 1. Create order on backend
      const { data: order } = await api.post(
        '/api/payments/create-order',
        { plan: planId },
        { headers: { Authorization: token } }
      )

      // 2. Open Razorpay checkout
      const paymentResponse = await openRazorpayCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        user,
        plan: planId,
      })

      // 3. Verify payment and activate subscription
      const { data: verifyData } = await api.post(
        '/api/payments/verify-payment',
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          plan: planId,
        },
        { headers: { Authorization: token } }
      )

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
    <div className="min-h-screen bg-[#f0ebff]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#f0ebff]/80 backdrop-blur-sm border-b border-violet-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-violet-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <span className="text-sm font-semibold text-slate-700 tracking-tight">Subscription</span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Choose the plan that{' '}
          <span className="text-violet-600">fits your career</span>
        </h1>
        <p className="mt-4 text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
          Unlock the full power of AI to land your dream job with professional
          resumes and cover letters.
        </p>

        {/* Current plan badge */}
        {isPremium && (
          <div className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
            <Crown size={14} /> Active:{' '}
            {user.plan === 'monthly' ? 'Pro Monthly' : 'Pro Yearly'}
          </div>
        )}
      </div>

      {/* Pricing cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => {
            const isCurrentPlan = user?.plan === plan.id && isPremium
            const isLoading = loadingPlan === plan.id

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col gap-5 transition-transform hover:-translate-y-0.5 ${plan.cardStyle}`}
              >
                {/* Most Popular / Best Value badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-600 text-white text-[11px] font-bold tracking-widest uppercase shadow-md shadow-violet-500/30">
                      <Zap size={10} />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan label */}
                <div>
                  <p className={`text-[11px] font-bold tracking-widest uppercase ${plan.labelStyle}`}>
                    {plan.label}
                  </p>

                  {/* Price */}
                  <div className="mt-2 flex items-end gap-1">
                    <span className={`text-5xl font-extrabold tracking-tight ${plan.priceStyle}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm pb-1.5 ${plan.featureStyle}`}>{plan.period}</span>
                  </div>

                  {/* Saving pill */}
                  {plan.saving && (
                    <span className="mt-2 inline-block text-[11px] font-semibold px-2.5 py-1 bg-violet-500/20 text-violet-400 rounded-full">
                      {plan.saving}
                    </span>
                  )}
                </div>

                {/* CTA button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading || isCurrentPlan}
                  className={`w-full py-3 rounded-xl text-sm font-bold tracking-tight transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${plan.buttonStyle}`}
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : isLoading
                    ? 'Processing…'
                    : plan.buttonText}
                </button>

                {/* Divider */}
                <div className={`border-t ${plan.id === 'yearly' ? 'border-white/10' : 'border-slate-100'}`} />

                {/* Feature list */}
                <ul className="space-y-3">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className={`shrink-0 ${plan.checkStyle}`} />
                      <span className={`text-sm ${plan.featureStyle}`}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
          {['FORBES', 'TECHCRUNCH', 'WIRED', 'THE VERGE'].map((name) => (
            <span key={name} className="text-sm font-bold text-slate-400 tracking-widest">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing
