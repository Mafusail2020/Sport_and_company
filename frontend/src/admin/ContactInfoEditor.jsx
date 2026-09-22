import { useEffect, useState } from "react";
import { contact as contactDefaults } from "../content/content.js";
import { adminApi } from "./adminApi.js";
import styles from "./ContactInfoEditor.module.css";

function emptySocialLink() {
  return { label: "", href: "" };
}

export default function ContactInfoEditor() {
  const [info, setInfo] = useState(null); // null = still loading
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getContactInfo()
      .then((data) => setInfo(data.contactInfo ?? { email: contactDefaults.email, phone: contactDefaults.phone, social: contactDefaults.social }))
      .catch(() => setInfo({ email: contactDefaults.email, phone: contactDefaults.phone, social: contactDefaults.social }));
  }, []);

  function updateField(field, value) {
    setStatus("idle");
    setInfo((prev) => ({ ...prev, [field]: value }));
  }

  function updateSocialLink(index, field, value) {
    setStatus("idle");
    setInfo((prev) => ({
      ...prev,
      social: prev.social.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    }));
  }

  function addSocialLink() {
    setStatus("idle");
    setInfo((prev) => ({ ...prev, social: [...prev.social, emptySocialLink()] }));
  }

  function removeSocialLink(index) {
    setStatus("idle");
    setInfo((prev) => ({ ...prev, social: prev.social.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setStatus("saving");
    setError("");
    try {
      const saved = await adminApi.saveContactInfo(info);
      setInfo(saved.contactInfo);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err.details ? `${err.message}: ${err.details.join("; ")}` : err.message);
    }
  }

  async function handleReset() {
    // eslint-disable-next-line no-alert -- simplest confirm for a destructive admin-only action
    if (!window.confirm("Повернути контактні дані до початкових? Збережені зміни буде втрачено.")) return;

    setStatus("saving");
    setError("");
    try {
      await adminApi.resetContactInfo();
      setInfo({ email: contactDefaults.email, phone: contactDefaults.phone, social: contactDefaults.social });
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (!info) return <p>Завантаження…</p>;

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <button type="button" onClick={handleReset} className={styles.secondaryButton}>
          Повернути початкові дані
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "saving"}
          className={styles.primaryButton}
        >
          {status === "saving" ? "Зберігаємо…" : "Зберегти"}
        </button>
      </div>

      {status === "saved" && <p className={styles.success}>Збережено.</p>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <label className={styles.field}>
        <span>Email для звернень</span>
        <input
          type="email"
          value={info.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Телефон</span>
        <input value={info.phone} onChange={(event) => updateField("phone", event.target.value)} />
      </label>

      <div className={styles.socialSection}>
        <span className={styles.socialLabel}>Соцмережі</span>
        {info.social.map((link, index) => (
          <div key={index} className={styles.socialRow}>
            <input
              placeholder="Назва (напр. Instagram)"
              value={link.label}
              onChange={(event) => updateSocialLink(index, "label", event.target.value)}
            />
            <input
              placeholder="https://…"
              value={link.href}
              onChange={(event) => updateSocialLink(index, "href", event.target.value)}
            />
            <button type="button" onClick={() => removeSocialLink(index)} className={styles.removeButton}>
              Видалити
            </button>
          </div>
        ))}
        <button type="button" onClick={addSocialLink} className={styles.secondaryButton}>
          + Додати соцмережу
        </button>
      </div>
    </div>
  );
}
