import './granice.css';

/** Przejście do quizu. Bank pytań i komentarze z dowodami: `docs/kahoot.md`, plik do wgrania: `npm run kahoot`. */
export default {
  id: 'kahoot',
  stage: 'granice',
  summary: 'Kahoot: gdzie mieszka ta reguła',
  html: `
    <div class="canvas kahoot">
      <p class="kahoot-title">Kahoot</p>
      <p class="kahoot-sub">gdzie mieszka ta reguła?</p>
      <div class="kahoot-meta"><span class="tag">10 pytań</span><span class="tag">20 s</span></div>
      <div class="kahoot-pin">PIN gry</div>
    </div>`,
  notes: `<p>Quiz: pokazuję przypadek, a sala wybiera standard, w którym mieszka reguła. Zła odpowiedź to zawsze sąsiad z granicy, bo właśnie o to rozróżnienie chodzi. Pytania dziewiąte i dziesiąte są podchwytliwe: pierwsze pyta o czynności, które nie są regułami, a drugie o obszar świadomie bez standardu.</p>`,

  animate(root) {
    return [
      (tl) => {
        tl.from(root.querySelectorAll('.kahoot > *'), { opacity: 0, y: 18, duration: 0.45, stagger: 0.12 });
      },
    ];
  },
};
