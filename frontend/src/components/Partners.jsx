import { partners } from "../content/content.js";
import { usePartnerLogos } from "../context/PartnerLogosContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";
import Button from "./Button.jsx";
import styles from "./Partners.module.css";

export default function Partners() {
  const reveal = useScrollReveal();
  const { logos } = usePartnerLogos();

  // The empty "лого" placeholders are the shipped design, not a gap to
  // fill — they always show a minimum of partners.slotCount boxes. Real
  // logos (uploaded via /admin) fill those boxes left to right first; once
  // there are more real logos than the minimum, the grid just grows.
  const totalSlots = Math.max(partners.slotCount, logos.length);

  return (
    <section id="partners" className={`${styles.section} section section--dark`}>
      <div ref={reveal} className={`container ${styles.inner} reveal`}>
        <span className="eyebrow">{partners.eyebrow}</span>
        <h2 className={styles.heading}>
          {partners.heading.map((line) => (
            <span key={line} className={styles.headingLine}>
              {line}
            </span>
          ))}
        </h2>
        <p className={styles.paragraph}>{partners.paragraph}</p>

        <ul className={styles.slots} aria-label="Партнери">
          {Array.from({ length: totalSlots }).map((_, index) => {
            const logo = logos[index];
            return (
              <li key={logo?.id ?? index} className={`${styles.slot} reveal`}>
                {logo ? <img src={logo.url} alt="Партнер" className={styles.logo} /> : "лого"}
              </li>
            );
          })}
        </ul>

        <Button href="#contact" variant="filled">
          {partners.button}
        </Button>
      </div>
    </section>
  );
}
