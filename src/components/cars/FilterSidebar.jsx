import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronDown, SlidersHorizontal, RotateCcw, Car, Calendar, DollarSign, Gauge, Fuel, Settings2, Tag } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { CARS_QUERY_KEY } from '../../pages/Home';

const fuelTypes = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];
const transmissions = ['All', 'Automatic', 'Manual'];
const sellerTypes = ['All', 'Dealer', 'Private'];
const features = ['Sunroof', 'Navigation', 'Parking Sensors', 'Apple CarPlay', 'Leather Seats', 'Heated Seats', 'Cruise Control', 'Bluetooth'];

const FilterSection = memo(function FilterSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#2A2A2D] pb-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF5F2D]/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#FF5F2D]" />
          </div>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#A1A1A7] group-hover:text-white transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pt-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
});

function FilterSidebar({ filters, onFilterChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters || {
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

  // Sync with external filters
  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  // Use shared car data for filters - same cache as main list
  const { data: rawCars = [] } = useQuery({
    queryKey: CARS_QUERY_KEY,
    queryFn: () => base44.entities.Car.list('-created_date', 100),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const allCars = useMemo(() => rawCars.map(c => ({ ...(c.data || {}), ...c })), [rawCars]);

  // Get unique makes from database
  const makes = useMemo(() => {
    const uniqueMakes = [...new Set(allCars
      .map(car => car.make)
      .filter(Boolean)
    )];
    return ['All', ...uniqueMakes.sort()];
  }, [allCars]);

  // Get models based on selected make
  const models = useMemo(() => {
    if (localFilters.make && localFilters.make !== 'All') {
      const filteredCars = allCars.filter(car => car.make === localFilters.make);
      const uniqueModels = [...new Set(filteredCars.map(c => c.model).filter(Boolean))].sort();
      return ['All', ...uniqueModels];
    }
    return ['All'];
  }, [localFilters.make, allCars]);

  const updateFilter = useCallback((key, value) => {
    setLocalFilters(prev => {
      const updated = { ...prev, [key]: value };
      
      // Reset model when make changes
      if (key === 'make' && value !== prev.make) {
        updated.model = 'All';
      }
      
      // Debounce filter change to parent
      setTimeout(() => onFilterChange(updated), 0);
      return updated;
    });
  }, [onFilterChange]);

  const toggleFeature = useCallback((feature) => {
    setLocalFilters(prev => {
      const current = prev.features || [];
      const updated = current.includes(feature)
        ? current.filter(f => f !== feature)
        : [...current, feature];
      const newFilters = { ...prev, features: updated };
      setTimeout(() => onFilterChange(newFilters), 0);
      return newFilters;
    });
  }, [onFilterChange]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (localFilters.make !== 'All') count++;
    if (localFilters.model !== 'All' && localFilters.model !== '') count++;
    if (localFilters.yearFrom) count++;
    if (localFilters.yearTo) count++;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 500000) count++;
    if (localFilters.mileageMax < 300000) count++;
    if (localFilters.fuelType !== 'All') count++;
    if (localFilters.transmission !== 'All') count++;
    if (localFilters.sellerType !== 'All') count++;
    if (localFilters.features?.length > 0) count += localFilters.features.length;
    return count;
  }, [localFilters]);

  return (
    <div className="w-80 bg-gradient-to-b from-[#1A1A1C] to-[#151517] border-r border-[#2A2A2D] overflow-y-auto h-[calc(100vh-80px)] sticky top-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#1A1A1C]/95 backdrop-blur-xl z-10 p-5 border-b border-[#2A2A2D]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5F2D] to-[#FF5F2D]/70 flex items-center justify-center shadow-lg shadow-[#FF5F2D]/20">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Filters</h3>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-[#A1A1A7]">{activeFiltersCount} active</p>
              )}
            </div>
          </div>
          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="text-[#A1A1A7] hover:text-white hover:bg-[#2A2A2D] gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Make & Model */}
        <FilterSection title="Make & Model" icon={Car}>
          <Select value={localFilters.make} onValueChange={(val) => updateFilter('make', val)}>
            <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-11 rounded-xl hover:border-[#FF5F2D]/50 transition-colors">
              <SelectValue placeholder="Select Make" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D] rounded-xl">
              {makes.map(make => (
                <SelectItem key={make} value={make} className="text-white hover:bg-[#2A2A2D] rounded-lg focus:bg-[#2A2A2D]">
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={localFilters.model || 'All'}
            onValueChange={(value) => updateFilter('model', value)}
            disabled={localFilters.make === 'All'}
          >
            <SelectTrigger className={`bg-[#0F0F11] border-[#2A2A2D] text-white h-11 rounded-xl transition-colors ${localFilters.make === 'All' ? 'opacity-50' : 'hover:border-[#FF5F2D]/50'}`}>
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D] rounded-xl">
              {models.map(model => (
                <SelectItem key={model} value={model} className="text-white hover:bg-[#2A2A2D] rounded-lg focus:bg-[#2A2A2D]">
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        {/* Year */}
        <FilterSection title="Registration Year" icon={Calendar}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="From"
              value={localFilters.yearFrom}
              onChange={(e) => updateFilter('yearFrom', e.target.value)}
              className="bg-[#0F0F11] border-[#2A2A2D] text-white placeholder:text-[#A1A1A7]/50 h-11 rounded-xl hover:border-[#FF5F2D]/50 focus:border-[#FF5F2D] transition-colors"
            />
            <Input
              type="number"
              placeholder="To"
              value={localFilters.yearTo}
              onChange={(e) => updateFilter('yearTo', e.target.value)}
              className="bg-[#0F0F11] border-[#2A2A2D] text-white placeholder:text-[#A1A1A7]/50 h-11 rounded-xl hover:border-[#FF5F2D]/50 focus:border-[#FF5F2D] transition-colors"
            />
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" icon={DollarSign}>
          <div className="bg-[#0F0F11] rounded-xl p-4 border border-[#2A2A2D]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#A1A1A7]">SAR {localFilters.priceRange[0].toLocaleString()}</span>
              <span className="text-sm text-[#A1A1A7]">SAR {localFilters.priceRange[1].toLocaleString()}</span>
            </div>
            <Slider
              value={localFilters.priceRange}
              onValueChange={(val) => updateFilter('priceRange', val)}
              min={0}
              max={500000}
              step={5000}
              className="[&_[role=slider]]:bg-[#FF5F2D] [&_[role=slider]]:border-[#FF5F2D] [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-[#FF5F2D]/30"
            />
          </div>
        </FilterSection>

        {/* Mileage */}
        <FilterSection title="Maximum Mileage" icon={Gauge}>
          <div className="bg-[#0F0F11] rounded-xl p-4 border border-[#2A2A2D]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#A1A1A7]">0 km</span>
              <span className="text-sm font-medium text-white">{localFilters.mileageMax?.toLocaleString()} km</span>
            </div>
            <Slider
              value={[localFilters.mileageMax]}
              onValueChange={(val) => updateFilter('mileageMax', val[0])}
              min={0}
              max={300000}
              step={10000}
              className="[&_[role=slider]]:bg-[#FF5F2D] [&_[role=slider]]:border-[#FF5F2D] [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-[#FF5F2D]/30"
            />
          </div>
        </FilterSection>

        {/* Fuel Type */}
        <FilterSection title="Fuel Type" icon={Fuel}>
          <div className="grid grid-cols-2 gap-2">
            {fuelTypes.map(fuel => (
              <button
                key={fuel}
                onClick={() => updateFilter('fuelType', fuel)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  localFilters.fuelType === fuel
                    ? 'bg-[#FF5F2D] text-white shadow-lg shadow-[#FF5F2D]/20'
                    : 'bg-[#0F0F11] text-[#A1A1A7] border border-[#2A2A2D] hover:border-[#FF5F2D]/50 hover:text-white'
                }`}
              >
                {fuel}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Transmission */}
        <FilterSection title="Transmission" icon={Settings2}>
          <div className="grid grid-cols-2 gap-2">
            {transmissions.map(trans => (
              <button
                key={trans}
                onClick={() => updateFilter('transmission', trans)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  localFilters.transmission === trans
                    ? 'bg-[#FF5F2D] text-white shadow-lg shadow-[#FF5F2D]/20'
                    : 'bg-[#0F0F11] text-[#A1A1A7] border border-[#2A2A2D] hover:border-[#FF5F2D]/50 hover:text-white'
                }`}
              >
                {trans}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Seller Type */}
        <FilterSection title="Seller Type" icon={Tag} defaultOpen={false}>
          <div className="grid grid-cols-3 gap-2">
            {sellerTypes.map(type => (
              <button
                key={type}
                onClick={() => updateFilter('sellerType', type)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  localFilters.sellerType === type
                    ? 'bg-[#FF5F2D] text-white shadow-lg shadow-[#FF5F2D]/20'
                    : 'bg-[#0F0F11] text-[#A1A1A7] border border-[#2A2A2D] hover:border-[#FF5F2D]/50 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Features */}
        <FilterSection title="Features" icon={Settings2} defaultOpen={false}>
          <div className="grid grid-cols-1 gap-2">
            {features.map(feature => (
              <label
                key={feature}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  (localFilters.features || []).includes(feature)
                    ? 'bg-[#FF5F2D]/10 border border-[#FF5F2D]/30'
                    : 'bg-[#0F0F11] border border-[#2A2A2D] hover:border-[#FF5F2D]/30'
                }`}
              >
                <Checkbox
                  id={feature}
                  checked={(localFilters.features || []).includes(feature)}
                  onCheckedChange={() => toggleFeature(feature)}
                  className="border-[#2A2A2D] data-[state=checked]:bg-[#FF5F2D] data-[state=checked]:border-[#FF5F2D]"
                />
                <span className={`text-sm ${(localFilters.features || []).includes(feature) ? 'text-white' : 'text-[#A1A1A7]'}`}>
                  {feature}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
        </div>
        </div>
        );
        }

        export default memo(FilterSidebar);