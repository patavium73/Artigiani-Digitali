# Piano di Implementazione: Nuova Landing Page "Industrial Officina" & Riorganizzazione Piani

Questo piano definisce le modifiche necessarie per trasformare la landing page nella schermata iniziale predefinita per i nuovi visitatori, adottando l'estetica **Industrial Officina** (ardesia e arancio laser), garantendo l'accesso libero al gestionale con banner Pro, e aggiornando la ripartizione dei piani tariffari in base alle risposte fornite.

---

## 1. Obiettivi e Requisiti Chiave

1. **Prima schermata predefinita (Landing Page)**:
   - Chi visita l'applicazione per la prima volta atterra direttamente sulla **Landing Page accattivante**.
   - Dalla landing page, l'utente può:
     - **Accedere / Registrarsi**: apre l'autenticazione (`AuthModal`). Al login completato viene indirizzato alla dashboard completa.
     - **Esplora Gestionale (Accesso Libero)**: entra direttamente nel gestionale per testare il calcolatore e le funzioni con piano *Starter Free*.
     - **Attiva Piano**: avvia il checkout del piano selezionato (con gestione transizione al login se non autenticato).
2. **Stile Visivo "Industrial Officina"**:
   - Palette: **Ardesia scura / Grafite** (`#0b0f19`, `#1e293b`), griglia millimetrata e accenti CAD/blueprint sottili.
   - Colore di risalto: **Arancio Laser vivido** (`#f97316` / `#fb923c` / neon laser) per i pulsanti di conversione e gli indicatori chiave.
   - Tipografia & Contrasti: **Contrasto WCAG AA nitido**, niente scritte illeggibili sul piano centrale, titoli boldati con font tecnico moderno.
   - Elementi visivi: badge di stato officina (Tolleranza ±0.05mm, Calcolo kWh Realtime, Ammortamento CNC/FDM/Laser), indicatori di calcolo live.
3. **Banner Pro nella Dashboard**:
   - Se l'utente entra con accesso libero (piano Free) o non è ancora passato a Pro, un banner superiore sobrio ma evidente in stile officina segnala: *"Stai esplorando con il piano Starter Free (fino a 2 macchine) — Passa ad Artigiano Pro per sbloccare fino a 5 macchine e fatture PDF"*, con pulsante rapido per aprire la schermata piani.
4. **Riorganizzazione Piani di Abbonamento**:
   - **Starter Free** (0€): 2 Macchine/Impianti configurabili, 5 ricette materiali, calcolo orario base e ammortamento standard.
   - **Artigiano Pro** (Centrale in evidenza, 9,90€/mese o 99€/anno):
     - **Nome e dettagli ad altissima leggibilità** con badge "PIÙ SCELTO DAI MAKER".
     - **Fino a 5 Macchine / Impianti** (FDM, Resina, Laser CO2/Fibra, Frese CNC).
     - Ricette filamenti e resine illimitate con allarme scorte.
     - Generazione preventivi e fatture PDF intestati con logo e P.IVA.
     - Simulatore commissioni marketplace (Etsy, eBay, Vinted, Stripe, POS).
     - Calcolo ricarico corriere e imballaggio protettivo.
   - **Laboratorio Team** (24,90€/mese o 249€/anno):
     - **Macchine e Impianti ILLIMITATI** (senza alcun vincolo di numero o tecnologia).
     - Schede banco officina per operatori e collaboratori.
     - Reportistica commesse, tempi macchina e consumi multi-operatore.
     - Esportazione contabile avanzata (Excel, CSV, JSON).
     - **Rimosso totalmente**: ogni riferimento ad *"Assistenza prioritaria dedicata via WhatsApp"*.

---

## 2. Architettura dei File e Modifiche Previste

### A. `src/App.tsx`
- **Gestione stato iniziale**:
  - `isLandingPageOpen`: inizializzato a `true` se l'utente non è loggato e non ha cliccato su "Esplora Gestionale" nella sessione corrente.
  - Se l'utente è loggato, mostra direttamente la dashboard gestionale.
  - Aggiunta del banner discreto "Modalità Free: Passa a Pro per sbloccare fino a 5 macchine" in cima alla dashboard quando il piano attivo è Free.

### B. `src/components/SubscriptionLandingPage.tsx`
- **Rinnovamento Grafico Completo**:
  - Hero section in stile officina meccanica/stampa 3D: badge "Stazione di Calcolo Industriale v2.4", griglia millimetrata, bottoni arancio laser con effetto glow.
  - Navbar dedicata della landing con: Logo OFFICINACALC 3D, pulsante "Accedi / Registrati", pulsante "Esplora Gestionale Senza Registrazione".
  - Scheda **Artigiano Pro** riprogettata per garantire **massima leggibilità** del titolo, dei prezzi e dei vantaggi (sfondo scuro ad alto contrasto con bordo arancio laser).
  - Limite aggiornato: *"Fino a 5 Macchine / Impianti"* per Pro, *"Macchine & Impianti Illimitati"* per Team.
  - Eliminazione totale della menzione di WhatsApp dal piano Team.
  - Sezione interattiva di anteprima rapida del calcolo (costo materiale + energia + usura = prezzo consigliato).

### C. `src/components/Header.tsx`
- Coerenza visiva con la nuova palette ardesia e arancio laser.
- Pulsante rapido per riaprire la Landing Page / Piani qualora l'utente voglia confrontare le opzioni in qualsiasi momento.

---

## 3. Piano di Verifica e Collaudo

1. **Test Prima Visita**:
   - Apertura dell'app da utente anonimo -> visualizzazione immediata della Landing Page con stile Industrial.
2. **Test Navigazione**:
   - Clic su *"Esplora Gestionale"* -> transizione fluida alla dashboard con presenza del banner promozionale Pro.
   - Clic su *"Accedi / Registrati"* -> apertura dell'AuthModal; al login, reindirizzamento al gestionale.
3. **Verifica Piani**:
   - Piano centrale *Artigiano Pro*: verificare leggibilità del testo e presenza del limite a 5 macchine.
   - Piano *Laboratorio Team*: verificare presenza di macchine illimitate e assenza di WhatsApp.
4. **Verifica Build**:
   - Esecuzione di `lint_applet` (`tsc --noEmit`) e `compile_applet` (`npm run build`) per assicurare zero errori di compilazione e TypeScript.
