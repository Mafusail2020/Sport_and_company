import { useEffect, useState } from "react";
import { adminApi } from "./adminApi.js";
import styles from "./PartnersEditor.module.css";

export default function PartnersEditor() {
  const [logos, setLogos] = useState(null); // null = still loading
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getPartnerLogos()
      .then((data) => setLogos(data.logos ?? []))
      .catch(() => setLogos([]));
  }, []);

  async function handleAdd(file) {
    setBusy(true);
    setError("");
    try {
      const result = await adminApi.addPartnerLogo(file);
      setLogos((prev) => [...prev, result.logo]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(logoId) {
    setBusy(true);
    setError("");
    try {
      await adminApi.removePartnerLogo(logoId);
      setLogos((prev) => prev.filter((logo) => logo.id !== logoId));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!logos) return <p>Завантаження…</p>;

  return (
    <div className={styles.wrap}>
      <p className={styles.hint}>
        Логотипи додаються зліва направо в порожні слоти на сайті. Порожні слоти лишаються з написом
        «лого», поки логотипів менше 5 — реальних партнерів можна додати більше, тоді блок просто
        зростає.
      </p>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <ul className={styles.grid}>
        {logos.map((logo) => (
          <li key={logo.id} className={styles.card}>
            <img src={logo.url} alt="" className={styles.thumb} />
            <button type="button" onClick={() => handleRemove(logo.id)} disabled={busy} className={styles.removeButton}>
              Видалити
            </button>
          </li>
        ))}

        <li className={styles.addCard}>
          <label className={styles.addLabel}>
            + Додати лого
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              className={styles.fileInput}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleAdd(file);
                event.target.value = "";
              }}
            />
          </label>
        </li>
      </ul>
    </div>
  );
}
