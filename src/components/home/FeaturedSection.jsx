import React from 'react';
import { motion } from 'framer-motion';
import CarCard from '../cars/CarCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../TranslationProvider';

export default function FeaturedSection({ title, subtitle, cars }) {
  const { t } = useTranslation();
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">{title}</h2>
            <p className="text-lg text-[#A1A1A7]">{subtitle}</p>
          </div>
          <Link
            to={createPageUrl('SearchResults')}
            className="hidden md:flex items-center gap-2 text-[#FF5F2D] hover:gap-3 transition-all font-medium"
          >
            {t('sections.viewAll')}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars?.slice(0, 6).map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <Link
          to={createPageUrl('SearchResults')}
          className="md:hidden mt-8 flex items-center justify-center gap-2 text-[#FF5F2D] hover:gap-3 transition-all font-medium"
        >
          {t('sections.viewAll')}
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}