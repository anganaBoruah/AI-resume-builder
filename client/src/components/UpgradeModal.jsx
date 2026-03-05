import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, CheckCircle2, Crown, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../configs/api'
import { login } from '../app/features/authSlice'
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay'

const PLANS = [
  {
    id: 'monthly',
    label: 'Pro Monthly',
    price: '₹99',
    period: '/month',
    features: ['Download as PDF', 'AI Writing Assistant', 'All Premium Templates'],
  },
  {
    id: 'yearly',
    label: 'Pro Yearly',
    price: '₹499',
    period: '/year',
    saving: 'Save ₹689',
    features: ['Everything in Pro', 'Priority Support', 'Early Access Features'],
  },
]

/**
 * Modal shown when a free user tries to access a premium feature.
 * @param {{ onClose: () => void, feature?: string }} props
 */
const UpgradeModal = ({ onClose, feature = 'Resume Downloads' }) => {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)
  const [loadingPlan, setLoadingPlan] = useState(null)

  const handleUpgrade = async (planId) => {
    try {
      setLoadingPlan(planId)

      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error('Could not load payment gateway. Please try again.')
        return
      }

      const { data: order } = await api.post(
        '/api/payments/create-order',
        { plan: planId },
        { headers: { Authorization: token } }
      )

      const paymentResponse = await openRazorpayCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        user,
        plan: planId,
      })

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
      onClose()
    } catch (error) {
      if (error.message !== 'Payment cancelled') {
        toast.error(error?.response?.data?.message || error.message || 'Payment failed.')
      }
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="relative bg-linear-to-br from-violet-600 to-purple-700 px-6 pt-8 pb-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={14} className="text-white" />
          </button>
          <div className="inline-flex items-center justify-center size-12 rounded-full bg-white/15 mb-3">
            <Crown size={22} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Unlock {feature}
          </h2>
          <p className="mt-1.5 text-sm text-violet-200">
            Upgrade to Pro to access this feature and more.
          </p>
        </div>

        {/* Plans */}
        <div className="p-5 space-y-3">
          {PLANS.map((plan) => {
            const isLoading = loadingPlan === plan.id

            return (
              <div
                key={plan.id}
                className={`rounded-xl border-2 p-4 transition-colors ${
                  plan.id === 'yearly'
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{plan.label}</span>
                      {plan.saving && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full">
                          {plan.saving}
                        </span>
                      )}
                    </div>
                    <div className="flex items-end gap-0.5 mt-0.5">
                      <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                      <span className="text-xs text-slate-400 pb-0.5">{plan.period}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isLoading}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60 ${
                      plan.id === 'yearly'
                        ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-400/30'
                        : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    <Zap size={13} />
                    {isLoading ? 'Processing…' : 'Upgrade'}
                  </button>
                </div>

                <ul className="space-y-1.5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={13} className="text-violet-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <p className="text-center text-[11px] text-slate-400 pb-5">
          Secure payment via Razorpay · Cancel anytime
        </p>
      </div>
    </div>
  )
}

export default UpgradeModal
