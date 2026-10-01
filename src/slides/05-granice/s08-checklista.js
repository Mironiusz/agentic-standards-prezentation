import './granice.css';

/** Siedem haseł z `PLAN_SLAJDY.md` 5.8. Ta sama lista jest instrukcją do ćwiczenia w bloku 7. */
const ITEMS = [
  'mapa: czy reguła ma już adres',
  'najpierw "Czego tu nie ma"',
  'sąsiad dostaje lustrzane odesłanie',
  'liczby i statusy: jedno miejsce',
  'odsyłacz do sekcji, nie do linii',
  'kopia nieunikniona: test zgodności',
  'spór bez rozstrzygnięcia: decision_registry.md',
];

/** Lista na co dzień: hasła wchodzą po kolei zaraz po wejściu na slajd. */
export default {
  id: 'checklista',
  stage: 'granice',
  summary: 'siedem zasad pilnowania granic na co dzień',
  html: `
    <h2 class="slide-title">Jak pilnować na co dzień</h2>
    <ol class="canvas check-list">
      ${ITEMS.map((item, i) => `<li><span class="check-num">${i + 1}</span>${item}</li>`).join('')}
    </ol>`,
  notes: `<p>Siedem zasad na co dzień, zebranych z poprzednich slajdów. Ta sama lista będzie instrukcją do ćwiczenia: zaczynamy od sprawdzenia mapy i od sekcji Czego tu nie ma, a nie od pisania reguł.</p>`,

  animate(root) {
    return [
      (tl) => {
        tl.from(root.querySelectorAll('.check-list li'), { opacity: 0, x: -16, duration: 0.35, stagger: 0.1 });
      },
    ];
  },
};
