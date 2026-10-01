import './wstep.css';

/** Slajd tytułowy. Ma tylko intro, więc notatki nie mają kliknięć. */
export default {
  id: 'tytul',
  summary: 'tytuł prezentacji',
  html: `
    <div class="title-slide">
      <div class="title-grid" aria-hidden="true"></div>
      <p class="kicker">quantask - docs/standards</p>
      <h1 class="title-main">Standardy w pipeline<br />agentowym</h1>
      <p class="title-sub">Rafał Mironko</p>
    </div>`,
  notes: `<p>Powitanie i jedno zdanie o temacie: w quantasku agent pracuje według standardów zapisanych w docs/standards i o tym, jak one działają, jest ta prezentacja.</p>`,

  animate(root) {
    const texts = root.querySelectorAll('.kicker, .title-main, .title-sub');
    return [
      (tl) => {
        tl.from(texts, { opacity: 0, y: 24, duration: 0.7, stagger: 0.15, ease: 'power2.out' });
      },
    ];
  },
};
