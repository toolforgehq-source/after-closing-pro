# After Closing Pro

AI-powered warranty and homeowner care platform for homebuilders.

**"Stop warranty calls from eating your life."**

## What It Does

After Closing Pro handles homeowner warranty requests after closing:
- Homeowners submit issues through a simple intake page
- AI triages the issue — asks follow-up questions, suggests safe troubleshooting
- Simple issues get resolved before they become service calls
- Real issues become organized tickets with AI summaries
- Builders assign trades in one click
- Everything is documented for warranty protection

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI (GPT-4o-mini for triage)
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/toolforgehq-source/after-closing-pro.git
cd after-closing-pro
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql` in the SQL editor
3. Copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in your keys:
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon key
- `OPENAI_API_KEY` — For AI triage
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — For billing
- `RESEND_API_KEY` — For email notifications

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login / Signup pages
│   ├── (dashboard)/     # Builder dashboard (protected)
│   │   └── dashboard/
│   │       ├── page.tsx          # Overview
│   │       ├── tickets/          # Ticket management
│   │       ├── homes/            # Home management
│   │       ├── trades/           # Trade management
│   │       └── settings/         # Company settings
│   ├── submit/[slug]/   # Public homeowner intake page
│   ├── api/
│   │   ├── triage/      # AI triage endpoint
│   │   ├── auth/        # Auth callback
│   │   └── webhooks/    # Stripe webhooks
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   └── intake/          # Intake page components
└── lib/
    ├── supabase/        # Supabase client/server helpers
    ├── stripe/          # Stripe client/server helpers
    ├── ai/              # AI triage system + prompts
    ├── types.ts         # TypeScript types + constants
    ├── utils.ts         # Utility functions
    └── email.ts         # Email notification helpers
```

## Database

See `supabase/migrations/001_initial_schema.sql` for the complete schema including:
- Companies, profiles, homes, trades
- Tickets with full status tracking
- AI triage sessions and messages
- Row Level Security policies

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Set all environment variables in your Vercel project settings.
