"use client";

import { useEffect, useState } from 'react';
import { Globe, X } from 'lucide-react';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState('id');

  useEffect(() => {
    // Add Google Translate script if it doesn't exist
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'id',
            includedLanguages: 'id,en,ar',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setActiveLang(langCode);
    setIsOpen(false);
    
    // Set Google Translate cookie reliably
    document.cookie = `googtrans=/id/${langCode}; path=/;`;
    document.cookie = `googtrans=/id/${langCode}; path=/; domain=${window.location.hostname};`;
    
    // Reload to apply translation immediately
    window.location.reload();
  };

  const languages = [
    { code: 'id', name: 'Indonesia', flagUrl: 'https://flagcdn.com/w40/id.png' },
    { code: 'en', name: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png' },
    { code: 'ar', name: 'العربية', flagUrl: 'https://flagcdn.com/w40/sa.png' },
  ];

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <div className="fixed bottom-6 left-6 z-50 flex items-end">
        
        {/* Language Options Menu (Flags) */}
        <div className={`absolute bottom-16 left-0 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-left ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col py-2 w-40">
            {languages.map((lang) => (
              <button 
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors ${activeLang === lang.code ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-700'}`}
              >
                <img src={lang.flagUrl} alt={lang.name} className="w-6 h-auto shadow-sm rounded-sm" />
                <span className="text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Action Button (Globe) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-[#105c36] text-white shadow-emerald-900/30' : 'bg-white text-emerald-700 border border-slate-200 hover:border-emerald-300'}`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
        </button>

      </div>
      
      {/* 
        Custom CSS to hide the ugly Google Translate top bar, tooltips, and popups
      */}
      <style jsx global>{`
        body {
          top: 0 !important;
        }
        .skiptranslate iframe {
          display: none !important;
          visibility: hidden !important;
        }
        .goog-te-gadget {
          display: none !important;
        }
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        /* Hide google translate tooltip on hover */
        .goog-tooltip {
            display: none !important;
        }
        .goog-tooltip:hover {
            display: none !important;
        }
        .goog-text-highlight {
            background-color: transparent !important;
            border: none !important; 
            box-shadow: none !important;
        }
      `}</style>
    </>
  );
}

// Add TypeScript interface for the window object
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}
