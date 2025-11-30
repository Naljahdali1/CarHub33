import React from 'react';
import { motion } from 'framer-motion';
import HeroSearchPanel from './HeroSearchPanel';
import { useTranslation } from '../TranslationProvider';

export default function HeroSection({ onSearch }) {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-[85vh] overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80&fm=webp"
          alt="Premium Cars"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F11]/70 via-[#0F0F11]/85 to-[#0F0F11]" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {t('hero.title')}
            <span className="block text-[#FF5F2D] mt-2">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-lg md:text-xl text-[#A1A1A7] max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </motion.div>

        {/* Inline Search Panel */}
        <HeroSearchPanel onSearch={onSearch} />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0F11] to-transparent" />
    </div>
  );
}