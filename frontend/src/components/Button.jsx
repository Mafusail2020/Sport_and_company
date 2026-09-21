import styles from "./Button.module.css";

/**
 * variant: "filled" (mint) | "outline-dark" (navy border, for light sections)
 *         | "outline-light" (white border, for dark sections) | "dark" (solid navy fill)
 * as: "a" | "button" — renders an anchor for in-page nav, a button for actions.
 */
export default function Button({
  children,
  variant = "filled",
  as = "a",
  href,
  onClick,
  type = "button",
  className = "",
  ...rest
}) {
  const classes = `${styles.button} ${styles[variant] ?? ""} ${className}`;

  if (as === "a") {
    return (
      <a href={href} onClick={onClick} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {children}
    </button>
  );
}
