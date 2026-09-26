/**
 * Zapasowe PDF-y z builda offline (dist/index.html). Użycie: npm run build && npm run pdf
 * Nazwy plików biorą się z pola `name` w package.json. Wynik w dist/ (D-010):
 * - NAZWA-kroki.pdf: strona na każde kliknięcie, zrzuty ekranu. Do prowadzenia prezentacji z przeglądarki PDF,
 *   gdy plik HTML zawiedzie: pilot przewija strony jak kroki.
 * - NAZWA.pdf: slajd na stronę w stanie końcowym, z widoku druku reveal.js. Tekst wektorowy i klikalne linki,
 *   do rozesłania po prezentacji.
 * - NAZWA-notatki.pdf: jak wyżej, a po każdym slajdzie strona z notatkami i czasem.
 */

import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { deckName, goToStep, openDeck, reportErrors, root } from './deck.mjs';

/** Przestrzenie 3D rysuje pętla requestAnimationFrame, więc dostaje chwilę po ułożeniu stron. */
const SETTLE_MS = 1500;

const browser = await chromium.launch();
const errors = [];

/** PDF z widoku druku reveal.js (`query` wybiera wariant, np. z notatkami). */
async function printView(query, file) {
  const page = await openDeck(browser, errors, query);
  await page.waitForFunction(() => document.querySelectorAll('.pdf-page').length === window.__deck.slides.length);
  await page.waitForTimeout(SETTLE_MS);
  const path = resolve(root, 'dist', file);
  await page.pdf({ path, preferCSSPageSize: true, printBackground: true });
  await page.close();
  console.log(`Zapisano ${path}`);
}

/** PDF ze zrzutów ekranu: strona na każdy krok każdego slajdu. */
async function stepsPdf(file) {
  const page = await openDeck(browser, errors);
  const slides = await page.evaluate(() => window.__deck.slides);
  const shots = [];
  for (const [h, slide] of slides.entries()) {
    for (let step = 0; step <= slide.steps; step++) {
      await goToStep(page, h, step);
      shots.push((await page.screenshot({ type: 'jpeg', quality: 90 })).toString('base64'));
    }
  }
  await page.close();

  const sheet = await browser.newPage();
  await sheet.setContent(`<!doctype html>
    <style>
      @page { size: 1600px 900px; margin: 0; }
      body { margin: 0; }
      img { display: block; width: 1600px; height: 900px; break-after: page; }
      img:last-child { break-after: auto; }
    </style>
    ${shots.map((s) => `<img src="data:image/jpeg;base64,${s}">`).join('')}`);
  await sheet.evaluate(() => Promise.all([...document.images].map((img) => img.decode())));
  const path = resolve(root, 'dist', file);
  await sheet.pdf({ path, preferCSSPageSize: true, printBackground: true });
  await sheet.close();
  console.log(`Zapisano ${path} (${shots.length} stron)`);
}

await stepsPdf(`${deckName}-kroki.pdf`);
await printView('?print-pdf', `${deckName}.pdf`);
await printView('?print-pdf&showNotes=separate-page', `${deckName}-notatki.pdf`);

await browser.close();
reportErrors(errors);
