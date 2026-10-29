/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FixedCostsConfig } from '../types/calculator';
import { formatCurrency4 } from '../utils/calculatorEngine';
import { Settings, X, Check, Zap, Clock, ShieldCheck, Cpu } from 'lucide-react';

interface FixedCostsModalProps {
  config: FixedCostsConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: FixedCostsConfig) => void;
}

export const FixedCostsModal: React.FC<FixedCostsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
}) => {
  const [electricityKwhCost, setElectricityKwhCost] = useState(config.electricityKwhCost);
  const [laborHourlyRate, setLaborHourlyRate] = useState(config.laborHourlyRate);
  const [currencySymbol, setCurrencySymbol] = useState(config.currencySymbol || '€');

  useEffect(() => {
    setElectricityKwhCost(config.electricityKwhCost);
    setLaborHourlyRate(config.laborHourlyRate);
    setCurrencySymbol(config.currencySymbol || '€');
  }, [config, isOpen]);

  if (!isOpen) return null;

  const currentConfig: FixedCostsConfig = {
    ...config,
    electricityKwhCost,
    laborHourlyRate,
    currencySymbol,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modale */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Tariffe di Base del Laboratorio
              </h3>
              <p className="text-xs text-purple-100">
                Imposta la tariffa oraria per il tuo tempo e la bolletta elettrica.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Tariffe */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4 text-xs font-semibold pb-1 border-b border-slate-100">
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-3 h-3 bg-amber-200 border border-amber-400 rounded-xs"></span>
              Giallo = da compilare
            </span>
            <span className="flex items-center gap-1.5 text-sky-800">
              <span className="w-3 h-3 bg-sky-200 border border-sky-400 rounded-xs"></span>
              Azzurro = calcolato
            </span>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Le macchine sono gestite in "Parco Macchine":</strong>
              <p className="text-indigo-700 text-2xs mt-0.5">
                Qui definisci le tariffe valide per tutta l'officina: la tua paga oraria di lavoro e il costo dell'energia della tua fornitura.
              </p>
            </div>
          </div>

          {/* 1. TARIFFA MANODOPERA ARTIGIANA */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Tariffa Oraria Manodopera (€ / ora) *</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-mono text-slate-400">€</span>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={laborHourlyRate}
                onChange={(e) => setLaborHourlyRate(parseFloat(e.target.value) || 0)}
                placeholder="15.00"
                className="w-full bg-amber-50/70 border border-amber-300 rounded-xl pl-8 pr-3 py-2 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              />
            </div>
            <div className="flex justify-between items-center text-2xs text-slate-500 pt-0.5">
              <span>Quanto vuoi essere pagato all'ora per pulizia, finitura e imballo.</span>
              <span className="font-mono font-bold text-sky-800">
                {formatCurrency4(laborHourlyRate / 60)}/min
              </span>
            </div>
          </div>

          {/* 2. ENERGIA ELETTRICA BOLLETTA */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-600" />
              <span>Costo Energia Elettrica di Rete (€ / kWh) *</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-mono text-slate-400">€</span>
              <input
                type="number"
                step="0.005"
                min="0.01"
                required
                value={electricityKwhCost}
                onChange={(e) => setElectricityKwhCost(parseFloat(e.target.value) || 0)}
                placeholder="0.250"
                className="w-full bg-amber-50/70 border border-amber-300 rounded-xl pl-8 pr-3 py-2 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              />
            </div>
            <span className="text-2xs text-slate-500 block">
              Dalla bolletta elettrica (indicativo 0,20 - 0,35 €/kWh). Utilizzato per calcolare il consumo di tutti gli impianti.
            </span>
          </div>

          {/* 3. SIMBOLO VALUTA */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Simbolo Valuta
            </label>
            <input
              type="text"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-24 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900"
            />
          </div>

          {/* Bottoni Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salva Tariffe Laboratorio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
