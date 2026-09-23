import { useEffect, useState } from "react";
import { pricing } from "../content/content.js";
import { usePackageSelection } from "../context/PackageContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import Button from "./Button.jsx";
import Faq from "./Faq.jsx";
import styles from "./Pricing.module.css";

export default function Pricing() {
  const { setSelectedPackage } = usePackageSelection();
  const revealPackages = useScrollReveal();
  const revealFaq = useScrollReveal();
  const [packagesOverride, setPackagesOverride] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/pricing")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.packages)) setPackagesOverride(data.packages);
      })
      .catch(() => {
        // Fails open: stays null, section stays hidden below — same as
        // "no packages configured yet."
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // No real packages are live yet, so there's nothing to show by default —
  // the section only appears once an admin actually saves one via /admin
  // (pricing.packages in content.js still holds the real transcript copy,
  // used as PricingEditor's starting point so "add one" means publishing
  // real approved copy, not writing new content from scratch).
  const packages = packagesOverride ?? [];

  function handleChoose(event, pkg) {
    event.preventDefault();
    setSelectedPackage(pkg.dropdownValue);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="pricing"
      className={`section ${styles.section}`}
      // The section's own top padding exists to separate the eyebrow/
      // heading/grid from whatever's above — with no packages, there's
      // nothing there to separate, so it renders as a blank white block
      // above FAQ instead. Zeroing it collapses that gap to nothing while
      // keeping the bottom padding (still needed after FAQ) and the
      // #pricing anchor id intact.
      style={packages.length === 0 ? { paddingTop: 0 } : undefined}
    >
      {packages.length > 0 && (
        <div ref={revealPackages} className="container reveal">
          <span className="eyebrow">{pricing.eyebrow}</span>
          <h2 className={styles.heading}>{pricing.heading}</h2>
          <p className={styles.intro}>{pricing.intro}</p>

          <ul className={styles.grid}>
            {packages.map((pkg) => (
              <li
                key={pkg.id}
                className={`${styles.card} ${pkg.featured ? styles.featured : ""} reveal`}
              >
                <span className={`${styles.badge} ${pkg.featured ? styles.badgeFeatured : ""}`}>
                  {pkg.badge}
                </span>
                <h3 className={styles.name}>{pkg.name}</h3>
                <p className={styles.tagline}>{pkg.tagline}</p>

                <p className={styles.price}>
                  {pkg.price}
                  {pkg.priceUnit && <span className={styles.priceUnit}>{pkg.priceUnit}</span>}
                </p>

                <ul className={styles.features}>
                  {pkg.features.map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">→</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  as="button"
                  variant={pkg.variant === "filled" ? "dark" : "outline-dark"}
                  onClick={(event) => handleChoose(event, pkg)}
                  className={styles.button}
                >
                  {pkg.button}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={revealFaq} className="container reveal">
        <Faq />
      </div>
    </section>
  );
}
