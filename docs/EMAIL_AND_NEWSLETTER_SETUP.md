# Email Delivery & Newsletter Setup

## Inquiry email (contact + pilot forms)

`/contact` and `/early-access` submit to server-side API routes that deliver
email over SMTP (`src/lib/email.ts`, via nodemailer). Until SMTP is configured,
both forms tell the visitor honestly that delivery is not yet connected and
point them to hello@universumlabs.com — they never fake success.

### Variables

```
INQUIRY_TO_EMAIL=hello@universumlabs.com   # where submissions are delivered
SMTP_HOST=smtp.postmarkapp.com             # your provider's SMTP host
SMTP_PORT=587
SMTP_USER=...                              # provider credential
SMTP_PASS=...                              # provider credential
SMTP_FROM=website@universumlabs.com        # verified sender address
SMTP_SECURE=false                          # "true" only for implicit TLS (port 465)
```

Any transactional provider with SMTP works — Postmark, Resend, Amazon SES,
Mailgun, SendGrid, etc. Steps are the same everywhere:

1. Create an account and **verify the sending domain** (`universumlabs.com`)
   via the DNS records the provider gives you (SPF/DKIM).
2. Create an SMTP credential and copy host/port/user/pass into the variables.
3. Set `SMTP_FROM` to an address on the verified domain.
4. Deploy, submit the contact form, and confirm the message arrives at
   `INQUIRY_TO_EMAIL`. Replies go straight to the submitter (`Reply-To` is set
   to their address).

Subject lines distinguish the two streams:

- `[Universum Labs] <Type> inquiry — <Name>` (contact/partnership)
- `[Universum Labs] Pilot application — <Name> (<Audience>)` (early access)

### Spam protection

- Honeypot field (hidden `website` input) — filled submissions are silently
  dropped server-side.
- In-memory rate limiting per client IP (5 submissions / 10 minutes per form).
  On a multi-instance deployment each instance keeps its own window; swap in a
  shared store (e.g. Upstash Redis) if abuse ever warrants it.
- Server-side validation with zod (`src/lib/validation.ts`); client attributes
  are only a convenience layer.

## Beehiiv newsletter

Newsletter signups (footer, closing section, Insights empty state) post to
`/api/newsletter`, which calls the **Beehiiv v2 API** server-side. The API key
never reaches the browser.

### Variables

```
BEEHIIV_API_KEY=...          # Beehiiv → Settings → API → New API key
BEEHIIV_PUBLICATION_ID=pub_… # Beehiiv → Settings → API (starts with "pub_")
```

### Setup

1. In Beehiiv: **Settings → API** → create an API key and copy the
   publication ID.
2. Set both variables on the deployment and redeploy.
3. Submit the form with a real address; the subscriber should appear in
   Beehiiv with UTM source `universumlabs-website`.

Behavior notes:

- `reactivate_existing: true` — a previously unsubscribed address that signs
  up again is reactivated rather than duplicated; already-active addresses are
  not duplicated.
- Beehiiv's email validation failures surface to the visitor as an honest
  "check your address" error; provider outages as an honest failure state.
- Double-opt-in is controlled inside Beehiiv (Settings → Subscribers). The
  success message already asks subscribers to confirm if asked.
