/** Wartość tokenu koloru z theme.css. GSAP nie interpoluje `var(--...)`, więc animacje kolorów używają tej funkcji. */
export function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
