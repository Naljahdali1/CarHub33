import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CARS_QUERY_KEY } from './Home';
import { motion } from 'framer-motion';
import ImageCarousel from '../components/cars/ImageCarousel';
import ContactButtons from '../components/shared/ContactButtons';
import CarCard from '../components/cars/CarCard';
import {
  Calendar,
  Gauge,
  Fuel,
  Zap,
  Settings,
  MapPin,
  User,
  Building2,
  ChevronLeft,
  Phone,
  Mail,
  Battery,
  Palette,
  DoorOpen,
  Users,
  Box,
  Shield,
  Wind,
  Gauge as Speedometer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CarDetails() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get('id');

  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use shared cache for faster loading
  const { data: allCars = [], isLoading: carsLoading } = useQuery({
    queryKey: CARS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_date', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Find car from cached data
  const car = useMemo(() => {
    const found = allCars.find(c => c.id === carId);
    return found || null;
  }, [allCars, carId]);

  // Get similar cars from same cache
  const similarCars = useMemo(() => {
    if (!car?.make) return [];
    return allCars
      .filter(c => c.make === car.make && c.id !== carId)
      .slice(0, 4);
  }, [allCars, car?.make, carId]);

  const isLoading = carsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F11] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-[#0F0F11] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Vehicle not found</p>
          <Button onClick={() => navigate(-1)} className="bg-[#FF5F2D]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const images = car.images
    ? (typeof car.images === 'string' ? car.images.split(',').map(img => img.trim()) : car.images)
    : [];

  const finalImages = images.length > 0 ? images : [car.main_image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80&fm=webp'];

  const features = car.features 
    ? (typeof car.features === 'string' ? car.features.split(',').map(f => f.trim()) : car.features)
    : [];

  const isElectric = car.fuel_type?.toLowerCase().includes('electric');
  
  return (
    <div className="min-h-screen bg-[#0F0F11]">
      {/* Back Button */}
      <div className="bg-[#1A1A1C]/80 backdrop-blur-xl sticky top-20 z-20 border-b border-[#2A2A2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#A1A1A7] hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Results</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div
                onClick={() => setShowCarousel(true)}
                className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group bg-[#1A1A1C]"
              >
                <img
                  src={finalImages[0]}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-6 left-6 text-white font-medium">
                    Click to view gallery ({finalImages.length} photos)
                  </div>
                </div>
              </div>

              {/* Thumbnail Grid */}
              {finalImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {finalImages.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index + 1);
                        setShowCarousel(true);
                      }}
                      className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer hover:opacity-75 transition-opacity bg-[#1A1A1C] border border-[#2A2A2D] hover:border-[#FF5F2D]"
                    >
                      <img
                        src={image}
                        alt={`View ${index + 2}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Title & Price Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A1C] rounded-2xl p-6 sm:p-8 border border-[#2A2A2D]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {car.make} {car.model}
                  </h1>
                  {car.body_type && (
                    <p className="text-[#A1A1A7] text-lg mb-3">{car.body_type}</p>
                  )}
                  {car.price_badge && (
                    <span className="inline-block px-3 py-1.5 bg-[#FF5F2D]/20 text-[#FF5F2D] rounded-full text-sm font-semibold border border-[#FF5F2D]/30">
                      {car.price_badge}
                    </span>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-4xl sm:text-5xl font-bold text-[#FF5F2D]">
                    SAR {car.price?.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Key Specs Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#2A2A2D]"
            >
              <h2 className="text-xl font-bold text-white mb-4">Key Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {car.year && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Calendar className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Year</p>
                      <p className="text-sm font-semibold text-white truncate">{car.year}</p>
                    </div>
                  </div>
                )}
                {car.mileage && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Gauge className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Mileage</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {parseInt(car.mileage).toLocaleString()} km
                      </p>
                    </div>
                  </div>
                )}
                {car.fuel_type && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Fuel className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Fuel Type</p>
                      <p className="text-sm font-semibold text-white truncate">{car.fuel_type}</p>
                    </div>
                  </div>
                )}
                {car.transmission && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Settings className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Transmission</p>
                      <p className="text-sm font-semibold text-white truncate">{car.transmission}</p>
                    </div>
                  </div>
                )}
                {car.power_hp && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Zap className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Power</p>
                      <p className="text-sm font-semibold text-white truncate">{car.power_hp} HP</p>
                    </div>
                  </div>
                )}
                {car.color && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Palette className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Color</p>
                      <p className="text-sm font-semibold text-white truncate">{car.color}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Vehicle Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#2A2A2D]"
            >
              <h2 className="text-xl font-bold text-white mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {car.doors && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <DoorOpen className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Doors</p>
                      <p className="text-sm font-semibold text-white">{car.doors}</p>
                    </div>
                  </div>
                )}
                {car.seats && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Users className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Seats</p>
                      <p className="text-sm font-semibold text-white">{car.seats}</p>
                    </div>
                  </div>
                )}
                {car.body_type && (
                  <div className="flex items-center gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Box className="w-5 h-5 text-[#FF5F2D] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#A1A1A7]">Body Type</p>
                      <p className="text-sm font-semibold text-white truncate">{car.body_type}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description */}
            {car.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#2A2A2D]"
              >
                <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                <p className="text-[#A1A1A7] leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </motion.div>
            )}

            {/* Features */}
            {features && features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#2A2A2D]"
              >
                <h2 className="text-xl font-bold text-white mb-4">Features & Equipment</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-[#0F0F11] rounded-lg text-white text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F2D] flex-shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Seller Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#1A1A1C] to-[#1A1A1C]/80 rounded-2xl p-6 border border-[#2A2A2D] shadow-xl sticky top-36"
            >
              {/* Header with Icon */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2A2A2D]">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF5F2D] to-[#FF5F2D]/80 flex items-center justify-center flex-shrink-0">
                  {car.seller_type === 'Dealer' ? (
                    <Building2 className="w-7 h-7 text-white" />
                  ) : (
                    <User className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#A1A1A7] uppercase tracking-wider mb-1">
                    {car.seller_type || 'Private Seller'}
                  </p>
                  <h3 className="text-lg font-bold text-white truncate">
                    {car.seller_name || 'Private Seller'}
                  </h3>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {(car.seller_location || car.city) && (
                  <div className="flex items-start gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <MapPin className="w-5 h-5 text-[#FF5F2D] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#A1A1A7] mb-1">Location</p>
                      <p className="text-white font-medium text-sm leading-snug">
                        {car.seller_location || car.city}
                      </p>
                    </div>
                  </div>
                )}

                {car.seller_phone && (
                  <div className="flex items-start gap-3 p-3 bg-[#0F0F11] rounded-xl">
                    <Phone className="w-5 h-5 text-[#FF5F2D] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#A1A1A7] mb-1">Phone</p>
                      <p className="text-white font-medium text-sm truncate">
                        {car.seller_phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="pt-6 border-t border-[#2A2A2D]">
                <ContactButtons phone={car.seller_phone || '+1234567890'} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similarCars && similarCars.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Similar Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(() => {
                const seen = new Set();
                return similarCars
                  .filter(c => {
                    if (c.id === car.id || !c.make || !c.model || !c.price) {
                      return false;
                    }
                    const imgs = c.images ? (typeof c.images === 'string' ? c.images.split(',') : c.images) : [];
                    if (imgs.length === 0 && !c.main_image) {
                      return false;
                    }
                    if (seen.has(c.id)) {
                      return false;
                    }
                    seen.add(c.id);
                    return true;
                  })
                  .slice(0, 4)
                  .map((similarCar) => (
                    <CarCard key={similarCar.id} car={similarCar} />
                  ));
              })()}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Carousel */}
      <ImageCarousel
        images={finalImages}
        isOpen={showCarousel}
        onClose={() => setShowCarousel(false)}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
}