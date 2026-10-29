/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FixedCostsConfig, OrderItem, WorkshopSettings } from '../types/calculator';
import { FixedCostsView } from './FixedCostsView';
import { MonthlyProfitAnalytics } from './MonthlyProfitAnalytics';
import {
  Settings,
  Building2,
  TrendingUp,
  Sliders,
  Upload,
  Image as ImageIcon,
  Trash2,
  Save,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  CreditCard,
  FileText,
  AlertCircle,
  Cpu,
} from 'lucide-react';

export type SettingsSubTab = 'tariffe' | 'anagrafica' | 'grafici';

interface SettingsViewProps {
  settings: WorkshopSettings;
  fixedCosts: FixedCostsConfig;
  orders: OrderItem[];
  activeSubTab?: SettingsSubTab;
  onSubTabChange?: (subTab: SettingsSubTab) => void;
  onSaveSettings: (settings: WorkshopSettings) => void;
  onOpenFixedCostsModal: () => void;
  onNavigateToMachines: () => void;
  onNavigateToOrders: () => void;
  onOpenNewOrder: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  fixedCosts,
  orders,
  activeSubTab: externalSubTab,
  onSubTabChange,
  onSaveSettings,
  onOpenFixedCostsModal,
  onNavigateToMachines,
  onNavigateToOrders,
  onOpenNewOrder,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<SettingsSubTab>('tariffe');
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSetSubTab = (tab: SettingsSubTab) => {
    setInternalSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // Stato locale modulo anagrafica
  const [formData, setFormData] = useState<WorkshopSettings>({
    ...settings,
    city: settings.city || 'Milano',
    zipCode: settings.zipCode || '20100',
    province: settings.province || 'MI',
    fiscalCode: settings.fiscalCode || '',
    pec: settings.pec || '',
    website: settings.website || '',
    sdiCode: settings.sdiCode || '0000000',
    iban: settings.iban || '',
    bankName: settings.bankName || '',
    logoUrl: settings.logoUrl || '',
    invoiceNotes:
      settings.invoiceNotes ||
      'Documento emesso per commessa digitale. Esente bollo per importi inferiori a € 77,47. Bonifico bancario a 30 gg.',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInputChange = (field: keyof WorkshopSettings, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Upload Logo da File locale
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Il logo non può superare i 2MB per consentire il salvataggio rapido in memoria.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          handleInputChange('logoUrl', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    handleInputChange('logoUrl', '');
  };

  const handleSubmitAnagrafica = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Intestazione Principale Pagina Impostazioni */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Settings className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700">
                  CONFIGURAZIONE BOTTEGA DIGITALE
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">Impostazioni Centralizzate</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Impostazioni Laboratorio, Ditta & Grafici
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Gestisci le tariffe orarie di laboratorio, l'anagrafica fiscale e logo per produrre fatture e consulta i grafici di andamento.
              </p>
            </div>
          </div>

          {/* Sotto-Menu a 3 Voci Esatte */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 shrink-0">
            <button
              type="button"
              onClick={() => handleSetSubTab('tariffe')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'tariffe'
                  ? 'bg-white text-purple-800 shadow-2xs font-extrabold'
                  : 'hover:text-slate-950'
              }`}
            >
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>1- Tariffe</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetSubTab('anagrafica')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'anagrafica'
                  ? 'bg-white text-blue-800 shadow-2xs font-extrabold'
                  : 'hover:text-slate-950'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>2- Anagrafica & Logo</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetSubTab('grafici')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'grafici'
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'hover:text-slate-950'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>3- Grafici</span>
            </button>
          </div>
        </div>
      </div>

      {/* SOTTO MENU 1: TARIFFE LABORATORIO */}
      {activeSubTab === 'tariffe' && (
        <div className="space-y-4">
          <FixedCostsView
            config={fixedCosts}
            onOpenEditModal={onOpenFixedCostsModal}
            onNavigateToMachines={onNavigateToMachines}
          />
        </div>
      )}

      {/* SOTTO MENU 2: ANAGRAFICA ARTIGIANO, DITTA & LOGO PER FATTURA */}
      {activeSubTab === 'anagrafica' && (
        <form onSubmit={handleSubmitAnagrafica} className="space-y-6 max-w-5xl mx-auto">
          {/* Card Sezione Logo e Ditta */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Anagrafica Fiscale & Identità Aziendale
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tutti i dati compilati qui vengono inseriti automaticamente nei documenti contabili, fatture elettroniche e preventivi A4.
                  </p>
                </div>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dati salvati con successo!</span>
                </div>
              )}
            </div>

            {/* SEZIONE LOGO AZIENDALE */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    Logo dell'Artigiano / Ditta per Fattura
                  </span>
                  <p className="text-xs text-slate-500">
                    Carica il tuo file immagine (PNG, JPG, SVG) o incolla un URL. Verrà stampato nell'intestazione di fatture e preventivi.
                  </p>
                </div>

                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Rimuovi Logo</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Anteprima Logo */}
                <div className="w-36 h-28 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-2xs p-2">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo Anteprima"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 text-center p-2">
                      <ImageIcon className="w-8 h-8 mb-1 text-slate-300" />
                      <span className="text-[10px] font-semibold">Nessun Logo</span>
                    </div>
                  )}
                </div>

                {/* Controlli Upload */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Carica Logo da Computer</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml, image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>

                    <span className="text-xs text-slate-400 text-center sm:text-left">oppure incolla URL:</span>
                  </div>

                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    placeholder="https://tuosito.it/logo.png"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* CAMPI ANAGRAFICI FATTURA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Ditta / Ragione Sociale *
                </label>
                <input
                  type="text"
                  required
                  value={formData.workshopName}
                  onChange={(e) => handleInputChange('workshopName', e.target.value)}
                  placeholder="es. Bottega Artigiani Digitali Srls"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome dell'Artigiano / Titolare *
                </label>
                <input
                  type="text"
                  required
                  value={formData.artisanName}
                  onChange={(e) => handleInputChange('artisanName', e.target.value)}
                  placeholder="es. Marco Valenti"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Partita IVA *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vatNumber}
                  onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                  placeholder="IT 09876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Codice Fiscale (C.F.)
                </label>
                <input
                  type="text"
                  value={formData.fiscalCode || ''}
                  onChange={(e) => handleInputChange('fiscalCode', e.target.value.toUpperCase())}
                  placeholder="es. VLNMRA85M15F205Z"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Codice Univoco Destinatario SDI (Fattura Elettronica)
                </label>
                <input
                  type="text"
                  value={formData.sdiCode || ''}
                  onChange={(e) => handleInputChange('sdiCode', e.target.value.toUpperCase())}
                  placeholder="es. M5UXCR1 oppure 0000000"
                  maxLength={7}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Posta Elettronica Certificata (PEC)
                </label>
                <input
                  type="email"
                  value={formData.pec || ''}
                  onChange={(e) => handleInputChange('pec', e.target.value)}
                  placeholder="azienda@pec.it"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telefono / Cellulare *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+39 02 8945 1200"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Ordinaria *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="officina@artigianidigitali.it"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sito Web / Portfolio
                </label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.artigianidigitali.it"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Slogan o Descrizione Attività
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  placeholder="Stampa 3D, Taglio Laser, CNC e Manifattura Digitale"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* INDIRIZZO E SEDE */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 mb-3">
                Sede Legale ed Operativa
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Via e Numero Civico *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Via delle Manifatture 42"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Città *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Milano"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      CAP
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode || ''}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="20100"
                      maxLength={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-sm text-center font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      value={formData.province || ''}
                      onChange={(e) => handleInputChange('province', e.target.value.toUpperCase())}
                      placeholder="MI"
                      maxLength={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-sm text-center uppercase font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* COORDINATE BANCARIE E NOTE FATTURA */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Coordinate di Pagamento su Fattura (Bonifico Bancario)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    IBAN Bancario per Incasso
                  </label>
                  <input
                    type="text"
                    value={formData.iban || ''}
                    onChange={(e) => handleInputChange('iban', e.target.value.toUpperCase())}
                    placeholder="IT60X0542811101000000123456"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Istituto Bancario
                  </label>
                  <input
                    type="text"
                    value={formData.bankName || ''}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Banca Intesa Sanpaolo - Sede Milano"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note di Fatturazione Fisse (Diciture di legge, Regime forfettario o esenzioni)
                </label>
                <textarea
                  rows={2}
                  value={formData.invoiceNotes || ''}
                  onChange={(e) => handleInputChange('invoiceNotes', e.target.value)}
                  placeholder="es. Operazione effettuata ai sensi dell'art. 1, commi da 54 a 89 della Legge n. 190/2014. Esente bollo per importi inferiori a € 77,47."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Termini e Condizioni di Fornitura Standard
                </label>
                <textarea
                  rows={3}
                  value={formData.termsAndConditions}
                  onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Pulsante Salvataggio */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-extrabold shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salva Anagrafica & Logo per Fattura</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SOTTO MENU 3: GRAFICI (SENZA LA DICITURA "PROFITTO") */}
      {activeSubTab === 'grafici' && (
        <div className="space-y-4">
          <MonthlyProfitAnalytics
            orders={orders}
            onNavigateToOrders={onNavigateToOrders}
            onOpenNewOrder={onOpenNewOrder}
          />
        </div>
      )}
    </div>
  );
};
