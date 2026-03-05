/**
 * Dynamically loads the Razorpay checkout script.
 * Returns true if loaded successfully, false otherwise.
 * @returns {Promise<boolean>}
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true) // already loaded

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Opens the Razorpay checkout modal and resolves with the payment response.
 * @param {{ orderId: string, amount: number, currency: string, user: object, plan: string }} opts
 * @returns {Promise<object>} razorpay payment response
 */
export const openRazorpayCheckout = ({ orderId, amount, currency, user, plan }) => {
  return new Promise((resolve, reject) => {
    // Track whether the payment handler already resolved the promise.
    // ondismiss can fire BEFORE handler for UPI redirect flows — this flag
    // prevents it from rejecting after a successful payment.
    let paymentHandled = false

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount,
      currency,
      order_id: orderId,
      name: 'AI Resume Builder',
      description: plan === 'monthly' ? 'Pro Monthly Plan — ₹99/month' : 'Pro Yearly Plan — ₹499/year',
      image: '/logo.svg',
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: { color: '#7C3AED' },
      handler: (response) => {
        paymentHandled = true
        resolve(response)
      },
      modal: {
        ondismiss: () => {
          if (!paymentHandled) reject(new Error('Payment cancelled'))
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      paymentHandled = true
      reject(new Error(response.error.description))
    })
    rzp.open()
  })
}
