import Button from "./Button.jsx";
import { hero } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import heroPhoto from "../assets/photos/hero-team-celebration.jpg";
import styles from "./Hero.module.css";

export default function Hero() {
  const revealCopy = useScrollReveal();
  const revealPhoto = useScrollReveal();

  return (
    <section id="hero" className={`${styles.hero} container`}>
      <div ref={revealCopy} className={`${styles.copy} reveal`}>
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

      <div ref={revealPhoto} className={`${styles.photoWrap} reveal`}>
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
