import { gallery } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import styles from "./Gallery.module.css";

const photoModules = import.meta.glob("../assets/photos/*.jpg", { eager: true, import: "default" });

function photoUrl(name) {
  return photoModules[`../assets/photos/${name}`];
}

export default function Gallery() {
  const reveal = useScrollReveal();

  return (
    <section id="gallery" className="section">
      <div ref={reveal} className="container reveal">
        <span className="eyebrow">{gallery.eyebrow}</span>
        <h2 className={styles.heading}>{gallery.heading}</h2>

        <div className={styles.grid}>
          <div className={`${styles.largeWrap} reveal`}>
            <img
              src={photoUrl(gallery.large.photo)}
              alt={gallery.large.alt}
              className={styles.large}
              loading="lazy"
            />
          </div>
          <div className={styles.smallGrid}>
            {gallery.small.map((photo, index) => (
              <div key={`${photo.photo}-${index}`} className={`${styles.smallWrap} reveal`}>
                <img
                  src={photoUrl(photo.photo)}
                  alt={photo.alt}
                  className={styles.small}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
