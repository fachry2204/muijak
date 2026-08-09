"use client";

import {useEffect, useState} from 'react';
import {Globe, X} from 'lucide-react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(locale);

  useEffect(() => {
    setActiveLang(locale);
  }, [locale]);

  const changeLanguage = (langCode: 'id' | 'en' | 'ar') => {
    setActiveLang(langCode);
    setIsOpen(false);

    router.replace(pathname, {locale: langCode});
    router.refresh();
  };

  const languages = [
    {code: 'id' as const, name: 'Indonesia', flagUrl: 'https://flagcdn.com/w40/id.png'},
    {code: 'en' as const, name: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png'},
    {code: 'ar' as const, name: 'العربية', flagUrl: 'https://flagcdn.com/w40/sa.png'},
  ];

  return (
    <>
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
