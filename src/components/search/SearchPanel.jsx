import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const fuelTypes = ['All Types', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'Gas'];
const transmissions = ['All', 'Automatic', 'Manual'];
const paymentTypes = ['Buy', 'Lease'];

export default function SearchPanel({ isOpen, onClose, onSearch }) {
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
    city: '',
    zipCode: '',
    paymentType: 'Buy',
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
    const uniqueMakes = [...new Set(allCars.map(car => car.make).filter(Boolean))];
    return uniqueMakes.sort();
  }, [allCars]);

  // Update models when make changes
  React.useEffect(() => {
    if (filters.make) {
      const filteredCars = allCars.filter(car => car.make === filters.make);
      const uniqueModels = [...new Set(filteredCars.map(c => c.model).filter(Boolean))].sort();
      setModels(uniqueModels);
    } else {
      setModels([]);
    }
  }, [filters.make, allCars]);

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-[#1A1A1C] rounded-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto mx-4"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#1A1A1C] border-b border-[#2A2A2D] px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#2A2A2D] rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[#A1A1A7]" />
              </button>
            </div>

            {/* Form */}
            <div className="p-8 space-y-8">
              {/* Make & Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A1A1A7] mb-2">Make</label>
                  <Select value={filters.make} onValueChange={(val) => setFilters({...filters, make: val})}>
                    <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12">
                      <SelectValue placeholder="Select make" />
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

                <div>
                  <label className="block text-sm font-medium text-[#A1A1A7] mb-2">Model</label>
                  <Select 
                    value={filters.model} 
                    onValueChange={(val) => setFilters({...filters, model: val})}
                    disabled={!filters.make}
                  >
                    <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12">
                      <SelectValue placeholder={filters.make ? "Select model" : "Select make first"} />
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
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-[#A1A1A7] mb-2">Registration Year</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    value={filters.yearFrom}
                    onChange={(e) => setFilters({...filters, yearFrom: e.target.value})}
                    placeholder="From"
                    className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
                  />
                  <Input
                    type="number"
                    value={filters.yearTo}
                    onChange={(e) => setFilters({...filters, yearTo: e.target.value})}
                    placeholder="To"
                    className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-[#A1A1A7] mb-2">Price Range (€)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    value={filters.priceFrom}
                    onChange={(e) => setFilters({...filters, priceFrom: e.target.value})}
                    placeholder="Min price"
                    className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
                  />
                  <Input
                    type="number"
                    value={filters.priceTo}
                    onChange={(e) => setFilters({...filters, priceTo: e.target.value})}
                    placeholder="Max price"
                    className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
                  />
                </div>
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-medium text-[#A1A1A7] mb-2">Max Mileage (km)</label>
                <Input
                  type="number"
                  value={filters.maxMileage}
                  onChange={(e) => setFilters({...filters, maxMileage: e.target.value})}
                  placeholder="e.g., 100000"
                  className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
                />
              </div>

              {/* Fuel & Transmission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A1A1A7] mb-2">Fuel Type</label>
                  <Select value={filters.fuelType} onValueChange={(val) => setFilters({...filters, fuelType: val})}>
                    <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D]">
                      {fuelTypes.map(fuel => (
                        <SelectItem key={fuel} value={fuel} className="text-white hover:bg-[#2A2A2D]">
                          {fuel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A1A1A7] mb-2">Transmission</label>
                  <Select value={filters.transmission} onValueChange={(val) => setFilters({...filters, transmission: val})}>
                    <SelectTrigger className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1C] border-[#2A2A2D]">
                      {transmissions.map(trans => (
                        <SelectItem key={trans} value={trans} className="text-white hover:bg-[#2A2A2D]">
                          {trans}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#A1A1A7] mb-2">City</label>
                  <Input
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    placeholder="Enter city"
                    className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A1A1A7] mb-2">ZIP Code</label>
                  <Input
                    value={filters.zipCode}
                    onChange={(e) => setFilters({...filters, zipCode: e.target.value})}
                    placeholder="Enter ZIP"
                    className="bg-[#0F0F11] border-[#2A2A2D] text-white h-12 placeholder:text-[#A1A1A7]/50"
                  />
                </div>
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-[#A1A1A7] mb-2">Payment Type</label>
                <div className="flex gap-4">
                  {paymentTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters({...filters, paymentType: type})}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                        filters.paymentType === type
                          ? 'bg-[#FF5F2D] text-white'
                          : 'bg-[#0F0F11] text-[#A1A1A7] hover:bg-[#2A2A2D]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Electric Only */}
              <div className="flex items-center space-x-3 p-4 bg-[#0F0F11] rounded-xl">
                <Checkbox
                  id="electric"
                  checked={filters.electricOnly}
                  onCheckedChange={(checked) => setFilters({...filters, electricOnly: checked})}
                  className="border-[#2A2A2D]"
                />
                <label
                  htmlFor="electric"
                  className="text-sm font-medium text-white cursor-pointer"
                >
                  Electric cars only
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[#1A1A1C] border-t border-[#2A2A2D] px-8 py-6 flex gap-4 rounded-b-3xl">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-14 text-white border-[#2A2A2D] hover:bg-[#2A2A2D]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSearch}
                className="flex-1 h-14 bg-[#FF5F2D] hover:bg-[#FF5F2D]/90 text-white font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Vehicles
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}