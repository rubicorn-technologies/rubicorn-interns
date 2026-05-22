# Rubicorn Internships Platform

Premium internship and industry training platform for Rubicorn Technologies Pvt. Ltd.

## Completed

- Full landing page: Hero, About, Domains, Process, Benefits, Tech, FAQ, Contact, Footer
- Dark glassmorphic design system with Tailwind v4 tokens, reveal-on-scroll, and animated gradients
- Application flow with Razorpay payment integration
- Supabase backend: applications, domains, user roles, RLS, intern ID trigger, private resume storage
- Admin authentication with Supabase email/password and admin role check
- Admin dashboard: overview, applicants, payments, certificates, and settings stubs
- Success page with confetti and intern ID display
- Privacy, Terms, and Refund pages
- SEO metadata, JSON-LD organization, robots.txt, and sitemap.xml

## Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in the values before testing application, payment, or admin flows.

Required server-side variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Required client-side variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Vercel Deployment

This repository includes `vercel.json` so Vercel installs with npm, builds with `npm run build`, serves `dist/client`, and falls back all app routes to `index.html`. This fixes the Vercel `404: NOT_FOUND` deployment shape for the public site.

Add the environment variables above in Vercel Project Settings before testing application, payment, or admin workflows. The public site can render without the service role key, but server functions such as application submission and admin data require `SUPABASE_SERVICE_ROLE_KEY`.

Configure Razorpay webhooks to call:

```text
https://your-vercel-domain/api/razorpay-webhook
```

## Pending / Next Steps

- Email automation for offer letters
- Certificate PDF generation
- WhatsApp / SMS notifications
- Advanced admin permissions

## Admin

- URL: `/login`
- Default admin: `admin@rubicorn.org` / set during onboarding

Training fee is set in the `domains` table.
