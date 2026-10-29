/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { calculateMarketplaceComparison, formatCurrency, formatPercent } from '../utils/calculatorEngine';
import { Store, X, TrendingUp, DollarSign, Award, ArrowRight } from 'lucide-react';

interface MarketplaceSimulatorModalProps {
  productTitle: string;
  initialSellingPrice: number;
  initialCostTotal: number;
  isOpen: boolean;
  onClose: () => void;
}

export const MarketplaceSimulatorModal: React.FC<MarketplaceSimulatorModalProps> = ({
  productTitle,
  initialSellingPrice,
  initialCostTotal,
  isOpen,
  onClose,
}) => {
  const [price, setPrice] = useState(initialSellingPrice || 28);
  const [cost, setCost] = useState(initialCostTotal || 8);
  const [quantity, setQuantity] = useState(1);

  React.useEffect(() => {
    if (initialSellingPrice > 0) setPrice(initialSellingPrice);
    if (initialCostTotal > 0) setCost(initialCostTotal);
  }, [initialSellingPrice, initialCostTotal, isOpen]);

  if (!isOpen) return null;

  const comparison = calculateMarketplaceComparison(price, cost, quantity);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modale */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Simulatore Canali & Commissioni Marketplace a Confronto
              </h3>
              <p className="text-xs text-emerald-100">
                Scopri quanto ti rimane davvero netto in tasca vendendo lo stesso prodotto su diversi canali.
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

        {/* Parametri di Simulazione */}
        <div className="p-6 space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Prodotto in Simulazione:
              </span>
              <span className="text-sm font-black text-slate-900">{productTitle}</span>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Prezzo Vendita (€)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Costo Vivo Produzione (€)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={cost}
                  onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Quantità Lotto (pz)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Griglia a 4 Colonne a Confronto Diretto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. VENDITA DIRETTA */}
            <div className="bg-emerald-50/60 border-2 border-emerald-500 rounded-2xl p-4 flex flex-col justify-between shadow-2xs relative">
              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" />
                Max Profitto
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-emerald-950 pr-20">
                  Vendita Diretta
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Laboratorio, passaparola o contanti
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Commissioni terzi:</span>
                    <span className="font-mono font-bold text-emerald-700">€ 0,00 (0%)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ricavo totale:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(comparison.direct.revenue)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Netto in Tasca:
                </span>
                <span className="text-2xl font-black font-mono text-emerald-950 block">
                  +{formatCurrency(comparison.direct.netProfit)}
                </span>
                <div className="text-[11px] text-emerald-700 font-bold mt-1">
                  Margine: {formatPercent(comparison.direct.marginPercent)} · {formatCurrency(comparison.direct.effectivePerPiece)}/pz
                </div>
              </div>
            </div>

            {/* 2. ETSY MARKETPLACE */}
            <div className="bg-orange-50/40 border border-orange-300 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-orange-950">Etsy Marketplace</h4>
                <p className="text-[11px] text-orange-800 mt-0.5">
                  0,20€ + 6,5% + 4% transazione
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Commissioni trattenute:</span>
                    <span className="font-mono font-bold text-red-700">
                      -{formatCurrency(comparison.etsy.fees)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ricavo lordo:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(comparison.etsy.revenue)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-orange-200">
                <span className="text-[10px] font-bold text-orange-900 uppercase block">
                  Netto in Tasca:
                </span>
                <span className="text-2xl font-black font-mono text-orange-950 block">
                  +{formatCurrency(comparison.etsy.netProfit)}
                </span>
                <div className="text-[11px] text-orange-800 font-bold mt-1">
                  Margine: {formatPercent(comparison.etsy.marginPercent)} · {formatCurrency(comparison.etsy.effectivePerPiece)}/pz
                </div>
              </div>
            </div>

            {/* 3. SHOPIFY / SITO PROPRIO */}
            <div className="bg-sky-50/40 border border-sky-300 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-sky-950">Sito Web / Shopify</h4>
                <p className="text-[11px] text-sky-800 mt-0.5">
                  1,9% + 0,25€ gateway Stripe
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Commissioni gateway:</span>
                    <span className="font-mono font-bold text-slate-800">
                      -{formatCurrency(comparison.shopify.fees)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ricavo lordo:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(comparison.shopify.revenue)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-sky-200">
                <span className="text-[10px] font-bold text-sky-900 uppercase block">
                  Netto in Tasca:
                </span>
                <span className="text-2xl font-black font-mono text-sky-950 block">
                  +{formatCurrency(comparison.shopify.netProfit)}
                </span>
                <div className="text-[11px] text-sky-800 font-bold mt-1">
                  Margine: {formatPercent(comparison.shopify.marginPercent)} · {formatCurrency(comparison.shopify.effectivePerPiece)}/pz
                </div>
              </div>
            </div>

            {/* 4. B2B INGROSSO */}
            <div className="bg-purple-50/40 border border-purple-300 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-purple-950">B2B / Ingrosso</h4>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  Sconto volume -25% riservato
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Sconto concesso:</span>
                    <span className="font-mono font-bold text-purple-800">-25,0%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Prezzo unitario:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(price * 0.75)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-purple-200">
                <span className="text-[10px] font-bold text-purple-900 uppercase block">
                  Netto in Tasca:
                </span>
                <span className="text-2xl font-black font-mono text-purple-950 block">
                  +{formatCurrency(comparison.b2b.netProfit)}
                </span>
                <div className="text-[11px] text-purple-800 font-bold mt-1">
                  Margine: {formatPercent(comparison.b2b.marginPercent)} · {formatCurrency(comparison.b2b.effectivePerPiece)}/pz
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span>
              💡 Su Etsy paghi <strong>{formatCurrency(comparison.etsy.fees)}</strong> di commissioni rispetto alla vendita diretta, pari a <strong>{formatPercent(((comparison.direct.netProfit - comparison.etsy.netProfit) / (comparison.direct.netProfit || 1)) * 100)}</strong> in meno di utile netto!
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
