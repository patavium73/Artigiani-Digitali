/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Download,
  Laptop,
  Smartphone,
  Share,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstallPrompt: () => void;
  hasNativePrompt: boolean;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstallPrompt,
  hasNativePrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Testata */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 relative border-b border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Installa Artigiani Digitali
              </h3>
            </div>
          </div>
        </div>

        {/* Contenuto & Istruzioni per dispositivo */}
        <div className="p-6 space-y-5">
          {hasNativePrompt ? (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-center space-y-3">
              <span className="text-xs font-bold text-teal-900 block">
                Il tuo browser supporta l'installazione istantanea con 1 clic:
              </span>
              <button
                type="button"
                onClick={() => {
                  onTriggerInstallPrompt();
                  onClose();
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Installa sul tuo dispositivo adesso</span>
              </button>
            </div>
          ) : null}

          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Istruzioni d'installazione passo-passo:
            </span>

            {/* 1. PC Windows / Mac */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <strong className="text-slate-900 block font-bold">
                  Su PC Windows o Mac (Chrome / Edge):
                </strong>
                <p className="text-slate-600">
                  Guarda nella barra degli indirizzi in alto a destra: troverai l'icona <span className="font-bold text-slate-800">"Installa applicazione"</span> (un monitor con freccia verso il basso) oppure clicca sui <strong>tre puntini ⋮ &gt; "Installa Artigiani Digitali"</strong>.
                </p>
              </div>
            </div>

            {/* 2. Android */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <strong className="text-slate-900 block font-bold">
                  Su Smartphone o Tablet Android (Chrome):
                </strong>
                <p className="text-slate-600">
                  Tocca i <strong>tre puntini ⋮</strong> in alto a destra e seleziona <strong>"Installa applicazione"</strong> oppure <strong>"Aggiungi a schermata Home"</strong>.
                </p>
              </div>
            </div>

            {/* 3. iPhone / iPad (iOS Safari) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Share className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <strong className="text-slate-900 block font-bold">
                  Su iPhone o iPad (Safari):
                </strong>
                <p className="text-slate-600">
                  Tocca il tasto <strong>Condividi</strong> (icona quadrata con freccia in alto), scorri verso il basso e tocca <strong>"Aggiungi alla schermata Home"</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500">
            <span className="flex items-center gap-1.5 text-teal-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Avvio istantaneo a schermo intero & cache offline attiva</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg cursor-pointer"
            >
              Ho capito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
