/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { OrderItem } from '../types/calculator';
import { formatCurrency, formatPercent } from '../utils/calculatorEngine';
import {
  TrendingUp,
  Award,
  DollarSign,
  Calendar,
  CheckCircle2,
  Filter,
  Layers,
  ArrowUpRight,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';

interface MonthlyProfitAnalyticsProps {
  orders: OrderItem[];
  onNavigateToOrders?: () => void;
  onOpenNewOrder?: () => void;
}

interface MonthlyDataPoint {
  monthKey: string; // "2026-05"
  monthLabel: string; // "Mag 26"
  fullMonthName: string; // "Maggio 2026"
  profit: number; // Margine netto totale (€)
  revenue: number; // Ricavi totali (€)
  cost: number; // Costi diretti totali (€)
  ordersCount: number; // Numero ordini
  marginPercent: number; // Margine netto % medio
}

export const MonthlyProfitAnalytics: React.FC<MonthlyProfitAnalyticsProps> = ({
  orders,
  onNavigateToOrders,
  onOpenNewOrder,
}) => {
  // Filtro stato: di default solo ordini completati (come da richiesta utente), con opzione di includere approvati
  const [includeApproved, setIncludeApproved] = useState<boolean>(false);
  // Modalità grafico: solo barre profitto vs confronto completo (ricavi, costi, profitto)
  const [chartMode, setChartMode] = useState<'profitOnly' | 'breakdown'>('profitOnly');

  // Calcolo dei 12 mesi precedenti rispetto a data di riferimento (ottobre 2026 o data corrente)
  const { monthlyData, summaryStats } = useMemo(() => {
    // Determina la data più recente tra gli ordini presenti o data odierna
    let referenceDate = new Date();
    // Se abbiamo date mock nel 2026, usiamo il max tra gli ordini per agganciare l'ultimo anno rilevante
    if (orders.length > 0) {
      const dates = orders
        .map((o) => new Date(o.createdAt || o.updatedAt).getTime())
        .filter((d) => !isNaN(d));
      if (dates.length > 0) {
        const maxTime = Math.max(...dates);
        referenceDate = new Date(maxTime);
      }
    }

    // Costruisci i 12 mesi precedenti (dal più vecchio al più recente)
    const months: { year: number; month: number; key: string }[] = [];
    const targetYear = referenceDate.getFullYear();
    const targetMonth = referenceDate.getMonth(); // 0-11

    for (let i = 11; i >= 0; i--) {
      const d = new Date(targetYear, targetMonth - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${String(m + 1).padStart(2, '0')}`;
      months.push({ year: y, month: m, key });
    }

    const monthNamesShort = [
      'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
      'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
    ];
    const monthNamesLong = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    // Inizializza mappa mesi
    const map = new Map<string, MonthlyDataPoint>();
    months.forEach(({ year, month, key }) => {
      const shortYear = String(year).slice(-2);
      map.set(key, {
        monthKey: key,
        monthLabel: `${monthNamesShort[month]} '${shortYear}`,
        fullMonthName: `${monthNamesLong[month]} ${year}`,
        profit: 0,
        revenue: 0,
        cost: 0,
        ordersCount: 0,
        marginPercent: 0,
      });
    });

    // Filtra ordini considerati
    const relevantOrders = orders.filter((o) => {
      if (includeApproved) {
        return o.status === 'completato' || o.status === 'approvato';
      }
      return o.status === 'completato';
    });

    // Aggrega i dati
    relevantOrders.forEach((o) => {
      const rawDate = o.createdAt || o.updatedAt;
      if (!rawDate) return;
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (map.has(key)) {
        const entry = map.get(key)!;
        entry.profit += o.totalMarginEur || 0;
        entry.revenue += o.totalRevenue || 0;
        entry.cost += o.totalCost || 0;
        entry.ordersCount += 1;
      }
    });

    // Calcola % di margine per ogni mese
    const list: MonthlyDataPoint[] = [];
    map.forEach((entry) => {
      entry.profit = Math.round(entry.profit * 100) / 100;
      entry.revenue = Math.round(entry.revenue * 100) / 100;
      entry.cost = Math.round(entry.cost * 100) / 100;
      entry.marginPercent =
        entry.revenue > 0 ? (entry.profit / entry.revenue) * 100 : 0;
      list.push(entry);
    });

    // Calcolo KPI riassuntivi
    const totalProfit = list.reduce((acc, m) => acc + m.profit, 0);
    const totalRevenue = list.reduce((acc, m) => acc + m.revenue, 0);
    const totalCost = list.reduce((acc, m) => acc + m.cost, 0);
    const totalOrders = list.reduce((acc, m) => acc + m.ordersCount, 0);
    const activeMonthsCount = list.filter((m) => m.ordersCount > 0).length || 1;
    const averageMonthlyProfit = totalProfit / 12; // Su base 12 mesi
    const overallMarginPercent =
      totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Trova mese record di profitto
    let bestMonth: MonthlyDataPoint | null = null;
    for (const m of list) {
      if (!bestMonth || m.profit > bestMonth.profit) {
        bestMonth = m;
      }
    }

    return {
      monthlyData: list,
      summaryStats: {
        totalProfit,
        totalRevenue,
        totalCost,
        totalOrders,
        averageMonthlyProfit,
        overallMarginPercent,
        activeMonthsCount,
        bestMonth: bestMonth && bestMonth.profit > 0 ? bestMonth : null,
      },
    };
  }, [orders, includeApproved]);

  // Tooltip customizzato per Recharts con stile rifinito
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyDataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[210px]">
          <div className="font-extrabold text-sm text-slate-100 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
            <span>{data.fullMonthName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {data.ordersCount} ord.
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-emerald-400 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Utile Netto:
              </span>
              <span className="font-mono text-sm">{formatCurrency(data.profit)}</span>
            </div>

            <div className="flex items-center justify-between gap-3 text-blue-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Fatturato Lordo:
              </span>
              <span className="font-mono">{formatCurrency(data.revenue)}</span>
            </div>

            <div className="flex items-center justify-between gap-3 text-rose-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                Costi Produzione:
              </span>
              <span className="font-mono">{formatCurrency(data.cost)}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <span>Margine %:</span>
              <span className="font-bold text-white font-mono">
                {formatPercent(data.marginPercent)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Intestazione Sezione con Badge e Controlli */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                  REPORT FINANZIARIO & PERFORMANCE
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">Ultimi 12 Mesi</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Grafico a Barre Andamento Mensile
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Visualizzazione dell'utile netto generato dalle commesse e ordini completati nell'ultimo anno solare.
              </p>
            </div>
          </div>

          {/* Filtri e Modalità Grafico */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Toggle Tipo Dati */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 border border-slate-200">
              <button
                type="button"
                onClick={() => setChartMode('profitOnly')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartMode === 'profitOnly'
                    ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                    : 'hover:text-slate-900'
                }`}
              >
                Solo Utile Netto
              </button>
              <button
                type="button"
                onClick={() => setChartMode('breakdown')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartMode === 'breakdown'
                    ? 'bg-white text-blue-800 shadow-2xs font-extrabold'
                    : 'hover:text-slate-900'
                }`}
              >
                Confronto Ricavi / Costi
              </button>
            </div>

            {/* Toggle Stato Ordini */}
            <button
              type="button"
              onClick={() => setIncludeApproved(!includeApproved)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                includeApproved
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Consente di visualizzare anche il margine previsto dagli ordini già approvati ma non ancora contrassegnati come evasi"
            >
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {includeApproved ? 'Inclusi Approvati' : 'Solo Completati'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards Riassuntive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Utile Netto Totale */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Utile Netto Annuo
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight text-emerald-600">
            {formatCurrency(summaryStats.totalProfit)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span className="font-semibold text-slate-700">
              {summaryStats.totalOrders} ordini
            </span>
            <span>
              {includeApproved ? 'completati o approvati' : 'completati con successo'}
            </span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 pointer-events-none">
            <TrendingUp className="w-24 h-24 text-emerald-600" />
          </div>
        </div>

        {/* Fatturato Totale */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fatturato Totale (12m)
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
            {formatCurrency(summaryStats.totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>Costi diretti:</span>
            <span className="font-semibold text-rose-600 font-mono">
              {formatCurrency(summaryStats.totalCost)}
            </span>
          </div>
        </div>

        {/* Media Mensile Utile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Media Utile Mensile
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight text-indigo-700">
            {formatCurrency(summaryStats.averageMonthlyProfit)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span>Margine medio:</span>
            <span className="font-bold text-slate-800 font-mono">
              {formatPercent(summaryStats.overallMarginPercent)}
            </span>
          </div>
        </div>

        {/* Mese Record */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mese Record (Utile)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight text-amber-600">
            {summaryStats.bestMonth
              ? formatCurrency(summaryStats.bestMonth.profit)
              : '€ 0,00'}
          </div>
          <div className="text-xs text-slate-600 font-bold mt-2 truncate">
            {summaryStats.bestMonth
              ? `${summaryStats.bestMonth.fullMonthName} (${summaryStats.bestMonth.ordersCount} ordini)`
              : 'Nessun ordine nel periodo'}
          </div>
        </div>
      </div>

      {/* Contenitore Grafico Recharts */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Andamento Mensile dell'Utile Netto</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Recharts Live
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Passa il mouse sulle barre per visualizzare i dettagli analitici di ciascun mese.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
              <span>Utile Netto (€)</span>
            </div>
            {chartMode === 'breakdown' && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block" />
                  <span>Ricavi Lordi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
                  <span>Costi</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-4 h-0.5 border-t border-dashed border-amber-500 inline-block" />
              <span>Media ({formatCurrency(summaryStats.averageMonthlyProfit)})</span>
            </div>
          </div>
        </div>

        {/* Canvas Recharts con ResponsiveContainer */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 16, right: 16, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="monthLabel"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `€ ${value}`}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Linea di riferimento per la media mensile */}
              {summaryStats.averageMonthlyProfit > 0 && (
                <ReferenceLine
                  y={summaryStats.averageMonthlyProfit}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
              )}

              {chartMode === 'profitOnly' ? (
                <Bar
                  dataKey="profit"
                  name="Utile Netto"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                >
                  {monthlyData.map((entry, index) => {
                    const isBest =
                      summaryStats.bestMonth &&
                      entry.monthKey === summaryStats.bestMonth.monthKey &&
                      entry.profit > 0;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isBest ? '#10b981' : '#059669'}
                        className="transition-all hover:opacity-80"
                      />
                    );
                  })}
                </Bar>
              ) : (
                <>
                  <Bar
                    dataKey="revenue"
                    name="Ricavi Lordi"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="cost"
                    name="Costi Diretti"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="profit"
                    name="Utile Netto"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabella Dati Dettagliata per Mese */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-extrabold text-slate-900">
              Riepilogo Numerico Mensile
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {monthlyData.filter((m) => m.ordersCount > 0).length} mesi con ordini
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mese / Anno</th>
                <th className="py-3 px-4 text-center">Ordini Evasi</th>
                <th className="py-3 px-4 text-right">Fatturato Lordo</th>
                <th className="py-3 px-4 text-right">Costi Totali</th>
                <th className="py-3 px-4 text-right">Utile Netto (€)</th>
                <th className="py-3 px-4 text-right">Margine %</th>
                <th className="py-3 px-4 text-center">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {monthlyData
                .slice()
                .reverse()
                .map((m) => {
                  const isBest =
                    summaryStats.bestMonth &&
                    m.monthKey === summaryStats.bestMonth.monthKey &&
                    m.profit > 0;
                  return (
                    <tr
                      key={m.monthKey}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isBest ? 'bg-emerald-50/40 font-bold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        {isBest && (
                          <span
                            title="Mese con maggior utile"
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800"
                          >
                            RECORD
                          </span>
                        )}
                        <span>{m.fullMonthName}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {m.ordersCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-800">
                            {m.ordersCount}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium">
                        {m.revenue > 0 ? formatCurrency(m.revenue) : '€ 0,00'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-rose-600">
                        {m.cost > 0 ? formatCurrency(m.cost) : '€ 0,00'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-emerald-600 text-sm">
                        {m.profit > 0 ? `+${formatCurrency(m.profit)}` : '€ 0,00'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {m.marginPercent > 0 ? (
                          <span className="text-teal-700">
                            {formatPercent(m.marginPercent)}
                          </span>
                        ) : (
                          <span className="text-slate-400">0.0%</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {m.profit > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Attivo
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Nessun incasso
                          </span>
                        )}
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
