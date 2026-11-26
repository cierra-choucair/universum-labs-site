# Collect Beta Signups in a Google Sheet

Setup takes about 5 minutes. Afterwards, every early-access application
on the website becomes a row in a Google Sheet you own, and you get an
email about it right away. Contact-form messages go to a second tab in
the same sheet. There's no DNS to change and no paid service to sign up for.

## 1. Create the sheet and paste in the script

1. Open **[sheets.new](https://sheets.new)** while signed in to the Google
   account that should own the data. Name it, e.g. _Universum Labs — Beta_.
2. In the sheet, choose **Extensions → Apps Script**.
3. Delete the placeholder code, then paste in all of
   [`beta-signups-apps-script.gs`](beta-signups-apps-script.gs).
4. Make up a long random secret (30+ characters, e.g. from a password
   manager). Paste it between the quotes on the `SHARED_SECRET` line,
   replacing `PASTE-YOUR-SECRET-HERE`. Keep it handy for step 3.
5. Optional: to send notifications somewhere other than this Google
   account, put that address in `NOTIFY_EMAIL`.
6. Click **Save** (the disk icon).

## 2. Authorize and deploy

1. In the function menu at the top of the editor, select **`authorize`**
   and click **▶ Run**.
2. Google asks for permission. Choose your account. If you see
   _"Google hasn't verified this app"_, click **Advanced → Go to (project
   name)**. That warning appears for any script you wrote yourself.
   Allow access.
3. Check your inbox for _"Universum Labs form receiver is connected"_.
4. Click **Deploy → New deployment**. Click the gear next to
   _Select type_ and choose **Web app**, then set:
   - **Execute as:** Me
   - **Who has access:** Anyone

   (The website's server is what calls this URL. The secret blocks
   anyone else, and the URL is never shown in the browser.)

5. Click **Deploy**, then **copy the Web app URL** (it ends in `/exec`).

## 3. Connect the website in Vercel

In the Vercel project, open **Settings → Environment Variables** and add:

| Name                           | Value                                     |
| ------------------------------ | ----------------------------------------- |
| `GOOGLE_SHEETS_WEBHOOK_URL`    | the Web app URL from step 2               |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | the exact secret you pasted in the script |

Then go to **Deployments → ⋯ on the latest → Redeploy**. Environment
variables only take effect on a new deployment.

## 4. Test it

Submit the early-access form on the live site. Within a few seconds you
should see:

- a **"Beta applications"** tab in the sheet with a header row and the
  submission, and
- an email titled _"[Universum Labs] Pilot application — Name (Audience)"_.
  Replying to it goes straight to the applicant.

The tabs and columns are created automatically on the first submission,
so you don't set anything up in the sheet yourself.

## Troubleshooting

| Symptom on the website                         | Likely cause                                                                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| "Online applications are not yet connected"    | One of the two Vercel variables is missing, or you didn't redeploy after adding them.                                      |
| "Your application could not be sent right now" | The secrets don't match, or the deployment isn't set to _Anyone_. Vercel's function logs (Logs tab) give the exact reason. |
| Row appears but no email arrives               | `authorize` was never run, or Google's daily email quota is used up (100/day on personal accounts, 1,500 on Workspace).    |

**If you edit the script later**, choose **Deploy → Manage deployments →
✏️ Edit → Version: New version → Deploy**. That keeps the same URL, so
Vercel needs no change. Choosing **New deployment** instead creates a new
URL, and you'd have to update `GOOGLE_SHEETS_WEBHOOK_URL`.

## Privacy

Applicants' names, emails, and answers are stored in this Google Sheet.
Share it only with people who need it, and make sure the privacy policy
(still marked "in preparation" in the site footer) mentions it.
