const SUBJECT_OPTIONS = ["Пакет Start", "Пакет Active", "Пакет Team", "Партнерство", "Інше"];

const LIMITS = {
  name: 120,
  contact: 120,
  details: 2000,
};

// eslint-disable-next-line no-control-regex -- intentional: stripping control chars
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, "").trim();
}

/**
 * Validates and sanitizes a raw contact-form payload.
 * Returns { ok: true, data } or { ok: false, errors }.
 */
function validateContactPayload(body) {
  const errors = [];

  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: ["Invalid request body"] };
  }

  const name = sanitizeText(body.name);
  const contact = sanitizeText(body.contact);
  const subject = sanitizeText(body.subject);
  const details = sanitizeText(body.details);

  if (!name) errors.push("name is required");
  if (name.length > LIMITS.name) errors.push(`name must be at most ${LIMITS.name} characters`);

  if (!contact) errors.push("contact is required");
  if (contact.length > LIMITS.contact) errors.push(`contact must be at most ${LIMITS.contact} characters`);

  if (!SUBJECT_OPTIONS.includes(subject)) errors.push("subject must be one of the allowed options");

  if (details.length > LIMITS.details) errors.push(`details must be at most ${LIMITS.details} characters`);

  if (errors.length > 0) return { ok: false, errors };

  return { ok: true, data: { name, contact, subject, details } };
}

module.exports = { validateContactPayload, SUBJECT_OPTIONS, LIMITS };
