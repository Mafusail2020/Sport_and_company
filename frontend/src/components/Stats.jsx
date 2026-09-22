import { useState } from "react";
import { stats } from "../content/content.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import styles from "./Stats.module.css";

const COUNT_DURATION = 700;

function parseStat(value) {
  const match = value.match(/^(\d+)(.*)$/);
  return match ? { target: Number(match[1]), suffix: match[2] } : { target: null, suffix: value };
}

const parsed = stats.map((stat) => parseStat(stat.number));

export default function Stats() {
  const [counts, setCounts] = useState(() => parsed.map((stat) => (stat.target === null ? null : 0)));

  const reveal = useScrollReveal(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const targets = parsed.map((stat) => stat.target);

    if (reduceMotion) {
      setCounts(targets);
      return;
    }

    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / COUNT_DURATION, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCounts(targets.map((target) => (target === null ? null : Math.round(target * eased))));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });

  return (
    <section id="stats" className="container" aria-label="Статистика Sport&Company">
      <ul ref={reveal} className={styles.grid}>
        {stats.map((stat, index) => (
          <li key={stat.label} className={`${styles.item} reveal`}>
            <p className={styles.number}>
              {counts[index] === null ? stat.number : `${counts[index]}${parsed[index].suffix}`}
            </p>
            <p className={styles.label}>{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
