'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-[#D4AF37] text-2xl">COLAPSO</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#D4AF37]">COLAPSO</h1>
            <p className="text-white/60 text-sm mt-1">365 dias de espelho vivo</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 text-sm"
          >
            Sair
          </button>
        </div>

        {/* Welcome Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Bem-vindo, {user.name || 'Guerreiro'}! 👋
          </h2>
          <p className="text-white/70 mb-6">
            Você está no dia <span className="text-[#D4AF37] font-bold">{user.currentDay}</span> de 365
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-black/50 rounded-xl p-4 border border-white/10">
              <div className="text-[#D4AF37] text-2xl sm:text-3xl font-bold">{user.daysInMirror}</div>
              <div className="text-white/60 text-xs sm:text-sm mt-1">Dias no Espelho</div>
            </div>
            <div className="bg-black/50 rounded-xl p-4 border border-white/10">
              <div className="text-[#D4AF37] text-2xl sm:text-3xl font-bold">{user.daysCollapsed}</div>
              <div className="text-white/60 text-xs sm:text-sm mt-1">Dias Colapsados</div>
            </div>
            <div className="bg-black/50 rounded-xl p-4 border border-white/10">
              <div className="text-red-400 text-2xl sm:text-3xl font-bold">{user.daysSkipped}</div>
              <div className="text-white/60 text-xs sm:text-sm mt-1">Dias Pulados</div>
            </div>
            <div className="bg-black/50 rounded-xl p-4 border border-white/10">
              <div className="text-[#D4AF37] text-2xl sm:text-3xl font-bold uppercase text-sm sm:text-base">
                {user.level}
              </div>
              <div className="text-white/60 text-xs sm:text-sm mt-1">Nível Atual</div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Status da Assinatura</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-[#D4AF37] font-bold uppercase">
                {user.subscriptionStatus === 'trial' && 'Período de Teste'}
                {user.subscriptionStatus === 'active' && 'Assinatura Ativa'}
                {user.subscriptionStatus === 'expired' && 'Assinatura Expirada'}
              </div>
              {user.subscriptionStatus === 'trial' && user.trialEndDate && (
                <p className="text-white/60 text-sm mt-1">
                  Teste termina em: {new Date(user.trialEndDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            {user.subscriptionStatus !== 'active' && (
              <button className="px-6 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#D4AF37]/80">
                Assinar Agora
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all text-left">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-bold mb-1">Desafio de Hoje</h4>
            <p className="text-white/60 text-sm">Acesse seu desafio diário</p>
          </button>
          
          <button className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all text-left">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-bold mb-1">Progresso</h4>
            <p className="text-white/60 text-sm">Veja sua evolução completa</p>
          </button>
          
          <button className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all text-left">
            <div className="text-2xl mb-2">🎧</div>
            <h4 className="font-bold mb-1">Subliminal</h4>
            <p className="text-white/60 text-sm">
              {user.subliminalEnabled ? 'Ativo' : 'Desativado'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
