const { Resend } = require("resend");

// resend.dev is Resend's shared test sender — usable with zero setup, but it
// can only deliver to the email address that owns the Resend account (the
// one used to sign up), not to arbitrary recipients. That's exactly this
// project's shape (submissions all go to one fixed admin inbox), so a custom
// verified domain is not needed unless that inbox is later pointed at an
// address outside the Resend account.
const FROM_ADDRESS = "Sport&Company <onboarding@resend.dev>";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function looksLikeEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Best-effort notification email for a contact-form submission. Never
 * throws — the submission is already durably recorded (Blob/local log)
 * before this is called, so a mail-provider hiccup must not turn into a
 * 500 for the visitor or a lost submission.
 */
async function sendContactNotification({ name, contact, subject, details }, toEmail) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email notification (submission was still recorded).");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: toEmail,
      replyTo: looksLikeEmail(contact) ? contact : undefined,
      subject: `Sport&Company: нове звернення — ${subject}`,
      text: [`Ім'я: ${name}`, `Контакт: ${contact}`, `Тема: ${subject}`, "", details || "(без додаткових деталей)"].join(
        "\n"
      ),
    });
  } catch (err) {
    console.error("Failed to send contact notification email (submission was still recorded):", err);
  }
}

module.exports = { sendContactNotification };
