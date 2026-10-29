/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FixedCostsConfig } from '../types/calculator';
import { formatCurrency, formatCurrency4 } from '../utils/calculatorEngine';
import { Settings, Edit2, Zap, Clock, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface FixedCostsViewProps {
  config: FixedCostsConfig;
  onOpenEditModal: () => void;
  onNavigateToMachines?: () => void;
}

export const FixedCostsView: React.FC<FixedCostsViewProps> = ({
  config,
  onOpenEditModal,
  onNavigateToMachines,
}) => {
  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header Sezione */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700">
              TARIFFE GENERALI OFFICINA
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tariffe Laboratorio (Manodopera & Energia)
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Configura la tariffa oraria per il tuo lavoro manuale e il costo dell'elettricità valido per tutte le lavorazioni.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEditModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Edit2 className="w-4 h-4" />
          <span>Modifica Tariffe nel Pop-up</span>
        </button>
      </div>

      {/* CHIARIMENTO PARCO MACCHINE VS TARIFFE LABORATORIO */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-indigo-950 block">
              Hai più stampanti 3D, laser o CNC?
            </span>
            <p className="text-indigo-800 mt-0.5">
              I singoli macchinari (costo acquisto, vita stimata e consumo in Watt) si gestiscono nella pagina dedicata <strong>"Parco Macchine"</strong>. Qui imposti solo la paga oraria del tuo tempo e la bolletta elettrica generale.
            </p>
          </div>
        </div>

        {onNavigateToMachines && (
          <button
            type="button"
            onClick={onNavigateToMachines}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>Vai al Parco Macchine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Scheda Tabellare Tariffe Generali */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Header Istruzione */}
        <div className="bg-slate-800 text-white py-3 px-6 text-center text-sm font-medium italic">
          Valori orari base applicati su tutte le ricette e i preventivi commerciali.
        </div>

        {/* Barra Legenda Colori */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-6 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-amber-800">
            <span className="w-3.5 h-3.5 bg-amber-200 border border-amber-400 rounded-xs"></span>
            ■ Giallo = da compilare
          </span>
          <span className="flex items-center gap-1.5 text-sky-800">
            <span className="w-3.5 h-3.5 bg-sky-200 border border-sky-400 rounded-xs"></span>
            ■ Azzurro = calcolato
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-sm">
          {/* SEZIONE 1: MANODOPERA ARTIGIANA */}
          <div className="bg-slate-900 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>1. TARIFFA MANODOPERA ARTIGIANA (IL TUO TEMPO)</span>
          </div>

          <div className="grid grid-cols-12 items-center p-4 sm:px-6 hover:bg-slate-50/50">
            <div className="col-span-5 font-bold text-slate-800">
              Pagamento Manodopera Oraria (€ / ora)
            </div>
            <div className="col-span-3 font-mono font-black text-slate-900 bg-amber-50/70 p-2 rounded-md text-right border border-amber-300 text-base">
              {formatCurrency(config.laborHourlyRate)}
            </div>
            <div className="col-span-4 text-slate-500 text-xs italic pl-4">
              Quanto vuoi guadagnare per ogni ora di lavoro manuale (pulizia pezzi, rimozione supporti, finitura, imballo).
            </div>
          </div>

          <div className="grid grid-cols-12 items-center p-3 sm:px-6 bg-slate-50/60">
            <div className="col-span-5 text-xs font-semibold text-slate-600">
              Costo al minuto di manodopera:
            </div>
            <div className="col-span-3 font-mono font-bold text-sky-950 bg-sky-50 p-1.5 rounded-md text-right border border-sky-200">
              {formatCurrency4(config.laborHourlyRate / 60)} / min
            </div>
            <div className="col-span-4 text-slate-400 text-2xs italic pl-4">
              Calcolato: Tariffa oraria ÷ 60 minuti.
            </div>
          </div>

          {/* SEZIONE 2: ENERGIA ELETTRICA DI RETE */}
          <div className="bg-slate-900 text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>2. ENERGIA ELETTRICA OFFICINA (BOLLETTA DI RETE)</span>
          </div>

          <div className="grid grid-cols-12 items-center p-4 sm:px-6 hover:bg-slate-50/50">
            <div className="col-span-5 font-bold text-slate-800">
              Costo energia (€ / kWh)
            </div>
            <div className="col-span-3 font-mono font-black text-slate-900 bg-amber-50/70 p-2 rounded-md text-right border border-amber-300 text-base">
              {config.electricityKwhCost.toLocaleString('it-IT', { minimumFractionDigits: 3 })} €
            </div>
            <div className="col-span-4 text-slate-500 text-xs italic pl-4">
              Costo unitario dalla bolletta energetica (indicativo 0,20 - 0,35 €/kWh). Utilizzato da tutte le macchine del parco.
            </div>
          </div>

          {/* Esempio pratico calcolo consumo */}
          <div className="p-4 bg-sky-50/80 border-t border-sky-100 flex items-center justify-between text-xs text-sky-950">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>
                <strong>Formula consumo automatico:</strong> Una stampante da 250W consuma 0,25 kW × {config.electricityKwhCost} € = <strong>{formatCurrency4(0.25 * config.electricityKwhCost)}/ora</strong>.
              </span>
            </div>
            <span className="font-mono text-2xs text-sky-700">Valuta: {config.currencySymbol || '€'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
