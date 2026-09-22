import { team } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import { usePhotoOverrides } from "../context/PhotoOverridesContext.jsx";
import Button from "./Button.jsx";
import teamPhoto from "../assets/photos/team-group.jpg";
import styles from "./Team.module.css";

export default function Team() {
  const reveal = useScrollReveal();
  const { overrides } = usePhotoOverrides();

  return (
    <section id="team" className="section">
      <div ref={reveal} className={`container ${styles.grid} reveal`}>
        <div>
          <span className="eyebrow">{team.eyebrow}</span>
          <h2 className={styles.heading}>
            {team.heading[0]}
            <br />
            {team.heading[1]}
          </h2>
          <p className={styles.paragraph}>{team.paragraph}</p>

          <ul className={styles.pills}>
            {team.pills.map((pill) => (
              <li key={pill}>{pill}</li>
            ))}
          </ul>

          <Button href="#contact" variant="filled">
            {team.button}
          </Button>
        </div>

        <div className={styles.photoWrap}>
          <img
            src={overrides["team"] ?? teamPhoto}
            alt={team.alt}
            width="1400"
            height="933"
            loading="lazy"
            className={styles.photo}
          />
        </div>
      </div>
    </section>
  );
}
