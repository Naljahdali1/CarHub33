import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '../TranslationProvider';

export default function HeroSearchPanel({ onSearch }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    maxMileage: '',
    fuelType: '',
    transmission: '',
    electricOnly: false,
  });
  const [models, setModels] = useState([]);

  // Fetch all cars to get makes and models
  const { data: rawCars } = useQuery({
    queryKey: ['cars-all', 'v3'],
    queryFn: () => base44.entities.Car.list('-created_date', 100),
    initialData: [],
    refetchOnWindowFocus: true,
  });

  const allCars = React.useMemo(() => rawCars.map(c => ({ ...(c.data || {}), ...c })), [rawCars]);

  // Get unique makes from database
  const makes = React.useMemo(() => {
    const uniqueMakes = [...new Set(allCars
      .map(car => car.make)
      .filter(Boolean)
    )];
    return uniqueMakes.sort();
  }, [allCars]);

  // Update models when make changes
  React.useEffect(() => {
    if (filters.make) {
      const filteredCars = allCars.filter(car => car.make === filters.make);
      const uniqueModels = [...new Set(filteredCars.map(c => c.model).filter(Boolean))].sort();
      setModels(uniqueModels);
      // Reset model if current selection is not available
      if (filters.model && !uniqueModels.includes(filters.model)) {
        setFilters(prev => ({...prev, model: ''}));
      }
    } else {
      setModels([]);
      setFilters(prev => ({...prev, model: ''}));
    }
  }, [filters.make, allCars]);

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="bg-[#1A1A1C]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#2A2A2D] p-8">
        {/* Main Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Make */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.make')}</label>
            <Select value={filters.make} onValueChange={(val) => setFilters({...filters, make: val})}>
              <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12">
                <SelectValue placeholder={t('search.allMakes')} />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D]">
                {makes.map(make => (
                  <SelectItem key={make} value={make} className="text-white hover:bg-[#2A2A2D]">
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.model')}</label>
            <Select 
              value={filters.model} 
              onValueChange={(val) => setFilters({...filters, model: val})}
              disabled={!filters.make}
            >
              <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12">
                <SelectValue placeholder={filters.make ? t('search.anyModel') : t('search.selectMakeFirst')} />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D]">
                {models.map(model => (
                  <SelectItem key={model} value={model} className="text-white hover:bg-[#2A2A2D]">
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.fuelType')}</label>
            <Select value={filters.fuelType} onValueChange={(val) => setFilters({...filters, fuelType: val})}>
              <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12">
                <SelectValue placeholder={t('search.allTypes')} />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D]">
                <SelectItem value="Petrol" className="text-white hover:bg-[#2A2A2D]">{t('search.petrol')}</SelectItem>
                <SelectItem value="Diesel" className="text-white hover:bg-[#2A2A2D]">{t('search.diesel')}</SelectItem>
                <SelectItem value="Electric" className="text-white hover:bg-[#2A2A2D]">{t('search.electric')}</SelectItem>
                <SelectItem value="Hybrid" className="text-white hover:bg-[#2A2A2D]">{t('search.hybrid')}</SelectItem>
                <SelectItem value="Gas" className="text-white hover:bg-[#2A2A2D]">{t('search.gas')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Year From */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.yearFrom')}</label>
            <Input
              type="number"
              value={filters.yearFrom}
              onChange={(e) => setFilters({...filters, yearFrom: e.target.value})}
              placeholder={t('placeholders.yearFrom')}
              className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
            />
          </div>

          {/* Year To */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.yearTo')}</label>
            <Input
              type="number"
              value={filters.yearTo}
              onChange={(e) => setFilters({...filters, yearTo: e.target.value})}
              placeholder={t('placeholders.yearTo')}
              className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
            />
          </div>

          {/* Price From */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.minPrice')}</label>
            <Input
              type="number"
              value={filters.priceFrom}
              onChange={(e) => setFilters({...filters, priceFrom: e.target.value})}
              placeholder={t('placeholders.minPrice')}
              className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
            />
          </div>

          {/* Price To */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.maxPrice')}</label>
            <Input
              type="number"
              value={filters.priceTo}
              onChange={(e) => setFilters({...filters, priceTo: e.target.value})}
              placeholder={t('placeholders.maxPrice')}
              className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Mileage */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.maxMileage')}</label>
            <Input
              type="number"
              value={filters.maxMileage}
              onChange={(e) => setFilters({...filters, maxMileage: e.target.value})}
              placeholder={t('placeholders.mileage')}
              className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
            />
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-medium text-[#A1A1A7] mb-2">{t('search.transmission')}</label>
            <Select value={filters.transmission} onValueChange={(val) => setFilters({...filters, transmission: val})}>
              <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12">
                <SelectValue placeholder={t('search.all')} />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D]">
                <SelectItem value="Automatic" className="text-white hover:bg-[#2A2A2D]">{t('search.automatic')}</SelectItem>
                <SelectItem value="Manual" className="text-white hover:bg-[#2A2A2D]">{t('search.manual')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Electric Only Checkbox */}
          <div className="flex items-end">
            <div className="flex items-center space-x-3 p-4 bg-[#0F0F11] rounded-xl h-12 w-full border border-[#2A2A2D]">
              <Checkbox
                id="electric"
                checked={filters.electricOnly}
                onCheckedChange={(checked) => setFilters({...filters, electricOnly: checked})}
                className="border-[#2A2A2D] data-[state=checked]:bg-[#FF5F2D] data-[state=checked]:border-[#FF5F2D]"
              />
              <label
                htmlFor="electric"
                className="text-sm font-medium text-white cursor-pointer select-none"
              >
                {t('search.electricOnly')}
              </label>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="w-full h-14 bg-[#FF5F2D] hover:bg-[#FF5F2D]/90 text-white font-semibold text-lg rounded-xl shadow-lg shadow-[#FF5F2D]/20"
        >
          <Search className="w-5 h-5 mr-2" />
          {t('hero.searchButton')}
        </Button>
      </div>
    </motion.div>
  );
}