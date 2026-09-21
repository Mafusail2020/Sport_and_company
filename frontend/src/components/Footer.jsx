import Logo from "./Logo.jsx";
import { footerNav, footer } from "../content/content.js";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <Logo variant="light" />
          <nav aria-label="Навігація у футері">
            <ul className={styles.nav}>
              {footerNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className={styles.divider} />

        <p className={styles.copy}>
          © {year} {footer.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
}
