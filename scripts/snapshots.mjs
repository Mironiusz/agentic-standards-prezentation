/**
 * Zrzuty ekranu każdego slajdu w każdym kroku animacji, z builda offline (dist/index.html).
 * Użycie: npm run build && npm run snapshots [-- id-slajdu ...]
 *
 * Wynik: snapshots/NN-id-krokK.png. Kończy się błędem, jeśli strona zgłosi błąd w konsoli,
 * sięgnie do sieci (plik ma działać offline, D-003) albo notatki nie zgadzają się ze slajdami:
 * liczba [klik] różna od liczby kroków, brak czasu w src/slides/timing.js (D-010).
 */

import { mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { goToStep, openDeck, reportErrors, root } from './deck.mjs';

const outDir = resolve(root, 'snapshots');
const only = new Set(process.argv.slice(2));

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const errors = [];
const page = await openDeck(browser, errors);

const { slides, totalTime } = await page.evaluate(() => window.__deck);
for (const slide of slides) {
  if (slide.clicks !== slide.steps) errors.push(`${slide.id}: ${slide.clicks} x [klik] w notatkach, a kroków animacji ${slide.steps}`);
  if (!slide.timing) errors.push(`${slide.id}: brak czasu w src/slides/timing.js`);
}
console.log(`Plan czasu: ${Math.round(totalTime / 60)} min`);
let count = 0;

for (const [h, slide] of slides.entries()) {
  if (only.size && !only.has(slide.id)) continue;
  for (let step = 0; step <= slide.steps; step++) {
    await goToStep(page, h, step);
    const name = `${String(h + 1).padStart(2, '0')}-${slide.id}-krok${step}.png`;
    await page.screenshot({ path: resolve(outDir, name) });
    count++;
  }
}

await browser.close();
console.log(`Zapisano ${count} zrzutów w ${outDir}`);
reportErrors(errors);
