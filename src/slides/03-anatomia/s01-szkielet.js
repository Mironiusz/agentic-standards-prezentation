import { gsap } from 'gsap';

import { SECTIONS, renderSkeleton } from '../../components/skeleton.js';
import './anatomia.css';

/** Hasło przy każdej sekcji: po co ta sekcja agentowi (`STANDARDY.md` 5.1). Materiał do przepisania. */
const NOTES = {
  stan: 'czy jeszcze aktualne?',
  poco: 'przypadki spoza tekstu reguły',
  zakres: 'czego tu nie ma + adres sąsiada',
  odstepstwo: 'czy niezgodność blokuje review',
  reguly: 'co się psuje bez reguły',
  checklista: 'materiał do review',
};

/** Dłuższy opis każdej sekcji do notatek prelegenta. */
const DETAILS = {
  stan: 'Stan dokumentu to data. Dzięki niej agent wie, czy dokument mógł się zestarzeć po jakimś zdarzeniu, a kontrola formatu wie, od kiedy obowiązuje.',
  poco: 'Po co ten dokument: jaki problem reguły rozwiązują. Dzięki temu agent umie zastosować regułę do przypadku, którego tekst nie przewidział.',
  zakres: 'Zakres i granice: za co standard odpowiada i, co ważniejsze, czego w nim nie ma, z adresem sąsiada. To routing zamiast powtarzania cudzej treści.',
  odstepstwo: 'Reguła odstępstwa mówi, czy kod niezgodny ze standardem blokuje review. W quantasku blokuje zawsze, bo repozytorium nie ma kodu zastanego.',
  reguly: 'Reguły z uzasadnieniem: przy każdej regule stoi, co się psuje, gdy się jej nie przestrzega. Bez uzasadnienia agent nie odróżni reguły ważnej od kosmetycznej.',
  checklista: 'Checklista to materiał do review, sprawdzalny punkt po punkcie, na zielono albo na czerwono.',
};

const SK = renderSkeleton({ x: 0, y: 0, w: 560 });

const notes = SECTIONS.map((s) => {
  const band = SK.bands[s.key];
  return `<g class="sz-item">
    <path class="sz-link" d="M${band.x + band.w + 8} ${band.cy} H660" />
    <text class="sz-note" x="680" y="${band.cy + 10}">${NOTES[s.key]}</text>
  </g>`;
}).join('');

/** Szkielet standardu: każde kliknięcie zapala jedną sekcję i dopisuje obok, po co ona agentowi. */
export default {
  id: 'szkielet',
  stage: 'anatomia',
  summary: 'anatomia standardu: sześć sekcji i po co każda z nich agentowi',
  html: `
    <h2 class="slide-title">Anatomia standardu</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 ${SK.height}" width="1440" height="${SK.height}" aria-hidden="true">
        ${SK.svg}
        ${notes}
      </svg>
    </div>`,
  notes: `
    <p>Prawie każdy z dziewiętnastu standardów quantaska ma ten sam szkielet. Przejdziemy po sekcjach i przy każdej powiemy, do czego służy agentowi.</p>
    ${SECTIONS.map((s) => `<p>[klik] ${DETAILS[s.key]}</p>`).join('')}`,

  animate(root) {
    const highlights = [...root.querySelectorAll('.sk-hi')];
    const items = [...root.querySelectorAll('.sz-item')];
    gsap.set(items, { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelector('.sk-doc'), { opacity: 0, y: 16, duration: 0.5 });
      },
      ...SECTIONS.map((_, k) => (tl) => {
        tl.to(highlights[k], { opacity: 1, duration: 0.3 });
        if (k > 0) tl.to(highlights[k - 1], { opacity: 0, duration: 0.3 }, '<');
        tl.to(items[k], { opacity: 1, duration: 0.4 }, '<0.1');
      }),
    ];
  },
};
