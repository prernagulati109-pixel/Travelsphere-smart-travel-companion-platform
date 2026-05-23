import React, { useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { X, ArrowRight } from 'lucide-react';
import PassengerStep from './PassengerStep';
import SeatSelectionStep from './SeatSelectionStep';
import AddOnsStep from './AddOnsStep';
import BookingSummaryStep from './BookingSummaryStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import '../../styles/BookingFlows.css';

export default function BookingFlowManager() {
  const { bookingState, closeBooking, setStep, setValidationErrors } = useBooking();
  const { isOpen, flowType, currentStep } = bookingState;

  // Determine flow sequence based on flowType
  const steps = useMemo(() => {
    switch (flowType) {
      case 'Flight':
        return [
          { id: 'passenger', label: 'Details', component: <PassengerStep /> },
          { id: 'seat', label: 'Seat', component: <SeatSelectionStep /> },
          { id: 'addons', label: 'Add-ons', component: <AddOnsStep /> },
          { id: 'summary', label: 'Summary', component: <BookingSummaryStep /> },
          { id: 'payment', label: 'Payment', component: <PaymentStep /> },
          { id: 'confirmation', label: 'Done', component: <ConfirmationStep /> }
        ];
      case 'Bus':
        return [
          { id: 'seat', label: 'Seat', component: <SeatSelectionStep /> },
          { id: 'passenger', label: 'Details', component: <PassengerStep /> },
          { id: 'summary', label: 'Summary', component: <BookingSummaryStep /> },
          { id: 'payment', label: 'Payment', component: <PaymentStep /> },
          { id: 'confirmation', label: 'Done', component: <ConfirmationStep /> }
        ];
      case 'Cab':
      case 'Hotel':
      case 'Tours':
      case 'Airport':
      case 'BusStand':
      default:
        return [
          { id: 'passenger', label: 'Details', component: <PassengerStep /> },
          { id: 'summary', label: 'Summary', component: <BookingSummaryStep /> },
          { id: 'payment', label: 'Payment', component: <PaymentStep /> },
          { id: 'confirmation', label: 'Done', component: <ConfirmationStep /> }
        ];
    }
  }, [flowType]);

  if (!isOpen || !flowType) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isConfirmation = currentStepData?.id === 'confirmation';

  const validateCurrentStep = () => {
    const errors = {};
    const passengerDetails = bookingState.passengerDetails || {};
    const item = bookingState.item || {};

    if (currentStepData?.id === 'passenger') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneDigits = (passengerDetails.phone || '').replace(/\D/g, '');

      if (!passengerDetails.fullName?.trim()) errors.fullName = 'Full name is required.';
      if (!emailRegex.test(passengerDetails.email || '')) errors.email = 'Enter a valid email address.';
      if (phoneDigits.length !== 10) errors.phone = 'Enter a valid 10-digit phone number.';
      if (!item.destination?.trim()) errors.destination = 'Travel destination is required.';
      if (!item.departureDate) errors.departureDate = 'Departure date is required.';
      if (!Number(item.travelers || 1)) errors.travelers = 'Number of travelers is required.';
    }

    if ((currentStepData?.id === 'seat') && (flowType === 'Flight' || flowType === 'Bus')) {
      if (!bookingState.seatSelection?.length) errors.seatSelection = 'Please select a seat to continue.';
    }

    if (currentStepData?.id === 'payment') {
      if (!bookingState.paymentMethod) errors.paymentMethod = 'Select a payment method.';
      if (bookingState.paymentMethod === 'scanner' && !bookingState.paymentVerified) {
        errors.paymentMethod = 'Please complete UPI verification before confirming.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isCurrentStepValid = () => {
    const passengerDetails = bookingState.passengerDetails || {};
    const item = bookingState.item || {};
    if (currentStepData?.id === 'passenger') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return Boolean(
        passengerDetails.fullName?.trim() &&
        emailRegex.test(passengerDetails.email || '') &&
        (passengerDetails.phone || '').replace(/\D/g, '').length === 10 &&
        item.destination?.trim() &&
        item.departureDate &&
        Number(item.travelers || 1)
      );
    }
    if ((currentStepData?.id === 'seat') && (flowType === 'Flight' || flowType === 'Bus')) {
      return Boolean(bookingState.seatSelection?.length);
    }
    if (currentStepData?.id === 'payment') {
      return bookingState.paymentMethod === 'scanner' ? bookingState.paymentVerified : Boolean(bookingState.paymentMethod);
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (!isLastStep) setStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0 && !isConfirmation) setStep(currentStep - 1);
  };

  return (
    <div className="booking-flow-overlay" onClick={isConfirmation ? undefined : closeBooking}>
      <div className="booking-flow-drawer" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        {!isConfirmation && (
          <div className="booking-flow-header">
            <h2>{flowType} Booking</h2>
            <button className="booking-flow-close" onClick={closeBooking}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* Progress Tracker */}
        {!isConfirmation && (
          <div className="booking-progress">
            <div className="booking-progress-steps">
              {steps.filter(s => s.id !== 'confirmation').map((s, idx) => (
                <div 
                  key={s.id} 
                  className={`progress-step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="booking-flow-content">
          {currentStepData?.component}
        </div>

        {/* Footer actions */}
        {!isConfirmation && (
          <div className="booking-flow-footer">
            {currentStep > 0 ? (
              <button className="btn-back" onClick={handleBack}>Back</button>
            ) : (
              <div></div> // Empty div for flex alignment
            )}
            
            <button 
              className="btn-next" 
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
            >
              {currentStepData?.id === 'payment' ? 'Pay Now' : 'Continue'} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
