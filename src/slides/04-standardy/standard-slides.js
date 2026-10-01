import { gsap } from 'gsap';

import { fileCard } from '../../components/file-card.js';
import { ARROW } from '../../components/icons.js';
import { token } from '../../lib/theme.js';
import './standardy.css';

/**
 * Trzy układy slajdów bloku 4, wspólne dla każdego omawianego standardu: po co (fragment pliku),
 * reguły (hasło i co się psuje) i kto pilnuje (łańcuch narzędzi). Treść przychodzi z `data.js`.
 */

const STAGE = 'standardy';

const GUARD_CLASS = { tool: 'is-mint', ci: 'is-mint', human: 'is-violet', none: 'is-alert', plain: '' };

const heading = (kicker, title) => `<p class="kicker">${kicker}</p><h2 class="slide-title std-title">${title}</h2>`;

/** Etykiety pod hasłem reguły: napis albo `{ label, cls }`, gdy etykieta ma mieć kolor. */
const demoTags = (demo = []) => {
  if (!demo.length) return '';
  const tags = demo.map((d) => (typeof d === 'string' ? { label: d, cls: '' } : d)).map((d) => `<span class="tag ${d.cls}">${d.label}</span>`);
  return `<div class="rule-demo">${tags.join('')}</div>`;
};

/**
 * Łańcuch tego, kto pilnuje reguły. Job CI dołącza strzałką do narzędzia przed nim (narzędzie, a potem job,
 * w którym chodzi) i razem tworzą grupę, która nie łamie się przy zawijaniu. Niezależne bariery to osobne grupy
 * bez strzałki, bo nie tworzą kolejności.
 */
const guardChain = (guard) => {
  const groups = [];
  for (const [kind, label] of guard) {
    const tag = `<span class="tag ${GUARD_CLASS[kind]}">${kind === 'ci' ? `CI: ${label}` : label}</span>`;
    if (kind === 'ci' && groups.length) groups[groups.length - 1].push(`<span class="guard-arrow">${ARROW}</span>`, tag);
    else groups.push([tag]);
  }
  return groups.map((g) => `<span class="guard-group">${g.join('')}</span>`).join('');
};

const notesOf = (intro, clicks) => `<p>${intro}</p>${clicks.map((c) => `<p>[klik] ${c}</p>`).join('')}`;

/** Gdy wszystkie reguły pochodzą z jednego standardu, kolumna z jego nazwą tylko się powtarza, więc jej nie ma. */
const singleStd = (std) => new Set(std.rules.map((r) => r.std)).size === 1;

const stdTag = (std, r) => (singleStd(std) ? '' : `<span class="tag is-orange">${r.std}</span>`);

/** Slajd z fragmentem sekcji Po co: intro pokazuje kartę, kliknięcie zapala kluczowe fragmenty. */
export function poCoSlide(std) {
  return {
    id: `${std.prefix}-po-co`,
    stage: STAGE,
    summary: std.summary.poCo,
    html: `
      ${heading('po co', std.title)}
      <div class="canvas std-cards is-${std.cards.length}">${std.cards.map(fileCard).join('')}</div>`,
    notes: notesOf(std.notes.poCo, [std.notes.poCoClick]),

    animate(root) {
      const marks = root.querySelectorAll('.fc-body mark');
      gsap.set(marks, { backgroundColor: 'rgba(0, 0, 0, 0)' });
      return [
        (tl) => {
          tl.from(root.querySelectorAll('.file-card'), { opacity: 0, y: 18, duration: 0.5, stagger: 0.2 });
        },
        (tl) => {
          tl.to(marks, { backgroundColor: token('--accent-soft'), color: token('--accent'), duration: 0.4, stagger: 0.2 });
        },
      ];
    },
  };
}

/** Slajd z regułami: każde kliknięcie dokłada jeden wiersz z hasłem reguły i tym, co się psuje bez niej. */
export function rulesSlide(std) {
  return {
    id: `${std.prefix}-reguly`,
    stage: STAGE,
    summary: std.summary.rules,
    html: `
      ${heading('reguły', std.title)}
      <div class="canvas rule-list ${singleStd(std) ? 'is-single' : ''}">
        ${std.rules
          .map(
            (r) => `<div class="rule-row">
          ${stdTag(std, r)}
          <div class="rule-main"><span class="rule-text">${r.rule}</span>${demoTags(r.demo)}</div>
          <div class="rule-breaks"><span class="rule-breaks-label">co się psuje</span>${r.breaks}</div>
        </div>`,
          )
          .join('')}
      </div>`,
    notes: notesOf('Kilka reguł wybranych z pliku. Przy każdej mówimy, co się psuje, gdy jej nie ma.', std.notes.rules),

    animate(root) {
      const rows = [...root.querySelectorAll('.rule-row')];
      gsap.set(rows, { opacity: 0 });
      return [
        null,
        ...rows.map((row) => (tl) => {
          tl.to(row, { opacity: 1, duration: 0.4 });
        }),
      ];
    },
  };
}

/** Slajd z tym, kto pilnuje reguły: intro pokazuje reguły, każde kliknięcie dokłada łańcuch jednej z nich. */
export function guardsSlide(std) {
  const note = std.guardsNote ? `<div class="guard-note">${fileCard(std.guardsNote)}</div>` : '';
  return {
    id: `${std.prefix}-pilnuje`,
    stage: STAGE,
    summary: std.summary.guards,
    html: `
      ${heading('kto pilnuje', std.title)}
      <div class="canvas guard-list ${singleStd(std) ? 'is-single' : ''}">
        ${std.rules
          .map(
            (r) => `<div class="guard-row">
          ${stdTag(std, r)}
          <span class="guard-rule">${r.rule}</span>
          <div class="guard-chain">${guardChain(r.guard)}</div>
        </div>`,
          )
          .join('')}
        ${note}
      </div>`,
    notes: notesOf('Te same reguły, a teraz pytanie, co je egzekwuje: narzędzie, job w CI, człowiek w review albo nic.', std.notes.guards),

    animate(root) {
      const chains = [...root.querySelectorAll('.guard-chain')];
      const noteEl = root.querySelector('.guard-note');
      gsap.set(chains, { opacity: 0 });
      if (noteEl) gsap.set(noteEl, { opacity: 0 });
      return [
        (tl) => {
          tl.from(root.querySelectorAll('.guard-row'), { opacity: 0, duration: 0.4, stagger: 0.1 });
        },
        ...chains.map((chain, i) => (tl) => {
          tl.to(i === chains.length - 1 && noteEl ? [chain, noteEl] : chain, { opacity: 1, duration: 0.4, stagger: 0.3 });
        }),
      ];
    },
  };
}
