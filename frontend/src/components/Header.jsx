import { useState } from "react";
import Logo from "./Logo.jsx";
import Button from "./Button.jsx";
import useScrollspy from "../hooks/useScrollspy.js";
import useScrollProgress from "../hooks/useScrollProgress.js";
import { nav } from "../content/content.js";
import styles from "./Header.module.css";

const sectionIds = nav.map((item) => item.href.slice(1));

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollspy(sectionIds);
  const progress = useScrollProgress();

  return (
    <header className={styles.header}>
      <div className={`${styles.bar} container`}>
        <Logo variant="dark" />

        <nav className={styles.nav} aria-label="Основна навігація">
          <ul>
            {nav.map((item) => {
              const isActive = activeId === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a href={item.href} className={isActive ? styles.active : ""} aria-current={isActive ? "true" : undefined}>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button href="#contact" variant="filled" className={styles.cta}>
            Замовити
          </Button>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" className={styles.mobileNav} aria-label="Мобільна навігація">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
