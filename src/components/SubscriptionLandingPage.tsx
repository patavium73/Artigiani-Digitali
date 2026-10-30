/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth, SubscriptionTier } from '../contexts/AuthContext';
import {
  Check,
  Zap,
  Shield,
  Smartphone,
  Printer,
  Wrench,
  CreditCard,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  Clock,
  Laptop,
  Flame,
  Cpu,
  Package,
  FileText,
  Sliders,
  DollarSign,
  AlertTriangle,
  Play,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface SubscriptionLandingPageProps {
  onBackToApp: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const SubscriptionLandingPage: React.FC<SubscriptionLandingPageProps> = ({
  onBackToApp,
  onOpenAuth,
}) => {
  const { user, subscription, upgradeTier } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [jobsPerMonth, setJobsPerMonth] = useState<number>(40);
  const [isProcessingTier, setIsProcessingTier] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calcolo ROI stimato dinamico
  const estimatedHoursSaved = Math.round(jobsPerMonth * 0.4);
  const estimatedMoneySaved = Math.round(jobsPerMonth * 9.2);

  const handleSelectPlan = async (tier: SubscriptionTier) => {
    if (!user) {
      onOpenAuth('register');
      return;
    }

    if (tier === 'free') {
      onBackToApp();
      return;
    }

    setIsProcessingTier(tier);
    try {
      await upgradeTier(tier, billingPeriod);
      setSuccessMessage(
        `Piano ${tier === 'pro' ? 'Artigiano Pro' : 'Laboratorio Team'} attivato con successo tramite Stripe!`
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onBackToApp();
      }, 2000);
    } catch (err: any) {
      alert("Errore durante l'attivazione: " + err.message);
    } finally {
      setIsProcessingTier(null);
    }
  };

  const FAQS = [
    {
      q: 'Come accedo se ho già acquistato o ho già un account?',
      a: 'Basta cliccare sul pulsante "Accedi" in alto a destra o su uno dei pulsanti di login. Inserisci la tua email e password (oppure accedi con Google con 1 clic) e ritroverai tutti i tuoi dati, clienti e macchine sincronizzati.',
    },
    {
      q: 'Posso esplorare il gestionale prima di acquistare un piano?',
      a: 'Sì! Offriamo un Accesso Libero con il piano Starter Free (fino a 2 macchine e 5 ricette). Puoi provare subito il calcolatore costi, la stima energetica e la gestione materiali. Quando vorrai sbloccare più macchine e le fatture PDF, potrai passare a Pro in qualunque momento.',
    },
    {
      q: 'Quante macchine posso configurare con il piano Artigiano Pro?',
      a: 'Con il piano Artigiano Pro puoi configurare fino a 5 macchine o impianti (qualsiasi combinazione di stampanti 3D FDM, Resina MSLA, Incisori/Taglio Laser CO2 o Fibra e Frese CNC). Per parchi macchine illimitati è disponibile il piano Laboratorio Team.',
    },
    {
      q: 'Posso installare l\'app su PC Windows e smartphone da officina?',
      a: 'Certamente! L\'applicazione è una PWA industriale ad alte prestazioni. Puoi installarla direttamente dal browser sul desktop del tuo PC Windows/Mac oppure sulla schermata home di smartphone e tablet Android, usandola comodamente davanti ai macchinari in officina.',
    },
    {
      q: 'Come funziona la fatturazione con Stripe?',
      a: 'I pagamenti sono gestiti dall\'infrastruttura certificata PCI-DSS di Stripe. Accettiamo carte di credito, debito, Apple Pay e Google Pay. Riceverai la fattura deducibile con P.IVA e codice SDI ad ogni rinnovo.',
    },
    {
      q: 'Posso cancellare o modificare l\'abbonamento in qualsiasi momento?',
      a: 'Sì, nessun vincolo e nessuna penale. Puoi annullare il rinnovo con un semplice clic direttamente dal pannello del tuo account o passare dal ciclo mensile a quello annuale.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      {/* BACKGROUND INDUSTRIAL CAD GRID */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px'
        }}
      />

      {/* TOP NAVIGATION BAR - INDUSTRIAL OFFICINA */}
      <header className="sticky top-0 z-40 bg-[#0c121e]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Officina */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/25 border border-orange-400/40">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-white block">
                OFFICINA<span className="text-orange-500">CALC</span> 3D
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                PRO v2.5
              </span>
            </div>
            <span className="text-2xs text-slate-400 font-mono tracking-wider block">
              SaaS Gestionale per Service 3D, Laser & CNC
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pulsante Esplora Senza Registrazione */}
          <button
            type="button"
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Esplora Gestionale (Free)</span>
            <span className="sm:hidden">Prova Free</span>
          </button>

          {!user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                Accedi
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-2 rounded-lg text-xs font-black text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                Crea Account
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 hidden md:inline max-w-[140px] truncate">{user.email}</span>
              <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-3xs font-mono font-bold uppercase border border-orange-500/30">
                {subscription.planName}
              </span>
              <button
                type="button"
                onClick={onBackToApp}
                className="ml-1 text-2xs font-bold text-orange-400 hover:underline cursor-pointer"
              >
                Vai al Gestionale →
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Messaggio Notifica Successo */}
      {successMessage && (
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 text-center max-w-5xl mx-auto space-y-6">
        {/* Tech Badge Laser */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold tracking-wide shadow-sm shadow-orange-500/10">
          <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span>CALCOLATORE INDUSTRIALE COMMESSE & MARGINI REALI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Basta preventivi a occhio.{' '}
          <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
            Calcola tempi, usura e utile reale al centesimo.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
          Il software dedicato ad artigiani, maker e service di <strong>Stampa 3D (FDM/Resina)</strong>, <strong>Taglio Laser</strong> e <strong>Fresatura CNC</strong>. Computo orario esatto, scarti, tariffe elettriche e fatture PDF pronte per il cliente.
        </p>

        {/* CTA Buttons Hero */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a
            href="#pricing"
            className="px-6 py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-orange-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-orange-400/50"
          >
            <span>Vedi Piani & Abbonati con Stripe</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </a>

          <button
            type="button"
            onClick={onBackToApp}
            className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm rounded-xl border border-slate-700/90 transition-all flex items-center gap-2 cursor-pointer hover:border-orange-500/40"
          >
            <Play className="w-4 h-4 text-orange-400" />
            <span>Esplora Subito Senza Carta</span>
          </button>
        </div>

        {/* Specifiche Tecniche Badge Strip */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          {[
            {
              icon: Cpu,
              title: 'Ammortamento Macchine',
              desc: 'Costo orario reale basato su ore vita, usura e consumi kW/h',
            },
            {
              icon: Package,
              title: 'Magazzino & Scorte',
              desc: 'Giacenze in grammi e fogli, costo al grammo e allarmi scorta',
            },
            {
              icon: FileText,
              title: 'Preventivi & Fatture PDF',
              desc: 'Documenti intestati con logo, P.IVA, SDI e clausole legali',
            },
            {
              icon: Smartphone,
              title: 'Web SaaS + PWA Mobile',
              desc: 'Installabile su PC da disegno e su tablet/smartphone in officina',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors backdrop-blur-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-2.5">
                <item.icon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white tracking-wide">{item.title}</div>
              <div className="text-2xs text-slate-400 mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SIMULATORE ROI INTERATTIVO - STILE BANCO OFFICINA */}
      <section className="bg-[#0b101c] border-y border-slate-800/90 py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-2xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
              SIMULATORE DI REDDITIVITÀ OFFICINA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Quanto utile in più generi ogni mese con il controllo costi?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Trascina il selettore in base al volume mensile di pezzi o commesse prodotte nel tuo laboratorio:
            </p>
          </div>

          <div className="bg-[#0f172a] p-5 sm:p-7 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-200 mb-2">
                <span>Commesse / Pezzi prodotti al mese:</span>
                <span className="text-orange-400 font-mono text-xl sm:text-2xl font-black">
                  {jobsPerMonth} pezzi / ordini
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={jobsPerMonth}
                onChange={(e) => setJobsPerMonth(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-3xs text-slate-500 mt-2 font-mono">
                <span>5 ordini (Hobbista)</span>
                <span>50 ordini (Service Medio)</span>
                <span>200 ordini (Produzione Continua)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-orange-500/20">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold mb-1">
                  <Clock className="w-4 h-4 text-orange-400" />
                  Ore risparmiate in calcoli manuali:
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  ~{estimatedHoursSaved} ore <span className="text-xs font-normal text-slate-400">/ mese</span>
                </div>
                <p className="text-2xs text-slate-400 mt-1">
                  Niente più fogli Excel sparsi o verifiche manuali dei consumi elettrici.
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/20">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold mb-1">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Utile netto protetto (Zero vendite sottocosto):
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  +{estimatedMoneySaved} € <span className="text-xs font-normal text-slate-400">/ mese</span>
                </div>
                <p className="text-2xs text-slate-400 mt-1">
                  Grazie al calcolo esatto di scarto pezzo, packaging, usura ugello/frese e marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE PIANI & TARIFFE (CON FOCUS MASSIMA LEGGIBILITA' SU ARTIGIANO PRO) */}
      <section id="pricing" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-10 w-full">
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-mono font-bold uppercase">
            <span>TARIFFE TRASPARENTI 2026</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Scegli il piano per la dimensione della tua officina
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Nessun costo nascosto. Fattura con P.IVA e codice SDI immediata. Puoi disdire in qualunque momento con 1 clic.
          </p>

          {/* Toggle Fatturazione Mensile / Annuale */}
          <div className="pt-3 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Fatturazione Mensile
            </span>
            <button
              type="button"
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="w-13 h-7 bg-slate-800 rounded-full p-1 border border-slate-700 relative transition-colors cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-orange-500 shadow-md transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'text-white' : 'text-slate-400'}`}>
              <span>Fatturazione Annuale</span>
              <span className="bg-orange-500/20 text-orange-400 text-3xs font-mono px-2 py-0.5 rounded-full border border-orange-500/40 font-bold">
                2 Mesi Gratis (-20%)
              </span>
            </span>
          </div>
        </div>

        {/* GRIGLIA COMPARATIVA DEI 3 PIANI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* PIANO 1: STARTER FREE */}
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  BASE
                </span>
                <span className="text-2xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                  Senza Scadenza
                </span>
              </div>

              <div className="text-xl font-black text-white mt-2">
                Starter Free
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">0 €</span>
                <span className="text-xs text-slate-400">/ per sempre</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 min-h-[36px]">
                Ideale per hobbisti o per esplorare le funzionalità del gestionale in anteprima.
              </p>

              <div className="border-t border-slate-800/80 my-5"></div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Fino a 2 Macchine</strong> configurabili</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Fino a 5 Ricette</strong> prodotto</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Calcolo orario kWh e ammortamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Archivio materiali di base</span>
                </li>
                <li className="flex items-start gap-2 text-slate-500">
                  <span className="w-4 h-4 text-center shrink-0">✕</span>
                  <span>Nessuna generazione di fatture e preventivi PDF</span>
                </li>
                <li className="flex items-start gap-2 text-slate-500">
                  <span className="w-4 h-4 text-center shrink-0">✕</span>
                  <span>Nessun allarme scorte magazzino</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('free')}
              className="mt-8 w-full py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
            >
              Usa Versione Free
            </button>
          </div>

          {/* PIANO 2: ARTIGIANO PRO (MASSIMA LEGGIBILITA', BORDO ARANCIO LASER, PIU' SCELTO) */}
          <div className="bg-[#131b2e] rounded-2xl p-6 sm:p-7 border-2 border-orange-500 shadow-2xl shadow-orange-500/15 flex flex-col justify-between relative transform md:-translate-y-2">
            {/* BADGE DI EVIDENZA */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
              ★ PIÙ SCELTO DAI SERVICE
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
                  PROFESSIONALE
                </span>
                <span className="text-2xs bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  Consigliato
                </span>
              </div>

              {/* NOME AD ALTA VISIBILITA' */}
              <div className="text-2xl font-black text-white mt-2 tracking-tight">
                Artigiano Pro
              </div>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                  {billingPeriod === 'annual' ? '9,90 €' : '14,00 €'}
                </span>
                <span className="text-xs text-slate-300 font-semibold">/ mese</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium min-h-[36px]">
                Per artigiani e service che necessitano di calcolo affidabile e documenti cliente completi.
              </p>

              <div className="border-t border-slate-700/80 my-5"></div>

              {/* LISTA VANTAGGI PRO CON LIMITE 5 MACCHINE */}
              <ul className="space-y-3 text-xs text-white">
                <li className="flex items-start gap-2.5 font-bold">
                  <div className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>Fino a 5 Macchine / Impianti</strong> (FDM, Resina, Laser, CNC)</span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>Ricette e Magazzino materiali illimitati</strong></span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>Fatture e Preventivi PDF</strong> con Logo, P.IVA e Dati Azienda</span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>Allarmi scorte sottolivello</strong> con ricarica rapida</span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>Simulatore commissioni</strong> (Etsy, Shopify, B2B, POS)</span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>Calcolo corriere</strong> peso volumetrico e imballaggi</span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Sincronizzazione Cloud Firebase PC + Smartphone</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              disabled={isProcessingTier === 'pro'}
              onClick={() => handleSelectPlan('pro')}
              className="mt-8 w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer border border-orange-400"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isProcessingTier === 'pro'
                  ? 'Elaborazione Stripe...'
                  : subscription.tier === 'pro'
                  ? 'Il Tuo Piano Attivo ✓'
                  : 'Abbonati ad Artigiano Pro'}
              </span>
            </button>
          </div>

          {/* PIANO 3: LABORATORIO TEAM (MACCHINE ILLIMITATE, RIMOSSO WHATSAPP) */}
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  OFFICINA & SQUADRA
                </span>
                <span className="text-2xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                  Illimitato
                </span>
              </div>

              <div className="text-xl font-black text-white mt-2">
                Laboratorio Team
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {billingPeriod === 'annual' ? '24,00 €' : '29,00 €'}
                </span>
                <span className="text-xs text-slate-400">/ mese</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 min-h-[36px]">
                Per officine con più operatori al banco e parchi macchine industriali complessi.
              </p>

              <div className="border-t border-slate-800/80 my-5"></div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5 font-bold text-white">
                  <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>Macchine e Impianti ILLIMITATI</strong></span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Tutte le funzionalità di Artigiano Pro incluse</span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong>Schede banco officina per operatori</strong></span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Accesso multi-operatore e permessi di squadra</span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Report analitici avanzati di produzione e ore</span>
                </li>
                <li className="flex items-start gap-2.5 font-medium">
                  <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Esportazione contabile avanzata (Excel & CSV)</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              disabled={isProcessingTier === 'team'}
              onClick={() => handleSelectPlan('team')}
              className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-500/40"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>
                {isProcessingTier === 'team'
                  ? 'Elaborazione Stripe...'
                  : subscription.tier === 'team'
                  ? 'Il Tuo Piano Attivo ✓'
                  : 'Attiva Laboratorio Team'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* SEZIONE FAQ */}
      <section className="bg-[#0b101c] border-t border-slate-800/90 py-14 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-2xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
              SUPPORTO & DETTAGLI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Domande Frequenti dei Maker
            </h2>
          </div>

          <div className="space-y-3 pt-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-orange-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Bar CTA */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131d33] to-slate-900 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">
              Pronto a proteggere i tuoi margini di produzione?
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Puoi iniziare subito con l'accesso libero o passare a Pro per salvare fino a 5 macchine e generare fatture PDF.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBackToApp}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Entra nel Gestionale →
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 cursor-pointer transition-all"
              >
                Accedi al Tuo Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080c14] border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-slate-300">OFFICINACALC 3D</span>
            <span>— SaaS per Maker e Service Artigiani</span>
          </div>
          <div className="flex items-center gap-4 text-2xs text-slate-400">
            <span>Server Europei Sicuri</span>
            <span>•</span>
            <span>Stripe Payments</span>
            <span>•</span>
            <span>Zero Lock-In</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
