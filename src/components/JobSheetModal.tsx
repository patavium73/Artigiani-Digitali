/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  OrderItem,
  ProductRecipe,
  MaterialItem,
  MachineItem,
  WorkshopSettings,
} from '../types/calculator';
import {
  Printer,
  X,
  Wrench,
  Layers,
  Cpu,
  Clock,
  CheckSquare,
  Package,
  Calendar,
  User,
  AlertTriangle,
  Scale,
} from 'lucide-react';

interface JobSheetModalProps {
  order: OrderItem;
  recipe?: ProductRecipe;
  materials: MaterialItem[];
  machines: MachineItem[];
  settings: WorkshopSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const JobSheetModal: React.FC<JobSheetModalProps> = ({
  order,
  recipe,
  materials,
  machines,
  settings,
  isOpen,
  onClose,
}) => {
  // Checklist interattiva per l'operatore al banco
  const [checklist, setChecklist] = useState({
    materialsPicked: false,
    machineSetup: false,
    jobCompleted: false,
    postProcessing: false,
    qualityCheck: false,
    packagingReady: false,
  });

  const [operatorNotes, setOperatorNotes] = useState('');
  const [operatorName, setOperatorName] = useState(settings.artisanName || 'Operatore');

  if (!isOpen) return null;

  // Trova la macchina assegnata
  const assignedMachine = machines.find((m) => m.id === order.machineId || m.id === recipe?.machineId);

  // Calcola i materiali necessari per l'ordine
  const materialsToPick = (recipe?.materialsUsed || []).map((mu) => {
    const totalNeeded = mu.quantityUsed * order.quantity;
    const inventoryItem = materials.find((m) => m.id === mu.materialId);
    const available = inventoryItem ? inventoryItem.stockQuantity : 0;
    const isShortage = available < totalNeeded;

    return {
      ...mu,
      totalNeeded,
      currentStock: available,
      isShortage,
      missing: isShortage ? totalNeeded - available : 0,
    };
  });

  // Calcola ore macchina totali e minuti manodopera totali
  const totalMachineHours = recipe ? (recipe.machineHours * order.quantity).toFixed(1) : '—';
  const totalLaborMinutes = recipe ? recipe.laborMinutes * order.quantity : 0;
  const laborHours = Math.floor(totalLaborMinutes / 60);
  const laborMins = totalLaborMinutes % 60;
  const totalLaborText =
    laborHours > 0 ? `${laborHours}h ${laborMins}m` : `${laborMins} minuti`;

  const handlePrint = () => {
    window.print();
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Barra Comandi Modal (Nascosta in Stampa) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                Scheda di Lavorazione Officina (Job Sheet)
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  {order.code}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Modulo esecutivo per il banco di lavoro con specifiche tecniche e lista prelievo magazzino.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Stampa Scheda Banco / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENUTO SCHEDA OFFICINA (Ottimizzato per A4 e Stampa) */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 print:p-4 print:space-y-4">
          
          {/* Intestazione Aziendale & Dati Commessa */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                OFFICINA DIGITALE · COMMESSA DI PRODUZIONE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-0.5">
                {order.title || order.recipeName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Cliente: {order.client.name} {order.client.company ? `(${order.client.company})` : ''}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Data: {new Date(order.createdAt).toLocaleDateString('it-IT')}
                </span>
                <span>·</span>
                <span>Consegna entro: {order.deliveryDays || 5} giorni lav.</span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
              <div className="text-xs uppercase font-extrabold text-slate-400">Codice Lavoro</div>
              <div className="text-2xl font-black font-mono text-slate-950">{order.code}</div>
              <div className="mt-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-slate-100 text-slate-800 border border-slate-300">
                  Q.TÀ: {order.quantity} PEZZI
                </span>
              </div>
            </div>
          </div>

          {/* Griglia Macchina Assegnata e Tempi Operativi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Cpu className="w-4 h-4 text-blue-600" />
                Impianto Assegnato
              </div>
              <div className="text-base font-black text-slate-900">
                {assignedMachine ? assignedMachine.name : (order.machineName || 'Impianto Standard')}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {assignedMachine ? `Modello: ${assignedMachine.model} · Potenza: ${assignedMachine.powerWatts}W` : 'Macchina predefinita da impostazioni'}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                Tempo Macchina Previsto
              </div>
              <div className="text-base font-black text-slate-900">
                {totalMachineHours} ore totali
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {recipe ? `${recipe.machineHours}h per singolo pezzo × ${order.quantity} pz` : '—'}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                <Wrench className="w-4 h-4 text-emerald-600" />
                Manodopera / Post-Produzione
              </div>
              <div className="text-base font-black text-slate-900">
                {totalLaborText}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {recipe ? `${recipe.laborMinutes} min/pz per finitura, controllo e imballo` : '—'}
              </div>
            </div>
          </div>

          {/* Parametri Tecnici di Lavorazione (G-Code, Laser, CNC) */}
          {recipe?.technicalSpecs && Object.values(recipe.technicalSpecs).some(Boolean) && (
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-700" />
                Parametri Tecnici di Settaggio
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {recipe.technicalSpecs.layerHeightMm && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                    <span className="text-slate-500 block">Altezza Layer:</span>
                    <span className="font-bold font-mono text-slate-900">{recipe.technicalSpecs.layerHeightMm} mm</span>
                  </div>
                )}
                {recipe.technicalSpecs.infillPercent && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                    <span className="text-slate-500 block">Riempimento (Infill):</span>
                    <span className="font-bold font-mono text-slate-900">{recipe.technicalSpecs.infillPercent}%</span>
                  </div>
                )}
                {recipe.technicalSpecs.nozzleSizeMm && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                    <span className="text-slate-500 block">Ugello (Nozzle):</span>
                    <span className="font-bold font-mono text-slate-900">Ø {recipe.technicalSpecs.nozzleSizeMm} mm</span>
                  </div>
                )}
                {recipe.technicalSpecs.laserPowerPercent && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                    <span className="text-slate-500 block">Potenza Laser:</span>
                    <span className="font-bold font-mono text-slate-900">{recipe.technicalSpecs.laserPowerPercent}%</span>
                  </div>
                )}
                {recipe.technicalSpecs.laserSpeedMmSec && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                    <span className="text-slate-500 block">Velocità Laser:</span>
                    <span className="font-bold font-mono text-slate-900">{recipe.technicalSpecs.laserSpeedMmSec} mm/s</span>
                  </div>
                )}
                {recipe.technicalSpecs.cncFeedRateMmMin && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                    <span className="text-slate-500 block">Avanzamento CNC:</span>
                    <span className="font-bold font-mono text-slate-900">{recipe.technicalSpecs.cncFeedRateMmMin} mm/min</span>
                  </div>
                )}
                {recipe.technicalSpecs.cncToolProfile && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-100 col-span-2">
                    <span className="text-slate-500 block">Fresa / Utensile:</span>
                    <span className="font-bold text-slate-900">{recipe.technicalSpecs.cncToolProfile}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LISTA PRELIEVO MATERIALI (PICK-LIST MAGAZZINO) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                Distinta Base Prelievo Magazzino ({materialsToPick.length} Materiali)
              </h3>
              <span className="text-xs text-slate-500 italic">
                Verificare la disponibilità fisica prima di avviare il macchinario
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold uppercase text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3">Verifica</th>
                    <th className="py-2.5 px-3">Materiale da Prelevare</th>
                    <th className="py-2.5 px-3 text-right">Dose / Pezzo</th>
                    <th className="py-2.5 px-3 text-right bg-amber-50 text-amber-900">
                      Totale da Prelevare
                    </th>
                    <th className="py-2.5 px-3 text-right">Giacenza a Scaffale</th>
                    <th className="py-2.5 px-3 text-center">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {materialsToPick.length > 0 ? (
                    materialsToPick.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-center w-12">
                          <div className="w-4 h-4 border-2 border-slate-400 rounded-xs mx-auto"></div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {item.materialName}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {item.quantityUsed} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-950 bg-amber-50/50">
                          {item.totalNeeded.toLocaleString('it-IT')} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                          {item.currentStock.toLocaleString('it-IT')} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {item.isShortage ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-extrabold bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              Mancano {item.missing.toLocaleString('it-IT')} {item.unit}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-100 text-emerald-800">
                              Disponibile
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-3 px-3 text-center text-slate-400 italic">
                        Nessun materiale specificato nella distinta.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dati Spedizione & Imballo Suggeriti */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="font-extrabold text-slate-900">Dati Pesi & Spedizione: </span>
                <span className="text-slate-600">
                  Peso Netto: <strong className="text-slate-900">{order.totalMaterialWeightGrams}g</strong> · Imballo: <strong className="text-slate-900">{order.totalPackagingWeightGrams}g</strong> · Lordo: <strong className="text-slate-900">{order.totalGrossWeightKg} kg</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Fascia Corriere Suggerita:</span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-mono font-black text-xs">
                {order.suggestedCourierBracket || '0-1 kg'}
              </span>
            </div>
          </div>

          {/* CHECKLIST CONTROLLO QUALITÀ OPERATORE */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              Checklist Fasi di Produzione & Controllo Qualità
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'materialsPicked', label: '1. Prelievo & controllo materiali a magazzino' },
                { key: 'machineSetup', label: '2. Azzeramento assi, calibrazione e avvio programma' },
                { key: 'jobCompleted', label: '3. Completamento ciclo macchina & distacco pezzo' },
                { key: 'postProcessing', label: '4. Post-produzione, rimozione supporti o sbavatura' },
                { key: 'qualityCheck', label: '5. Controllo dimensionale, finitura estetica e pesatura' },
                { key: 'packagingReady', label: '6. Imballaggio protettivo e applicazione etichetta' },
              ].map((step) => {
                const isChecked = checklist[step.key as keyof typeof checklist];
                return (
                  <div
                    key={step.key}
                    onClick={() => toggleCheck(step.key as keyof typeof checklist)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer select-none ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center font-bold ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && '✓'}
                    </div>
                    <span className={`font-semibold ${isChecked ? 'line-through text-emerald-800' : ''}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Note Operatore e Firma / Firma Consegna */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Note Officina & Anomalie Riscontrate
              </label>
              <textarea
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="Eventuali note su tolleranze, regolazioni ugello o modifiche G-code..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col justify-between border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase">Operatore al Banco:</span>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
                <span>Firma Operatore: _______________________</span>
                <span>Data Lavorazione: ____/____/2026</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
