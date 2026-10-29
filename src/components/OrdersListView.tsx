/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OrderItem } from '../types/calculator';
import { formatCurrency, formatPercent } from '../utils/calculatorEngine';
import {
  ShoppingCart,
  Plus,
  Search,
  Printer,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  PackageCheck,
  Truck,
  Box,
  TrendingUp,
} from 'lucide-react';

interface OrdersListViewProps {
  orders: OrderItem[];
  onOpenAddModal: () => void;
  onEditOrder: (order: OrderItem) => void;
  onPrintOrder: (order: OrderItem) => void;
  onOpenJobSheet: (order: OrderItem) => void;
  onDeductStock: (order: OrderItem) => void;
  onDeleteOrder: (id: string) => void;
  onUpdateStatus: (id: string, status: OrderItem['status']) => void;
  onNavigateToAnalytics?: () => void;
}

export const OrdersListView: React.FC<OrdersListViewProps> = ({
  orders,
  onOpenAddModal,
  onEditOrder,
  onPrintOrder,
  onOpenJobSheet,
  onDeductStock,
  onDeleteOrder,
  onUpdateStatus,
  onNavigateToAnalytics,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Intestazione Sezione Ordini */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0 shadow-2xs">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
                  COMMESSE & PRODUZIONE
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {orders.length} Ordini Registrati
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Calcolo Ordini, Preventivi & Schede Officina
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Calcola preventivi con sconto volume, verifica margini minimi, stampa schede banco per l'officina e scarica scorte da magazzino.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onNavigateToAnalytics && (
              <button
                type="button"
                onClick={onNavigateToAnalytics}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-sm font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Visualizza Grafici</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuovo Ordine / Preventivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra Ricerca e Filtri */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca per codice, prodotto o cliente..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'bozza', 'inviato', 'approvato', 'completato'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer capitalize ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Tutti gli Ordini' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Tabella Ordini (Conforme allo Screenshot 4 e arricchita) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Codice & Lavoro</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4 text-center">Quantità</th>
                <th className="py-3 px-4 text-right">Sconto Offerto</th>
                <th className="py-3 px-4 text-right">Prezzo Unit. Scontato</th>
                <th className="py-3 px-4 text-right bg-slate-800">Ricavo Totale</th>
                <th className="py-3 px-4 text-right bg-slate-800">Costo Totale</th>
                <th className="py-3 px-4 text-right bg-emerald-900 text-emerald-100">Margine (€)</th>
                <th className="py-3 px-4 text-center bg-emerald-950 text-white">Margine (%)</th>
                <th className="py-3 px-4 text-center">Magazzino & Spedizione</th>
                <th className="py-3 px-4 text-center">Stato</th>
                <th className="py-3 px-4 text-right">Azioni & Schede</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">{ord.code}</div>
                    <div className="text-xs font-bold text-teal-800">{ord.recipeName}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{ord.client?.name || 'Cliente Diretto'}</div>
                    {ord.client?.company && (
                      <div className="text-xs text-slate-500">{ord.client.company}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 whitespace-nowrap">
                    {ord.quantity} pz
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-700 whitespace-nowrap">
                    {ord.volumeDiscountPercent > 0 ? `-${ord.volumeDiscountPercent}%` : '0%'}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(ord.unitDiscountedPrice)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-black text-slate-950 bg-slate-50 whitespace-nowrap">
                    {formatCurrency(ord.totalRevenue)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 bg-slate-50 whitespace-nowrap">
                    {formatCurrency(ord.totalCost)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-800 bg-emerald-50/50 whitespace-nowrap">
                    +{formatCurrency(ord.totalMarginEur)}
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {ord.isUnderMarginAlert ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        {formatPercent(ord.realMarginPercent)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {formatPercent(ord.realMarginPercent)}
                      </span>
                    )}
                  </td>

                  {/* Info Magazzino & Spedizione */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center gap-1">
                      {ord.stockShortageWarning ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-extrabold bg-amber-100 text-amber-800" title={ord.stockShortageWarning}>
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Sotto-Scorta
                        </span>
                      ) : ord.materialsDeducted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Scaricato
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDeductStock(ord)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors cursor-pointer"
                          title="Scarica i materiali necessari da magazzino"
                        >
                          <PackageCheck className="w-3 h-3 text-slate-500" />
                          Scarica Stock
                        </button>
                      )}

                      {ord.suggestedCourierBracket && (
                        <span className="text-3xs text-slate-500 flex items-center gap-0.5 font-mono">
                          <Truck className="w-2.5 h-2.5 text-slate-400" />
                          {ord.totalGrossWeightKg}kg ({ord.suggestedCourierBracket})
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        onUpdateStatus(ord.id, e.target.value as OrderItem['status'])
                      }
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                        ord.status === 'approvato'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.status === 'inviato'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : ord.status === 'completato'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="bozza">Bozza</option>
                      <option value="inviato">Inviato</option>
                      <option value="approvato">Approvato</option>
                      <option value="rifiutato">Rifiutato</option>
                      <option value="completato">Completato</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Scheda di Lavorazione Officina (Job Sheet) */}
                      <button
                        type="button"
                        onClick={() => onOpenJobSheet(ord)}
                        className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-900 hover:text-white border border-amber-400/40 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        title="Apri Scheda di Lavorazione Banco (Job Sheet)"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Scheda Banco</span>
                      </button>

                      {/* Stampa Preventivo Cliente */}
                      <button
                        type="button"
                        onClick={() => onPrintOrder(ord)}
                        className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Stampa Preventivo Formale PDF"
                      >
                        <Printer className="w-4 h-4 text-blue-600" />
                      </button>

                      {/* Modifica */}
                      <button
                        type="button"
                        onClick={() => onEditOrder(ord)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Modifica Ordine"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Elimina */}
                      <button
                        type="button"
                        onClick={() => onDeleteOrder(ord.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Elimina Ordine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
