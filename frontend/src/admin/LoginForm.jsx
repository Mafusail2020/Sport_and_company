import { useState } from "react";
import { adminApi } from "./adminApi.js";
import styles from "./LoginForm.module.css";

export default function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await adminApi.login(password);
      onSuccess();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>Адміністрування Sport&amp;Company</h1>

      <label className={styles.field}>
        <span>Пароль</span>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus -- the only field on a dedicated login screen */}
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Входимо…" : "Увійти"}
      </button>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
