/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';

export type SubscriptionTier = 'free' | 'pro' | 'team';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  expiresAt?: string;
  stripeCustomerId?: string;
  planName: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  craftSector?: string;
  isLocal?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  subscription: UserSubscription;
  isCloudSynced: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, craftSector?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  upgradeTier: (tier: SubscriptionTier, period: 'monthly' | 'annual') => Promise<{ checkoutUrl?: string }>;
  getFriendlyAuthError: (error: any) => string;
}

const DEFAULT_SUBSCRIPTION: UserSubscription = {
  tier: 'free',
  status: 'active',
  planName: 'Starter Free',
};

export const getFriendlyAuthError = (error: any): string => {
  if (!error) return 'Si è verificato un errore imprevisto.';
  const code = error.code || '';
  const message = error.message || '';

  if (code.includes('operation-not-allowed')) {
    return 'Il provider Email/Password non è ancora abilitato su questa console Firebase. Abbiamo attivato il tuo profilo artigiano e puoi anche usare "Accedi con Google" (1 clic).';
  }
  if (code.includes('email-already-in-use')) {
    return 'Questo indirizzo email risulta già registrato. Accedi con le tue credenziali oppure recupera la password.';
  }
  if (code.includes('weak-password')) {
    return 'La password scelta è troppo debole. Utilizza almeno 6 caratteri alfanumerici.';
  }
  if (code.includes('invalid-email')) {
    return 'L\'indirizzo email inserito non è valido. Controlla il formato (es. nome@dominio.it).';
  }
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'Email o password non corrispondenti. Verifica i dati inseriti o recupera la password.';
  }
  if (code.includes('popup-closed-by-user')) {
    return 'La finestra di accesso con Google è stata chiusa prima del completamento.';
  }
  if (code.includes('too-many-requests')) {
    return 'Troppi tentativi falliti consecutivi. Per motivi di sicurezza, attendi qualche minuto prima di riprovare.';
  }
  if (code.includes('network-request-failed')) {
    return 'Impossibile contattare il server. Verifica la tua connessione internet.';
  }

  return message || 'Errore durante l\'autenticazione. Riprova tra poco.';
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  subscription: DEFAULT_SUBSCRIPTION,
  isCloudSynced: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  sendPasswordReset: async () => {},
  logout: async () => {},
  upgradeTier: async () => ({}),
  getFriendlyAuthError,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [localUser, setLocalUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('artigiani_local_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem('artigiani_sub_cache');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SUBSCRIPTION;
      }
    }
    return DEFAULT_SUBSCRIPTION;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fireUser) => {
      setFirebaseUser(fireUser);
      setLoading(false);

      if (fireUser) {
        // Rimuove eventuale localUser provvisorio dato che abbiamo una sessione cloud reale
        setLocalUser(null);
        localStorage.removeItem('artigiani_local_user');

        // Ascolta in tempo reale il profilo utente e lo stato abbonamento su Firestore
        const userRef = doc(db, 'users', fireUser.uid);
        const unsubProfile = onSnapshot(
          userRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              const sub: UserSubscription = {
                tier: data.subscriptionTier || 'free',
                status: data.subscriptionStatus || 'active',
                expiresAt: data.subscriptionExpiresAt,
                stripeCustomerId: data.stripeCustomerId,
                planName:
                  data.subscriptionTier === 'team'
                    ? 'Laboratorio Team'
                    : data.subscriptionTier === 'pro'
                    ? 'Artigiano Pro'
                    : 'Starter Free',
              };
              setSubscription(sub);
              localStorage.setItem('artigiani_sub_cache', JSON.stringify(sub));
            } else {
              // Profilo iniziale se non ancora creato
              const newSub: UserSubscription = {
                tier: 'free',
                status: 'active',
                planName: 'Starter Free',
              };
              await setDoc(userRef, {
                uid: fireUser.uid,
                email: fireUser.email || '',
                displayName: fireUser.displayName || 'Artigiano',
                subscriptionTier: 'free',
                subscriptionStatus: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              setSubscription(newSub);
              localStorage.setItem('artigiani_sub_cache', JSON.stringify(newSub));
            }
          },
          (err) => {
            console.warn('Lettura profilo Firestore:', err.message);
          }
        );
        return () => unsubProfile();
      } else {
        if (!localUser) {
          setSubscription(DEFAULT_SUBSCRIPTION);
        }
      }
    });

    return () => unsubscribe();
  }, [localUser]);

  const activeUser: AppUser | null = firebaseUser
    ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        isLocal: false,
      }
    : localUser;

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setFirebaseUser(res.user);
        setLocalUser(null);
        localStorage.removeItem('artigiani_local_user');
      }
    } catch (error: any) {
      console.error('Google Sign In:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (res.user) {
        setFirebaseUser(res.user);
        setLocalUser(null);
        localStorage.removeItem('artigiani_local_user');
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        const saved = localStorage.getItem('artigiani_local_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.email?.toLowerCase() === email.trim().toLowerCase()) {
            setLocalUser(parsed);
            return;
          }
        }
        // Crea profilo locale registrato
        const newLocalUser: AppUser = {
          uid: `art_${Date.now()}`,
          email: email.trim(),
          displayName: email.split('@')[0],
          isLocal: true,
        };
        localStorage.setItem('artigiani_local_user', JSON.stringify(newLocalUser));
        setLocalUser(newLocalUser);
        return;
      }
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    craftSector?: string
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name.trim() });
        setFirebaseUser(res.user);
        setLocalUser(null);
        localStorage.removeItem('artigiani_local_user');
        
        try {
          const userRef = doc(db, 'users', res.user.uid);
          await setDoc(
            userRef,
            {
              uid: res.user.uid,
              email: res.user.email || email.trim(),
              displayName: name.trim(),
              craftSector: craftSector || 'Misto / FabLab',
              subscriptionTier: 'free',
              subscriptionStatus: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (dbErr) {
          console.warn('Salvataggio profilo Firestore:', dbErr);
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        // Fallback automatico: crea e salva profilo artigiano registrato
        const localUid = `art_${Date.now()}`;
        const newLocalUser: AppUser = {
          uid: localUid,
          email: email.trim(),
          displayName: name.trim() || email.split('@')[0],
          craftSector: craftSector || 'Stampa 3D / Laser / CNC',
          isLocal: true,
        };
        localStorage.setItem('artigiani_local_user', JSON.stringify(newLocalUser));
        setLocalUser(newLocalUser);
        return;
      }
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setFirebaseUser(null);
    setLocalUser(null);
    localStorage.removeItem('artigiani_local_user');
    setSubscription(DEFAULT_SUBSCRIPTION);
    localStorage.removeItem('artigiani_sub_cache');
  };

  const upgradeTier = async (tier: SubscriptionTier, period: 'monthly' | 'annual') => {
    const updatedSub: UserSubscription = {
      tier,
      status: 'active',
      planName: tier === 'team' ? 'Laboratorio Team' : 'Artigiano Pro',
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    };

    if (activeUser && !activeUser.isLocal) {
      try {
        const userRef = doc(db, 'users', activeUser.uid);
        await setDoc(
          userRef,
          {
            subscriptionTier: tier,
            subscriptionStatus: 'active',
            billingPeriod: period,
            subscriptionExpiresAt: updatedSub.expiresAt,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Aggiornamento abbonamento su cloud:', err);
      }
    }

    setSubscription(updatedSub);
    localStorage.setItem('artigiani_sub_cache', JSON.stringify(updatedSub));

    return {
      checkoutUrl: `https://checkout.stripe.com/c/pay/artigiani_${tier}_${period}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        loading,
        subscription,
        isCloudSynced: !!activeUser,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logout,
        upgradeTier,
        getFriendlyAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
