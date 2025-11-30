import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import CarCard from '../components/cars/CarCard';
import CarCardSkeleton from '../components/cars/CarCardSkeleton';
import FilterSidebar from '../components/cars/FilterSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X, Car, ArrowUpDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { CARS_QUERY_KEY } from './Home';

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  
  const [filters, setFilters] = useState({
    make: urlParams.get('make') || 'All',
    model: urlParams.get('model') || 'All',
    yearFrom: urlParams.get('yearFrom') || '',
    yearTo: urlParams.get('yearTo') || '',
    priceRange: urlParams.get('priceFrom') && urlParams.get('priceTo') 
      ? [parseInt(urlParams.get('priceFrom')), parseInt(urlParams.get('priceTo'))] 
      : [0, 500000],
    mileageMax: urlParams.get('maxMileage') ? parseInt(urlParams.get('maxMileage')) : 300000,
    fuelType: urlParams.get('fuelType') || 'All',
    transmission: urlParams.get('transmission') || 'All',
    sellerType: 'All',
    features: [],
  });

  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Shared query with aggressive caching - uses same key as Home for instant navigation
  const { data: allCars = [], isLoading } = useQuery({
    queryKey: CARS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Filter out invalid cars and remove duplicates - show all cars with essential fields
  const validCars = useMemo(() => {
    if (!allCars || allCars.length === 0) return [];
    const seen = new Set();
    return allCars
      .filter(car => {
        // Filter out invalid data - only require ID
        if (!car.id) return false;

        if (seen.has(car.id)) {
          return false;
        }
        seen.add(car.id);
        return true;
      });
  }, [allCars]);

  // Apply filters - show all cars by default, filter only when criteria are set
  const filteredCars = useMemo(() => {
    let result = [...validCars];

    // Make filter
    if (filters.make && filters.make !== 'All') {
      result = result.filter(car => car.make === filters.make);
    }

    // Model filter
    if (filters.model && filters.model !== 'All' && filters.model !== '') {
      result = result.filter(car => car.model === filters.model);
    }

    // Year filter - only apply if values are provided
    if (filters.yearFrom && filters.yearFrom !== '') {
      result = result.filter(car => parseInt(car.year) >= parseInt(filters.yearFrom));
    }
    if (filters.yearTo && filters.yearTo !== '') {
      result = result.filter(car => parseInt(car.year) <= parseInt(filters.yearTo));
    }

    // Price filter - only apply if not at default range (500000 is max)
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000)) {
      result = result.filter(car => 
        car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]
      );
    }

    // Mileage filter - only apply if not at default (300000 is max)
    if (filters.mileageMax && filters.mileageMax < 300000) {
      result = result.filter(car => {
        const mileage = parseInt(String(car.mileage).replace(/[^\d]/g, '')) || 0;
        return mileage <= filters.mileageMax;
      });
    }

    // Fuel type filter
    if (filters.fuelType && filters.fuelType !== 'All') {
      result = result.filter(car => car.fuel_type === filters.fuelType);
    }

    // Transmission filter
    if (filters.transmission && filters.transmission !== 'All') {
      result = result.filter(car => car.transmission === filters.transmission);
    }

    // Seller type filter
    if (filters.sellerType && filters.sellerType !== 'All') {
      result = result.filter(car => car.seller_type === filters.sellerType);
    }

    // Features filter
    if (filters.features && filters.features.length > 0) {
      result = result.filter(car => 
        filters.features.every(feature => car.features?.includes(feature))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'mileage-low':
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
        break;
    }

    return result;
  }, [validCars, filters, sortBy]);

  const displayedCars = filteredCars;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      make: 'All',
      model: 'All',
      yearFrom: '',
      yearTo: '',
      priceRange: [0, 500000],
      mileageMax: 300000,
      fuelType: 'All',
      transmission: 'All',
      sellerType: 'All',
      features: [],
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0F11]">
      {/* Header Bar */}
      <div className="sticky top-20 bg-[#1A1A1C]/95 backdrop-blur-xl border-b border-[#2A2A2D] z-30 shadow-xl">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="hidden md:flex w-10 h-10 rounded-xl bg-[#FF5F2D]/10 items-center justify-center">
                  <Car className="w-5 h-5 text-[#FF5F2D]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    Browse Cars
                  </h1>
                  <p className="text-sm text-[#A1A1A7]">
                    {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} available
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden bg-[#FF5F2D] hover:bg-[#FF5F2D]/90 gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#A1A1A7] hidden sm:block" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] bg-[#0F0F11] border-[#2A2A2D] text-white h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D] rounded-xl">
                    <SelectItem value="newest" className="text-white hover:bg-[#2A2A2D] rounded-lg">
                      Newest First
                    </SelectItem>
                    <SelectItem value="price-low" className="text-white hover:bg-[#2A2A2D] rounded-lg">
                      Lowest Price
                    </SelectItem>
                    <SelectItem value="price-high" className="text-white hover:bg-[#2A2A2D] rounded-lg">
                      Highest Price
                    </SelectItem>
                    <SelectItem value="mileage-low" className="text-white hover:bg-[#2A2A2D] rounded-lg">
                      Lowest Mileage
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowMobileFilters(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 bottom-0 w-80 bg-[#1A1A1C] shadow-2xl overflow-y-auto"
              >
                <div className="p-4 border-b border-[#2A2A2D] flex justify-between items-center sticky top-0 bg-[#1A1A1C]/95 backdrop-blur-xl z-10">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#FF5F2D]" />
                    <h3 className="text-lg font-bold text-white">Filters</h3>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-[#2A2A2D] rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    setFilters(newFilters);
                  }}
                  onReset={handleResetFilters}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-[#A1A1A7] mb-4">No vehicles found</p>
              <p className="text-[#A1A1A7] mb-6">Try adjusting your filters</p>
              <Button
                onClick={handleResetFilters}
                className="bg-[#FF5F2D] hover:bg-[#FF5F2D]/90"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedCars.map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>

                  {/* Results Summary */}
                  {filteredCars.length > 0 && (
                    <div className="mt-12 text-center">
                      <p className="text-[#A1A1A7]">
                        Showing all <span className="text-white font-medium">{filteredCars.length}</span> vehicles
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            </div>
            </div>
            );
            }