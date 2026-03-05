/**
 * Returns true if the user has an active paid subscription.
 * @param {{ plan: string, subscriptionStatus: string }} user
 * @returns {boolean}
 */
export const isPremiumUser = (user) => {
  return (
    (user?.plan === 'monthly' || user?.plan === 'yearly') &&
    user?.subscriptionStatus === 'active'
  )
}
