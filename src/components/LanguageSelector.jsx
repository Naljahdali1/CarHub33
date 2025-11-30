import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from './TranslationProvider';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export default function LanguageSelector() {
  const { language, changeLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1C] border border-[#2A2A2D] rounded-xl hover:bg-[#2A2A2D] transition-all"
      >
        <Globe className="w-4 h-4 text-[#FF5F2D]" />
        <span className="text-white text-sm font-medium">{currentLanguage?.nativeName}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 left-0 min-w-[160px] bg-[#1A1A1C] border border-[#2A2A2D] rounded-xl shadow-2xl overflow-hidden z-50"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                    language === lang.code
                      ? 'bg-[#FF5F2D]/10 text-[#FF5F2D]'
                      : 'text-white hover:bg-[#2A2A2D]'
                  }`}
                >
                  <span className="font-medium">{lang.nativeName}</span>
                  {language === lang.code && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}