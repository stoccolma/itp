'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { usePlanStore, type CitySlug } from '@/stores/planStore';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

const CITIES: { slug: CitySlug; name: string }[] = [
  { slug: 'palermo', name: 'Palermo' },
  { slug: 'agrigento', name: 'Agrigento' },
  { slug: 'noto', name: 'Noto' },
  { slug: 'siracusa', name: 'Siracusa' },
  { slug: 'catania', name: 'Catania' },
  { slug: 'taormina', name: 'Taormina' }
];

export default function OneLinePlanner() {
  const { city, dateISO, setCity, setDateISO, resetSelection } = usePlanStore();
  const router = useRouter();
  
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [shake, setShake] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const comboboxRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Prevent hydration mismatch
  useEffect(() => {
    console.log('🔄 OneLinePlanner mounted');
    setMounted(true);
  }, []);
  
  // Use dateISO from store or today as fallback
  const effectiveDate = dateISO || today;
  
  useEffect(() => {
    console.log('📅 Date state - dateISO:', dateISO, 'effectiveDate:', effectiveDate, 'today:', today);
  }, [dateISO, effectiveDate, today]);
  
  // Filter cities based on search term
  const filteredCities = CITIES.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Close combobox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsComboboxOpen(false);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleCitySelect = (slug: CitySlug) => {
    setCity(slug);
    setIsComboboxOpen(false);
    setSearchTerm('');
    setHelperText('');
    setShake(false);
  };
  
  // Initialize flatpickr
  useEffect(() => {
    if (!dateInputRef.current || !mounted) return;
    
    const fp = flatpickr(dateInputRef.current, {
      dateFormat: 'Y-m-d',
      defaultDate: effectiveDate,
      minDate: today,
      onChange: (selectedDates: Date[]) => {
        const date = selectedDates[0];
        if (date) {
          const iso = date.toISOString().split('T')[0];
          console.log('📅 Date selected:', iso);
          setDateISO(iso);
          console.log('📅 Date stored in dateISO:', iso);
        }
      },
    });
    
    console.log('📅 Flatpickr initialized');
    
    return () => {
      fp.destroy();
      console.log('📅 Flatpickr destroyed');
    };
  }, [mounted, effectiveDate, today, setDateISO]);
  
  const handlePlanDay = () => {
    if (!city) {
      setHelperText('Pick a city to generate your day.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    // Use effective date (from store or today)
    const dateToUse = effectiveDate;
    
    // Ensure date is saved to store
    if (!dateISO) {
      setDateISO(dateToUse);
    }
    
    console.log('🚀 Planning day for', city, 'on', dateToUse);
    
    // Navigate to the planner page with params (this triggers map zoom)
    router.push(`/?from=${city}&date=${dateToUse}`, { scroll: false });
    
    // After navigation, scroll to map section
    setTimeout(() => {
      const mapSection = document.querySelector('[data-map-section]');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };
  
  const handleReset = () => {
    console.log('🔄 Resetting selection');
    resetSelection();
    setHelperText('');
    setShake(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsComboboxOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && filteredCities.length === 1) {
      handleCitySelect(filteredCities[0].slug);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsComboboxOpen(true);
    }
  };
  
  const selectedCity = CITIES.find(c => c.slug === city);
  
  return (
    <div className="bg-zinc-100 bg-[var(--paper)] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* One-line selector */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Destination pill */}
          <div className="relative flex-1" ref={comboboxRef}>
            <button
              type="button"
              onClick={() => setIsComboboxOpen(!isComboboxOpen)}
              onKeyDown={handleKeyDown}
              className={`w-full px-4 py-3 rounded-full border-2 ${
                shake 
                  ? 'border-red-500 dark:border-red-400 animate-shake' 
                  : 'border-zinc-300 border-[var(--line)]'
              } bg-white bg-[var(--card)] text-left flex items-center justify-between hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors`}
              aria-haspopup="listbox"
              aria-expanded={isComboboxOpen}
              aria-label="Select destination city"
            >
              <span className={selectedCity ? 'text-zinc-900 text-[var(--ink)]' : 'text-zinc-500 text-[var(--ink)]/60'}>
                {selectedCity ? selectedCity.name : 'Select city...'}
              </span>
              {selectedCity ? (
                <X 
                  className="w-5 h-5 text-zinc-500 text-[var(--ink)]/60" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCity(null);
                  }}
                />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-500 text-[var(--ink)]/60" />
              )}
            </button>
            
            {/* Combobox dropdown */}
            {isComboboxOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white bg-[var(--card)] border-2 border-zinc-300 border-[var(--line)] rounded-lg shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-2 border-b-2 border-zinc-200 focus:outline-none bg-white bg-[var(--card)] text-zinc-900 text-[var(--ink)]"
                  autoFocus
                />
                <ul role="listbox" className="max-h-60 overflow-y-auto">
                  {filteredCities.map((c) => (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => handleCitySelect(c.slug)}
                        className="w-full px-4 py-2 text-left hover:bg-zinc-100 text-zinc-900 text-[var(--ink)] focus:outline-none focus:bg-zinc-100"
                        role="option"
                        aria-selected={city === c.slug}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                  {filteredCities.length === 0 && (
                    <li className="px-4 py-2 text-zinc-500 text-[var(--ink)]/60 text-sm">
                      No cities found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          
          {/* Date pill */}
          <div className="relative flex-1 sm:flex-initial sm:w-auto">
            {mounted ? (
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="text"
                  value={effectiveDate}
                  placeholder="Select date"
                  readOnly
                  className="w-full sm:w-48 px-4 py-3 pr-12 rounded-full border-2 border-zinc-300 border-[var(--line)] bg-white bg-[var(--card)] text-zinc-900 text-[var(--ink)] cursor-pointer hover:border-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  aria-label="Select date"
                />
                <Calendar className="w-5 h-5 text-zinc-500 text-[var(--ink)]/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full sm:w-48 px-4 py-3 rounded-full border-2 border-zinc-300 border-[var(--line)] bg-white bg-[var(--card)] flex items-center justify-between">
                <span className="text-zinc-900 text-[var(--ink)]">{today}</span>
                <Calendar className="w-5 h-5 text-zinc-500 text-[var(--ink)]/60" />
              </div>
            )}
          </div>
          
          {/* Plan Day button */}
          <button
            type="button"
            onClick={handlePlanDay}
            disabled={!city}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              city
                ? 'bg-zinc-900 bg-[var(--card)] text-white hover:bg-zinc-800'
                : 'bg-zinc-300 text-zinc-500 text-[var(--ink)]0 cursor-not-allowed'
            }`}
          >
            Plan Day
          </button>
        </div>
        
        {/* Helper text */}
        {helperText && (
          <p className="text-sm text-red-600 mt-2 ml-4">
            {helperText}
          </p>
        )}
        
        {/* Reset link and privacy text */}
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-zinc-600 text-[var(--ink)]/60 hover:text-zinc-900 underline"
          >
            Reset selection
          </button>
          <p className="text-xs text-zinc-500 text-[var(--ink)]0">
            Privacy-first. Locally curated.
          </p>
        </div>
      </div>
      
      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
