/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  X,
  Cloud,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Laptop,
  Eye,
  EyeOff,
  Building,
  Wrench,
  Printer,
  Zap,
  ArrowRight,
  Send,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
}) => {
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    logout,
    subscription,
    getFriendlyAuthError,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Campi Registrazione
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [craftSector, setCraftSector] = useState('Stampa 3D (FDM / Resina)');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessInfo(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    if (!name.trim()) {
      setError('Inserisci il tuo nome o la ragione sociale della tua attività.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }

    if (password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Le due password inserite non coincidono. Controlla e riprova.');
      return;
    }

    if (!acceptTerms) {
      setError('Devi accettare i termini di servizio per proseguire.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password, name, craftSector);
      setSuccessInfo('Registrazione completata! Benvenuto nel tuo laboratorio cloud.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Inserisci l\'indirizzo email registrato.');
      return;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email);
      setSuccessInfo('Email di recupero inviata! Controlla la tua casella di posta elettronica.');
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessInfo(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Testata della Modale */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white p-6 relative border-b border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {user
                  ? 'Il Tuo Account Laboratorio'
                  : mode === 'register'
                  ? 'Registrazione Artigiani Digitali'
                  : mode === 'forgot'
                  ? 'Recupero Password'
                  : 'Accesso al Gestionale Cloud'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {user
                  ? 'Dati e macchinari sincronizzati su Cloud Firebase.'
                  : mode === 'register'
                  ? 'Crea il tuo profilo cloud in 30 secondi per salvare macchine e preventivi.'
                  : 'Accedi per consultare i tuoi calcoli da PC, tablet o smartphone.'}
              </p>
            </div>
          </div>

          {/* Tab Selettore: Registrati vs Accedi (Solo se non loggato) */}
          {!user && mode !== 'forgot' && (
            <div className="grid grid-cols-2 gap-1 bg-slate-950/60 p-1 rounded-xl mt-5 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setSuccessInfo(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Crea Nuovo Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessInfo(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Ho già un Account
              </button>
            </div>
          )}
        </div>

        {/* Corpo della Modale */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Notifiche Errore & Successo */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-semibold">{successInfo}</span>
            </div>
          )}

          {user ? (
            /* STATO: UTENTE GIÀ CONNESSO */
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs uppercase tracking-wider font-bold text-teal-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>{user.isLocal ? 'Profilo Artigiano Attivo' : 'Connesso al Cloud Firebase'}</span>
                  </span>
                  <span className="bg-teal-600 text-white text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded">
                    {subscription.planName}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {user.displayName || 'Artigiano Registrato'}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  {user.email}
                </div>
                <p className="text-2xs text-teal-800 pt-1">
                  {user.isLocal
                    ? 'Account registrato e attivo. Macchine, ricette e preventivi sono memorizzati e operativi.'
                    : 'Tutte le modifiche a ricette, magazzino e preventivi sono salvate in cloud e accessibili da qualsiasi dispositivo.'}
                </p>

                {user.isLocal && (
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full mt-2 py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-teal-300 text-2xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Collega anche account Google per sincronizzazione cloud multi-dispositivo</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-slate-500" />
                  <span>PC Officina / Slicer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <span>Smartphone & Tablet</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="w-full py-2.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
              >
                Disconnetti Account
              </button>
            </div>
          ) : mode === 'register' ? (
            /* ======================================================== */
            /* FORM COMPLETO REGISTRAZIONE ARTIGIANO */
            /* ======================================================== */
            <div className="space-y-4">
              {/* Tasto Google 1-Click */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Registrati subito con Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-3xs font-bold text-slate-400 uppercase tracking-wider relative">
                  oppure compila i dati
                </span>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Nome Artigiano / Ditta */}
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome e Cognome o Ragione Sociale *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="es. Mario Rossi (Officina 3D)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Settore Principale */}
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Attività / Impianti Principali
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {[
                      { key: 'Stampa 3D (FDM / Resina)', label: 'Stampa 3D (FDM/Resina)' },
                      { key: 'Taglio & Incisione Laser', label: 'Taglio & Laser' },
                      { key: 'Fresatura & CNC', label: 'Fresatura CNC' },
                      { key: 'Maker / FabLab Misto', label: 'Laboratorio Misto' },
                    ].map((sec) => (
                      <button
                        key={sec.key}
                        type="button"
                        onClick={() => setCraftSector(sec.key)}
                        className={`p-2 rounded-lg text-left text-2xs font-semibold border transition-all cursor-pointer ${
                          craftSector === sec.key
                            ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email di Accesso *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mario@officina3d.it"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Password e Conferma Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password (min. 6 car.) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Conferma Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full bg-slate-50 border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden ${
                          confirmPassword && password !== confirmPassword
                            ? 'border-red-400 bg-red-50/30'
                            : 'border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Consenso Termini */}
                <label className="flex items-start gap-2 pt-1 text-2xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded accent-teal-600 cursor-pointer"
                  />
                  <span>
                    Accetto i termini di servizio e il trattamento sicuro dei dati per la gestione commesse.
                  </span>
                </label>

                {/* Bottone Registrazione */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <span>Registrazione in corso...</span>
                  ) : (
                    <>
                      <span>Crea Account Gratuito e Accedi</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : mode === 'login' ? (
            /* ======================================================== */
            /* FORM ACCESSO EMAIL & PASSWORD */
            /* ======================================================== */
            <div className="space-y-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Accedi con Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-3xs font-bold text-slate-400 uppercase tracking-wider relative">
                  oppure con email
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="titolare@laboratorio.it"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-2xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-2xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer underline"
                    >
                      Password dimenticata?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <span>Verifica in corso...</span> : <span>Accedi al Laboratorio</span>}
                </button>
              </form>
            </div>
          ) : (
            /* ======================================================== */
            /* RECUPERO PASSWORD */
            /* ======================================================== */
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Inserisci l'indirizzo email con cui ti sei registrato. Ti invieremo un link sicuro per reimpostare la password.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Indirizzo Email Registrato
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="titolare@laboratorio.it"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Invio in corso...' : 'Invia Link di Recupero'}</span>
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline cursor-pointer"
                >
                  ← Torna alla schermata di accesso
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
