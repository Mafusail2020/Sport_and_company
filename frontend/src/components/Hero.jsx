import Button from "./Button.jsx";
import { hero } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { usePhotoOverrides } from "../context/PhotoOverridesContext.jsx";
import heroPhoto from "../assets/photos/hero-team-celebration.jpg";
import styles from "./Hero.module.css";

export default function Hero() {
  const revealCopy = useScrollReveal();
  const revealPhoto = useScrollReveal();
  const { overrides } = usePhotoOverrides();

  return (
    <section id="hero" className={`${styles.hero} container`}>
      <div ref={revealCopy} className={styles.copy}>
        <span className="eyebrow reveal">{hero.eyebrow}</span>
        <h1 className={`${styles.heading} reveal`}>
          {hero.heading.map((line) => (
            <span key={line} className={styles.headingLine}>
              {line}
            </span>
          ))}
          <span className={`accent ${styles.headingLine}`}>{hero.headingAccent}</span>
        </h1>
        <p className={`${styles.paragraph} reveal`}>{hero.paragraph}</p>

        <ul className={`${styles.tags} reveal`}>
          {hero.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className={`${styles.ctas} reveal`}>
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
          src={overrides["hero"] ?? heroPhoto}
          alt="Команда Sport&Company святкує перемогу з піднятими руками після футзального матчу"
          width="1600"
          height="1067"
          className={styles.photo}
        />
      </div>
    </section>
  );
}
