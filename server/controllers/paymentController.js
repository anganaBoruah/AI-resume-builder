import Razorpay from 'razorpay'
import crypto from 'crypto'
import User from '../models/User.js'

/** Lazy-initialised so env vars are guaranteed to be loaded first */
const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })

/** Amount in paise (₹1 = 100 paise) */
const PLAN_AMOUNTS = {
  monthly: 9900,   // ₹99
  yearly: 49900,   // ₹499
}

/**
 * POST /api/payments/create-order
 * Creates a Razorpay order for the selected plan.
 */
export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body

    if (!PLAN_AMOUNTS[plan]) {
      return res.status(400).json({ message: 'Invalid plan. Choose "monthly" or "yearly".' })
    }

    const order = await getRazorpay().orders.create({
      amount: PLAN_AMOUNTS[plan],
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message })
  }
}

/**
 * POST /api/payments/verify-payment
 * Verifies Razorpay signature and activates the user's subscription.
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body

    console.log('[verifyPayment] userId:', req.userId, '| plan:', plan)
    console.log('[verifyPayment] order_id:', razorpay_order_id, '| payment_id:', razorpay_payment_id)

    // Validate signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      console.error('[verifyPayment] Signature mismatch! expected:', expectedSignature, '| received:', razorpay_signature)
      return res.status(400).json({ message: 'Payment verification failed: invalid signature.' })
    }

    console.log('[verifyPayment] Signature valid. Updating user...')

    // Activate subscription on the user record
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        plan,
        subscriptionStatus: 'active',
        razorpaySubscriptionId: razorpay_payment_id,
      },
      { new: true }
    ).select('-password')

    if (!user) {
      console.error('[verifyPayment] User not found for userId:', req.userId)
      return res.status(404).json({ message: 'User not found.' })
    }

    console.log('[verifyPayment] User updated successfully. plan:', user.plan)
    res.json({ message: 'Subscription activated successfully!', user })
  } catch (error) {
    console.error('[verifyPayment] Error:', error)
    res.status(500).json({ message: 'Payment verification failed', error: error.message })
  }
}
