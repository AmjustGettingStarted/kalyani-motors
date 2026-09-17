import React, { createContext, useContext, useState, useMemo } from 'react';
import { mockCars } from '../data/mockCars';
import { mockBanners } from '../data/mockBanners';
import { mockLocations } from '../data/mockLocations';
import { mockServices } from '../data/mockServices';
import { mockFaqs } from '../data/mockFaqs';

export const CITIES = ['Bengaluru', 'Hyderabad', 'Mysore', 'Chennai'];

const KalyaniContext = createContext(null);

export function KalyaniProvider({ children }) {
  // City state with localStorage persistence
  const [selectedCity, setSelectedCityState] = useState(() => {
    try {
      const saved = localStorage.getItem('kalyani_selected_city');
      return saved && CITIES.includes(saved) ? saved : 'Bengaluru';
    } catch {
      return 'Bengaluru';
    }
  });

  const setSelectedCity = (city) => {
    if (CITIES.includes(city)) {
      setSelectedCityState(city);
      try {
        localStorage.setItem('kalyani_selected_city', city);
      } catch (err) {
        console.warn('Could not save city to localStorage', err);
      }
    }
  };

  // Test Drive Modal Global State
  const [testDriveModal, setTestDriveModal] = useState({
    isOpen: false,
    selectedCar: null,
  });

  const openTestDrive = (car = null) => {
    setTestDriveModal({
      isOpen: true,
      selectedCar: car || mockCars[0],
    });
  };

  const closeTestDrive = () => {
    setTestDriveModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Filtered locations for current active city
  const cityLocations = useMemo(() => {
    const key = selectedCity.toLowerCase();
    return mockLocations[key] || mockLocations.bengaluru;
  }, [selectedCity]);

  const value = {
    selectedCity,
    setSelectedCity,
    cities: CITIES,
    cars: mockCars,
    banners: mockBanners,
    locations: cityLocations,
    allLocations: mockLocations,
    services: mockServices,
    faqs: mockFaqs,
    testDriveModal,
    openTestDrive,
    closeTestDrive,
  };

  return <KalyaniContext.Provider value={value}>{children}</KalyaniContext.Provider>;
}

export function useKalyani() {
  const context = useContext(KalyaniContext);
  if (!context) {
    throw new Error('useKalyani must be used within a KalyaniProvider');
  }
  return context;
}
