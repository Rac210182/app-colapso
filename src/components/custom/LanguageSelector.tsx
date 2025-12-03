'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { type Language } from '@/types';
import { useState } from 'react';

const FLAGS = {
  'pt-BR': '🇧🇷',
  'pt-PT': '🇵🇹',
  'en': '🇺🇸',
  'es': '🇪🇸',
  'fr': '🇫🇷',
  'it': '🇮🇹',
};

const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'pt-BR', name: 'Português (BR)' },
  { code: 'pt-PT', name: 'Português (PT)' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [tempLanguage, setTempLanguage] = useState<Language | null>(null);

  const handleLanguageClick = (lang: Language) => {
    setTempLanguage(lang);
    setShowMenu(false);
    setShowPrompt(true);
  };

  const confirmLanguage = (permanent: boolean) => {
    if (tempLanguage) {
      setLanguage(tempLanguage);
      if (permanent) {
        localStorage.setItem('colapso_language_permanent', 'true');
      }
    }
    setShowPrompt(false);
    setTempLanguage(null);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-3xl hover:scale-110 transition-transform"
        >
          {FLAGS[language]}
        </button>

        {showMenu && (
          <div className="absolute top-12 right-0 bg-black border border-[#D4AF37] rounded-lg p-2 min-w-[200px]">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageClick(lang.code)}
                className={`w-full text-left px-4 py-2 hover:bg-[#D4AF37]/10 rounded flex items-center gap-2 ${
                  language === lang.code ? 'text-[#D4AF37]' : 'text-white'
                }`}
              >
                <span className="text-xl">{FLAGS[lang.code]}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showPrompt && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-black border border-[#D4AF37] rounded-lg p-8 max-w-md w-full">
            <p className="text-white text-center mb-6">{t('language_prompt')}</p>
            <div className="flex gap-4">
              <button
                onClick={() => confirmLanguage(true)}
                className="flex-1 bg-[#D4AF37] text-black py-3 rounded-lg font-bold hover:bg-[#D4AF37]/80"
              >
                {t('yes')}
              </button>
              <button
                onClick={() => confirmLanguage(false)}
                className="flex-1 border border-[#D4AF37] text-[#D4AF37] py-3 rounded-lg font-bold hover:bg-[#D4AF37]/10"
              >
                {t('no')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
