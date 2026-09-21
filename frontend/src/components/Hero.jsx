import Button from "./Button.jsx";
import { hero } from "../content/content.js";
import heroPhoto from "../assets/photos/hero-team-celebration.jpg";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={`${styles.hero} container`}>
      <div className={styles.copy}>
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 className={styles.heading}>
          {hero.heading.map((line) => (
            <span key={line} className={styles.headingLine}>
              {line}
            </span>
          ))}
          <span className={`accent ${styles.headingLine}`}>{hero.headingAccent}</span>
        </h1>
        <p className={styles.paragraph}>{hero.paragraph}</p>

        <ul className={styles.tags}>
          {hero.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className={styles.ctas}>
          <Button href="#contact" variant="filled">
            {hero.primaryCta}
          </Button>
          <Button href="#why-us" variant="outline-dark">
            {hero.secondaryCta}
          </Button>
        </div>
      </div>

      <div className={styles.photoWrap}>
        <img
          src={heroPhoto}
          alt="Команда Sport&Company святкує перемогу з піднятими руками після футзального матчу"
          width="1600"
          height="1067"
          className={styles.photo}
        />
      </div>
    </section>
  );
}
