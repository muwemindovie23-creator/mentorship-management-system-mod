# Deployment Guide (Vercel + Neon + Gmail)

## 1. Neon (database)

1. Create a project at <https://neon.tech> (e.g. `mentorship`).
2. Copy the **pooled** connection string → `DATABASE_URL`
   (must include `?sslmode=require&pgbouncer=true`).
3. Copy the **direct** connection string → `DIRECT_URL`.

## 2. Gmail SMTP

1. Enable 2-factor authentication on the Google account.
2. Create an App Password: <https://myaccount.google.com/apppasswords>.
3. Use it as `SMTP_PASSWORD` with `SMTP_USER` = the Gmail address,
   `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`.

> Gmail limits ~500 recipients/day for regular accounts. The bulk mailer
> sends in batches of 20; for larger cohorts consider Google Workspace or
> a transactional provider.

## 3. Vercel

1. Push the repository to GitHub and import it at <https://vercel.com/new>.
2. Framework preset: **Next.js** (auto-detected). `vercel.json` overrides
   the build command to run migrations:

   ```
   prisma generate && prisma migrate deploy && next build
   ```

3. Add Environment Variables (Production **and** Preview):

   - `DATABASE_URL`, `DIRECT_URL`
   - `AUTH_SECRET` (new random value), `AUTH_TRUST_HOST=true`
   - `AUTH_URL` = `https://www.mentmw.org`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`
   - `NEXT_PUBLIC_APP_URL` = `https://www.mentmw.org`
   - `NEXT_PUBLIC_APP_NAME`
   - `CRON_SECRET`

4. Deploy. Migrations run during the build against `DIRECT_URL`.
5. Under Project → Settings → Domains, add `mentmw.org` and
   `www.mentmw.org`, then set `www.mentmw.org` as the primary domain
   (the app already 308-redirects the apex to `www` — see
   `next.config.ts` — so both resolve to one canonical URL for SEO).

## 4. Cron jobs

`vercel.json` registers two crons (Vercel sends
`Authorization: Bearer $CRON_SECRET` automatically when the env var is set):

| Path | Schedule | Purpose |
| --- | --- | --- |
| `/api/cron/weekly-reminders` | `0 8 * * 1` | Weekly nudge to mentors & mentees |
| `/api/cron/meeting-reminders` | `0 7 * * *` | Reminders for meetings in the next 24h |

## 5. Seed production

Run once from your machine with production env vars:

```bash
DATABASE_URL="<pooled-url>" DIRECT_URL="<direct-url>" \
SEED_ADMIN_EMAIL="coordinator@engineering.edu" \
SEED_ADMIN_PASSWORD="<strong-password>" \
npx prisma db seed
```

Then log in and change anything you need under the admin dashboard.

## 6. Post-deploy checklist

- [ ] Log in as admin; create/activate the real semester; open registration.
- [ ] Register a test mentor + mentee; approve both; verify pairing emails.
- [ ] Trigger `/api/cron/weekly-reminders` manually with the bearer secret.
- [ ] Confirm dark mode, CSV export and messaging work on the deployed URL.

## 7. Search engine indexing (Google Search Console)

The app already serves `/robots.txt` and `/sitemap.xml` (generated from
`src/app/robots.ts` and `src/app/sitemap.ts`) pointing at
`https://www.mentmw.org`. To get it indexed:

1. Go to <https://search.google.com/search-console> and add a property
   for `https://www.mentmw.org` (**URL prefix** type).
2. Verify ownership — easiest is the **HTML tag** method: Search Console
   gives you a `<meta name="google-site-verification" content="...">`
   tag. Copy just the `content` value and set it as the
   `GOOGLE_SITE_VERIFICATION` env var in Vercel, then redeploy —
   `src/app/layout.tsx` already renders it automatically. (Or use the
   **DNS TXT record** method instead if you manage `mentmw.org`'s DNS
   directly — no env var needed either way.)
3. Once verified, open **Sitemaps** in the left nav and submit
   `https://www.mentmw.org/sitemap.xml`.
4. Use **URL Inspection** on `https://www.mentmw.org/` and click
   **Request indexing** to speed up the first crawl.
5. Repeat verification for [Bing Webmaster Tools](https://www.bing.com/webmasters)
   if you also want Bing/Yahoo coverage — it accepts the same sitemap
   URL and can import verification directly from Search Console.

Indexing itself (Google crawling and ranking the site) is out of this
repo's control — steps 1–4 above have to be done once, by hand, by
whoever owns the Search Console account.

## Scaling notes

- The rate limiter is in-memory (per serverless instance). For strict
  global limits swap `src/lib/rate-limit.ts` for Upstash Redis.
- Neon autoscales; keep `pgbouncer=true` on the pooled URL so serverless
  functions don't exhaust connections.
