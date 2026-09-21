import iconUrl from "../assets/logo/icon.svg";
import styles from "./Logo.module.css";

// Rendered as a live text wordmark (not a flattened logo image) so color can
// switch per-section (navy on light bg, white on dark bg/footer) and the
// name stays selectable/accessible text. See docs/asset-inventory.md.
export default function Logo({ variant = "dark" }) {
  return (
    <a href="#hero" className={styles.logo} aria-label="Sport&Company — на початок сторінки">
      <img src={iconUrl} alt="" width="40" height="40" className={styles.icon} />
      <span className={`${styles.wordmark} ${variant === "light" ? styles.light : ""}`}>
        <span className={styles.line}>
          SPORT<span className={styles.amp}>&amp;</span>
        </span>
        <span className={styles.line}>COMPANY</span>
      </span>
    </a>
  );
}
