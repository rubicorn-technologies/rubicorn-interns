
# Rubicorn Internship + Training Platform

Premium dark glassmorphic single-page site with paid training application flow, Supabase backend, and admin dashboard.

## Tech & Setup

- TanStack Start (existing) + Tailwind v4 + shadcn
- Lovable Cloud (Supabase) — enabled in build phase
- Razorpay (test mode, ₹1 default) via server functions
- Logo (`src/assets/rubicorn-logo.jpg`) drives palette: deep navy `#0a2540` + teal `#1cb5c9` accents on near-black background

## Design System

- Dark only. Tokens in `src/styles.css` (oklch): `--background` near-black, `--primary` teal, `--accent` navy, gradient + glass tokens (`--gradient-primary`, `--glass-bg`, `--glass-border`, `--shadow-glow`)
- Glass utility classes, floating blur orbs, animated mesh gradient bg, reveal-on-scroll (IntersectionObserver), hover spotlight
- Typography: Inter / Space Grotesk via Google Fonts

## Routes

```
src/routes/
  __root.tsx              SEO defaults, fonts, dark class on html
  index.tsx               Landing (Hero, About, Domains, Process, Benefits, Tech, FAQ, Contact, Footer)
  success.tsx             Post-payment confetti + intern ID + next steps
  privacy.tsx             Privacy Policy
  terms.tsx               Terms & Conditions
  refund.tsx              Refund Policy
  login.tsx               Admin login (email/password)
  _authenticated.tsx      Guard layout (admin role check)
  _authenticated/admin/index.tsx        Overview (stats, revenue by domain)
  _authenticated/admin/applicants.tsx   Table + filters + detail modal + CSV export
  _authenticated/admin/payments.tsx     Payment tracking
  _authenticated/admin/certificates.tsx Placeholder
  _authenticated/admin/settings.tsx     Domain config, intern-ID prefix
  api/public/razorpay-webhook.ts        HMAC-verified webhook (marks payment paid)
```

## Components

`Navbar`, `Hero`, `DomainsGrid`, `ProcessTimeline`, `BenefitsCards`, `TechMarquee`, `FAQAccordion`, `ContactSection`, `Footer`, `ApplyModal` (multi-step form + Razorpay), `GlassCard`, `BlurOrbs`, `AdminShell`, `ApplicantTable`, `StatCard`, `ApplicantDetailDrawer`.

## Database (Supabase)

```
profiles (id uuid PK = auth.users.id, email, full_name, created_at)
user_roles (id, user_id, role app_role enum: 'admin'|'user', unique(user_id,role))
  + has_role(uuid, app_role) security-definer fn
domains (id, slug, name, description, price_inr, active, sort)
applications (
  id uuid PK, intern_id text unique,        -- generated: RBN-{DOMAIN}-{YYYY}-{seq}
  full_name, email, phone, college, degree, year_of_study,
  domain_id FK, mode enum('online','hybrid','offline'),
  linkedin_url, github_url, resume_path,    -- supabase storage
  motivation text,
  payment_status enum('pending','paid','failed'),
  amount_inr int, razorpay_order_id, razorpay_payment_id, razorpay_signature,
  created_at, paid_at
)
```
- Trigger generates `intern_id` on payment_status -> 'paid'
- RLS: applications insert allowed for anon; select/update only `has_role(auth.uid(),'admin')`
- Storage bucket `resumes` (private); signed URLs in admin view
- Admin seed: `admin@rubicorn.org` created via Supabase admin API in a one-time setup server fn; role row inserted

## Server Functions (`src/lib/*.functions.ts`)

- `createOrder` — input: applicationData + domainId. Inserts pending application, uploads resume, creates Razorpay order via REST, returns `{orderId, amount, keyId, applicationId}`
- `verifyPayment` — verifies HMAC(`order_id|payment_id`, secret), updates application to paid, returns intern_id
- `listApplications` (admin) — paginated, filterable
- `dashboardStats` (admin) — totals, revenue by domain
- `signResumeUrl` (admin)

Secrets needed: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` (prompted via add_secret).

## Application Flow

1. User clicks Apply → `ApplyModal` opens (glass, multi-step)
2. Fills form, uploads resume, agrees to disclaimer
3. `createOrder` server fn → returns Razorpay order
4. Razorpay Checkout script loaded; opens modal
5. On success handler → `verifyPayment` server fn
6. Redirect to `/success?id={intern_id}` with confetti

## Admin

- Login: Supabase email/password. After auth, `_authenticated` guard checks `has_role`; non-admins redirected.
- Default admin seeded with `admin@rubicorn.org` / provided password
- Dashboard: stat cards (total applicants, paid, revenue, conversion), revenue-by-domain chart (Recharts), recent table
- Applicants page: searchable/filterable table, detail drawer with resume preview, CSV export

## SEO

- Per-route `head()` with India-focused keywords ("internship India", "online internship training", domain names)
- JSON-LD: `Organization` (root) + `Course`/`EducationalOrganization` on index
- `public/robots.txt`, `public/sitemap.xml` (relative URLs)
- OG: generated image for landing

## Build Order

1. Enable Lovable Cloud; add Razorpay secrets
2. Migrations: enums, tables, RLS, trigger, storage bucket, seed domains + admin role
3. Design tokens + global effects in `styles.css`; copy logo to `src/assets/`
4. Landing page sections + components
5. ApplyModal + Razorpay server fns + success page
6. Webhook route
7. Admin auth + dashboard
8. Legal pages, SEO, sitemap, README

## Notes for User

- Test price hardcoded to ₹1; flip per-domain in admin > Settings later
- Razorpay in **test mode** until you swap in live keys via Cloud > Secrets
- Email automation (offer letter), certificate generation, and notifications are out of scope for v1 (listed in README pending)
