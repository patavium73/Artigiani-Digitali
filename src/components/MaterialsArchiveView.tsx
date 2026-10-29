/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaterialCategory, MaterialItem } from '../types/calculator';
import { formatCurrency, formatCurrency4 } from '../utils/calculatorEngine';
import {
  Box,
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Flame,
  Cpu,
  Package,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Archive,
} from 'lucide-react';

interface MaterialsArchiveViewProps {
  materials: MaterialItem[];
  onOpenAddModal: () => void;
  onEditMaterial: (mat: MaterialItem) => void;
  onDeleteMaterial: (id: string) => void;
  onReplenishMaterialStock: (id: string, amount: number) => void;
}

export const MaterialsArchiveView: React.FC<MaterialsArchiveViewProps> = ({
  materials,
  onOpenAddModal,
  onEditMaterial,
  onDeleteMaterial,
  onReplenishMaterialStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState<boolean>(false);

  // Calcolo statistiche magazzino & sotto-scorta
  const lowStockItems = materials.filter(
    (m) => m.stockQuantity !== undefined && m.stockQuantity <= (m.minStockThreshold || 0)
  );

  const filtered = materials.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesLowStock = !filterLowStockOnly || (m.stockQuantity !== undefined && m.stockQuantity <= (m.minStockThreshold || 0));
    return matchesSearch && matchesCat && matchesLowStock;
  });

  const getCategoryBadge = (category: MaterialCategory) => {
    switch (category) {
      case 'Filamento':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Filamento 3D
          </span>
        );
      case 'Legno':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Legno / Pannello
          </span>
        );
      case 'Plastica':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Box className="w-3.5 h-3.5 text-sky-600" />
            Plastica / Acrilico
          </span>
        );
      case 'Accessorio':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            Accessorio / Viti
          </span>
        );
      case 'Imballaggio':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            Imballaggio
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Intestazione e Azioni Magazzino */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                  MAGAZZINO & GIACENZE
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {materials.length} Materiali Registrati
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Archivio Materiali, Scorte & Prezzi Unitari
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Monitora giacenze fisiche, allarmi sotto-scorta e costo unitario calcolato automaticamente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nuovo Materiale</span>
            </button>
          </div>
        </div>

        {/* ALLARME SOTTO-SCORTA PROMINENTE (Se presenti articoli con scorta bassa) */}
        {lowStockItems.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-sm">
                  Attenzione: {lowStockItems.length} materiali sotto la soglia minima di sicurezza!
                </h4>
                <p className="text-xs text-amber-800">
                  {lowStockItems.map((m) => `${m.name} (${m.stockQuantity} ${m.unit})`).join(', ')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              {filterLowStockOnly ? 'Mostra Tutti i Materiali' : 'Mostra Solo Sotto-Scorta'}
            </button>
          </div>
        )}

        {/* Legenda Colori conforme allo Screenshot 2 */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-amber-800">
              <span className="w-3.5 h-3.5 bg-amber-200 border border-amber-400 rounded-xs"></span>
              Giallo = da compilare (Costo e Quantità confezione)
            </span>
            <span className="flex items-center gap-1.5 font-bold text-sky-800">
              <span className="w-3.5 h-3.5 bg-sky-200 border border-sky-400 rounded-xs"></span>
              Azzurro = calcolato (Costo Unitario al grammo, m² o pezzo)
            </span>
          </div>

          <div className="text-slate-500 text-xs">
            Le modifiche al magazzino si propagano in tempo reale a tutte le distinte e ordini.
          </div>
        </div>
      </div>

      {/* Barra Ricerca e Filtri Categoria */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca filamento, pannello, acrilico..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'Filamento', 'Legno', 'Plastica', 'Accessorio', 'Imballaggio'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tutti i Materiali' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabella Magazzino con Giacenze e Allarmi */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Materiale</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4 text-right bg-slate-800">Costo Conf. (€)</th>
                <th className="py-3 px-4 text-right bg-slate-800">Q.tà Conf.</th>
                <th className="py-3 px-4 text-center bg-slate-800">Unità</th>
                <th className="py-3 px-4 text-right bg-sky-900 text-sky-100">
                  Costo Unitario (€)
                </th>
                <th className="py-3 px-4 text-center bg-slate-800">Giacenza a Scaffale</th>
                <th className="py-3 px-4 text-center">Stato Scorta</th>
                <th className="py-3 px-4 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((mat) => {
                const stock = mat.stockQuantity ?? 0;
                const threshold = mat.minStockThreshold ?? 0;
                const isOutOfStock = stock <= 0;
                const isLowStock = !isOutOfStock && stock <= threshold;

                return (
                  <tr key={mat.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-slate-950">
                      <div>{mat.name}</div>
                      {mat.notes && (
                        <div className="text-2xs text-slate-400 font-normal italic mt-0.5">
                          {mat.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {getCategoryBadge(mat.category)}
                    </td>

                    {/* Celle Gialle (da compilare) */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 bg-amber-50/30">
                      {formatCurrency(mat.cost)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 bg-amber-50/30">
                      {mat.packageQuantity.toLocaleString('it-IT')}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 bg-amber-50/30">
                      {mat.unit}
                    </td>

                    {/* Cella Azzurra (Calcolo Automatico) */}
                    <td className="py-3.5 px-4 text-right font-mono font-black text-sky-950 bg-sky-50 border-x border-sky-100">
                      {formatCurrency4(mat.unitCost)} / {mat.unit}
                    </td>

                    {/* Giacenza Attuale */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-base font-black">
                          {stock.toLocaleString('it-IT')}
                        </span>
                        <span className="text-xs text-slate-500 font-normal">{mat.unit}</span>
                      </div>
                      <div className="text-2xs text-slate-400">
                        Soglia min: {threshold.toLocaleString('it-IT')} {mat.unit}
                      </div>
                    </td>

                    {/* Badge Stato Scorta */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          Esaurito
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Sotto Scorta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Disponibile
                        </span>
                      )}
                    </td>

                    {/* Azioni: Rifornisci, Modifica, Elimina */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onReplenishMaterialStock(mat.id, mat.packageQuantity)}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title={`Aggiungi +${mat.packageQuantity} ${mat.unit} alla giacenza`}
                        >
                          <RefreshCw className="w-3 h-3 text-emerald-600" />
                          <span>+{mat.packageQuantity} {mat.unit}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditMaterial(mat)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Modifica Materiale"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteMaterial(mat.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Elimina Materiale"
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
