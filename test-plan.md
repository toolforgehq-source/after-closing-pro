# After Closing Pro — End-to-End Test Plan

## Context
This is a brand new MVP app. All credentials (Supabase, OpenAI, Stripe, Resend) are placeholders.
Testing focuses on verifiable UI rendering, navigation, and page structure.

## Test Environment
- Dev server: `http://localhost:3000`
- No real backend (Supabase placeholder URL)
- Browser: Chrome

---

## Test 1: Landing Page Content & Structure

**What to verify:** The landing page renders all sections with correct content, pricing, and navigation links.

**Steps:**
1. Navigate to `http://localhost:3000`
2. Verify the nav bar contains "After Closing Pro" brand name and "Sign In" / "Start Free Trial" links

**Assertions:**
- Nav shows "After Closing Pro" text
- "Sign In" link points to `/login`
- "Start Free Trial" link points to `/signup`
- Hero heading contains "Stop warranty calls from eating your life"
- Hero subtext mentions "AI to handle homeowner warranty requests after closing"
- "14-day free trial. No credit card required." text is visible
- "Sound Familiar?" section heading is present with 6 pain point cards
- "How It Works" section shows 3 numbered steps: "Homeowner Submits Issue", "AI Triages the Issue", "You Get a Clean Ticket"
- "Built for Builders" section shows 6 feature cards including "AI Issue Triage", "Smart Ticket Management", "Trade Routing", "Warranty Protection", "Instant Escalation", "Homeowner Sign-Off"
- Pricing section shows 3 plans:
  - Starter: $199/month, "Up to 15 active warranty homes"
  - Growth: $399/month, "Up to 50 active warranty homes", labeled "Most Popular"
  - Pro: $799/month, "Unlimited warranty homes"
- Footer contains "Built by builders, for builders."

## Test 2: Login Page Renders Correctly & Shows Error on Invalid Submit

**What to verify:** Login form renders with correct fields and shows an error when submitting with placeholder Supabase.

**Steps:**
1. Click "Sign In" from the landing page nav
2. Verify the login form renders with email and password fields
3. Fill in email: `test@example.com`, password: `password123`
4. Click "Sign In" button
5. Observe error message appears (since Supabase URL is invalid)

**Assertions:**
- URL is `/login`
- "After Closing Pro" branding visible
- "Sign in to your builder account" subtitle visible
- Email input with label "Email" is present
- Password input with label "Password" is present
- "Sign In" submit button is present
- "Don't have an account? Sign up" link visible, points to `/signup`
- After submit: a red error message appears in the form (exact text depends on Supabase client error)

## Test 3: Signup Page Two-Step Form Flow

**What to verify:** Signup page renders a 2-step form — account details first, then company creation.

**Steps:**
1. Navigate to `/signup` via the "Sign up" link on login page
2. Verify Step 1 form: name, email, password fields
3. Fill in name: "Test Builder", email: "test@builder.com", password: "test1234"
4. Click "Continue"
5. Verify Step 2 form appears with company fields
6. Verify "Back" button takes you back to Step 1

**Assertions:**
- URL is `/signup`
- Step 1 subtitle: "Create your builder account"
- "Your Name" input is present
- "Email" input is present
- "Password" input is present (min 6 chars)
- "Continue" button is present
- "Already have an account? Sign in" link visible, points to `/login`
- After clicking Continue, Step 2 appears:
  - Subtitle changes to "Set up your company"
  - "Company Name" input is present
  - "Company Phone (Optional)" input is present
  - "Create Account" button is present
  - "Back" text button is present
- Clicking "Back" returns to Step 1 with previously entered values preserved (name, email, password)

## Test 4: Dashboard Route Protection (Auth Redirect)

**What to verify:** Unauthenticated access to `/dashboard` redirects to `/login`.

**Steps:**
1. Navigate directly to `http://localhost:3000/dashboard`
2. Observe redirect to `/login`

**Assertions:**
- Browser URL changes to `/login` (307 redirect confirmed via curl)
- Login page is displayed, not the dashboard
