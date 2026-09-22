import { whyUs } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import styles from "./WhyUs.module.css";

export default function WhyUs() {
  const reveal = useScrollReveal();

  return (
    <section id="why-us" className={`${styles.section} section section--dark`}>
      <div ref={reveal} className={`container ${styles.inner} reveal`}>
        <span className="eyebrow">{whyUs.eyebrow}</span>
        <h2 className={styles.heading}>
          {whyUs.heading}
          <br />
          <span className="accent">{whyUs.headingAccent}</span>
        </h2>
        <p className={styles.paragraph}>{whyUs.paragraph}</p>

        <ul className={styles.cards}>
          {whyUs.cards.map((card) => (
            <li key={card.number} className={`${styles.card} reveal`}>
              <span className={styles.cardNumber}>{card.number}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p>{card.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
