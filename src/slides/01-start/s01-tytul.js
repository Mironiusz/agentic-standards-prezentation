import './start.css';

/** Slajd tytułowy startowy, do podmiany na własny. Ma tylko intro, więc notatki nie mają kliknięć. */
export default {
  id: 'tytul',
  html: `
    <div class="title-slide">
      <div class="title-grid" aria-hidden="true"></div>
      <p class="kicker">Nazwa wydarzenia</p>
      <h1 class="title-main">Tytuł prezentacji</h1>
      <p class="title-sub">Podtytuł albo imię i nazwisko prelegenta</p>
    </div>`,
  notes: `<p>Slajd tytułowy do podmiany. Intro gra samo po wejściu na slajd, bez kliknięć.</p>`,

  animate(root) {
    const texts = root.querySelectorAll('.kicker, .title-main, .title-sub');
    return [
      (tl) => {
        tl.from(texts, { opacity: 0, y: 24, duration: 0.7, stagger: 0.15, ease: 'power2.out' });
      },
    ];
  },
};
