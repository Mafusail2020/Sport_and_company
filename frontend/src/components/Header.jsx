import { useMemo, useState } from "react";
import Logo from "./Logo.jsx";
import Button from "./Button.jsx";
import useScrollspy from "../hooks/useScrollspy.js";
import useScrollProgress from "../hooks/useScrollProgress.js";
import { usePricingOverride } from "../context/PricingOverrideContext.jsx";
import { nav as navDefaults } from "../content/content.js";
import styles from "./Header.module.css";

const hasPricingLink = navDefaults.some((item) => item.href === "#pricing");

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { packages } = usePricingOverride();
  const hasPackages = packages.length > 0;

  // Mirrors Pricing.jsx: with no packages, that section unmounts entirely
  // (nothing left to jump to), so its nav link shouldn't be offered either.
  // Memoized on hasPackages (not recomputed every render) so useScrollspy's
  // effect below — keyed on this array's identity — doesn't tear down and
  // rebuild its IntersectionObserver on every scroll-driven re-render.
  const nav = useMemo(
    () => (hasPackages || !hasPricingLink ? navDefaults : navDefaults.filter((item) => item.href !== "#pricing")),
    [hasPackages]
  );
  const sectionIds = useMemo(() => nav.map((item) => item.href.slice(1)), [nav]);
  const activeId = useScrollspy(sectionIds);
  const progress = useScrollProgress();

  return (
    <header className={styles.header}>
      <div className={`${styles.bar} container`}>
        <Logo variant="dark" />

        <div className={styles.navActions}>
          <nav className={styles.nav} aria-label="Основна навігація">
            <ul>
              {nav.map((item) => {
                const isActive = activeId === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a href={item.href} className={isActive ? styles.active : ""} aria-current={isActive ? "true" : undefined}>
                      {item.label}
                      <span className={styles.underline} aria-hidden="true" />
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

      <div
        className={`${styles.progressTrack} ${progress > 0 ? styles.visible : ""}`}
        aria-hidden="true"
      >
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
