import React, { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import HeroSection from '../components/home/HeroSection';
import CarSection from '../components/home/CarSection';
import BrandGrid from '../components/home/BrandGrid';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTranslation } from '../components/TranslationProvider';

// Shared query key for cars across the app - v4 uses Supabase
export const CARS_QUERY_KEY = ['cars-all', 'v4'];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Single optimized query with aggressive caching - shared across app
  const { data: allCars = [], isLoading } = useQuery({
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

  // Filter out invalid cars and remove duplicates - memoized for performance
  const validCars = useMemo(() => {
    if (!allCars || allCars.length === 0) return [];
    const seen = new Set();
    return allCars
      .filter(car => {
        // Filter out invalid data - only require ID to display everything
        if (!car.id) return false;

        // Remove duplicates by ID
        if (seen.has(car.id)) {
          return false;
        }
        seen.add(car.id);
        return true;
      });
  }, [allCars]);

  const handleSearch = useCallback((filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'All' && value !== 'All Makes' && value !== 'All Types' && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) params.append(key, JSON.stringify(value));
          } else if (typeof value !== 'boolean' || value === true) {
            params.append(key, value);
          }
        }
      });
    }

    navigate(createPageUrl(`SearchResults${params.toString() ? '?' + params.toString() : ''}`));
  }, [navigate]);

  // Prefetch search results page data
  const prefetchSearchResults = useCallback(() => {
    queryClient.prefetchQuery({
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
      staleTime: 10 * 60 * 1000,
    });
  }, [queryClient]);

  // Memoized car sections for faster rendering - limit to 8 cars per section
  const { recentCars, electricCars, luxuryCars, suvCars } = useMemo(() => {
    return {
      recentCars: validCars.slice(0, 8),
      electricCars: validCars.filter(car => 
        car.fuel_type?.toLowerCase().includes('electric') || car.is_electric === 'true'
      ).slice(0, 4),
      luxuryCars: validCars.filter(car => car.price > 50000).slice(0, 4),
      suvCars: validCars.filter(car => 
        car.body_type?.toLowerCase().includes('suv')
      ).slice(0, 4)
    };
  }, [validCars]);

  return (
    <div className="min-h-screen bg-[#0F0F11]">
      {/* Hero with Integrated Search */}
      <HeroSection onSearch={handleSearch} />

      {/* Recently Added */}
      <CarSection
        title={t('sections.recentlyAdded') || 'Recently Added'}
        subtitle="Discover the latest vehicles in our inventory"
        cars={recentCars.slice(0, 12)}
        isLoading={isLoading}
        viewAllText="View All Cars"
        onViewAll={() => handleSearch({})}
      />

      {/* Electric Vehicles */}
      {electricCars.length > 0 && (
        <CarSection
          title="Electric & Hybrid Vehicles"
          subtitle="Eco-friendly options for a sustainable future"
          cars={electricCars}
          isLoading={isLoading}
          gradient="from-green-500/10 to-blue-500/10"
        />
      )}

      {/* Luxury Vehicles */}
      {luxuryCars.length > 0 && (
        <CarSection
          title="Premium Collection"
          subtitle="Luxury vehicles for distinguished tastes"
          cars={luxuryCars}
          isLoading={isLoading}
          gradient="from-amber-500/10 to-orange-500/10"
        />
      )}

      {/* SUVs & Trucks */}
      {suvCars.length > 0 && (
        <CarSection
          title="SUVs & Crossovers"
          subtitle="Spacious and versatile vehicles"
          cars={suvCars}
          isLoading={isLoading}
          gradient="from-blue-500/10 to-purple-500/10"
        />
      )}

      {/* Popular Brands */}
      <BrandGrid />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FF5F2D] to-[#FF5F2D]/80 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <button
              onClick={() => handleSearch({})}
              onMouseEnter={prefetchSearchResults}
              className="px-10 py-4 bg-white text-[#FF5F2D] font-semibold rounded-full hover:bg-white/90 transition-all shadow-xl"
            >
              {t('cta.button')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}