import { useEffect, useState } from "react";
import { contact } from "../content/content.js";
import { usePackageSelection } from "../context/PackageContext.jsx";
import styles from "./Contact.module.css";

const initialForm = { name: "", contact: "", subject: contact.form.subjectOptions[0], details: "" };

function sanitize(value) {
  // Client-side hygiene only — strips control characters and trims. The
  // backend re-validates and re-sanitizes everything independently; this
  // does not substitute for server-side checks.
  // eslint-disable-next-line no-control-regex -- intentional: stripping control chars
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

export default function Contact() {
  const { selectedPackage } = usePackageSelection();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  useEffect(() => {
    // Syncs local form state with an external signal (a pricing-card click
    // elsewhere on the page, via PackageContext) rather than a value
    // derivable from props/state at render time — a legitimate effect use.
    if (selectedPackage) {
      setForm((prev) => ({ ...prev, subject: selectedPackage }));
    }
  }, [selectedPackage]);

  function handleChange(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");

    const payload = {
      name: sanitize(form.name),
      contact: sanitize(form.contact),
      subject: form.subject,
      details: sanitize(form.details),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className={`${styles.section} section section--mint`}>
      <div className={`container ${styles.grid}`}>
        <div>
          <span className="eyebrow">{contact.eyebrow}</span>
          <h2 className={styles.heading}>{contact.heading}</h2>
          <p className={styles.paragraph}>{contact.paragraph}</p>

          <dl className={styles.details}>
            <div>
              <dt>EMAIL</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>ТЕЛЕФОН</dt>
              {/* Dummy placeholder number from the source design — kept as
                  plain text, not a clickable tel: link, until a real number
                  is provided. See docs/design-spec.md. */}
              <dd>{contact.phone}</dd>
            </div>
            <div>
              <dt>СОЦМЕРЕЖІ</dt>
              <dd className={styles.social}>
                {contact.social.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt>ЛОКАЦІЯ</dt>
              <dd>{contact.location}</dd>
            </div>
          </dl>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <span className={styles.formTitle}>{contact.form.title}</span>

          <label className={styles.field}>
            <span>{contact.form.nameLabel}</span>
            <input
              type="text"
              required
              maxLength={120}
              placeholder={contact.form.namePlaceholder}
              value={form.name}
              onChange={handleChange("name")}
            />
          </label>

          <label className={styles.field}>
            <span>{contact.form.contactLabel}</span>
            <input
              type="text"
              required
              maxLength={120}
              placeholder={contact.form.contactPlaceholder}
              value={form.contact}
              onChange={handleChange("contact")}
            />
          </label>

          <label className={styles.field}>
            <span>{contact.form.subjectLabel}</span>
            <select value={form.subject} onChange={handleChange("subject")}>
              {contact.form.subjectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>{contact.form.detailsLabel}</span>
            <textarea
              rows={4}
              maxLength={2000}
              placeholder={contact.form.detailsPlaceholder}
              value={form.details}
              onChange={handleChange("details")}
            />
          </label>

          <button type="submit" className={styles.submit} disabled={status === "submitting"}>
            {status === "submitting" ? "Надсилаємо…" : contact.form.submit}
          </button>

          <p className={styles.consent}>{contact.form.consent}</p>

          {status === "success" && (
            <p className={styles.status} role="status">
              Дякуємо! Ми зв'яжемось із вами найближчим часом.
            </p>
          )}
          {status === "error" && (
            <p className={`${styles.status} ${styles.statusError}`} role="alert">
              Щось пішло не так. Спробуйте ще раз або напишіть нам на {contact.email}.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
