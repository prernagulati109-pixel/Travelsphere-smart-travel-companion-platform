import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState(() => {
    try {
      const saved = localStorage.getItem('bookingState');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    return {
      isOpen: false,
      flowType: null, // 'flight', 'bus', 'cab', 'hotel'
      currentStep: 0,
      item: null, // the selected item to book
      passengerDetails: {},
      seatSelection: [],
      addOns: {},
      guestDetails: {},
      paymentMethod: null,
      paymentVerified: false,
      validationErrors: {},
      summary: {}
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('bookingState', JSON.stringify(bookingState));
    } catch(e) {}
  }, [bookingState]);

  const startBooking = (flowType, item) => {
    setBookingState(prev => ({
      ...prev,
      isOpen: true,
      flowType,
      item,
      currentStep: 0,
      passengerDetails: {},
      seatSelection: [],
      addOns: {},
      guestDetails: {},
      paymentMethod: null,
      paymentVerified: false,
      validationErrors: {},
      summary: {}
    }));
  };

  const closeBooking = () => {
    setBookingState(prev => ({
      ...prev,
      isOpen: false,
      item: null,
      currentStep: 0
    }));
  };

  const setStep = (stepIndex) => {
    setBookingState(prev => ({ ...prev, currentStep: stepIndex }));
  };

  const updateData = (key, data) => {
    setBookingState(prev => ({ ...prev, [key]: data }));
  };

  const setValidationErrors = (errors) => {
    setBookingState(prev => ({ ...prev, validationErrors: errors }));
  };

  const clearValidationError = (key) => {
    setBookingState(prev => ({
      ...prev,
      validationErrors: {
        ...(prev.validationErrors || {}),
        [key]: null
      }
    }));
  };

  return (
    <BookingContext.Provider value={{ 
      bookingState, 
      startBooking, 
      closeBooking, 
      setStep, 
      updateData,
      setValidationErrors,
      clearValidationError
    }}>
      {children}
    </BookingContext.Provider>
  );
};
