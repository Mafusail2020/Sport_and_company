import { useState } from "react";
import { faq } from "../content/content.js";
import styles from "./Faq.module.css";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {faq.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          return (
            <li key={item.question} className={styles.item}>
              <h3 className={styles.questionRow}>
                <button
                  type="button"
                  id={buttonId}
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <span className={styles.icon} aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className={`${styles.answerWrap} ${isOpen ? styles.answerWrapOpen : ""}`}
              >
                <div className={styles.answer}>
                  <div className={styles.answerInner}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

