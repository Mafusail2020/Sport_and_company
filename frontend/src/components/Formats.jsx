import { formats } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import styles from "./Formats.module.css";

const photoModules = import.meta.glob("../assets/photos/*.jpg", { eager: true, import: "default" });

function photoUrl(name) {
  return photoModules[`../assets/photos/${name}`];
}

export default function Formats() {
  const reveal = useScrollReveal();

  return (
    <section id="formats" className={`section ${styles.section}`}>
      <div ref={reveal} className="container reveal">
        <div className={styles.head}>
          <div>
            <span className="eyebrow">{formats.eyebrow}</span>
            <h2 className={styles.heading}>{formats.heading}</h2>
          </div>
          <p className={`${styles.intro} ${styles.introBold}`}>{formats.intro}</p>
        </div>

        <ul className={styles.grid}>
          {formats.cards.map((card) => (
            <li key={card.title} className={styles.card}>
              <div className={styles.photoWrap}>
                <img
                  src={photoUrl(card.photo)}
                  alt={card.alt}
                  width={card.width}
                  height={card.height}
                  loading="lazy"
                  className={styles.photo}
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
