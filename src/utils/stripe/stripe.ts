import { config } from 'src/config/stipe';
import Stripe from 'stripe';

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2024-06-20',
});
