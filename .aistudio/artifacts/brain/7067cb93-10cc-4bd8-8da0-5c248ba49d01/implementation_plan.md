# Calcolatore Prezzi Artigiani Digitali (Stampa 3D, Laser, CNC)

Applicazione web professionale ispirata alle specifiche del manuale operativo *Calcolatore_Artigiani_Digitali.xlsx*, progettata per maker, studi di prototipazione rapida e artigiani digitali. Consente di calcolare in modo trasparente costi di produzione (materiali, manodopera, ammortamento e spese generali), margini di profitto, soglie sconto B2B/ingrosso e prezzi al dettaglio, con archiviazione commesse ed esportazione preventivi stampabili.

## User Review & Critical Decisions

> [!IMPORTANT]
> Le scelte chiave sono state confermate in base alle tue risposte:
> 1. **Motore di calcolo**: Formula universale del manuale integrata con **moduli dedicati per Stampa 3D (FDM/Resina), Taglio/Incisione Laser e Fresatura CNC** per stimare automaticamente grammature, usura utensili, consumo energetico e tempi macchina.
> 2. **Gestione commesse**: **Archivio preventivi completo** con anagrafica clienti, codice commessa, note di lavorazione, duplicazione e salvataggio locale persistente.
> 3. **Design System**: **Tema chiaro professionale in stile gestionale tecnico** (lavagna pulita, griglie dati ad alta densità con cifre tabulari, celle di input evidenziate in grigio morbido conformi al manuale Excel, stato di convalida in tempo reale).

- **Convalida Dati in Tempo Reale**: Indicatore di stato conforme al manuale ("PRONTO" in verde, avviso di divisione per zero se il volume è 0, blocco su valori non numerici, allarme margine negativo se il prezzo supera i vincoli di mercato).
- **Esportazione & Documentazione**: Generazione istantanea di preventivo cliente formattato e pronto per la stampa/PDF, oltre alla copia rapida del computo metrico.

---

## 1. Overview & Core Concept

- **Cosa fa l'applicazione**:
  - Implementa la metodologia di costo **bottom-up**: `Costo di Base = Costo Materiali + Lavoro Diretto + Spese Generali / Volume`.
  - Calcola automaticamente i tre livelli di prezzo cardine definiti nel manuale:
    1. **Costo di Base (Break-even)**: Soglia minima di pareggio economico.
    2. **Prezzo All'Ingrosso (Wholesale/B2B)**: Calcolato applicando la soglia di sconto massima consentita salvaguardando il margine di sicurezza.
    3. **Prezzo Finale (Retail / Consigliato al Dettaglio)**: Costo di Base + Margine Target desiderato (`Prezzo = Costo / (1 - Margine%)` o Markup secondo preferenza).
  - Include calcolatori parametrici ausiliari specifici:
    - **Stampa 3D (FDM / Resina)**: Grammi filamento/ml resina, costo bobina/bottiglia, usura ugello/FEP, consumo elettrico kWh, tempo di stampa e post-produzione (rimozione supporti, cura UV, carteggiatura).
    - **Incisione e Taglio Laser**: Materiale grezzo (lastre compensato, acrilico, cuoio, alluminio), tempo laser, usura tubo laser/lente CO2/Diodo, consumo aspiratore e aria assistita.
    - **Fresatura CNC**: Dimensioni stock/blocco, tempo di lavorazione mandrino, usura frese/utensili, lubrificante/refrigerante, tempo di piazzamento e staffaggio.
- **Destinatari**: Maker, fablab, artigiani digitali, laboratori di prototipazione, studi grafici e piccole officine manifatturiere.
- **Valore aggiunto**: Elimina il rischio di sottocosto, tiene conto delle spese generali e dell'energia reale, genera preventivi commerciali chiari e tiene traccia dei clienti.

---

## 2. User Experience & Visual Design

### Flussi Utente Principali
1. **Configurazione Commessa & Cliente**: Inserimento cliente (nome, email, telefono, P.IVA/CF facoltativo), nome progetto e tecnologia selezionata (Generica, Stampa 3D, Laser, CNC).
2. **Inserimento Costi (Input Dati - Celle Grigie)**:
   - Sezione diretta o tramite assistente parametri tecnici (grammi, minuti, potenza macchinario).
   - Costo Materiali (€), Tariffa oraria (€/h) e Ore di Lavoro, Spese Generali (€) e Volume di produzione previsto (pz).
3. **Impostazione Margini & Sconti**:
   - Margine di Profitto desiderato (%) con slider rapido e input numerico.
   - Soglia massima di sconto consentita per rivenditori o partner B2B (%).
4. **Verifica Stato & Risultati (Dashboard)**:
   - Cella "Stato Convalida" dinamica ("PRONTO" / "ATTENZIONE").
   - Matrice dei tre prezzi (Costo Base, Wholesale B2B, Retail Finale) con scomposizione grafica della torta dei costi e margini unitari.
5. **Salvataggio & Esportazione**:
   - Salvataggio rapido nella cronologia preventivi.
   - Anteprima preventivo formale con pulsante stampa diretta / esporta PDF e pulsante esportazione dati.

### Visual Identity & Theme (Stile Gestionale Tecnico Chiaro)
- **Palette Colori**:
  - Sfondo principale neutro: `#F8FAFC` (Slate 50) e superfici card `#FFFFFF` (Bianco puro).
  - Celle di input conformi alla documentazione: sfondo grigio chiaro `#F1F5F9` con bordo distinto e focus ring blu zaffiro `#2563EB`.
  - Accenti di stato: Verde smeraldo `#16A34A` per stato `PRONTO`, Ambra `#D97706` per avvisi di margine stretto, Rosso cremisi `#DC2626` per errori di divisione per zero.
  - Testo e titoli: `#0F172A` (Slate 900) e secondario `#475569` (Slate 600).
