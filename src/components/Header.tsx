/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Box,
  ShoppingCart,
  Users,
  Settings,
  Plus,
  Cpu,
  Cloud,
  Sparkles,
  Download,
  CreditCard,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { InstallGuideModal } from './InstallGuideModal';

export type NavTab =
  | 'recipes'
  | 'materials'
  | 'machines'
  | 'orders'
  | 'clients'
  | 'settings'
  | 'analytics'
  | 'fixedCosts';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNewRecipe: () => void;
  onOpenNewMaterial: () => void;
  onOpenNewOrder: () => void;
  onOpenNewMachine: () => void;
  onOpenLanding: () => void;
  onOpenAuth: () => void;
  materialsCount: number;
  recipesCount: number;
  ordersCount: number;
  machinesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRecipe,
  onOpenNewMaterial,
  onOpenNewOrder,
  onOpenNewMachine,
  onOpenLanding,
  onOpenAuth,
  materialsCount,
  recipesCount,
  ordersCount,
  machinesCount,
}) => {
  const { user, subscription, isCloudSynced, logout } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
    } else {
      setIsInstallModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-18">
          
          {/* Logo Brand OfficinaCalc 3D */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-orange-600 text-white flex items-center justify-center font-black text-base shadow-xs border border-orange-500/20">
              <Cpu className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('recipes');
                }}
                className="text-lg font-black tracking-tight text-slate-950 whitespace-nowrap shrink-0 hover:text-orange-600 transition-colors block"
              >
                OFFICINA<span className="text-orange-600">CALC</span> 3D
              </a>
              <div className="flex items-center gap-2">
                <span className="text-3xs font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                  SaaS PWA
                </span>
                <span className="text-3xs text-orange-600 font-bold uppercase tracking-wider font-mono">
                  {subscription.tier === 'pro'
                    ? 'PRO (5 MACCHINE)'
                    : subscription.tier === 'team'
                    ? 'TEAM (ILLIMITATO)'
                    : 'STARTER FREE'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigazione Principale con Icone Colorate */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex items-center gap-2 py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'recipes'
                  ? 'text-purple-700 font-extrabold border-b-2 border-purple-700'
                  : 'hover:text-slate-950 border-b-2 border-transparent'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center text-purple-700">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span>Ricette ({recipesCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'materials'
                  ? 'text-blue-700 font-extrabold border-b-2 border-blue-700'
                  : 'hover:text-slate-950 border-b-2 border-transparent'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-700">
                <Box className="w-3.5 h-3.5" />
              </div>
              <span>Magazzino ({materialsCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('machines')}
              className={`flex items-center gap-2 py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'machines'
                  ? 'text-indigo-700 font-extrabold border-b-2 border-indigo-700'
                  : 'hover:text-slate-950 border-b-2 border-transparent'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span>Parco Macchine ({machinesCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'orders'
                  ? 'text-teal-700 font-extrabold border-b-2 border-teal-700'
                  : 'hover:text-slate-950 border-b-2 border-transparent'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center text-teal-700">
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
              <span>Ordini & Lotti ({ordersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'clients'
                  ? 'text-amber-700 font-extrabold border-b-2 border-amber-700'
                  : 'hover:text-slate-950 border-b-2 border-transparent'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span>Clienti</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'settings' || activeTab === 'fixedCosts' || activeTab === 'analytics'
                  ? 'text-purple-700 font-extrabold border-b-2 border-purple-700'
                  : 'hover:text-slate-950 border-b-2 border-transparent'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center text-purple-700">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <span>Impostazioni</span>
            </button>
          </nav>

          {/* Azioni Rapide SaaS: PWA Install, Cloud Sync, Piani & Nuovo Ordine */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Tasto Installa PWA */}
            <button
              type="button"
              onClick={handleInstallClick}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Installa Artigiani Digitali come applicazione su Windows o Android"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Installa App</span>
            </button>

            {/* Se loggato: mostra profilo e Logoff. Se non loggato: mostra Login e Piani & Prezzi */}
            {user ? (
              <>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 transition-colors cursor-pointer max-w-[160px]"
                  title="Visualizza dettagli account"
                >
                  <User className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span className="truncate hidden sm:inline">{user.displayName || user.email || 'Artigiano'}</span>
                  <span className="sm:hidden">Profilo</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                  title="Disconnetti account"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Logoff</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all cursor-pointer"
                  title="Accedi o crea un account"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-600" />
                  <span>Login</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenLanding}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                  title="Visualizza i piani abbonamento SaaS"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Piani & Prezzi</span>
                </button>
              </>
            )}

            {/* Tasto Primario Nuovo Ordine */}
            <button
              type="button"
              onClick={onOpenNewOrder}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Nuovo Ordine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet nav bar */}
      <div className="xl:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${
            activeTab === 'recipes' ? 'bg-purple-100 text-purple-900 font-black' : 'bg-slate-100'
          }`}
        >
          Ricette ({recipesCount})
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${
            activeTab === 'materials' ? 'bg-blue-100 text-blue-900 font-black' : 'bg-slate-100'
          }`}
        >
          Magazzino ({materialsCount})
        </button>
        <button
          onClick={() => setActiveTab('machines')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${
            activeTab === 'machines' ? 'bg-indigo-100 text-indigo-900 font-black' : 'bg-slate-100'
          }`}
        >
          Macchine ({machinesCount})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${
            activeTab === 'orders' ? 'bg-teal-100 text-teal-900 font-black' : 'bg-slate-100'
          }`}
        >
          Ordini ({ordersCount})
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${
            activeTab === 'clients' ? 'bg-amber-100 text-amber-900 font-black' : 'bg-slate-100'
          }`}
        >
          Clienti
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'settings' || activeTab === 'fixedCosts' || activeTab === 'analytics'
              ? 'bg-purple-100 text-purple-900 font-black'
              : 'bg-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-purple-700" />
          <span>Impostazioni</span>
        </button>

        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 bg-teal-100 text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3 h-3 text-teal-700" />
          <span>Installa App</span>
        </button>

        {user ? (
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 bg-red-100 text-red-900 font-bold flex items-center gap-1 cursor-pointer"
            title="Disconnetti account"
          >
            <LogOut className="w-3 h-3 text-red-700" />
            <span>Logoff</span>
          </button>
        ) : (
          <>
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 bg-slate-100 text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <LogIn className="w-3 h-3 text-teal-700" />
              <span>Login</span>
            </button>

            <button
              onClick={onOpenLanding}
              className="px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 bg-amber-100 text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Abbonamento</span>
            </button>
          </>
        )}
      </div>

      {/* Modale Guida Installazione PWA */}
      <InstallGuideModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onTriggerInstallPrompt={() => deferredPrompt?.prompt()}
        hasNativePrompt={!!deferredPrompt}
      />
    </header>
  );
};
