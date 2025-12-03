'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { type User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para traduzir erros do Firebase para mensagens amigáveis
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente fazer login.',
    'auth/invalid-email': 'E-mail inválido. Verifique e tente novamente.',
    'auth/operation-not-allowed': 'Operação não permitida. Entre em contato com o suporte.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
    'auth/user-not-found': 'Usuário não encontrado. Verifique o e-mail ou cadastre-se.',
    'auth/wrong-password': 'Senha incorreta. Tente novamente.',
    'auth/invalid-credential': 'Credenciais inválidas. Verifique e-mail e senha.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/popup-blocked': 'Popup bloqueado. Permita popups para este site.',
    'auth/popup-closed-by-user': 'Login cancelado. Tente novamente.',
    'auth/cancelled-popup-request': 'Login cancelado. Tente novamente.',
    'auth/unauthorized-domain': '⚠️ Domínio não autorizado. Configure o domínio atual no Firebase Console (Authentication > Settings > Authorized domains).',
  };

  return errorMessages[errorCode] || 'Ocorreu um erro inesperado. Tente novamente.';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Check for redirect result first
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && mounted) {
          console.log('✅ Login com Google realizado com sucesso!');
        }
      } catch (error: any) {
        if (mounted) {
          console.error('❌ Erro no redirecionamento:', error);
          setError(getErrorMessage(error.code));
        }
      }
    };

    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Load user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            // Create new user document
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || '',
              birthDate: '',
              gender: '',
              language: 'pt-BR',
              onboardingCompleted: false,
              startDate: new Date().toISOString(),
              currentDay: 1,
              level: 'despertar',
              subscriptionStatus: 'trial',
              subscriptionPlan: null,
              trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              daysInMirror: 0,
              daysCollapsed: 0,
              daysSkipped: 0,
              subliminalEnabled: true,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error: any) {
          console.error('❌ Erro ao carregar dados do usuário:', error);
          setError('Erro ao carregar dados do usuário. Tente novamente.');
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name if provided
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error);
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('🔄 Iniciando login com Google...');
      console.log('📍 Domínio atual:', window.location.origin);
      
      // Use redirect instead of popup to avoid popup blockers
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error('❌ Erro no login com Google:', error);
      console.error('📋 Código do erro:', error.code);
      console.error('📋 Mensagem do erro:', error.message);
      
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      setLoading(false);
      
      // Se for erro de domínio não autorizado, mostrar instruções detalhadas
      if (error.code === 'auth/unauthorized-domain') {
        console.error('🔧 SOLUÇÃO: Adicione o domínio atual no Firebase Console:');
        console.error('   1. Acesse: https://console.firebase.google.com');
        console.error('   2. Selecione seu projeto');
        console.error('   3. Vá em Authentication > Settings > Authorized domains');
        console.error('   4. Adicione o domínio:', window.location.hostname);
      }
      
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('❌ Erro ao sair:', error);
      const errorMessage = 'Erro ao sair. Tente novamente.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('❌ Erro ao enviar e-mail de recuperação:', error);
      const errorMessage = getErrorMessage(error.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) {
      setError('Usuário não autenticado.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const updatedUser = { ...user, ...data };
      await setDoc(doc(db, 'users', user.uid), updatedUser);
      setUser(updatedUser);
    } catch (error: any) {
      console.error('❌ Erro ao atualizar usuário:', error);
      const errorMessage = 'Erro ao atualizar dados. Tente novamente.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      loading, 
      error,
      signIn, 
      signUp, 
      signInWithGoogle, 
      signOut, 
      resetPassword,
      updateUser,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
