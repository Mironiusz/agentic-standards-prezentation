import { gsap } from 'gsap';

import { ARROW, CROSS } from '../../components/icons.js';
import './anatomia.css';

const arrow = `<span class="qa-arrow">${ARROW}</span>`;

/**
 * Pytania, które agent inaczej by zgadywał, i odpowiedzi z trzech standardów omawianych w bloku 4.
 * Odpowiedź to mały rysunek z HTML, a nie zdanie. Znaki zakazane idą jako encje HTML, żeby nie stały w kodzie
 * dosłownie, a homoglifu (cyrylickie a) nie pokazujemy, bo font prezentacji nie ma cyrylicy (D-012).
 */
const CARDS = [
  {
    question: 'Jak określić próg złożoności funkcji?',
    src: 'code_quality',
    answer: `<div class="qa-row qa-big"><span class="qa-old">10</span>${arrow}<span class="qa-new">15</span></div>
      <div class="qa-cap">ustalony pomiarem na repozytorium</div>`,
  },
  {
    question: 'Co, jeśli komendy nie ma na liście?',
    src: 'git',
    answer: `<div class="qa-ask">zmienia historię gita?</div>
      <div class="qa-table">
        <span class="qa-key">tak</span>${arrow}<span class="tag is-violet">decyduje człowiek</span>
        <span class="qa-key">nie</span>${arrow}<span class="tag">agent może</span>
      </div>`,
  },
  {
    question: 'Jakich znaków nie używać?',
    src: 'formatting',
    answer: `<div class="qa-table qa-glyphs">
        <span class="qa-bad">&mdash;</span>${arrow}<span class="qa-good">-</span>
        <span class="qa-bad">&ldquo; &rdquo;</span>${arrow}<span class="qa-good">"</span>
        <span class="qa-bad">&hellip;</span>${arrow}<span class="qa-good">...</span>
      </div>`,
  },
  {
    question: 'Gdzie trzymać wartość?',
    src: 'config',
    answer: `<div class="qa-table">
        <span class="qa-key">sekret</span>${arrow}<span class="tag">.env</span>
        <span class="qa-key">zależy od maszyny</span>${arrow}<span class="tag">.env.local</span>
        <span class="qa-key">reszta</span>${arrow}<span class="tag">kod</span>
      </div>`,
  },
  {
    question: 'Czego agentowi nie wolno?',
    src: 'git',
    answer: `<div class="qa-row"><span class="tag is-alert">${CROSS} commit</span><span class="tag is-alert">${CROSS} push</span></div>
      <div class="qa-cap is-violet">tylko człowiek, nawet na prośbę</div>`,
  },
  {
    question: 'Czego nie sprawdza żadne narzędzie?',
    src: 'git',
    answer: `<div class="qa-quote">Żaden mechanizm nie sprawdza reguł z tego dokumentu.</div>
      <div class="qa-cap">napisane wprost w standardzie</div>`,
  },
];

/** Sześć pytań, które standard rozstrzyga za agenta. Każde kliknięcie dokłada jedną kartę. */
export default {
  id: 'tresci',
  stage: 'anatomia',
  summary: 'na jakie pytania odpowiada standard: sześć przykładów',
  html: `
    <h2 class="slide-title">Przykłady, na jakie pytania odpowiada standard</h2>
    <div class="canvas qa-grid">
      ${CARDS.map(
        (c) => `<div class="qa-card">
        <span class="qa-question"><span class="qa-src">${c.src}</span>${c.question}</span>
        <div class="qa-answer">${c.answer}</div>
      </div>`,
      ).join('')}
    </div>`,
  notes: `
    <p>Standard to w praktyce odpowiedzi na pytania, które agent inaczej by zgadywał. Sześć przykładów z trzech standardów, które omówimy w następnym bloku.</p>
    <p>[klik] Jak określić próg złożoności funkcji: nie na wyczucie, tylko pomiarem na repozytorium. Wyszło 15. Bez liczby każdy, człowiek czy agent, ma własne wyczucie, a przy progu 10 sypały się fałszywe alarmy.</p>
    <p>[klik] Co, jeśli komendy nie ma na liście: zamiast listy wszystkich komend standard gita daje jedno pytanie. Jeśli operacja zmienia historię, decyduje człowiek. Bez tego agent zgaduje po podobieństwie nazwy.</p>
    <p>[klik] Jakich znaków nie używać: długie myślniki, zakrzywione cudzysłowy, wielokropek i znaki, które wyglądają jak zwykłe litery, a nimi nie są. Bez tej listy tekst agenta od razu zdradza, że pisał go czat.</p>
    <p>[klik] Gdzie trzymać wartość: sekret idzie do .env, wartość zależna od maszyny do .env.local, a reszta zostaje w kodzie. Bez tego każdy czyta konfigurację po swojemu, a przy rotacji sekretu szukamy po całym repozytorium.</p>
    <p>[klik] Czego agentowi nie wolno: commit i push robi tylko człowiek, nawet jeśli agenta poprosi o to sam użytkownik. Bez tej granicy agent podpisałby czyimś nazwiskiem coś, czego nikt nie przejrzał.</p>
    <p>[klik] Czego nie sprawdza żadne narzędzie: standard gita mówi wprost, że żaden mechanizm nie pilnuje jego reguł. Trzyma się ich agent, który je czyta, a naruszenie wyłapuje człowiek na review albo widać je dopiero w historii gita. Reguła miękka opisana jako miękka nadal działa, a taka, która udaje twardą, usypia czujność.</p>`,

  animate(root) {
    const cards = [...root.querySelectorAll('.qa-card')];
    gsap.set(cards, { opacity: 0, y: 16 });

    return [
      null,
      ...cards.map((card) => (tl) => {
        tl.to(card, { opacity: 1, y: 0, duration: 0.4 });
      }),
    ];
  },
};
