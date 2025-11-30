import React, { memo } from 'react';
import { motion } from 'framer-motion';
import CarCard from '../cars/CarCard';
import CarCardSkeleton from '../cars/CarCardSkeleton';
import { ChevronRight, Sparkles } from 'lucide-react';

function CarSection({ 
  title, 
  subtitle, 
  cars, 
  isLoading, 
  gradient,
  viewAllText,
  onViewAll 
}) {
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!cars || cars.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 relative overflow-hidden ${gradient ? `bg-gradient-to-br ${gradient}` : ''}`}>
      {/* Background decoration */}
      {gradient && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#FF5F2D]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="flex items-start gap-4">
            {gradient && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="hidden md:flex w-12 h-12 rounded-xl bg-[#FF5F2D]/10 items-center justify-center mt-1 border border-[#FF5F2D]/20"
              >
                <Sparkles className="w-6 h-6 text-[#FF5F2D]" />
              </motion.div>
            )}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white mb-2"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[#A1A1A7] text-lg"
              >
                {subtitle}
              </motion.p>
            </div>
          </div>
          {onViewAll && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onViewAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5F2D]/10 hover:bg-[#FF5F2D]/20 rounded-xl text-[#FF5F2D] font-semibold transition-all mt-6 md:mt-0 border border-[#FF5F2D]/20"
            >
              {viewAllText || 'View All'}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car.id}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(CarSection);