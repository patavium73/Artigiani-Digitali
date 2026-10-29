/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MaterialCategory, MaterialItem, UnitType } from '../types/calculator';
import { formatCurrency4 } from '../utils/calculatorEngine';
import { Box, X, Check, Sparkles } from 'lucide-react';

interface MaterialModalProps {
  material: MaterialItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: MaterialItem) => void;
}

const CATEGORIES: MaterialCategory[] = [
  'Filamento',
  'Resina',
  'Legno',
  'Plastica',
  'Metallo',
  'Accessorio',
  'Imballaggio',
  'Altro',
];

const UNITS: { label: string; value: UnitType }[] = [
  { label: 'Grammi (g) - Filamento 3D', value: 'g' },
  { label: 'Metri Quadri (m²) - Lastre e Pannelli', value: 'm²' },
  { label: 'Pezzi (pz) - Minuteria e Imballi', value: 'pz' },
  { label: 'Millilitri (ml) - Resina liquida', value: 'ml' },
];

export const MaterialModal: React.FC<MaterialModalProps> = ({
  material,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Filamento');
  const [cost, setCost] = useState<number>(22.0);
  const [packageQuantity, setPackageQuantity] = useState<number>(1000);
  const [unit, setUnit] = useState<UnitType>('g');
  const [stockQuantity, setStockQuantity] = useState<number>(1000);
  const [minStockThreshold, setMinStockThreshold] = useState<number>(200);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (material) {
      setName(material.name);
      setCategory(material.category);
      setCost(material.cost);
      setPackageQuantity(material.packageQuantity);
      setUnit(material.unit);
      setStockQuantity(material.stockQuantity ?? 1000);
      setMinStockThreshold(material.minStockThreshold ?? 200);
      setNotes(material.notes || '');
    } else {
      setName('');
      setCategory('Filamento');
      setCost(22.0);
      setPackageQuantity(1000);
      setUnit('g');
      setStockQuantity(1000);
      setMinStockThreshold(200);
      setNotes('');
    }
  }, [material, isOpen]);

  if (!isOpen) return null;

  // Calcolo automatico in tempo reale (evidenziato in azzurro come nello Screenshot 2)
  const computedUnitCost =
    packageQuantity > 0 ? cost / packageQuantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: material?.id || '',
      name: name.trim(),
      category,
      cost,
      packageQuantity,
      unit,
      unitCost: computedUnitCost,
      stockQuantity,
      minStockThreshold,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modale */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {material ? 'Modifica Materiale' : 'Nuovo Materiale nel Magazzino'}
              </h3>
              <p className="text-xs text-blue-100">
                Inserisci costo e quantità. Il costo unitario è automatico.
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

        {/* Form Inserimento */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Nome Materiale *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. Bobina PLA Nero 1.75mm o Pannello Betulla 3mm"
              className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
            <p className="text-[11px] text-amber-800 mt-1">
              ■ Giallo = Campo da compilare per l'archivio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Tipologia / Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Unità di Misura
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
              >
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Costo Acquisto Confezione (€) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-mono text-slate-400">€</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={cost}
                  onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                  placeholder="22.00"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-lg pl-8 pr-3 py-2 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Quantità nella Confezione ({unit}) *
              </label>
              <input
                type="number"
                step="any"
                min="0.001"
                required
                value={packageQuantity}
                onChange={(e) => setPackageQuantity(parseFloat(e.target.value) || 0)}
                placeholder="1000"
                className="w-full bg-amber-50/60 border border-amber-300 rounded-lg px-3.5 py-2 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* BOX AZZURRO: CALCOLO AUTOMATICO COSTO UNITARIO */}
          <div className="p-4 bg-sky-50 border-2 border-sky-300 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                ■ Azzurro = Costo Unitario Calcolato Automaticamente
              </span>
              <p className="text-xs text-sky-700 mt-0.5">
                Formula: Costo Confezione ÷ Quantità
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg sm:text-xl font-black font-mono text-sky-950 block">
                {formatCurrency4(computedUnitCost)} / {unit}
              </span>
            </div>
          </div>

          {/* GESTIONE GIACENZA & SOTTO-SCORTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 uppercase tracking-wider">
                Giacenza Attuale a Magazzino ({unit})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseFloat(e.target.value) || 0)}
                placeholder="1000"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <span className="text-2xs text-slate-500 mt-0.5 block">
                Quantità fisica attualmente presente in officina
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 uppercase tracking-wider">
                Soglia Minima Sotto-Scorta ({unit})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(parseFloat(e.target.value) || 0)}
                placeholder="200"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <span className="text-2xs text-slate-500 mt-0.5 block">
                Genera un allarme visivo quando la scorta scende sotto
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Note & Specifiche Fornitore
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="es. Spool 1kg, Lastra protetta, Per oggettistica promozionale..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
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
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salva nel Magazzino</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
