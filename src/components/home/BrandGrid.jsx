import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../TranslationProvider';

const brands = [
  { name: 'BMW', logo: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&q=80&fm=webp' },
  { name: 'Mercedes-Benz', logo: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&q=80&fm=webp' },
  { name: 'Audi', logo: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&q=80&fm=webp' },
  { name: 'Volkswagen', logo: 'https://images.unsplash.com/photo-1622353472782-672fa6f16b2e?w=200&q=80&fm=webp' },
  { name: 'Porsche', logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80&fm=webp' },
  { name: 'Tesla', logo: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&q=80&fm=webp' },
  { name: 'Toyota', logo: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=200&q=80&fm=webp' },
  { name: 'Honda', logo: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=200&q=80&fm=webp' },
];

export default function BrandGrid() {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 bg-[#0F0F11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">{t('sections.popularBrands')}</h2>
          <p className="text-lg text-[#A1A1A7]">{t('sections.popularBrandsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={createPageUrl(`SearchResults?make=${brand.name}`)}
                className="block bg-[#1A1A1C] rounded-2xl p-8 border border-[#2A2A2D] hover:border-[#FF5F2D]/30 hover:shadow-xl hover:shadow-[#FF5F2D]/5 transition-all group"
              >
                <div className="aspect-square relative overflow-hidden rounded-xl bg-[#0F0F11] mb-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-center text-white font-semibold group-hover:text-[#FF5F2D] transition-colors">
                  {brand.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}