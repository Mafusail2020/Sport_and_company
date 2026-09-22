import { about } from "../content/content.js";
import aboutPhoto from "../assets/photos/about-team-table.jpg";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { usePhotoOverrides } from "../context/PhotoOverridesContext.jsx";
import styles from "./About.module.css";

export default function About() {
  const reveal = useScrollReveal();
  const { overrides } = usePhotoOverrides();

  return (
    <section id="about" className={`section ${styles.section}`}>
      <div ref={reveal} className={`container ${styles.grid} reveal`}>
        <div className={styles.photoWrap}>
          <img
            src={overrides["about"] ?? aboutPhoto}
            alt="Команда Sport&Company обговорює концепцію події за столом переговорів"
            width="780"
            height="1200"
            className={styles.photo}
          />
        </div>

        <div>
          <span className="eyebrow">{about.eyebrow}</span>
          <h2 className={styles.heading}>{about.heading}</h2>

          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}

          <ul className={styles.bullets}>
            {about.bullets.map((bullet) => (
              <li key={bullet}>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
