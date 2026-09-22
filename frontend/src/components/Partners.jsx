import { partners } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import Button from "./Button.jsx";
import styles from "./Partners.module.css";

export default function Partners() {
  const reveal = useScrollReveal();

  return (
    <section id="partners" ref={reveal} className={`${styles.section} section section--dark reveal`}>
      <div className={`container ${styles.inner}`}>
        <span className="eyebrow">{partners.eyebrow}</span>
        <h2 className={styles.heading}>
          {partners.heading.map((line) => (
            <span key={line} className={styles.headingLine}>
              {line}
            </span>
          ))}
        </h2>
        <p className={styles.paragraph}>{partners.paragraph}</p>

        {/* Literal empty "лого" placeholder slots — this is the shipped
            design, not missing content. Never fill with invented logos. */}
        <ul className={styles.slots} aria-label="Партнери (слоти очікують лого)">
          {Array.from({ length: partners.slotCount }).map((_, index) => (
            <li key={index} className={styles.slot}>
              лого
            </li>
          ))}
        </ul>

        <Button href="#contact" variant="filled">
          {partners.button}
        </Button>
      </div>
    </section>
  );
}
