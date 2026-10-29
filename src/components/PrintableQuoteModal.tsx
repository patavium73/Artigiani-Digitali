/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { OrderItem, WorkshopSettings } from '../types/calculator';
import { formatCurrency } from '../utils/calculatorEngine';
import {
  Printer,
  X,
  Calendar,
  Clock,
  Truck,
  FileText,
  RotateCcw,
  Plus,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface PrintableQuoteModalProps {
  order: OrderItem;
  settings: WorkshopSettings;
  onClose: () => void;
}

const PRESET_CLAUSES = [
  {
    label: '+ Acconto 50% all\'ordine',
    clause: '• Modalità di pagamento: 50% acconto all\'accettazione del preventivo, saldo alla notifica di merce pronta prima della spedizione.',
  },
  {
    label: '+ Tolleranze dimensionali ±0.2mm',
    clause: '• Tolleranze geometriche e dimensionali secondo normativa ISO 2768-m (tolleranza standard ±0.2 mm per componenti tecnici).',
  },
  {
    label: '+ Reso escluso (beni su misura)',
    clause: '• Diritto di recesso escluso ai sensi dell\'art. 59, comma 1, lett. c) D.Lgs 206/2005 (fornitura di beni confezionati su misura o personalizzati).',
  },
  {
    label: '+ Spedizione corriere espresso',
    clause: '• Spedizione affidata a corriere espresso tracciato. Il codice di tracciamento (tracking) verrà comunicato all\'evasione del lotto.',
  },
  {
    label: '+ Riserva di proprietà al saldo',
    clause: '• Riserva di proprietà: la merce fornita resta di proprietà esclusiva della ditta fornitrice fino al totale saldo della fattura (Art. 1523 C.C.).',
  },
  {
    label: '+ Decorrenza da approvazione bozza',
    clause: '• I termini di consegna decorrono dall\'accredito dell\'acconto e dalla formale approvazione esecutiva dei file di produzione / rendering.',
  },
];

export const PrintableQuoteModal: React.FC<PrintableQuoteModalProps> = ({
  order,
  settings,
  onClose,
}) => {
  const [docType, setDocType] = useState<'preventivo' | 'fattura'>('preventivo');
  const [vatRate, setVatRate] = useState<number>(22); // 22% o 0% per regime forfettario

  // 1. Data documento (modificabile interattivamente)
  const initialDate = order.createdAt
    ? order.createdAt.slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const [docDate, setDocDate] = useState<string>(initialDate);

  // 2. Validità preventivo (modificabile interattivamente)
  const [validityDays, setValidityDays] = useState<number>(order.validityDays || 30);

  // 3. Tempi e modalità di consegna (modificabile interattivamente)
  const [deliveryText, setDeliveryText] = useState<string>(
    order.deliveryText || `${order.deliveryDays || 5} giorni lavorativi`
  );

  // 4. Termini e Condizioni personalizzabili
  const [docTerms, setDocTerms] = useState<string>(
    order.customTerms || settings.termsAndConditions || ''
  );

  // Pannello personalizzazione visibile/nascosto
  const [showConfigBar, setShowConfigBar] = useState<boolean>(true);
  const [showTermsDrawer, setShowTermsDrawer] = useState<boolean>(false);

  const subtotal = order.totalRevenue;
  const vatAmount = (subtotal * vatRate) / 100;
  const grandTotal = subtotal + vatAmount;

  const handlePrint = () => {
    window.print();
  };

  const formattedDocDate = useMemo(() => {
    try {
      const [year, month, day] = docDate.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      return new Date(docDate).toLocaleDateString('it-IT');
    } catch {
      return docDate;
    }
  }, [docDate]);

  const addClause = (clause: string) => {
    if (docTerms.includes(clause)) return;
    setDocTerms((prev) => (prev.trim() ? `${prev.trim()}\n${clause}` : clause));
  };

  const resetTermsToDefault = () => {
    setDocTerms(settings.termsAndConditions || '');
  };

  const setTodayDate = () => {
    setDocDate(new Date().toISOString().slice(0, 10));
  };

  const getTechName = () => {
    switch (order.technology) {
      case 'print3d':
        return 'Stampa 3D Professionale (FDM / Resina ad alta precisione)';
      case 'laser':
        return 'Taglio & Incisione Laser di Precisione';
      case 'cnc':
        return 'Fresatura e Lavorazione Meccanica CNC';
      default:
        return 'Lavorazione Artigianato Digitale & Prototipazione';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden my-auto print-container">
        
        {/* BARRA SUPERIORE DI CONTROLLO PRINCIPALE (NON STAMPABILE) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>{docType === 'fattura' ? 'Fattura / Proforma Fiscale' : 'Preventivo Ufficiale Commessa'}</span>
                <span className="text-2xs uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {order.code}
                </span>
              </h3>
              <p className="text-xs text-slate-400 hidden sm:block">
                Imposta data, validità, consegna e clausole prima di stampare o salvare in PDF A4.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Selettore Tipo Documento */}
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as 'preventivo' | 'fattura')}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="preventivo">Documento: Preventivo</option>
              <option value="fattura">Documento: Fattura Proforma</option>
            </select>

            {/* Opzione Regime IVA */}
            <select
              value={vatRate}
              onChange={(e) => setVatRate(parseInt(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value={22}>IVA Ordinaria 22%</option>
              <option value={10}>IVA Agevolata 10%</option>
              <option value={4}>IVA Minima 4%</option>
              <option value={0}>Regime Forfettario (0% IVA)</option>
            </select>

            {/* Toggle Pannello Parametri Documento */}
            <button
              type="button"
              onClick={() => setShowConfigBar(!showConfigBar)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                showConfigBar
                  ? 'bg-slate-800 border-teal-500 text-teal-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Parametri</span>
            </button>

            {/* Bottone Stampa PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Stampa / PDF</span>
            </button>

            {/* Chiudi */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
              title="Chiudi visualizzazione"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PANNELLO DI CONFIGURAZIONE INTERATTIVO: DATA, VALIDITÀ, CONSEGNA & AGGIUNTA TERMINI (NON STAMPABILE) */}
        {showConfigBar && (
          <div className="no-print bg-slate-800/95 text-slate-200 px-5 py-3 border-b border-slate-700 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Modifica Data di Emissione */}
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Data Emissione Documento</span>
                  </label>
                  <button
                    type="button"
                    onClick={setTodayDate}
                    className="text-3xs text-slate-400 hover:text-teal-300 font-semibold underline cursor-pointer"
                  >
                    Imposta Oggi
                  </button>
                </div>
                <input
                  type="date"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {/* 2. Modifica Validità Offerta */}
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Validità Offerta (Giorni)</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {[15, 30, 60].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setValidityDays(d)}
                        className={`text-3xs px-1.5 py-0.5 rounded cursor-pointer ${
                          validityDays === d
                            ? 'bg-teal-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white bg-slate-800'
                        }`}
                      >
                        {d}gg
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <span className="text-xs text-slate-400 whitespace-nowrap">giorni</span>
                </div>
              </div>

              {/* 3. Modifica Tempi di Consegna */}
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Tempi di Consegna Stimati</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {['3-5 gg', '7-10 gg', 'Pronta consegna'].map((txt) => (
                      <button
                        key={txt}
                        type="button"
                        onClick={() =>
                          setDeliveryText(
                            txt.includes('gg') ? `${txt} lavorativi` : txt
                          )
                        }
                        className="text-3xs px-1.5 py-0.5 rounded cursor-pointer text-slate-400 hover:text-white bg-slate-800"
                      >
                        {txt}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={deliveryText}
                  onChange={(e) => setDeliveryText(e.target.value)}
                  placeholder="es. 5 giorni lavorativi"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* 4. Barra Aggiunta Termini & Clausole */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Aggiunta Rapida Clausole / Condizioni:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowTermsDrawer(!showTermsDrawer)}
                  className="text-xs px-2.5 py-1 bg-teal-800 hover:bg-teal-700 text-teal-100 rounded-md font-semibold cursor-pointer transition-colors"
                >
                  {showTermsDrawer ? 'Chiudi Editor Termini ▲' : 'Modifica / Espandi Termini ▼'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_CLAUSES.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addClause(item.clause)}
                    className="text-2xs bg-slate-700 hover:bg-slate-600 text-teal-200 px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-teal-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Editor Termini Espanso */}
            {showTermsDrawer && (
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-2.5 mt-2 animate-in fade-in duration-150">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-teal-300">
                    Modifica testo Termini & Condizioni per questo documento:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetTermsToDefault}
                      className="text-2xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Ripristina da Impostazioni</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CLAUSES.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addClause(item.clause)}
                      className="text-3xs bg-slate-800 hover:bg-teal-900/60 border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-teal-200 px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5 text-teal-400" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={docTerms}
                  onChange={(e) => setDocTerms(e.target.value)}
                  placeholder="Inserisci termini, modalità di pagamento, condizioni di consegna, garanzie..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-hidden resize-y"
                />
              </div>
            )}
          </div>
        )}

        {/* FOGLIO UFFICIALE PREVENTIVO / FATTURA PROFORMA (FORMATO STAMPA A4) */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white font-sans text-sm space-y-8 flex-1">
          {/* TESTATA AZIENDALE & NUMERO DOCUMENTO */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.workshopName}
                    className="max-h-14 max-w-[180px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                    AD
                  </div>
                )}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    {settings.workshopName}
                  </h1>
                  {settings.artisanName && (
                    <span className="text-xs text-slate-500 font-semibold block">
                      Titolare: {settings.artisanName}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-slate-600 text-xs font-semibold max-w-sm">
                {settings.tagline}
              </p>
              <div className="text-slate-500 text-xs mt-2 space-y-0.5">
                <p>
                  {settings.address}
                  {settings.zipCode ? ` · ${settings.zipCode}` : ''}
                  {settings.city ? ` ${settings.city}` : ''}
                  {settings.province ? ` (${settings.province})` : ''}
                </p>
                <p>
                  P.IVA: <strong className="font-mono text-slate-800">{settings.vatNumber}</strong>
                  {settings.fiscalCode ? (
                    <> · C.F.: <strong className="font-mono text-slate-800">{settings.fiscalCode}</strong></>
                  ) : null}
                </p>
                {settings.sdiCode || settings.pec ? (
                  <p>
                    {settings.sdiCode ? <>Cod. SDI: <strong className="font-mono text-slate-800">{settings.sdiCode}</strong></> : null}
                    {settings.sdiCode && settings.pec ? ' · ' : ''}
                    {settings.pec ? <>PEC: <strong className="font-mono text-slate-800">{settings.pec}</strong></> : null}
                  </p>
                ) : null}
                <p>
                  Email: {settings.email} · Tel: {settings.phone}
                  {settings.website ? ` · Web: ${settings.website}` : ''}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className={`text-xs font-black uppercase tracking-widest block ${
                docType === 'fattura' ? 'text-blue-700' : 'text-teal-700'
              }`}>
                {docType === 'fattura' ? 'FATTURA PROFORMA' : 'PREVENTIVO COMMESSA'}
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
                {order.code}
              </div>
              <div className="text-slate-600 text-xs mt-2 space-y-1">
                <p className="flex items-center sm:justify-end gap-1.5">
                  <span className="text-slate-400">Data emissione:</span>
                  <strong className="text-slate-900 font-bold">{formattedDocDate}</strong>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <span className="text-slate-400">Validità offerta:</span>
                  <strong className="text-slate-900 font-bold">{validityDays} giorni</strong>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <span className="text-slate-400">Consegna stimata:</span>
                  <strong className="text-slate-900 font-bold">{deliveryText}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* DATI DESTINATARIO / CLIENTE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Destinatario Spettabile:
              </span>
              <div className="font-bold text-slate-950 text-base">
                {order.client?.company || order.client?.name || 'Gentile Cliente'}
              </div>
              {order.client?.company && order.client?.name && (
                <div className="text-slate-700 text-xs font-medium mt-0.5">
                  C.A.: {order.client.name}
                </div>
              )}
              {order.client?.address && (
                <div className="text-slate-600 text-xs mt-1">{order.client.address}</div>
              )}
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Riferimenti Fiscali & Recapiti:
              </span>
              {order.client?.taxNumber && (
                <p className="text-slate-700 font-mono text-xs font-medium">
                  P.IVA / CF: <strong>{order.client.taxNumber}</strong>
                </p>
              )}
              {order.client?.email && (
                <p className="text-slate-600 text-xs">{order.client.email}</p>
              )}
              {order.client?.phone && (
                <p className="text-slate-600 text-xs">{order.client.phone}</p>
              )}
            </div>
          </div>

          {/* OGGETTO DELLA COMMESSA */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Oggetto della fornitura:
            </div>
            <div className="text-base font-black text-slate-900">{order.title}</div>
            <div className="text-slate-600 text-xs font-medium mt-0.5">{getTechName()}</div>
          </div>

          {/* TABELLA COMPUTO PREVENTIVO */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-900 text-xs font-black text-slate-900 uppercase">
                  <th className="py-3 px-2">Descrizione Lavorazione & Specifiche</th>
                  <th className="py-3 px-3 text-center">Quantità</th>
                  <th className="py-3 px-3 text-right">Prezzo Base</th>
                  <th className="py-3 px-3 text-right">Sconto Offerto</th>
                  <th className="py-3 px-3 text-right">Prezzo Unitario</th>
                  <th className="py-3 px-3 text-right">Importo Totale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-4 px-2">
                    <div className="font-bold text-slate-950 text-sm">
                      {order.recipeName}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                      <p>• Include materie prime da magazzino, tempi macchina, finitura e controllo qualità.</p>
                      {order.notes && <p>• Note commessa: {order.notes}</p>}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center font-mono font-black text-slate-900">
                    {order.quantity} pz
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-slate-500">
                    {formatCurrency(order.unitBasePrice)}
                  </td>
                  <td className="py-4 px-3 text-right font-mono font-semibold text-teal-700">
                    {order.volumeDiscountPercent > 0 ? `-${order.volumeDiscountPercent}%` : '—'}
                  </td>
                  <td className="py-4 px-3 text-right font-mono font-bold text-slate-950">
                    {formatCurrency(order.unitDiscountedPrice)}
                  </td>
                  <td className="py-4 px-3 text-right font-mono font-black text-slate-950 text-base">
                    {formatCurrency(subtotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTALI & RIEPILOGO IVA */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-80 space-y-2 border-t border-slate-200 pt-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Imponibile Fornitura:</span>
                <span className="font-mono font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>
                  {vatRate > 0 ? `IVA (${vatRate}%):` : 'IVA (Regime Forfettario 0%):'}
                </span>
                <span className="font-mono font-semibold">{formatCurrency(vatAmount)}</span>
              </div>

              <div className="flex justify-between text-lg font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                <span>{docType === 'fattura' ? 'TOTALE FATTURA:' : 'TOTALE PREVENTIVO:'}</span>
                <span className={`font-mono ${docType === 'fattura' ? 'text-blue-700' : 'text-teal-700'}`}>
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              {settings.iban && (
                <div className="pt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold block text-slate-900 text-[11px] uppercase tracking-wide">
                    Coordinate Bancarie per Pagamento:
                  </span>
                  <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                    IBAN: {settings.iban}
                  </div>
                  {settings.bankName && (
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Banca: {settings.bankName}
                    </div>
                  )}
                </div>
              )}

              {settings.invoiceNotes && (
                <p className="text-[10px] text-slate-500 italic pt-1">
                  {settings.invoiceNotes}
                </p>
              )}

              {vatRate === 0 && !settings.invoiceNotes && (
                <p className="text-[10px] text-slate-400 italic pt-1">
                  Operazione effettuata senza applicazione dell'IVA ai sensi dell'art. 1, commi 54-89, L. 190/2014.
                </p>
              )}
            </div>
          </div>

          {/* NOTE LEGALI, CONDIZIONI & FIRMA */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-500">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">
                  {docType === 'fattura' ? 'Note e Condizioni di Vendita:' : 'Termini e Condizioni di Fornitura:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfigBar(true);
                    setShowTermsDrawer(true);
                  }}
                  className="no-print text-2xs text-teal-700 hover:text-teal-900 font-semibold underline cursor-pointer"
                >
                  Modifica termini
                </button>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {docTerms || 'Nessun termine specifico inserito.'}
              </p>
            </div>

            <div className="flex flex-col justify-between h-full pt-4 sm:pt-0">
              <div className="text-right">
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Per Accettazione e Conferma d'Ordine:
                </span>
                <p className="text-xs text-slate-400">
                  Timbro e Firma leggibile del Committente
                </p>
              </div>

              <div className="mt-12 pt-2 border-b border-dashed border-slate-400 w-3/4 ml-auto text-right text-xs text-slate-400">
                Data e Firma per Accettazione
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
