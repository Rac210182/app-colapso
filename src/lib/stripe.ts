import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export const PRICES = {
  monthly: {
    BRL: 49.90,
    USD: 9.99,
    EUR: 9.99,
  },
  annual: {
    BRL: 29.90,
    USD: 5.99,
    EUR: 5.99,
  },
};

export const getCurrency = (locale: string): 'BRL' | 'USD' | 'EUR' => {
  if (locale.startsWith('pt')) return 'BRL';
  if (locale.startsWith('en')) return 'USD';
  return 'EUR';
};

export const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
};
