/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MachineItem, TechnologyType } from '../types/calculator';
import { calculateMachineHourlyRate, formatCurrency4 } from '../utils/calculatorEngine';
import { Cpu, X, Check, Layers, Flame, Palette } from 'lucide-react';

interface MachineModalProps {
  machine: MachineItem | null;
  electricityKwhCost: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (machine: MachineItem) => void;
}

export const MachineModal: React.FC<MachineModalProps> = ({
  machine,
  electricityKwhCost,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [technology, setTechnology] = useState<TechnologyType>('print3d');
  const [model, setModel] = useState('');
  const [purchaseCost, setPurchaseCost] = useState<number>(1200);
  const [estimatedLifeHours, setEstimatedLifeHours] = useState<number>(2500);
  const [powerWatts, setPowerWatts] = useState<number>(300);
  const [hourlyMaintenanceCost, setHourlyMaintenanceCost] = useState<number>(0.50);
  const [status, setStatus] = useState<MachineItem['status']>('active');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (machine) {
      setName(machine.name);
      setTechnology(machine.technology);
      setModel(machine.model || '');
      setPurchaseCost(machine.purchaseCost);
      setEstimatedLifeHours(machine.estimatedLifeHours);
      setPowerWatts(machine.powerWatts);
      setHourlyMaintenanceCost(machine.hourlyMaintenanceCost || 0);
      setStatus(machine.status);
      setNotes(machine.notes || '');
    } else {
      setName('');
      setTechnology('print3d');
      setModel('');
      setPurchaseCost(1200);
      setEstimatedLifeHours(2500);
      setPowerWatts(300);
      setHourlyMaintenanceCost(0.50);
      setStatus('active');
      setNotes('');
    }
  }, [machine, isOpen]);

  if (!isOpen) return null;

  const currentMachine: MachineItem = {
    id: machine?.id || '',
    name: name.trim(),
    technology,
    model: model.trim(),
    purchaseCost,
    estimatedLifeHours,
    powerWatts,
    hourlyMaintenanceCost,
    status,
    notes: notes.trim(),
    updatedAt: new Date().toISOString(),
  };

  const { depreciationHourly, electricityHourly, maintenanceHourly, machineCostHourly } =
    calculateMachineHourlyRate(currentMachine, electricityKwhCost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(currentMachine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modale */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {machine ? 'Modifica Macchinario' : 'Aggiungi Impianto al Parco Macchine'}
              </h3>
              <p className="text-xs text-purple-100">
                Calcola ammortamento, assorbimento elettrico e costo orario della singola macchina.
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

        {/* Form Impianto */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome Impianto / Identificativo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="es. Bambu Lab X1C #1 o Laser CO2 80W"
                className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Tecnologia Impianto
              </label>
              <select
                value={technology}
                onChange={(e) => setTechnology(e.target.value as TechnologyType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden cursor-pointer"
              >
                <option value="print3d">Stampa 3D (FDM / Resina)</option>
                <option value="laser">Incisione & Taglio Laser</option>
                <option value="cnc">Fresatura CNC</option>
                <option value="craft">Artigianato / Altro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Modello / Produttore
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="es. Thunder Nova 24 o CoreXY"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Stato Operativo
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MachineItem['status'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white cursor-pointer"
              >
                <option value="active">Attiva / In Produzione</option>
                <option value="idle">Disponibile / Standby</option>
                <option value="maintenance">In Manutenzione</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Costo Acquisto (€) *
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-400">€</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(parseFloat(e.target.value) || 0)}
                  placeholder="1400"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Vita Stimata (ore) *
              </label>
              <input
                type="number"
                step="50"
                min="1"
                required
                value={estimatedLifeHours}
                onChange={(e) => setEstimatedLifeHours(parseInt(e.target.value) || 1)}
                placeholder="3000"
                className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Potenza (Watt) *
              </label>
              <input
                type="number"
                step="10"
                min="0"
                required
                value={powerWatts}
                onChange={(e) => setPowerWatts(parseInt(e.target.value) || 0)}
                placeholder="350"
                className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Manutenzione & Usura Oraria (€/h)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs font-mono text-slate-400">€</span>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={hourlyMaintenanceCost}
                  onChange={(e) =>
                    setHourlyMaintenanceCost(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.50"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-mono text-slate-900 focus:bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block italic">
                Ugelli, cinghie, tubo laser o frese
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Note Tecniche / Area di Lavoro
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="es. Piatto 256x256x256mm, ugello 0.4 hardened..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:bg-white"
              />
            </div>
          </div>

          {/* BOX AZZURRO: CALCOLO ORARIO MACCHINA AUTOMATICO */}
          <div className="p-4 bg-sky-50 border-2 border-sky-300 rounded-xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-sky-900 block">
              CALCOLI AUTOMATICI COSTO ORARIO
            </span>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white/90 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Ammortamento</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency4(depreciationHourly)}/h
                </span>
              </div>

              <div className="bg-white/90 p-2 rounded-lg border border-sky-200">
                <span className="text-[10px] text-slate-500 block">Energia ({electricityKwhCost}€/kWh)</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency4(electricityHourly)}/h
                </span>
              </div>

              <div className="bg-sky-100 p-2 rounded-lg border-2 border-sky-400">
                <span className="text-[10px] font-bold text-sky-900 block">TOTALE ORARIO</span>
                <span className="font-mono font-black text-sky-950 text-sm">
                  {formatCurrency4(machineCostHourly)}/h
                </span>
              </div>
            </div>
          </div>

          {/* Bottoni Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salva nel Parco Macchine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
