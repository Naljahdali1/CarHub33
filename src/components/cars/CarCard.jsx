import React, { memo } from 'react';
import { MapPin, Gauge, Calendar, Fuel, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../TranslationProvider';

const badgeColors = {
  'Very Good': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Good': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'New': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Sponsored': 'bg-[#FF5F2D]/20 text-[#FF5F2D] border-[#FF5F2D]/30',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&fm=webp';

function CarCard({ car }) {
  const { t } = useTranslation();
  
  const badgeText = {
    'Very Good': t('badges.veryGood'),
    'Good': t('badges.good'),
    'New': t('badges.new'),
    'Sponsored': t('badges.sponsored')
  };

  const isElectric = car.is_electric === 'true' || car.is_electric === true || car.fuel_type?.toLowerCase().includes('electric');
  const imageUrl = car.main_image || DEFAULT_IMAGE;
  const mileageValue = car.mileage ? parseInt(String(car.mileage).replace(/[^\d]/g, '')) : null;
  
  return (
    <Link to={createPageUrl(`CarDetails?id=${car.id}`)}>
      <div className="bg-gradient-to-b from-[#1A1A1C] to-[#151517] rounded-2xl overflow-hidden border border-[#2A2A2D] hover:border-[#FF5F2D]/40 hover:shadow-2xl hover:shadow-[#FF5F2D]/10 transition-all cursor-pointer group hover:-translate-y-1 duration-200">
        {/* Image with lazy loading */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1A1C]">
          <img
            src={imageUrl}
            alt={`${car.make} ${car.model}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge */}
          {car.price_badge && car.price_badge !== 'No rating' && (
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${badgeColors[car.price_badge] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {badgeText[car.price_badge] || car.price_badge}
            </div>
          )}

          {/* Electric Badge */}
          {isElectric && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {t('search.electric')}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title & Price */}
          <div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#FF5F2D] transition-colors truncate">
              {car.make} {car.model}
            </h3>
            <p className="text-3xl font-bold text-[#FF5F2D]">
              SAR {car.price?.toLocaleString()}
            </p>
          </div>

          {/* Specs - show only available data */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {car.year && car.year !== 'unknown' && (
              <div className="flex items-center gap-2 text-[#A1A1A7]">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{car.year}</span>
              </div>
            )}
            {mileageValue > 0 && (
              <div className="flex items-center gap-2 text-[#A1A1A7]">
                <Gauge className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{mileageValue.toLocaleString()} {t('carCard.km')}</span>
              </div>
            )}
            {car.fuel_type && (
              <div className="flex items-center gap-2 text-[#A1A1A7]">
                <Fuel className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{car.fuel_type.split(',')[0]}</span>
              </div>
            )}
            {car.transmission && (
              <div className="flex items-center gap-2 text-[#A1A1A7]">
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{car.transmission}</span>
              </div>
            )}
          </div>

          {/* Location */}
          {car.seller_location && (
            <div className="pt-3 border-t border-[#2A2A2D] flex items-center gap-2 text-[#A1A1A7]">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{car.seller_location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(CarCard);