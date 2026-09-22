import { stats } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import styles from "./Stats.module.css";

export default function Stats() {
  const reveal = useScrollReveal();

  return (
    <section id="stats" className="container" aria-label="Статистика Sport&Company">
      <ul ref={reveal} className={`${styles.grid} reveal`}>
        {stats.map((stat) => (
          <li key={stat.label} className={styles.item}>
            <p className={styles.number}>{stat.number}</p>
            <p className={styles.label}>{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
