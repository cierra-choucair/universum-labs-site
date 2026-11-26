/**
 * Universum Labs — website form receiver (Google Apps Script)
 *
 * Paste this whole file into a Google Sheet's Apps Script editor
 * (Extensions → Apps Script) and deploy it as a web app. Every website
 * submission then:
 *   1. becomes a new row in this spreadsheet
 *      ("Beta applications" tab for early access,
 *       "Contact inquiries" tab for the contact form), and
 *   2. sends you a notification email (reply to it to answer the person).
 *
 * Full setup steps: docs/BETA_SIGNUPS_SETUP.md
 */

// ── 1. REQUIRED: paste the same long random string you set in Vercel
//       as GOOGLE_SHEETS_WEBHOOK_SECRET.
const SHARED_SECRET = "PASTE-YOUR-SECRET-HERE";

// ── 2. OPTIONAL: who receives notification emails. Leave empty to use
//       the Google account that owns this spreadsheet. Separate several
//       addresses with commas.
const NOTIFY_EMAIL = "";

// ── Nothing below needs editing. ──────────────────────────────────────

const SHEET_NAMES = {
  "early-access": "Beta applications",
  contact: "Contact inquiries",
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (SHARED_SECRET === "PASTE-YOUR-SECRET-HERE" || data.secret !== SHARED_SECRET) {
      return respond({ ok: false, error: "unauthorized" });
    }

    const sheetName = SHEET_NAMES[data.form];
    if (!sheetName || !Array.isArray(data.fields)) {
      return respond({ ok: false, error: "bad_request" });
    }

    // Serialize writes so simultaneous submissions never collide.
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      appendSubmission(sheetName, data.submittedAt, data.fields);
    } finally {
      lock.releaseLock();
    }

    // The row is saved; a failed email must not turn that into an error.
    try {
      notify(data, sheetName);
    } catch (err) {
      console.error("Notification email failed: " + err);
    }

    return respond({ ok: true });
  } catch (err) {
    console.error(err);
    return respond({ ok: false, error: "server_error" });
  }
}

/** Visiting the web app URL in a browser confirms the deployment is live. */
function doGet() {
  return ContentService.createTextOutput("Universum Labs form receiver is running.");
}

/**
 * Run this once from the editor (choose "authorize" in the function menu,
 * then ▶ Run). It grants the script permission to use this sheet and send
 * email, and sends you a test message.
 */
function authorize() {
  MailApp.sendEmail(
    recipient(),
    "Universum Labs form receiver is connected",
    "Website submissions will be saved to this spreadsheet:\n" +
      SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  );
}

function appendSubmission(sheetName, submittedAt, fields) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  // Header row: "Submitted at" plus one column per field label. New
  // labels (if the website form gains fields later) become new columns.
  const lastColumn = sheet.getLastColumn();
  const header =
    lastColumn > 0 ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : ["Submitted at"];
  fields.forEach(function (field) {
    if (header.indexOf(field[0]) === -1) header.push(field[0]);
  });
  sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
  sheet.setFrozenRows(1);

  const row = header.map(function (column) {
    if (column === "Submitted at") return new Date(submittedAt || Date.now());
    const match = fields.find(function (field) {
      return field[0] === column;
    });
    return match ? safeCell(match[1]) : "";
  });
  sheet.appendRow(row);
}

function notify(data, sheetName) {
  const lines = data.fields
    .filter(function (field) {
      return String(field[1] || "").trim().length > 0;
    })
    .map(function (field) {
      return field[0] + ":\n" + field[1];
    });

  const body =
    lines.join("\n\n") +
    '\n\n—\nSaved to the "' +
    sheetName +
    '" tab:\n' +
    SpreadsheetApp.getActiveSpreadsheet().getUrl();

  const options = data.replyTo ? { replyTo: String(data.replyTo) } : {};
  MailApp.sendEmail(recipient(), String(data.subject || "New website submission"), body, options);
}

function recipient() {
  return NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
}

/** Stop text such as "=HYPERLINK(...)" from being run as a formula. */
function safeCell(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function respond(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
