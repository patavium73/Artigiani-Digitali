/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FixedCostsConfig,
  MaterialItem,
  ProductRecipe,
  TechnologyType,
} from '../types/calculator';
import {
  calculateRecipeCosts,
  formatCurrency,
  formatPercent,
} from '../utils/calculatorEngine';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Flame,
  Cpu,
  Palette,
  ShoppingCart,
  AlertTriangle,
  Settings,
  Sparkles,
} from 'lucide-react';

interface RecipesCatalogViewProps {
  recipes: ProductRecipe[];
  materials: MaterialItem[];
  fixedConfig: FixedCostsConfig;
  onOpenAddModal: () => void;
  onOpenFixedCostsModal: () => void;
  onOpenMarketplaceSimulator: (recipe: ProductRecipe) => void;
  onEditRecipe: (recipe: ProductRecipe) => void;
  onDeleteRecipe: (id: string) => void;
  onCreateOrderFromRecipe: (recipe: ProductRecipe) => void;
}

export const RecipesCatalogView: React.FC<RecipesCatalogViewProps> = ({
  recipes,
  materials,
  fixedConfig,
  onOpenAddModal,
  onOpenFixedCostsModal,
  onOpenMarketplaceSimulator,
  onEditRecipe,
  onDeleteRecipe,
  onCreateOrderFromRecipe,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState<string>('all');

  const filtered = recipes.filter((r) => {
    const matNames = (
      r.materialsUsed?.map((m) => m.materialName).join(' ') ||
      r.materialName ||
      ''
    ).toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matNames.includes(searchTerm.toLowerCase());
    const matchesTech = techFilter === 'all' || r.technology === techFilter;
    return matchesSearch && matchesTech;
  });

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

  return (
    <div className="space-y-5">
      {/* Intestazione Catalogo e Costi Fissi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700">
                  CATALOGO RICETTE & LAVORAZIONI
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {recipes.length} Lavorazioni Salvate
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Catalogo Prodotti & Calcolo Margini
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Salva le ricette. Costi e margini si aggiornano in tempo reale se cambiano i costi nel Magazzino (Tab 2).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenFixedCostsModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-bold transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-purple-600" />
              <span>Costi Fissi Macchina</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nuova Ricetta / Lavoro</span>
            </button>
          </div>
        </div>

        {/* Legenda Colori conforme allo Screenshot 5 */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-amber-800">
              <span className="w-3.5 h-3.5 bg-amber-200 border border-amber-400 rounded-xs"></span>
              Giallo = da compilare (Materiale, tempi, scarto e prezzo)
            </span>
            <span className="flex items-center gap-1.5 font-bold text-sky-800">
              <span className="w-3.5 h-3.5 bg-sky-200 border border-sky-400 rounded-xs"></span>
              Azzurro = calcolato (Costi diretti, usura macchina e manodopera)
            </span>
          </div>

          <div className="text-slate-600 font-semibold text-xs flex items-center gap-2">
            <span>Costo orario macchina attuale:</span>
            <span className="font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold">
              {formatCurrency(
                (fixedConfig.machineCost / (fixedConfig.estimatedLifeHours || 1)) +
                  (fixedConfig.powerWatts / 1000) * fixedConfig.electricityKwhCost
              )}/h
            </span>
          </div>
        </div>
      </div>

      {/* Barra Ricerca e Filtri Tecnologia */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca prodotto o materiale..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'print3d', 'laser', 'cnc', 'craft'].map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setTechFilter(tech)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                techFilter === tech
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tech === 'all'
                ? 'Tutte le Lavorazioni'
                : tech === 'print3d'
                ? 'Stampa 3D'
                : tech === 'laser'
                ? 'Laser'
                : tech === 'cnc'
                ? 'CNC'
                : 'Artigianato'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabella Catalogo Ricette (Fedele allo Screenshot 5) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Prodotto</th>
                <th className="py-3 px-3">Tecnologia</th>
                <th className="py-3 px-3 bg-slate-800">Materiale</th>
                <th className="py-3 px-3 text-right bg-slate-800">Grammi / Area</th>
                <th className="py-3 px-3 text-right bg-slate-800">Ore</th>
                <th className="py-3 px-3 text-right bg-slate-800">Min. Mano</th>
                <th className="py-3 px-3 text-right bg-slate-800">% Scarto</th>
                <th className="py-3 px-3 text-right bg-amber-900 text-amber-100">
                  Prezzo (€)
                </th>
                <th className="py-3 px-3 text-right bg-sky-900 text-sky-100">Costo Mat.</th>
                <th className="py-3 px-3 text-right bg-sky-900 text-sky-100">Costo Mac.</th>
                <th className="py-3 px-3 text-right bg-sky-900 text-sky-100">Costo Mano.</th>
                <th className="py-3 px-3 text-right bg-sky-900 text-sky-100">Scarto</th>
                <th className="py-3 px-3 text-right bg-sky-950 text-white">Costo Tot./pz</th>
                <th className="py-3 px-3 text-right bg-emerald-900 text-emerald-100">Margine (€)</th>
                <th className="py-3 px-3 text-center bg-emerald-950 text-white">Margine (%)</th>
                <th className="py-3 px-3 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((recipe) => {
                const costs = calculateRecipeCosts(recipe, materials, fixedConfig);
                const hasMultipleMaterials = recipe.materialsUsed && recipe.materialsUsed.length > 1;

                return (
                  <tr key={recipe.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-3 font-bold text-slate-950 whitespace-nowrap">
                      <div>{recipe.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {recipe.salesChannel && (
                          <span className="inline-flex items-center text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {recipe.salesChannel === 'direct'
                              ? 'Diretto (0%)'
                              : recipe.salesChannel === 'etsy'
                              ? 'Etsy (6.5%)'
                              : recipe.salesChannel === 'shopify'
                              ? 'Shopify (1.9%)'
                              : recipe.salesChannel === 'b2b'
                              ? 'B2B (0%)'
                              : 'Personalizzato'}
                          </span>
                        )}
                        {recipe.machineName && (
                          <span className="inline-flex items-center text-3xs text-indigo-700 font-medium">
                            {recipe.machineName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getTechBadge(recipe.technology)}
                    </td>

                    <td className="py-3.5 px-3 bg-amber-50/30">
                      {hasMultipleMaterials ? (
                        <div className="space-y-1">
                          {recipe.materialsUsed.map((m, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                              <span className="truncate max-w-[160px]">{m.materialName}</span>
                              <span className="text-slate-500 font-mono text-[11px] shrink-0">
                                ({m.quantityUsed} {m.unit})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="font-semibold text-slate-800 whitespace-nowrap">
                          {recipe.materialsUsed?.[0]?.materialName || recipe.materialName}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 bg-amber-50/30 whitespace-nowrap">
                      {hasMultipleMaterials ? (
                        <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                          {recipe.materialsUsed.length} materiali
                        </span>
                      ) : (
                        `${recipe.materialsUsed?.[0]?.quantityUsed ?? recipe.quantityUsed} ${
                          recipe.materialsUsed?.[0]?.unit ?? recipe.unit
                        }`
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 bg-amber-50/30 whitespace-nowrap">
                      {recipe.machineHours} h
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 bg-amber-50/30 whitespace-nowrap">
                      {recipe.laborMinutes} m
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 bg-amber-50/30 whitespace-nowrap">
                      {recipe.wasteRiskPercent}%
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-black text-amber-950 bg-amber-100/60 whitespace-nowrap">
                      {formatCurrency(recipe.sellingPrice)}
                    </td>

                    {/* Celle Azzurre Calcolate in Automatico */}
                    <td className="py-3.5 px-3 text-right font-mono text-sky-950 bg-sky-50 whitespace-nowrap">
                      {formatCurrency(costs.costMaterial)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-sky-950 bg-sky-50 whitespace-nowrap">
                      {formatCurrency(costs.costMachine)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-sky-950 bg-sky-50 whitespace-nowrap">
                      {formatCurrency(costs.costLabor)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-sky-950 bg-sky-50 whitespace-nowrap">
                      {formatCurrency(costs.costWaste)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-950 bg-sky-100/70 whitespace-nowrap">
                      {formatCurrency(costs.costTotal)}
                    </td>

                    <td
                      className={`py-3.5 px-3 text-right font-mono font-black whitespace-nowrap ${
                        costs.isNegativeMargin
                          ? 'text-red-700 bg-red-50'
                          : 'text-emerald-800 bg-emerald-50/50'
                      }`}
                    >
                      {formatCurrency(costs.marginEur)}
                    </td>

                    {/* Margine % con allarme dello Screenshot 5 */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {costs.isNegativeMargin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-black font-mono text-xs bg-red-100 text-red-700 border border-red-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          {formatPercent(costs.marginPercent)}
                        </span>
                      ) : costs.marginPercent < 20 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-black font-mono text-xs bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          {formatPercent(costs.marginPercent)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-black font-mono text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {formatPercent(costs.marginPercent)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenMarketplaceSimulator(recipe)}
                          className="flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md text-xs font-bold transition-colors cursor-pointer border border-amber-200"
                          title="Simula Commissioni Marketplace (Etsy, Shopify, B2B, Diretto)"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Marketplace</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onCreateOrderFromRecipe(recipe)}
                          className="flex items-center gap-1 px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-md text-xs font-bold transition-colors cursor-pointer border border-teal-200"
                          title="Crea Ordine Cliente per questo Prodotto"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-teal-600" />
                          <span>Ordina</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditRecipe(recipe)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Modifica Ricetta"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteRecipe(recipe.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Elimina Ricetta"
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
