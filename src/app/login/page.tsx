'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/custom/LanguageSelector';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push('/onboarding');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao autenticar');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push('/onboarding');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao autenticar com Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <LanguageSelector />
      
      <div className="w-full max-w-md">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#D4AF37] text-center mb-2">
          COLAPSO
        </h1>
        <p className="text-white/60 text-center mb-8 text-sm sm:text-base">
          365 dias de espelho vivo
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2 text-sm">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 text-sm">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-bold hover:bg-[#D4AF37]/80 disabled:opacity-50"
          >
            {loading ? '...' : t('login')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-white/60">ou</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full border border-white/20 text-white py-3 rounded-lg font-bold hover:bg-white/5 disabled:opacity-50"
        >
          {t('continue_google')}
        </button>

        <p className="w-full mt-6 text-center text-white/60 text-sm">
          {isSignUp ? (
            <>
              Já tem uma conta?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-[#D4AF37] hover:underline font-medium"
              >
                Entre aqui
              </button>
            </>
          ) : (
            <>
              Não tem uma conta?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-[#D4AF37] hover:underline font-medium"
              >
                Cadastre-se
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
