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
- `GET /api/colleges?search=&state=&stream=` → College[] (58 seeded, incl. the owner-supplied partner list)
- `POST /api/leads` → Lead (201). Body: name, phone (validated 10-digit Indian mobile), email?, course_interest?, state?, message?, source: apply|counselling|contact
- `POST /api/enquiries` → Lead (201). Same model; forces source="contact" (contact page form).
- `GET /api/leads` → Lead[] **requires header `X-Admin-Key` matching ADMIN_KEY in backend/.env** (401 otherwise).
- Collections: `courses`, `colleges`, `leads` (+ template's `status_checks`). Indexes registered in lib/db.py INDEXES, applied at startup by ensure_indexes().

## Data model (Pydantic ↔ hand-written TS mirrors in frontend/src/lib/types.ts)
- Course: id, name, category, level, duration, eligibility, fee_range, description, career_outcomes[], popular
- College: id, name, city, state, type (Government|Private|Private (Deemed)), streams[], rating, fee_range, description, featured
- Lead: LeadCreate fields + id, status (`new` default), notes (`LeadNote[]`: id/text/created_at), overdue (derived at read time, never stored), created_at (aware UTC on write, normalised on read)

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
- `GET /api/admin/leads` (cookie-protected) returns `{stats, leads}`: totals per source, per status, and last-7-days count, plus every enquiry newest-first.
- `PATCH /api/admin/leads/{lead_id}/status` (cookie-protected) sets the pipeline status. Valid: `new | called | interested | admitted | not_interested`. 404 on unknown id, 422 on an invalid status.
- `POST /api/admin/leads/{lead_id}/notes` (cookie-protected) appends a timestamped call note `{id, text, created_at}` and returns the updated lead. 404 on unknown id, 422 on empty text.
- **Follow-up flagging** is derived, not stored: a lead with `status == "new"` older than `FOLLOW_UP_DAYS` (2, in `routers/admin.py`) comes back with `overdue: true`, and `stats.overdue` / `stats.follow_up_days` summarise it. Changing the status clears the flag automatically.
- UI: 6 stat cards (total / new / **overdue, highlighted gold when > 0** / called / interested / admitted), search box, status filter (incl. a "Needs follow-up (overdue)" option, value `__overdue`), request-type filter, CSV export (status + notes included), per-row notes dialog with a count badge, latest-note preview under the student name, "Follow up" row badge, and call + WhatsApp buttons.
- PIN is `ADMIN_PIN` in backend/.env (see memory/test_credentials.md).

## Email (lib/email.py — Emergent managed Resend proxy)
Three server-side templates; all sends pass `_assert_safe_email()` and run via `asyncio.create_task` so mail never delays or breaks a submission (failures are logged only).
1. `notify_owner_of_lead` → owner alert on every new enquiry (recipient `OWNER_EMAIL`).
2. `send_student_ack` → thank-you confirmation to the student, using the owner's supplied copy ("Your Career, Our Vision."). Skipped when the student left no email address.
3. `send_daily_summary` → morning digest table of the last 24h of enquiries, with a dashboard deep-link.
- Env: `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME`, `OWNER_EMAIL`, `EMAIL_REPLY_TO`.

## Scheduled task (`.emergent/crons.yml`)
- `daily-enquiry-summary` → `POST /api/cron/daily-summary` at `0 8 * * *` Asia/Kolkata (8:00 AM IST).
- Endpoint requires `Authorization: Bearer $WEBHOOK_CRON_SECRET` (constant-time compare), dedupes on `X-Webhook-Id`, acks 2xx immediately and backgrounds the work.
- The email lists the last 24h of enquiries AND a gold callout counting anything still uncalled past the follow-up window.
- **Skipped only when there is nothing to report** — no new enquiries AND nothing overdue (owner's choice).

## Imagery
- All site imagery is brand-generated navy/gold vector graphics (no people, no stock photos) hosted on the Emergent CDN; URLs live in `IMAGES` in `frontend/src/lib/site.ts`. The owner plans to supply real office/team photos later — swap the `IMAGES` URLs when they arrive.

## WhatsApp
- `components/layout/WhatsAppButton.tsx` — floating CTA on every public page (hidden on `/admin`), with a dismissible hint bubble and a pre-filled message.
