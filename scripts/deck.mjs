/**
 * Wspólne dla skryptów Playwright: otwarcie builda offline (dist/index.html) i przejście po krokach.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Nazwa prezentacji z pola `name` w package.json, np. do nazw plików PDF. */
export const deckName = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).name;

const TRANSITION_MS = 600;

/**
 * Otwiera prezentację w nowej karcie. Błędy strony i każde zapytanie do sieci (plik ma działać
 * offline, D-003) trafiają do `errors`.
 */
export async function openDeck(browser, errors, query = '') {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  await page.route(/^(?!file:|data:|blob:)/, (route) => {
    errors.push(`Zapytanie do sieci: ${route.request().url()}`);
    route.abort();
  });

  await page.goto(pathToFileURL(resolve(root, 'dist/index.html')).href + query);
  await page.waitForFunction(() => window.__deck);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

/** Ustawia slajd `h` w kroku `step` (0 = po intro) i czeka, aż animacja i przejście się skończą. */
export async function goToStep(page, h, step) {
  await page.evaluate(([hh, f]) => window.__deck.reveal.slide(hh, 0, f), [h, step - 1]);
  await page.waitForTimeout(TRANSITION_MS);
  await page.evaluate(() => window.__deck.settle());
  await page.waitForTimeout(100);
}

/** Wypisuje zebrane błędy strony i kończy skrypt kodem 1, jeśli jakikolwiek się pojawił. */
export function reportErrors(errors) {
  if (!errors.length) return;
  console.error('Błędy strony:\n' + errors.join('\n'));
  process.exit(1);
}
