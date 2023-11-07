import Stripe from 'stripe'

if (!process.env.STRIPE_API_KEY) {
  throw new Error('STRIPE_API_KEY not defined in environment variables.');
}

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY, 
  {
    apiVersion: '2023-08-16',
    appInfo: {
      name: 'rtnews',
      version: '0.1.0'
    },
});