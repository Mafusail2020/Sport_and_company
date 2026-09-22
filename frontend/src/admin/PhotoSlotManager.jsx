import { useEffect, useState } from "react";
import { PHOTO_SLOTS } from "../content/photoSlots.js";
import { adminApi } from "./adminApi.js";
import styles from "./PhotoSlotManager.module.css";

const photoModules = import.meta.glob("../assets/photos/*.jpg", { eager: true, import: "default" });

function defaultPhotoUrl(filename) {
  return photoModules[`../assets/photos/${filename}`];
}

export default function PhotoSlotManager() {
  const [overrides, setOverrides] = useState({});
  const [busySlot, setBusySlot] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getPhotos()
      .then((data) => setOverrides(data.overrides ?? {}))
      .catch(() => {});
  }, []);

  async function handleUpload(slotKey, file) {
    setBusySlot(slotKey);
    setError("");
    try {
      const result = await adminApi.uploadPhoto(slotKey, file);
      setOverrides((prev) => ({ ...prev, [slotKey]: result.url }));
    } catch (err) {
      setError(`${slotKey}: ${err.message}`);
    } finally {
      setBusySlot(null);
    }
  }

  async function handleRevert(slotKey) {
    setBusySlot(slotKey);
    setError("");
    try {
      await adminApi.resetPhoto(slotKey);
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
    } catch (err) {
      setError(`${slotKey}: ${err.message}`);
    } finally {
      setBusySlot(null);
    }
  }

  return (
    <div className={styles.wrap}>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <ul className={styles.grid}>
        {PHOTO_SLOTS.map((slot) => {
          const isOverridden = Boolean(overrides[slot.key]);
          const isBusy = busySlot === slot.key;
          const currentUrl = overrides[slot.key] ?? defaultPhotoUrl(slot.defaultFile);

          return (
            <li key={slot.key} className={styles.card}>
              <img src={currentUrl} alt="" className={styles.thumb} />
              <p className={styles.label}>{slot.label}</p>
              <p className={styles.status}>{isOverridden ? "Змінено" : "Стандартне фото"}</p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isBusy}
                className={styles.fileInput}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleUpload(slot.key, file);
                  event.target.value = "";
                }}
              />

              {isOverridden && (
                <button
                  type="button"
                  onClick={() => handleRevert(slot.key)}
                  disabled={isBusy}
                  className={styles.revertButton}
                >
                  Повернути стандартне
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
