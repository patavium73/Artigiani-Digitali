/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Box,
  ShoppingCart,
  Users,
  Settings,
  Plus,
  Cpu,
  TrendingUp,
} from 'lucide-react';

export type NavTab = 'recipes' | 'materials' | 'machines' | 'orders' | 'clients' | 'settings' | 'analytics' | 'fixedCosts';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNewRecipe: () => void;
  onOpenNewMaterial: () => void;
  onOpenNewOrder: () => void;
  onOpenNewMachine: () => void;
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
  materialsCount,
  recipesCount,
  ordersCount,
  machinesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-18">
          {/* Logo Brand Artigiani Digitali */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              AD
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('recipes');
              }}
              className="text-lg font-black tracking-tight text-slate-950 whitespace-nowrap shrink-0 hover:text-blue-700 transition-colors"
            >
              Artigiani Digitali
            </a>
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

          {/* Azione Rapida Primaria */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenNewOrder}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
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
      </div>
    </header>
  );
};