- **Tipografia**:
  - Intestazioni e interfaccia: *Plus Jakarta Sans* pulita e moderna.
  - Cifre e valori finanziari: `tabular-nums font-mono` per evitare oscillazioni e allineare perfettamente i decimali.
- **Disciplina Anti-Slop**:
  - Nessuna pillola superflua o badge decorativi vuoti.
  - Layout ad alta densità con etichette chiare e descrizioni tooltip conformi al testo del manuale.
  - Indicatori di stato legati a dati reali di convalida.

---

## 3. Key Product Decisions & Trade-Offs

- **Formula Margine vs Ricarico (Markup)**:
  - *Scelta*: Implementazione della formula classica del margine commerciale sul venduto: `Prezzo Retail = Costo Base / (1 - Margine%)` con toggle opzionale per il Markup sul costo `Costo Base * (1 + Ricarico%)`, spiegando chiaramente la differenza all'artigiano per non erodere i profitti.
  - *Perché*: Gli artigiani confondono frequentemente margine e ricarico; offrire entrambi i riferimenti elimina errori fatali di pricing.
- **Moduli Parametrici Integrati**:
  - *Scelta*: I moduli 3D, Laser e CNC compilano automaticamente i tre campi madre del manuale (Costo Materiali, Lavoro Diretto, Spese Generali e Macchina).
  - *Perché*: Mantiene la fedeltà al foglio di calcolo madre, aggiungendo precisione alle specificità dei processi digitali.
- **Persistenza Dati Locale (LocalStorage)**:
  - *Scelta*: Memorizzazione reattiva delle commesse, impostazioni predefinite di laboratorio e anagrafica clienti nel `localStorage` del browser, con funzione di backup/ripristino JSON.
  - *Perché*: Funziona istantaneamente offline senza costringere a login cloud o configurazioni esterne, ideale per officine e fablab.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App.tsx (Root Workspace)                         │
├────────────────────┬───────────────────────────────────────────────────┤
│ Top Bar            │ Titolo "Calcolatore Artigiani Digitali"           │
│                    │ Tab: Calcolatore | Archivio Preventivi | Impostaz.│
├────────────────────┴───────────────────────────────────────────────────┤
│                                                                        │
│ ┌──────────────────────────────────────┐ ┌───────────────────────────┐ │
│ │ Input Section (Scheda Dati di Input) │ │ Dashboard Risultati       │ │
│ │ • Info Commessa & Cliente            │ │ • Stato Convalida: PRONTO │ │
│ │ • Selettore Modalità (Base / 3D /    │ │ • Matrice Prezzi:         │ │
│ │   Laser / CNC)                       │ │   - Costo Base Unitario   │ │
│ │ • Celle di Input (Grigie):           │ │   - Break-even Point      │ │
│ │   - Costo Materiali (€)              │ │   - Prezzo All'Ingrosso   │ │
│ │   - Lavoro Diretto (€/h x ore)       │ │   - Prezzo Retail Dettaglio│ │
│ │   - Spese Generali & Volume pz       │ │ • Grafico / Breakdown     │ │
│ │   - Margine Target (%)               │ │ • Esporta PDF / Salva     │ │
│ │   - Soglia Sconto (%)                │ │                           │ │
│ └──────────────────────────────────────┘ └───────────────────────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Archivio Commesse & Preventivi Salvati                             │ │
│ │ • Ricerca per cliente / tecnologia / data                          │ │
│ │ • Carica nel calcolatore, Duplica, Anteprima Stampa, Elimina       │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Struttura Modelli Dati
- `CraftType`: `'generic' | 'print3d' | 'laser' | 'cnc'`
- `PricingInputs`: Materiali, Ore lavoro, Tariffa oraria, Spese generali, Volume produzione, Margine target, Soglia sconto.
- `TechSpecificParameters`:
  - 3D: Peso (g), Costo bobina (€/kg), Consumo energetico (W), Usura/Ammortamento (€/h), Tempo slicing (h/min), Post-processing (min).
  - Laser: Costo semilavorato (€/foglio o pezzo), Tempo incisione/taglio (min), Potenza laser (W), Usura tubo/lente (€/h).
  - CNC: Costo blocco materiale (€), Tempo mandrino (min), Usura utensili/frese (€), Tempo staffaggio/azzeramento (min).
- `QuoteRecord`: Id univoco, codice commessa (es. `PRV-2026-001`), cliente, data creazione, parametri tecnici, risultati calcolati, note, stato (Bozza, Inviato, Approvato, Rifiutato).

### Fasi di Realizzazione
1. **Configurazione & Base**: Setup utility matematiche di calcolo, formattazione valuta euro, validatori anti-divisione per zero conformi al manuale.
2. **Componente Input & Moduli Specifici**: Maschera dati input conforme con celle grigio chiaro, selettore moduli 3D / Laser / CNC con auto-compilazione.
3. **Dashboard di Calcolo in Tempo Reale**: Box stato "PRONTO", matrici prezzi, scomposizione visiva del prezzo finale.
4. **Archivio Preventivi & Modale Anteprima Stampa**: Gestione completa storico, anagrafica clienti e stampa/PDF con layout preventivo aziendale pulito.
5. **Verifica & Rifinitura**: Verifica WCAG AA, conformità Tailwind v4, test dei calcoli con i dati d'esempio del manuale (€15,50 materiali, €22,00 lavoro, €4,25 spese generali, 35% margine, 10% sconto).
