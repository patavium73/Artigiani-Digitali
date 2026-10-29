/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MachineItem, TechnologyType } from '../types/calculator';
import {
  calculateMachineHourlyRate,
  formatCurrency,
  formatCurrency4,
} from '../utils/calculatorEngine';
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Flame,
  Palette,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface MachinesViewProps {
  machines: MachineItem[];
  electricityKwhCost: number;
  onOpenAddModal: () => void;
  onEditMachine: (machine: MachineItem) => void;
  onDeleteMachine: (id: string) => void;
}

export const MachinesView: React.FC<MachinesViewProps> = ({
  machines,
  electricityKwhCost,
  onOpenAddModal,
  onEditMachine,
  onDeleteMachine,
}) => {
  const getTechBadge = (type: TechnologyType) => {
    switch (type) {
      case 'print3d':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Stampa 3D
          </span>
        );
      case 'laser':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Laser
          </span>
        );
      case 'cnc':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            CNC
          </span>
        );
      case 'craft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Palette className="w-3.5 h-3.5 text-rose-600" />
            Artigianato
          </span>
        );
    }
  };

  const getStatusBadge = (status: MachineItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Attiva
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Manutenzione
          </span>
        );
      case 'idle':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
            Disponibile
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Intestazione Parco Macchine */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700">
                PARCO MACCHINE MULTIPLO
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">
                {machines.length} Impianti Censiti
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Gestione Impianti & Tariffe Orarie Macchina
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Associa ciascun lavoro alla sua macchina specifica. Ammortamento, usura e consumi in kWh vengono calcolati al centesimo.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuova Macchina / Impianto</span>
        </button>
      </div>

      {/* Tabella Parco Macchine */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Impianto / Macchinario</th>
                <th className="py-3 px-4">Tecnologia</th>
                <th className="py-3 px-4 text-right bg-slate-800">Costo Acquisto</th>
                <th className="py-3 px-4 text-right bg-slate-800">Vita Utile</th>
                <th className="py-3 px-4 text-right bg-slate-800">Potenza</th>
                <th className="py-3 px-4 text-right bg-sky-900 text-sky-100">Ammort. / h</th>
                <th className="py-3 px-4 text-right bg-sky-900 text-sky-100">Energia / h</th>
                <th className="py-3 px-4 text-right bg-sky-950 text-white">Costo Tot. Orario</th>
                <th className="py-3 px-4 text-center">Stato</th>
                <th className="py-3 px-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {machines.map((mac) => {
                const { depreciationHourly, electricityHourly, machineCostHourly } =
                  calculateMachineHourlyRate(mac, electricityKwhCost);

                return (
                  <tr key={mac.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-950">{mac.name}</div>
                      {mac.model && (
                        <div className="text-xs text-slate-500">{mac.model}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getTechBadge(mac.technology)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 bg-amber-50/30 whitespace-nowrap">
                      {formatCurrency(mac.purchaseCost)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 bg-amber-50/30 whitespace-nowrap">
                      {mac.estimatedLifeHours.toLocaleString('it-IT')} h
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 bg-amber-50/30 whitespace-nowrap">
                      {mac.powerWatts} W
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-sky-950 bg-sky-50 whitespace-nowrap">
                      {formatCurrency4(depreciationHourly)}/h
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-sky-950 bg-sky-50 whitespace-nowrap">
                      {formatCurrency4(electricityHourly)}/h
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-sky-950 bg-sky-100/70 whitespace-nowrap text-base">
                      {formatCurrency4(machineCostHourly)}/h
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(mac.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditMachine(mac)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Modifica Impianto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteMachine(mac.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Elimina Macchinario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
