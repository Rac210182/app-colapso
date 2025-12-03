'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/custom/LanguageSelector';

const QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    q1: '',
    q2: 5,
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: '',
  });

  const { user, updateUser } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const handleNext = () => {
    if (step < 13) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    await updateUser({
      name: formData.name,
      birthDate: formData.birthDate,
      gender: formData.gender,
      language: language,
      onboardingCompleted: true,
    });

    // Save onboarding answers to Firestore
    const { doc, setDoc } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    
    await setDoc(doc(db, 'onboarding', user.uid), {
      ...formData,
      completedAt: new Date().toISOString(),
    });

    router.push('/dashboard');
  };

  const canProceed = () => {
    if (step === 0) return formData.name.length > 0;
    if (step === 1) return formData.birthDate.length > 0;
    if (step === 2) return formData.gender.length > 0;
    if (step === 3) return formData.q1.length > 0;
    if (step === 4) return true; // q2 is a number
    if (step === 5) return formData.q3.length > 0;
    if (step === 6) return formData.q4.length > 0;
    if (step === 7) return formData.q5.length > 0;
    if (step === 8) return formData.q6.length > 0;
    if (step === 9) return formData.q7.length > 0;
    if (step === 10) return formData.q8.length > 0;
    if (step === 11) return formData.q9.length > 0;
    if (step === 12) return formData.q10.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <LanguageSelector />
      
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 13 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded ${
                  i <= step ? 'bg-[#D4AF37]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <p className="text-white/60 text-sm text-center">
            {step + 1} / 13
          </p>
        </div>

        <div className="space-y-6">
          {step === 0 && (
            <div>
              <h2 className="text-2xl sm:text-3xl text-white mb-4">{t('name')}</h2>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none text-lg"
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl sm:text-3xl text-white mb-4">{t('birth_date')}</h2>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none text-lg"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl sm:text-3xl text-white mb-4">{t('gender')}</h2>
              <div className="space-y-3">
                {['male', 'female', 'other'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`w-full py-4 rounded-lg border text-lg ${
                      formData.gender === gender
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-black text-white border-white/20 hover:border-[#D4AF37]'
                    }`}
                  >
                    {t(gender)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step >= 3 && step <= 12 && (
            <div>
              <h2 className="text-xl sm:text-2xl text-white mb-6 leading-relaxed">
                {t(QUESTIONS[step - 3])}
              </h2>
              
              {step === 4 ? (
                <div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.q2}
                    onChange={(e) => setFormData({ ...formData, q2: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center mt-4">
                    <span className="text-[#D4AF37] text-4xl font-bold">{formData.q2}</span>
                  </div>
                </div>
              ) : step === 12 ? (
                <input
                  type="text"
                  value={formData.q10}
                  onChange={(e) => setFormData({ ...formData, q10: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none text-lg"
                  placeholder="Uma palavra"
                  maxLength={50}
                  autoFocus
                />
              ) : (
                <textarea
                  value={formData[`q${step - 2}` as keyof typeof formData] as string}
                  onChange={(e) => setFormData({ ...formData, [`q${step - 2}`]: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none text-lg min-h-[150px] resize-none"
                  autoFocus
                />
              )}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full bg-[#D4AF37] text-black py-4 rounded-lg font-bold text-lg hover:bg-[#D4AF37]/80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step === 12 ? 'Começar' : t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}
