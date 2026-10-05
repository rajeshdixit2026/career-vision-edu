# Career Vision Education Services — App Spec

## What this app is
A recreation of the owner's business site (careervisioneducationservices.com) as a modern
multi-page marketing + lead-generation site: **career counseling & admission guidance consultancy
based in **Gopalganj, Bihar**, serving students across India.

- Brand: Navy `#04194E` primary + Gold `#FFCD2A` accent. Fonts: Outfit (headings) + Plus Jakarta Sans (body).
- Public site: no login. Lead capture is the core business flow.

## Pages (frontend/src/pages, routes in App.tsx)
- `/` Home — hero (exact original copy: "Make the Right Choice for Your Future."), stats ribbon, services grid (6), popular courses (API), featured colleges (API), why-us, funding teaser, testimonials, CTA band. "Book Free Counselling" buttons open QuickCounsellingModal (Dialog).
- `/about` AboutUs, `/courses` Courses (category filter pills synced to `?category=`), `/colleges` Colleges (debounced search + state + stream filters), `/counseling` CareerCounseling (5-stage framework + booking form), `/bihar-credit-card` MNSSBY page (benefits, eligibility, documents, EMI calculator 4% vs 10.5%), `/education-loan` (loan comparison + EMI calculator), `/scholarships` (scheme directory), `/contact` (office info + enquiry form), `/apply` (lead form, accepts `?college=` prefill).
- Forms all render LeadCaptureForm; funding pages use FundingCalculator (client-side EMI math).

## Backend (all under /api, via api_router in server.py)
- `GET /api/courses?category=` → Course[] (28 seeded)
- `GET /api/colleges?search=&state=&stream=` → College[] (20 seeded)
- `POST /api/leads` → Lead (201). Body: name, phone (validated 10-digit Indian mobile), email?, course_interest?, state?, message?, source: apply|counselling|contact
- `POST /api/enquiries` → Lead (201). Same model; forces source="contact" (contact page form).
- `GET /api/leads` → Lead[] **requires header `X-Admin-Key` matching ADMIN_KEY in backend/.env** (401 otherwise).
- Collections: `courses`, `colleges`, `leads` (+ template's `status_checks`). Indexes registered in lib/db.py INDEXES, applied at startup by ensure_indexes().

## Data model (Pydantic ↔ hand-written TS mirrors in frontend/src/lib/types.ts)
- Course: id, name, category, level, duration, eligibility, fee_range, description, career_outcomes[], popular
- College: id, name, city, state, type (Government|Private|Private (Deemed)), streams[], rating, fee_range, description, featured
- Lead: LeadCreate fields + id, created_at (aware UTC on write, normalised on read)

## Seed / fallback
- `cd /app/backend && python seed.py` — idempotent wipe+reseed of courses & colleges (stable slug ids like `course-btech`, `col-galgotias`).
- Frontend has FALLBACK_COURSES / FALLBACK_COLLEGES (lib/fallbackData.ts) shown only when the API errors, so the static preview never blanks.

## Business contact (confirmed by the owner)
- Owner: Rajesh Dixit
- Address: 2nd Floor, Sona Commercial Complex, Above Mangal Marble, Banjari Road, Gopalganj, Bihar – 841428
- Phone (call): +91 84346 99521 · WhatsApp: +91 62013 77781 (wa.me/916201377781)
- Email: careervisioneducationservices@gmail.com · Hours: Mon–Sat 10 AM – 6 PM
- Instagram + Facebook links in `frontend/src/lib/site.ts` CONTACT

## Admin dashboard (`/admin`)
- PIN gate → `POST /api/admin/login` sets an httpOnly cookie (`cv_admin_session`, HMAC of ADMIN_PIN). `GET /api/admin/me` answers "am I logged in", `POST /api/admin/logout` clears it.
- `GET /api/admin/leads` (cookie-protected) returns `{stats, leads}`: totals per source + last-7-days count, and every enquiry newest-first.
- UI: 5 stat cards, search box, request-type filter, CSV export, per-row call + WhatsApp buttons.
- PIN is `ADMIN_PIN` in backend/.env (see memory/test_credentials.md).

## Email alerts
- `lib/email.py` — Emergent managed Resend proxy. Owner alert fires on every lead via `asyncio.create_task` so a slow/failing mail provider can never delay or break a student's submission (errors are logged only).
- Recipient is `OWNER_EMAIL` (server config, never caller input); body comes from the server-side template `build_lead_alert()`; `_assert_safe_email()` gate runs on every send.
- Env: `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME`, `OWNER_EMAIL`, `EMAIL_REPLY_TO`.

## WhatsApp
- `components/layout/WhatsAppButton.tsx` — floating CTA on every public page (hidden on `/admin`), with a dismissible hint bubble and a pre-filled message.
