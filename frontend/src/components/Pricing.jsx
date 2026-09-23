import { pricing } from "../content/content.js";
import { usePackageSelection } from "../context/PackageContext.jsx";
import { usePricingOverride } from "../context/PricingOverrideContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import Button from "./Button.jsx";
import Faq from "./Faq.jsx";
import styles from "./Pricing.module.css";

export default function Pricing() {
  const { setSelectedPackage } = usePackageSelection();
  const { packages } = usePricingOverride();
  const revealPackages = useScrollReveal();
  const revealFaq = useScrollReveal();

  function handleChoose(event, pkg) {
    event.preventDefault();
    setSelectedPackage(pkg.dropdownValue);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  // FAQ's questions are all about pricing packages (what's included, how
  // long a package lasts, cancellation) — with no packages, there's nothing
  // for it to answer, so the whole section (not just the cards grid) stays
  // unmounted. The #pricing anchor id (nav's "Послуги" link) goes with it —
  // there's genuinely nothing to jump to in this state.
  if (packages.length === 0) return null;

  return (
    <section id="pricing" className={`section ${styles.section}`}>
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

      <div ref={revealFaq} className="container reveal">
        <Faq />
      </div>
    </section>
  );
}
