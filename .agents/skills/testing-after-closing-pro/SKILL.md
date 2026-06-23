---
name: testing-after-closing-pro
description: Test the After Closing Pro MVP end-to-end. Use when verifying UI rendering, auth flows, landing page, or dashboard functionality.
---

# Testing After Closing Pro

## Prerequisites

### Devin Secrets Needed
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (required for full testing)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (required for full testing)
- `OPENAI_API_KEY` — OpenAI API key (required for AI triage testing)
- `STRIPE_SECRET_KEY` — Stripe secret key (required for billing testing)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook secret
- `RESEND_API_KEY` — Resend API key (required for email testing)

Without real credentials, only the following can be tested:
- Landing page (fully static server component)
- Login page (form rendering, error display on submit)
- Signup page (2-step form flow, Back button)
- Dashboard route protection (redirect to /login)

### Database Setup
If Supabase credentials are available:
1. Run `supabase/migrations/001_initial_schema.sql` against the Supabase project
2. This creates 9 tables with RLS policies

## Local Dev Server

```bash
cd /home/ubuntu/repos/after-closing-pro
npm install
npx next dev -p 3000
```

If port 3000 is in use, kill existing processes:
```bash
fuser -k 3000/tcp  # or pkill -f "next dev"
```

Wait for "Ready in Xms" message before testing.

## What to Test

### Without Supabase (UI-only)
1. **Landing page** (`/`) — Static server component, no API calls
   - Nav: "After Closing Pro" brand, Sign In (/login), Start Free Trial (/signup)
   - Hero: "Stop warranty calls from eating your life"
   - "Sound Familiar?" — 6 pain point cards
   - "How It Works" — 3 numbered steps
   - "Built for Builders" — 6 feature cards
   - Pricing: Starter $199, Growth $399 (Most Popular), Pro $799
   - CTA: "Ready to stop chasing warranty calls?"
   - Footer: "Built by builders, for builders."

2. **Login page** (`/login`) — Client component, Supabase called only on submit
   - Form renders: Email, Password inputs + Sign In button
   - "Don't have an account? Sign up" link
   - On submit with invalid Supabase: red error message appears

3. **Signup page** (`/signup`) — Client component, 2-step flow
   - Step 1: Name, Email, Password + Continue button
   - Step 2: Company Name, Phone (Optional) + Create Account + Back button
   - Back button preserves Step 1 values (name, email, password stored in React state)
   - Note: Browser autofill might fill Step 2 fields — this is browser behavior, not a bug

4. **Dashboard redirect** (`/dashboard`) — Middleware intercepts
   - Unauthenticated users get 307 redirect to /login
   - Middleware at `src/middleware.ts` calls `supabase.auth.getUser()`

### With Supabase (full flow)
5. **Sign up + company creation** — Creates user, company, and profile
6. **Dashboard** (`/dashboard`) — Stats cards, recent tickets, needs-review section
7. **Homes** (`/dashboard/homes`) — Grid view, add home form, warranty status
8. **Trades** (`/dashboard/trades`) — Trade list, add trade dialog
9. **Tickets** (`/dashboard/tickets`) — Filter by status, ticket detail with messages
10. **Settings** (`/dashboard/settings`) — Company settings form
11. **Homeowner intake** (`/submit/[company-slug]`) — Public page, AI chat flow

### With OpenAI (AI triage)
12. **AI triage chat** — Submit issue on intake page, verify AI asks follow-ups
13. **Emergency escalation** — Submit gas/water/electrical issue, verify immediate escalation
14. **Safe troubleshooting** — Submit GFCI/breaker issue, verify AI suggests safe steps

## Key Architecture Notes

- Landing page is a **server component** — no client-side JS needed to render
- Auth pages are **client components** — forms render without API calls, Supabase only called on submit
- Middleware matcher excludes `/submit`, `/api/triage`, `/api/webhooks`, and static assets
- Dashboard routes require authentication via middleware
- The AI triage system uses GPT-4o-mini with temperature 0.3
- Ticket statuses: new, ai_triage, needs_review, ai_resolved, assigned_to_trade, scheduled, in_progress, waiting_on_homeowner, completed, closed, not_warranty, emergency

## Common Issues

- **Port already in use**: Previous dev server instances might still be running. Use `fuser -k 3000/tcp` or `pkill -f "next dev"` to kill them.
- **"Failed to fetch" on login/signup**: Expected when using placeholder Supabase URL. This confirms error handling works.
- **Middleware timeout**: With placeholder Supabase URL, middleware might be slow on first request as it tries to reach the invalid URL. Subsequent requests should be faster.
- **`lsof` not available**: Use `fuser` or `ss -tlnp` instead to check port usage.
