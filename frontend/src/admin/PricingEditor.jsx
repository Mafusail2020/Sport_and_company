import { useEffect, useState } from "react";
import { pricing as pricingDefaults } from "../content/content.js";
import { adminApi } from "./adminApi.js";
import styles from "./PricingEditor.module.css";

function emptyPackage() {
  return {
    id: `pkg-${Date.now()}`,
    badge: "",
    name: "",
    tagline: "",
    price: "",
    priceUnit: "",
    features: [],
    button: "",
    variant: "outline",
    featured: false,
    dropdownValue: "",
  };
}

export default function PricingEditor() {
  const [packages, setPackages] = useState(null); // null = still loading
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getPricing()
      .then((data) => setPackages(data.packages ?? pricingDefaults.packages))
      .catch(() => setPackages(pricingDefaults.packages));
  }, []);

  function updatePackage(index, field, value) {
    setStatus("idle");
    setPackages((prev) => prev.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg)));
  }

  function updateFeatures(index, text) {
    updatePackage(
      index,
      "features",
      text.split("\n").map((line) => line.trim()).filter(Boolean)
    );
  }

  function addPackage() {
    setStatus("idle");
    setPackages((prev) => [...prev, emptyPackage()]);
  }

  function removePackage(index) {
    setStatus("idle");
    setPackages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setStatus("saving");
    setError("");
    try {
      const saved = await adminApi.savePricing(packages);
      setPackages(saved.packages);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err.details ? `${err.message}: ${err.details.join("; ")}` : err.message);
    }
  }

  async function handleReset() {
    // eslint-disable-next-line no-alert -- simplest confirm for a destructive admin-only action
    if (!window.confirm("Повернути пакети до початкових? Збережені зміни буде втрачено.")) return;

    setStatus("saving");
    setError("");
    try {
      await adminApi.resetPricing();
      setPackages(pricingDefaults.packages);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (!packages) return <p>Завантаження…</p>;

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <button type="button" onClick={addPackage} className={styles.secondaryButton}>
          + Додати пакет
        </button>
        <button type="button" onClick={handleReset} className={styles.secondaryButton}>
          Повернути початкові пакети
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

      {packages.length === 0 && (
        <p className={styles.hint}>
          Пакетів немає — блок цін на сайті не показуватиметься, поки ви не додасте хоча б один.
        </p>
      )}

      {packages.map((pkg, index) => (
        <fieldset key={index} className={styles.card}>
          <legend>{pkg.name || `Пакет ${index + 1}`}</legend>

          <label>
            <span>ID (унікальний)</span>
            <input value={pkg.id} onChange={(event) => updatePackage(index, "id", event.target.value)} />
          </label>
          <label>
            <span>Бейдж</span>
            <input value={pkg.badge} onChange={(event) => updatePackage(index, "badge", event.target.value)} />
          </label>
          <label>
            <span>Назва</span>
            <input value={pkg.name} onChange={(event) => updatePackage(index, "name", event.target.value)} />
          </label>
          <label>
            <span>Підзаголовок</span>
            <input value={pkg.tagline} onChange={(event) => updatePackage(index, "tagline", event.target.value)} />
          </label>
          <label>
            <span>Ціна</span>
            <input value={pkg.price} onChange={(event) => updatePackage(index, "price", event.target.value)} />
          </label>
          <label>
            <span>Одиниця ціни</span>
            <input
              value={pkg.priceUnit}
              onChange={(event) => updatePackage(index, "priceUnit", event.target.value)}
            />
          </label>
          <label>
            <span>Текст кнопки</span>
            <input value={pkg.button} onChange={(event) => updatePackage(index, "button", event.target.value)} />
          </label>
          <label>
            <span>Значення для форми звернення</span>
            <input
              value={pkg.dropdownValue}
              onChange={(event) => updatePackage(index, "dropdownValue", event.target.value)}
            />
          </label>
          <label>
            <span>Стиль кнопки</span>
            <select value={pkg.variant} onChange={(event) => updatePackage(index, "variant", event.target.value)}>
              <option value="outline">outline</option>
              <option value="filled">filled</option>
            </select>
          </label>
          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={pkg.featured}
              onChange={(event) => updatePackage(index, "featured", event.target.checked)}
            />
            <span>Виділений пакет</span>
          </label>
          <label className={styles.fullWidth}>
            <span>Переваги (по одній на рядок)</span>
            <textarea
              rows={4}
              value={pkg.features.join("\n")}
              onChange={(event) => updateFeatures(index, event.target.value)}
            />
          </label>

          <button type="button" onClick={() => removePackage(index)} className={styles.removeButton}>
            Видалити пакет
          </button>
        </fieldset>
      ))}
    </div>
  );
}
