/**
 * Warianty slajdu wybierane klawiszem z cyfrą (D-015). Slajd z elementami `[data-variant="1"]`,
 * `[data-variant="2"]` itd. pokazuje naraz tylko ten z klasą `is-active` (style w `components.css`),
 * a cyfra wciśnięta na tym slajdzie przełącza na wariant o tym numerze. Na innych slajdach cyfry nic nie robią.
 *
 * Widok prezentera (S) przekazuje klawisze do własnej kopii prezentacji, a do głównego okna synchronizuje
 * tylko numer slajdu i kroku. Dlatego wybór idzie też przez `localStorage`: zdarzenie `storage` dociera
 * do pozostałych okien tej samej prezentacji, w tym do projektora. Przeglądarka może zablokować pamięć
 * (tryb prywatny, zablokowane dane witryny), więc zapis jest w `try`: wybór działa wtedy tylko w oknie,
 * w którym wciśnięto klawisz.
 */

const STORAGE_KEY = 'deck-variant';
const MAX_VARIANTS = 9;

/** Pokazuje wariant `n` slajdu o danym id. Zwraca `false`, gdy slajd nie ma takiego wariantu. */
function show(slideId, n) {
  const options = document.getElementById(slideId)?.querySelectorAll('[data-variant]') ?? [];
  if (n > options.length) return false;
  options.forEach((el) => el.classList.toggle('is-active', el.dataset.variant === String(n)));
  return true;
}

/** Przekazuje wybór pozostałym oknom prezentacji. */
function share(slideId, n) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ slideId, n }));
  } catch {
    return;
  }
}

/** Podpina klawisze 1-9 pod warianty bieżącego slajdu i nasłuch wyborów z innych okien. */
export function bindVariants(deck) {
  for (let n = 1; n <= MAX_VARIANTS; n++) {
    deck.addKeyBinding({ keyCode: 48 + n, key: String(n), description: `wariant ${n} slajdu` }, () => {
      const slideId = deck.getCurrentSlide()?.id;
      if (slideId && show(slideId, n)) share(slideId, n);
    });
  }
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    const { slideId, n } = JSON.parse(event.newValue);
    show(slideId, n);
  });
}
