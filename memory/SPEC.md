# Career Vision Education Services — App Spec

## What this app is
A recreation of the owner's business site (careervisioneducationservices.com) as a modern
multi-page marketing + lead-generation site: **career counseling & admission guidance consultancy
based in Janakpuri, New Delhi**, serving students across India.

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

## Business contact shown on site (from public sources — owner should confirm)
- Address: 615B, 1st Floor, Plot No. 6, District Centre, Janakpuri, New Delhi – 110058
- Phones: +91 97113 56677 / +91 96544 93444 · WhatsApp wa.me/919711356677
- Email: info@careervisioneducationservices.com · Hours: Mon–Sat 10 AM – 6 PM
- Instagram: @careervisioneducationservices
