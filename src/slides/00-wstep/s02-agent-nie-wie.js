import { gsap } from 'gsap';

import { token } from '../../lib/theme.js';
import './wstep.css';

/**
 * Prawdziwy przypadek ze script-managera, z integracji z API Fleethanda. 2026-08-04 agent dopisał testy kontroli
 * tabletu w `fleethand_set_companycode.py`, a atrapa odpowiedzi API dostała pole `fhTabImei`, bo tak zakładał
 * testowany kod. 2026-09-02, przy diagnozie tabletów offline, agent odpytał żywe API i ustalił, że
 * `GET /api/vehicle` tego pola nie zwraca. Kod testów i zdanie agenta są cytatami z transkryptów (skrócone:
 * w atrapie pominięte pole `tabSimNo`). Autora samego kodu produkcyjnego nie da się ustalić z transkryptów.
 */
export default {
  id: 'agent-nie-wie',
  summary: 'prawdziwy przykład: agent zgaduje kontrakt API Fleethanda, a testy są zielone',
  html: `
    <h2 class="slide-title">Co robi agent, kiedy nie wie?</h2>
    <div class="canvas chat">
      <div class="bubble is-user">
        <div class="bubble-who">ja, 4 sierpnia</div>
        czy można robić kolejny tier testów? implementuj
      </div>
      <div class="bubble is-agent nw-tests">
        <div class="bubble-who">agent</div>
        <div class="code-card">before   = {<span class="c-str">"tabImei"</span>: <span class="c-str">"IMEI1"</span>, <mark class="c-str">"fhTabImei"</mark>: None}<br />after_ok = {<span class="c-str">"tabImei"</span>: <span class="c-str">"IMEI1"</span>, <mark class="c-str">"fhTabImei"</mark>: <span class="c-str">"IMEI1"</span>}</div>
      </div>
      <div class="chat-gap">miesiąc później</div>
      <div class="bubble is-agent nw-found">
        <div class="bubble-who">agent, 2 września</div>
        Weryfikacja tabletu jest ślepa: sprawdza spójność przez <code>fhTabImei</code>, a <code>GET /api/vehicle</code> tego pola w ogóle nie zwraca.
      </div>
      <div class="chat-effects">
        <span class="tag is-alert">kontrola zawsze daje False</span>
        <span class="tag is-alert">testy zielone: atrapa zna ten sam kontrakt</span>
      </div>
    </div>`,
  notes: `
    <p>Zaczynamy od prawdziwej sytuacji ze script-managera, z integracji z API Fleethanda, czyli systemu, który wysyła zadania na tablety w ciężarówkach. Na początku sierpnia proszę agenta o kolejną porcję testów.</p>
    <p>[klik] Agent pisze testy do kontroli tabletu po zmianie firmy pojazdu. Atrapa odpowiedzi API dostaje pole fhTabImei, bo tak zakłada kod, który agent testuje. Prawdziwego API agent nie odpytał, tylko przepisał założenie z kodu do testu. Testy przechodzą.</p>
    <p>[klik] Podświetlone jest to, czego agent nie wiedział, więc zgadł: że API zwraca pole fhTabImei. Wziął je z kodu, a nie z kontraktu API.</p>
    <p>[klik] Miesiąc później, przy diagnozie tabletów offline, agent odpytuje żywe API i sam to wyłapuje: GET /api/vehicle w ogóle nie zwraca fhTabImei, w odpowiedzi jest tylko tabImei i numer karty SIM. Kodu produkcyjnego nie da się przypisać agentowi, ale testy z atrapą napisał on.</p>
    <p>[klik] Skutek: na aucie z tabletem warunek kontroli po aktualizacji zawsze wychodzi False, a testy przez cały miesiąc były zielone, bo atrapa znała ten sam zgadnięty kontrakt co kod. Nic się nie wywaliło i nikt nie zauważył, że kontrola nic nie kontroluje.</p>`,

  animate(root) {
    const tests = root.querySelector('.nw-tests');
    const later = root.querySelectorAll('.chat-gap, .nw-found');
    const marks = root.querySelectorAll('.bubble mark');
    const effects = root.querySelectorAll('.chat-effects .tag');
    gsap.set([tests, ...later, ...effects], { opacity: 0 });
    gsap.set(marks, { backgroundColor: 'rgba(0, 0, 0, 0)' });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.slide-title, .bubble.is-user'), { opacity: 0, y: 16, duration: 0.5, stagger: 0.15 });
      },
      (tl) => {
        tl.to(tests, { opacity: 1, duration: 0.5 });
      },
      (tl) => {
        tl.to(marks, { backgroundColor: token('--c-alert-soft'), color: token('--c-alert'), duration: 0.4, stagger: 0.2 });
      },
      (tl) => {
        tl.to(later, { opacity: 1, duration: 0.5, stagger: 0.2 });
      },
      (tl) => {
        tl.to(effects, { opacity: 1, duration: 0.4, stagger: 0.2 });
      },
    ];
  },
};
