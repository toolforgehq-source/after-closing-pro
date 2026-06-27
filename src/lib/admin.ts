import { Subscription } from './types';

// Admin emails that get permanent free Pro access
const ADMIN_EMAILS = [
  'jacksonhomesnd@gmail.com',
];

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getAdminSubscription(companyId: string): Subscription {
  return {
    id: 'admin-free',
    company_id: companyId,
    stripe_customer_id: 'admin',
    stripe_subscription_id: 'admin',
    plan: 'pro',
    status: 'active',
    current_period_end: '2099-12-31T23:59:59Z',
    created_at: new Date().toISOString(),
  };
}
