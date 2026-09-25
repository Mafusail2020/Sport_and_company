import { useEffect, useState } from "react";
import { adminApi } from "./admin/adminApi.js";
import LoginForm from "./admin/LoginForm.jsx";
import PricingEditor from "./admin/PricingEditor.jsx";
import PhotoSlotManager from "./admin/PhotoSlotManager.jsx";
import ContactInfoEditor from "./admin/ContactInfoEditor.jsx";
import PartnersEditor from "./admin/PartnersEditor.jsx";
import Button from "./components/Button.jsx";
import styles from "./AdminApp.module.css";

export default function AdminApp() {
  const [authStatus, setAuthStatus] = useState("checking"); // checking | anonymous | authenticated
  const [tab, setTab] = useState("pricing"); // pricing | photos | contact | partners

  useEffect(() => {
    adminApi
      .session()
      .then(() => setAuthStatus("authenticated"))
      .catch(() => setAuthStatus("anonymous"));
  }, []);

  async function handleLogout() {
    await adminApi.logout().catch(() => {});
    setAuthStatus("anonymous");
  }

  if (authStatus === "checking") {
    return <p className={styles.loading}>Завантаження…</p>;
  }

  if (authStatus === "anonymous") {
    return (
      <div className={styles.page}>
        <LoginForm onSuccess={() => setAuthStatus("authenticated")} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Адміністрування Sport&amp;Company</h1>
        <Button as="button" variant="outline-dark" onClick={handleLogout}>
          Вийти
        </Button>
      </header>

      <nav className={styles.tabs}>
        <button
          type="button"
          className={tab === "pricing" ? styles.tabActive : styles.tab}
          onClick={() => setTab("pricing")}
        >
          Пакети
        </button>
        <button
          type="button"
          className={tab === "photos" ? styles.tabActive : styles.tab}
          onClick={() => setTab("photos")}
        >
          Фото
        </button>
        <button
          type="button"
          className={tab === "contact" ? styles.tabActive : styles.tab}
          onClick={() => setTab("contact")}
        >
          Контакти
        </button>
        <button
          type="button"
          className={tab === "partners" ? styles.tabActive : styles.tab}
          onClick={() => setTab("partners")}
        >
          Партнери
        </button>
      </nav>

      <main className={styles.content}>
        {tab === "pricing" && <PricingEditor />}
        {tab === "photos" && <PhotoSlotManager />}
        {tab === "contact" && <ContactInfoEditor />}
        {tab === "partners" && <PartnersEditor />}
      </main>
    </div>
  );
}
