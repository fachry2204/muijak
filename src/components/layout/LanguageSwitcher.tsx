"use client";

import {useEffect, useState} from 'react';
import {Globe, X} from 'lucide-react';
import Script from 'next/script';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(locale);

  const initializeGoogleTranslate = () => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    if (!TranslateElement || document.querySelector('#google_translate_element select')) return;

    new TranslateElement({
      pageLanguage: 'id',
      includedLanguages: 'id,en,ar',
      autoDisplay: false,
    }, 'google_translate_element');
  };

  useEffect(() => {
    setActiveLang(locale);
    window.googleTranslateElementInit = initializeGoogleTranslate;
    initializeGoogleTranslate();
  }, [locale]);

  const changeLanguage = (langCode: 'id' | 'en' | 'ar') => {
    setActiveLang(langCode);
    setIsOpen(false);

    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `googtrans=/id/${langCode}; path=/; expires=${expires}; SameSite=Lax`;

    const translateSelect = document.querySelector<HTMLSelectElement>('#google_translate_element select');
    if (translateSelect) {
      translateSelect.value = langCode;
      translateSelect.dispatchEvent(new Event('change', {bubbles: true}));
    }

    router.replace(pathname, {locale: langCode});
    window.setTimeout(() => window.location.reload(), 250);
  };

  const languages = [
    {code: 'id' as const, name: 'Indonesia', flagUrl: 'https://flagcdn.com/w40/id.png'},
    {code: 'en' as const, name: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png'},
    {code: 'ar' as const, name: 'العربية', flagUrl: 'https://flagcdn.com/w40/sa.png'},
  ];

  return (
    <>
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
        onReady={initializeGoogleTranslate}
      />
      <div id="google_translate_element" className="fixed -left-[9999px] h-px w-px overflow-hidden opacity-0" aria-hidden="true" />

      <div className="fixed bottom-6 left-6 z-[9999] flex items-end">
        <div className={`absolute bottom-16 left-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 origin-bottom-left ${isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-0 opacity-0'}`}>
          <div className="flex w-40 flex-col py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-emerald-50 ${activeLang === lang.code ? 'bg-emerald-100 font-bold text-emerald-800' : 'text-slate-700'}`}
              >
                <img src={lang.flagUrl} alt={lang.name} className="w-6 h-auto rounded-sm shadow-sm" />
                <span className="text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Pilih bahasa"
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-[#105c36] text-white shadow-emerald-900/30' : 'border border-slate-200 bg-white text-emerald-700 hover:border-emerald-300'}`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Globe className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {pageLanguage: string; includedLanguages: string; autoDisplay: boolean},
          elementId: string
        ) => object;
      };
    };
  }
}
