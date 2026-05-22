# Rubicorn Internships Platform

Premium internship + industry training platform for Rubicorn Technologies Pvt. Ltd.

## ✅ Completed

- Full landing page (Hero, About, Domains, Process, Benefits, Tech, FAQ, Contact, Footer)
- Dark glassmorphic design system (Tailwind v4 tokens, blur orbs, reveal-on-scroll, animated gradients)
- Application flow with Razorpay payment integration (test mode)
- Supabase backend: applications, domains, user_roles, RLS, intern_id auto-generation trigger
- Resume upload to private storage bucket
- Admin authentication (Supabase email/password + role check)
- Admin dashboard: Overview (stats + revenue by domain), Applicants table (search, CSV export, resume preview), Payments, Certificates, Settings stubs
- Success page with confetti and intern ID display
- Privacy / Terms / Refund legal pages
- SEO: per-route metadata, JSON-LD organization, robots.txt, sitemap.xml
- Default admin seeded: `admin@rubicorn.org`

## ⏳ Pending / Next steps

- Swap Razorpay test keys for live keys (Cloud → Secrets: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`)
- Email automation for offer letters (Resend / SES)
- Certificate generation pipeline (PDF)
- WhatsApp / SMS notifications
- Advanced admin permissions (moderator role)
- Razorpay webhook reconciliation route

## Setup

```bash
bun install
bun run dev
```

## Deployment

Deploys automatically via Lovable Cloud → publish. Custom domain: `intern.rubicorn.in`.

## Admin

- URL: `/login`
- Default: `admin@rubicorn.org` / set during onboarding

Training fee is **₹1** by default (test mode). Update in `domains` table once live.
